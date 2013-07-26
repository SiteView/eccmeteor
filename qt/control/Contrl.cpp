#include <svdbapi.h>
#include <svtime.h>
#include <buffer.h>
#include <util.h>

#include <string>
#include <set>
#include <list>
#include <map>

using namespace std;
using namespace svutil;

typedef TTime CTime;
typedef TTimeSpan CTimeSpan;

#ifdef	WIN32
#include <windows.h>
#include "PSAPI.h"
#pragma comment( lib, "PSAPI.LIB" )
#endif

#include "TString.h"
#include "ThreadEx.h"
#include "COption.h"
#include "CUtil.h"
#include "DynamicParam.h"
#include "InspectSch.h"
#include "WatchProcess.h"

//// to extern in COption  ///////////
long g_lSubRestartTime = 0;   //定时重启监测进程的时间间隔(分钟);
int g_uCheckTime = 0;        //和监测进程通讯的时间间隔(分钟);
int g_uMaxMemory = 800;     //允许监测进程占用的最大内存数(物理内存单位M);
std::string g_rootpath;

bool g_bool_watch_AlertServer = true;		//是否守护监测 AlertServer
bool g_bool_watch_ReportGenerate = true;	//是否守护监测 ReportGenerate
bool g_bool_watch_Monitorshedule = true;	//是否守护监测 Monitorshedule

CString g_strRefreshQueueName = "SiteView70_RefreshInfo";
std::set<std::string> g_exes;			//被守护监测的 exe 列表
///////////////////

std::list<WatchProcess *> g_allPThread;
InspectSch * g_inspect;
DynamicParam * g_dynp;

void ToExit(void);
bool Run(void);

char *g_account = NULL;
char *g_password = NULL;
string g_mcPName = "";

const char *g_ServiceDName = "SiteView_Watch";
const char *g_ServiceName = "SiteView_Watch";

PROCESS_INFORMATION g_schpi;
PROCESS_INFORMATION g_alertpi;
PROCESS_INFORMATION g_reportpi;

#ifdef	WIN32
CString g_AlertProcessName = "AlertServer.exe";
CString g_ReportProcessName = "reportgenerate.exe";
CString g_ScheduleProcessName = "MonitorSchedule.exe";
#else
CString g_AlertProcessName = "AlertServer";
CString g_ReportProcessName = "reportgenerate";
CString g_ScheduleProcessName = "MonitorSchedule";
#endif

CString g_strMessage = "";
bool g_Disabled = false;
bool g_SubProcessState = true;

#ifdef	WIN32
SERVICE_STATUS SVS_ServiceStatus;
SERVICE_STATUS_HANDLE SVS_ServiceStatusHandle;

DWORD SVS_ServiceInitialization(DWORD argc, LPTSTR *argv, DWORD *specificError);

void WINAPI SVS_ServiceCtrlHandler(DWORD opcode)
{
	switch(opcode)
	{
		case SERVICE_CONTROL_PAUSE:
		SVS_ServiceStatus.dwCurrentState=SERVICE_PAUSED;
		break;

		case SERVICE_CONTROL_CONTINUE:
		SVS_ServiceStatus.dwCurrentState=SERVICE_RUNNING;
		break;

		case SERVICE_CONTROL_STOP:
		case SERVICE_CONTROL_SHUTDOWN:
		SVS_ServiceStatus.dwWin32ExitCode = 0;
		SVS_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
		SVS_ServiceStatus.dwCheckPoint = 0;
		SVS_ServiceStatus.dwWaitHint = 0;

		g_SubProcessState=false;
		ThreadEx::sleep(1000);
		ToExit();

		if(!SetServiceStatus(SVS_ServiceStatusHandle, &SVS_ServiceStatus))
		{
			g_strMessage.Format("SetServiceStatus error: %ld\r\n", GetLastError());
			CErrorLog(g_strMessage);
		}

		return;

		case SERVICE_CONTROL_INTERROGATE:
		// Fall through to send current status.
//			CErrorLog("Service Control Interrogate\r\n");
		break;

		default:
		g_strMessage.Format("Unrecognized opcode %ld\r\n", opcode);
		CErrorLog(g_strMessage);
		break;
	}

	if (!SetServiceStatus (SVS_ServiceStatusHandle, &SVS_ServiceStatus))
	{
		g_strMessage.Format("SetServiceStatus error: %ld\r\n", GetLastError());
		CErrorLog(g_strMessage);
	}

}
void WINAPI SVS_ServiceStart(DWORD argc, LPTSTR *argv)
{

	DWORD status=0;
	DWORD specificError=0;

	SVS_ServiceStatus.dwServiceType = SERVICE_WIN32;
	SVS_ServiceStatus.dwCurrentState = SERVICE_START_PENDING;
	SVS_ServiceStatus.dwControlsAccepted = SERVICE_ACCEPT_SHUTDOWN |
	SERVICE_ACCEPT_STOP |
	SERVICE_ACCEPT_PAUSE_CONTINUE;
	SVS_ServiceStatus.dwWin32ExitCode = 0;
	SVS_ServiceStatus.dwServiceSpecificExitCode = 0;
	SVS_ServiceStatus.dwCheckPoint = 0;
	SVS_ServiceStatus.dwWaitHint = 0;

	SVS_ServiceStatusHandle=::RegisterServiceCtrlHandler("VALIDATESERVER",SVS_ServiceCtrlHandler);
	if (SVS_ServiceStatusHandle == (SERVICE_STATUS_HANDLE)0)
	{
		g_strMessage.Format("RegisterServiceCtrlHandler failed %d\r\n", GetLastError());
		CErrorLog(g_strMessage);
		return;
	}

	status = SVS_ServiceInitialization(argc,argv, &specificError);

	// Handle error condition
	if (status != NO_ERROR)
	{
		SVS_ServiceStatus.dwCurrentState = SERVICE_STOPPED;
		SVS_ServiceStatus.dwCheckPoint = 0;
		SVS_ServiceStatus.dwWaitHint = 0;
		SVS_ServiceStatus.dwWin32ExitCode = status;
		SVS_ServiceStatus.dwServiceSpecificExitCode = specificError;

		SetServiceStatus (SVS_ServiceStatusHandle, &SVS_ServiceStatus);

		g_strMessage = "服务初始化失败!\r\n";
		CErrorLog(g_strMessage);
		return;
	}

	SVS_ServiceStatus.dwCurrentState = SERVICE_RUNNING;
	SVS_ServiceStatus.dwCheckPoint = 0;
	SVS_ServiceStatus.dwWaitHint = 0;

	if (!SetServiceStatus (SVS_ServiceStatusHandle, &SVS_ServiceStatus))
	{
		g_strMessage.Format("SetServiceStatus error: %ld\r\n", GetLastError());
		CErrorLog(g_strMessage);
		return;
	}

	HANDLE m_handle=GetCurrentProcess();
	DWORD iPriority=GetPriorityClass(m_handle);
	SetPriorityClass(m_handle,HIGH_PRIORITY_CLASS);
	HANDLE m_thread=GetCurrentThread();
	SetThreadPriority(m_thread,THREAD_PRIORITY_ABOVE_NORMAL);

	Run();

	MSG msg;
	while(::GetMessage(&msg,NULL,0,0))
	{
		TranslateMessage(&msg);
		::DispatchMessage(&msg);
	}

}
DWORD SVS_ServiceInitialization(DWORD argc, LPTSTR *argv, DWORD *specificError)
{
	argv;
	argc;
	specificError;
	return (0);
}

bool InstallService()
{
	char buf[2048] =
	{	0};

	sprintf(buf, "\"%s\" -service", g_mcPName.c_str());
	SC_HANDLE hs = OpenSCManager(NULL, SERVICES_ACTIVE_DATABASE, SC_MANAGER_ALL_ACCESS);
	if (hs == NULL)
	{
		puts("Open 'SCManager' failed");
		return false;
	}

	if (::CreateService(hs, g_ServiceName, g_ServiceDName, SERVICE_ALL_ACCESS, SERVICE_WIN32_OWN_PROCESS,
					SERVICE_AUTO_START, SERVICE_ERROR_NORMAL, buf, "", NULL, NULL, g_account, g_password) == NULL)
	{
		puts("Install service failed");
		DWORD err = ::GetLastError();
		switch (err)
		{
			case ERROR_ACCESS_DENIED:
			puts(
					"\t The handle to the specified service control manager database does not have SC_MANAGER_CREATE_SERVICE access.");
			break;
			case ERROR_CIRCULAR_DEPENDENCY:
			puts("\t A circular service dependency was specified.");
			break;
			case ERROR_DUP_NAME:
			puts(
					"\t The display name already exists in the service control manager database either as a service name or as another display name.");
			break;
			case ERROR_INVALID_HANDLE:
			puts("\t The handle to the specified service control manager database is invalid.");
			break;
			case ERROR_INVALID_NAME:
			puts("\t The specified service name is invalid");
			break;
			case ERROR_INVALID_PARAMETER:
			puts("\t A parameter that was specified is invalid");
			break;
			case ERROR_INVALID_SERVICE_ACCOUNT:
			puts("\t The user account name specified in the lpServiceStartName parameter does not exist.");
			break;
			case ERROR_SERVICE_EXISTS:
			puts("\tThe specified service already exists in this database.");
			break;
			default:
			puts("\t Unknown");
		}
		if (g_account != NULL)
		free(g_account);
		if (g_password)
		free(g_password);
		return false;
	}
	else
	puts("Install service sucessed");

	if (g_account != NULL)
	free(g_account);
	if (g_password)
	free(g_password);

	return true;
}

bool UnInstall()
{
	DWORD err = 0;
	SC_HANDLE hsm = ::OpenSCManager(NULL, SERVICES_ACTIVE_DATABASE, SC_MANAGER_ALL_ACCESS);
	if (hsm == NULL)
	{
		puts("UnInstall service failed ,cause by OpenSCManager failed");
		return false;
	}

	SC_HANDLE hsc = ::OpenService(hsm, g_ServiceName, DELETE);
	if (hsc == NULL)
	{
		puts("UnInstall service failed ,cause by OpenService failed");

		err = ::GetLastError();
		switch (err)
		{
			case ERROR_ACCESS_DENIED:
			puts("\t The specified service control manager ");
			break;
			case ERROR_INVALID_HANDLE:
			puts("\t The specified handle is invalid");
			break;
			case ERROR_INVALID_NAME:
			puts("\t The specified service name is invalid");
			break;
			case ERROR_SERVICE_DOES_NOT_EXIST:
			puts("\t The specified service does not exist");
			break;
			default:
			puts("\t Unknown error with 'OpenService'");
		}
		return false;
	}

	if (::DeleteService(hsc) == 0)
	{
		puts("Remove service failed");
		err = ::GetLastError();
		switch (err)
		{
			case ERROR_ACCESS_DENIED:
			puts("\t The specified handle was not opened with DELETE access");
			break;
			case ERROR_INVALID_HANDLE:
			puts("\t The specified handle is invalid");
			break;
			case ERROR_SERVICE_MARKED_FOR_DELETE:
			puts("\t The specified service has already been marked for deletion");
			break;
			default:
			puts("\t Unknown error");
		}

		return false;
	}
	puts("Remove serivce successed");
	return true;
}

BOOL WINAPI ConsoleHandler(DWORD CEvent)
{
	switch(CEvent)
	{
		case CTRL_C_EVENT: case CTRL_BREAK_EVENT: case CTRL_CLOSE_EVENT: case CTRL_LOGOFF_EVENT: case CTRL_SHUTDOWN_EVENT:
		ToExit();
		ExitProcess(0);
		break;
	}
	return TRUE;
}

void RunServices()
{
	SERVICE_TABLE_ENTRY ste[] =
	{
		{	"MonitorContrl", SVS_ServiceStart},
		{	NULL, NULL}};

	::StartServiceCtrlDispatcher(ste);
}
#else

#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <signal.h>
#include <errno.h>
#include <sys/resource.h>
#include <sys/syslog.h>
#include <sys/file.h>
#include <sys/stat.h>

#define LOCKFILE "/var/run/MonitorContrl.pid"
#define LOCKMODE (S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH)

void error_quit(const char *str)
{
	cout << str << endl;
	CErrorLog(str);
	exit(1);
}

int lockfile(int fd)
{
	struct flock fl;
	fl.l_type = F_WRLCK;
	fl.l_start = 0;
	fl.l_whence = SEEK_SET;
	fl.l_len = 0;
	return fcntl(fd, F_SETLK, &fl);
}

bool hasrun()
{
	int fd;
	char buf[128] = { 0 };
	fd = open(LOCKFILE, O_RDWR | O_CREAT, LOCKMODE);
	if (fd < 0)
	{
		sprintf(buf, "hasrun() can't open .pid:%s , %s", LOCKFILE, strerror(errno));
		error_quit(buf);
	}

	if (lockfile(fd) < 0)
	{
		if (EACCES == errno || EAGAIN == errno)
		{
			close(fd);
			return true;
		}
		sprintf(buf, "hasrun() can't lock .pid:%s , %s", LOCKFILE, strerror(errno));
		error_quit(buf);
	}
	ftruncate(fd, 0);
	sprintf(buf, "%ld", (long) getpid());
	write(fd, buf, strlen(buf) + 1);
	return false;
}

void daemonize()
{
	int i, fd0, fd1, fd2;
	pid_t pid;
	struct rlimit rl;
	struct sigaction sa;

	umask(0);

	int temp;
	temp = getrlimit(RLIMIT_NOFILE, &rl);
	if (temp < 0)
		error_quit("daemonize() can't get file limit");

	pid = fork();
	if (pid < 0)
		error_quit("daemonize() can't fork");
	else if (pid != 0)
		exit(0);

	setsid();

	sa.sa_handler = SIG_IGN;
	sigemptyset(&sa.sa_mask);
	sa.sa_flags = 0;
	temp = sigaction(SIGHUP, &sa, NULL);
	if (temp < 0)
		error_quit("daemonize() can't ignore SIGHUP");

	pid = fork();
	if (pid < 0)
		error_quit("daemonize() can't fork");
	else if (pid != 0)
		exit(0);

	temp = chdir("/");
	if (temp < 0)
		error_quit("daemonize() can't change directoy to /");

	if (rl.rlim_max == RLIM_INFINITY)
		rl.rlim_max = 1024;
	for (i = 0; i < rl.rlim_max; i++)
		close(i);

	fd0 = open("/dev/null", O_RDWR);
	fd1 = dup(0);
	fd2 = dup(0);

	if (fd0 != 0 || fd1 != 1 || fd2 != 2)
	{
		char buf[128] = { 0 };
		sprintf(buf, "daemonize() unexpected file descriptors %d %d %d", fd0, fd1, fd2);
		error_quit(buf);
	}
}

void sigroutine(int dunno)
{
	switch (dunno)
	{
	case 1:
	case 2:
	case 3:
		ToExit();
		exit(1);
		break;
	}
	return;
}

void afterRun()
{
	signal(SIGHUP, sigroutine);
	signal(SIGINT, sigroutine);
	signal(SIGQUIT, sigroutine);
	while (true)
	{
		ThreadEx::sleep(2000000);
	}
}

void RunServices()
{
	puts("\nstart MonitorContrl as daemon...\n");
	outputRegeditKey();
	cout << "    linux .pid is: " << LOCKFILE << endl;
	cout << "    stop MonitorContrl by command: MonitorContrl -stop\n" << endl;
	daemonize();
	Run();
	afterRun();
}

bool InstallService()
{
	return true;
}
bool UnInstall()
{
	return true;
}
void stopService()
{
	int fd;
	char buf[32] = { 0 };
	char text[128] = { 0 };
	fd = open(LOCKFILE, O_RDWR, S_IRUSR | S_IWUSR);
	if (fd < 0)
	{
		sprintf(text, "stopService() can't open .pid:%s , %s", LOCKFILE, strerror(errno));
		error_quit(buf);
	}
	int io = ::read(fd, buf, 30);
	if (io < 0)
	{
		sprintf(text, "stopService() can't read .pid:%s , %s", LOCKFILE, strerror(errno));
		error_quit(buf);
	}
	long pnumber;
	pnumber = strtol(buf, NULL, 10);
	printf("stop MonitorContrl by: kill -HUP %ld\n", pnumber);
	kill(pnumber, SIGHUP);
}
#endif

int main(int argc, char *argv[])
{
#ifdef WIN32
	cout << "\nMonitorContrl start..." << endl;
	outputRegeditKey();
#endif
	int nRetCode = 0;
	g_mcPName = argv[0];
	SetSvdbAddrByFile("svapi.ini");
	g_rootpath = GetRootPath();

	if (argc >= 2)
	{
		if (strcmp(argv[1], "-service") == 0)
		{
#ifndef WIN32
			if (hasrun())
			{
				CErrorLog("(-service)MonitorContrl has run already.");
				return 1;
			}
#endif
			RunServices();
		}
		else if (strcmp(argv[1], "-install") == 0)
		{
			if (argc == 4)
			{
				g_account = S_STRDUP(argv[2]);
				g_password = S_STRDUP(argv[3]);
			}

			InstallService();
		}
		else if (strcmp(argv[1], "-uninstall") == 0)
		{
			UnInstall();
		}
		else if (strcmp(argv[1], "-stop") == 0)
		{
#ifndef	WIN32
			stopService();
#endif
		}
		else
			puts("Invalid parameter");

		return 1;
	}
#ifndef	WIN32
	cout << "linux .pid is: " << LOCKFILE << endl;
#endif

	if(!Run())
		return 1;

#ifdef	WIN32
	if (SetConsoleCtrlHandler( (PHANDLER_ROUTINE)ConsoleHandler, TRUE) == FALSE)
	printf("Failed to set Console Ctrl Handler!\n");

	MSG msg;
	BOOL bRet=TRUE;
	while((bRet=::GetMessage(&msg,NULL,0,0))!=0)
	{
		if(bRet==-1)
		{
			continue;
		}
		puts("Got Message");
		TranslateMessage(&msg);
		::DispatchMessage(&msg);
	}
	ToExit();
	ExitProcess(0);
#else

	afterRun();

#endif
	return nRetCode;
}

bool Run(void)
{
#ifndef WIN32
	if (hasrun())
	{
		CErrorLog("MonitorContrl has run already.");
		return false;
	}
#endif

	g_inspect = new InspectSch();
	if (!g_inspect->createEvent())
	{
#ifdef WIN32
		ExitProcess(1);
#else
		::exit(1);
#endif
	}

	COption * option = new COption(g_inspect);
	option->LoadOption();
	g_SubProcessState = true;

	g_dynp = new DynamicParam(option);
	g_dynp->Start();

	if (g_bool_watch_Monitorshedule)
	{
		WatchProcess * schedule = new WatchProcess();
		if (schedule->init(&g_schpi, g_ScheduleProcessName.getText()))
			schedule->Start();
		g_allPThread.push_back(schedule);

		ThreadEx::sleep(2000);
		if (g_inspect->init(&g_schpi, g_ScheduleProcessName.getText()))
			g_inspect->Start();
	}

	if (g_bool_watch_AlertServer)
	{
		WatchProcess * alert = new WatchProcess();
		if (alert->init(&g_alertpi, g_AlertProcessName.getText()))
			alert->Start();
		g_allPThread.push_back(alert);
	}

	if (g_bool_watch_ReportGenerate)
	{
		WatchProcess * report = new WatchProcess();
		if (report->init(&g_reportpi, g_ReportProcessName.getText()))
			report->Start();
		g_allPThread.push_back(report);
	}

	int sindex = 0;
	std::set<std::string>::iterator sit;
	for (sit = g_exes.begin(); sit != g_exes.end(); ++sit)
	{
		++sindex;
		WatchProcess * onep = new WatchProcess();
		PROCESS_INFORMATION pi;
		if (onep->init(&pi, *sit))
			onep->Start();
		g_allPThread.push_back(onep);
	}
	CErrorLog("monitor control starts up...");
	puts("\n\n");
	return true;
}

void ToExit()
{
	puts("monitor control to exit...");
	g_dynp->toExit();
	g_inspect->toExit();

	std::list<WatchProcess *>::iterator it;
	for (it = g_allPThread.begin(); it != g_allPThread.end(); ++it)
	{
		(*it)->toExit();
	}
	ThreadEx::sleep(1000);
	for (it = g_allPThread.begin(); it != g_allPThread.end(); ++it)
	{
		(*it)->toTerminateProcess();
	}
	CErrorLog("monitor control closed.");
}
