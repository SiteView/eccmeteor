/*******************************************************************
 MonitorSchedule.cpp
 Main file;
 *******************************************************************/

//#include "stdio.h";
//#include <iostream>
#include "Schedule.h"
//#include <TTime.h>
#include "SUtil.h"
#include "SchMain.h"
#include "LoadConfig.h"
#include "Monitors.h"
#include "WorkControl.h"
#include <svdbapi.h>
#include <svtime.h>
#include <util.h>

using namespace std;

#ifdef WIN32

#define		WM_COMMUNICATION	WM_USER+135

#endif

CString g_strRootPath = "D:\\v70";
string g_ServerHost = "localhost";
SUtil *putil;

std::string g_RefreshQueueName = "";
std::string g_QueueAddr = "";
std::string g_ConfigTrackQueueName = "SiteView70-ConfigTrack";

Option *g_pOption = NULL;

CTime g_LastSchTime;

SchMain*pMain = NULL;

int Univ::seid(1);
int Univ::msappend(1000);
int Univ::pluscount(0);
bool Univ::enablemass(false);

void Run();

void ToExit()
{
	SUtil::ErrorLog("MonitorSchedule closed.");
	puts("\n");
}

bool selfCheckIsOk()
{
	CTime curt = CTime::GetCurrentTimeEx();
	svutil::TTimeSpan tsp = curt - g_LastSchTime;
	char text[256] = { 0 };
	sprintf(text, "@@@@ Self-check at:%s , last Dispatching ran at %d min ago.  @@@@\n", curt.Format().c_str(),
			tsp.GetTotalMinutes());
	puts(text);
#ifdef	WIN32
	OutputDebugString(text);
#endif
	if (tsp.GetTotalMinutes() < 2)
		return true;

	string show = " selfCheck is not ok. Exit MonitorSchedule! \n";
	show += text;
	SUtil::ErrorLog(show.c_str());
#ifdef	WIN32
	OutputDebugString(show.c_str());
#endif
	ThreadEx::sleep(100);
	return false;
}


#ifdef WIN32
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

#define LOCKFILE "/var/run/MonitorSchedule.pid"
#define LOCKMODE (S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH)

void error_quit(const char *str)
{
	cout << str << endl;
	SUtil::ErrorLog(str);
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
		ThreadEx::sleep(2 * 60 * 1000);
		if (selfCheckIsOk())
			continue;
		else
			break;
	}
}

void RunServices()
{
	puts("\nstart MonitorSchedule as daemon...\n");
	outputRegeditKey();
	cout << "    linux .pid is: " << LOCKFILE << endl;
	cout << "    stop MonitorSchedule by command: MonitorSchedule -stop\n" << endl;
	daemonize();
	Run();
	afterRun();
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
	printf("stop MonitorSchedule by: kill -QUIT %ld\n", pnumber);
	kill(pnumber, SIGQUIT);
}
#endif

void Run(void)
{
	g_strRootPath = SUtil::GetRootPath();
	if (g_strRootPath.IsEmpty())
		throw MSException("Root path is empty!");

	CString strError;
	putil = new SUtil;

#ifndef WIN32
	if (hasrun())
	{
		putil->ErrorLog("MonitorSchedule has run already");
		::exit(2);
	}
#endif
	puts("MonitorSchedule Run... \n");

	pMain = new SchMain;
	try
	{
		pMain->Init();
		pMain->Run();
	} catch (MSException &e)
	{
		strError.Format("MonitorSchedule Run failed :%s", e.Description);
		putil->ErrorLog(strError);

#ifdef WIN32
		ExitProcess(2);
#else
		::exit(2);
#endif

	} catch (...)
	{
		CString strError = "";
		strError.Format("MonitorSchedule Run failed");
		putil->ErrorLog((LPCSTR) strError);

#ifdef WIN32
		ExitProcess(2);
#else
		::exit(2);
#endif

	}
	putil->ErrorLog("MonitorSchedule starts up...");
}

class testtex: public ThreadEx
{
public:
	testtex()
	{
		//pe=new Event();
	}
	virtual void run(void);
	Event pe;

};

void testtex::run(void)
{
	pe.wait();
	puts("In thread");
}

void testmonitor(void)
{
	putil = new SUtil;
	try
	{

		putil->Init();
		LoadConfig lc;
		lc.LoadAll();
		CMonitorList Monitorlst;
		lc.CreateMonitors(Monitorlst);
		int count = Monitorlst.size();
		printf("%d monitor be load\n", count);
		//Monitors *pM=NULL;
		//POSITION pos=Monitorlst.GetHeadPosition();
		//POSITION pos2=NULL,pos3=NULL;
		CMonitorList::iterator it = Monitorlst.begin();

		ReturnData* prd = NULL;
		int n = 0;
		while (Monitorlst.size() > 0)
		{
			//	pM=Monitorlst.RemoveTail();
			Monitors*pM = Monitorlst.front();
			Monitorlst.pop_front();
			//				pM=Monitorlst.GetNext(pos);
			printf("\n------------MonitorID:%s----------------\n", pM->GetMonitorID());
			printf("MonitorID:%s\nClass:%s\nMonitorType:%d\nSEID:%s\nParentID:%s\nFrequency:%d\n",
					(char*) pM->GetMonitorID(), (char*) pM->GetMonitorClass(), pM->GetMonitorType(),
					pM->GetSEID().c_str(), pM->GetParentID().c_str(), pM->GetFrequency());

			puts("\n@@Parameter list@@");

			CStringList &lst = pM->GetParameterList();
			CStringList::iterator it2;
			it2 = lst.begin();
			while (it2 != lst.end())
			{
				printf("%s\n", it2->c_str());
				*it2++;
			}

			puts("\n+++ReturnList+++\n");

			CReturnDataList&rdl = pM->GetReutrnList();

			CReturnDataList::iterator it3;
			//	pos3=rdl.GetHeadPosition();
			it3 = rdl.begin();
			while (it3 != rdl.end())
			{
				//prd=rdl.GetNext(pos3);
				prd = *it3++;
				printf("Label:%s\nName:%s\nUnit:%s\nType:%s\n", (char *) prd->m_Label, (char *) prd->m_Name,
						(char *) prd->m_Unit, (char *) prd->m_Type);
			}

			puts("\n===StateCondition===\n");

			StateCondition ** sct = pM->GetStateCondition();
			StateCondition *psct = sct[0];
			printf("Expression:%s\nStateType:%d\n", (char *) psct->m_Expression, psct->m_Type);

			CStateConditionItemList&Item = psct->GetStateConditionList();
			//pos2=Item.GetHeadPosition();
			CStateConditionItemList::iterator it4;
			it4 = Item.begin();
			while (it4 != Item.end())
			{
				//					StateConditionItem *psti=Item.GetNext(pos2);
				StateConditionItem *psti = *it4++;
				printf("ItemID:%d\nOperator:%s\nName:%s\nValue:%s\n", psti->m_ItemID, (char*) psti->m_Operator,
						(char*) psti->m_ParamName, (char *) psti->m_ParamValue);
			}

			psct = sct[1];
			printf("Expression:%s\nStateType:%d\n", (char *) psct->m_Expression, psct->m_Type);

			CStateConditionItemList&Item2 = psct->GetStateConditionList();
			//	pos2=Item2.GetHeadPosition();
			it4 = Item2.begin();
			while (it4 != Item2.end())
			{
				//					StateConditionItem *psti=Item2.GetNext(pos2);
				StateConditionItem *psti = *it4++;
				printf("ItemID:%d\nOperator:%s\nName:%s\nValue:%s\n", psti->m_ItemID, (char*) psti->m_Operator,
						(char*) psti->m_ParamName, (char *) psti->m_ParamValue);
			}

			psct = sct[2];
			printf("Expression:%s\nStateType:%d\n", (char *) psct->m_Expression, psct->m_Type);

			CStateConditionItemList&Item3 = psct->GetStateConditionList();
			//	pos2=Item3.GetHeadPosition();
			it4 = Item3.begin();
			while (it4 != Item3.end())
			{
				//			StateConditionItem *psti=Item3.GetNext(pos2);
				StateConditionItem *psti = *it4++;
				printf("ItemID:%d\nOperator:%s\nName:%s\nValue:%s\n", psti->m_ItemID, (char*) psti->m_Operator,
						(char*) psti->m_ParamName, (char *) psti->m_ParamValue);
			}

			n++;

			delete pM;
		}

		printf("Total %d monitors\n", n);

	} catch (MSException &e)
	{
		printf("putil init exception:%s\n", e.Description);
		return;
	}
}

bool MakeMonitorListByBuf(CMonitorList &lstMonitor, const char *buf)
{
	if (g_pOption == NULL)
		return false;

	const char *pt = buf;
	string str;
	LoadConfig lc;
	lc.m_pOption = g_pOption;

	lc.LoadAll();

	do
	{

		str = pt;
		if (str.empty())
			break;
		Monitors *pM = new Monitors();
		if (pM == NULL)
			break;
		try
		{
			if (lc.CreateSingleMonitor(pM, str.c_str()))
			{
				puts("Create ok");
				lstMonitor.push_back(pM);
				puts("push ok");
			}
			else
			{
				puts("Create failed");
				delete pM;
			}

		} catch (...)
		{
			puts("Create exception");
			delete pM;
		}

		pt += str.size() + 1;

	} while (pt[0] != '\0');

	return true;
}

bool GetMonitorListByQueue(CMonitorList &lstMonitor, string queueName, string mlabel, string addr)
{
	MQRECORD mrd = ::PopMessage(queueName, 0, "default", addr);
	if (mrd == INVALID_VALUE)
		return false;
	string label;
	svutil::TTime ct;
	unsigned int len = 0;
	if (!::GetMessageData(mrd, label, ct, NULL, len))
	{
		::CloseMQRecord(mrd);
		return false;
	}

	if (label.compare(mlabel) != 0)
	{
		::CloseMQRecord(mrd);
		return false;
	}
	printf("label :%s\n", label.c_str());
	if (len <= 0)
	{
		::CloseMQRecord(mrd);
		return false;
	}

	char *pbuf = new char[len];
	memset(pbuf, 0, len);
	if (!::GetMessageData(mrd, label, ct, pbuf, len))
	{
		::CloseMQRecord(mrd);
		return false;
	}
	::CloseMQRecord(mrd);

	printf("len :%d\n", len);

	bool bret = false;

	bret = MakeMonitorListByBuf(lstMonitor, pbuf);
	delete[] pbuf;

	return bret;

}

bool testParseOpt(string opt, string &name, string &type)
{
	int pos = 0;
	pos = opt.find(':');
	if (pos < 0)
		return false;
	name = opt.substr(0, pos);
	if (name.empty())
		return false;
	type = opt.substr(pos + 1);

	if (type.empty())
		return false;
	return true;
}
void test_taskplan()
{
	putil = new SUtil;
	try
	{

		putil->Init();
		LoadConfig lc;
		lc.LoadAll();

		TASKMAP tmap;
		if (!lc.LoadTaskPlan(tmap))
		{
			puts("Load task plan failed");
			return;
		}

		TASKMAP::iterator it;
		while (tmap.findnext(it))
		{
			puts("----------------------------------------------------------------------------------");
			printf("Task name:%s,Task type:%d\n", (*it).getkey().getword(), (*it).getvalue()->m_type);
			for (int i = 0; i < 7; i++)
			{
				printf("Week %d,enable:%s\n", i, (*it).getvalue()->m_week[i].m_enable ? "true" : "false");
				int n = (*it).getvalue()->m_week[i].m_task.size();
				for (int k = 0; k < n; k++)
				{
					printf("bhour:%d,bminute:%d,ehour:%d,eminute:%d\n",
							(*it).getvalue()->m_week[i].m_task[k].m_beginhour,
							(*it).getvalue()->m_week[i].m_task[k].m_beginminute,
							(*it).getvalue()->m_week[i].m_task[k].m_endhour,
							(*it).getvalue()->m_week[i].m_task[k].m_endminute);

				}

			}
		}

	} catch (...)
	{
		puts("Exception happend");
	}

}

int CheckReturnLen(const char *buf)
{
	if (buf == NULL)
		return -1;

	const char *pt = buf;
	if (pt[0] == '\0')
		return 0;

	int pos = 0;
	while (true)
	{
		pt++;
		pos++;
		if ((pt[0] == '\0') && (pt[1] == '\0'))
			break;
	}

	return pos + 2;

}

void appendRecordIfNeed()
{
	if (Univ::enablemass && putil != NULL)
	{
		std::list<SingelRecord> listrcd;
		int count(0);
		if ((count = putil->AppendThenClearAllRecords(listrcd)) > 0)
			cout << "AppendMass " << count << " records done," << " slept " << Univ::msappend << " ms." << endl;
		else if (count < 0)
			cout << "AppendMassRecord failed!" << endl;
	}
}

int main(int argc, char *argv[])
{
//命令行参数说明 ?
	printf("%d arg: ", argc);
	for (int i = 0; i <= argc - 1; ++i)
		printf("%s  ", argv[i]);
	printf("\n");

	SetSvdbAddrByFile("svapi.ini");

	putil = new SUtil();
	if (argc > 1)
	{
		if (argc != 2 && argc != 4)
		{
			puts("Parameter error");
			return -1;
		}

#ifndef WIN32
		if (strcmp(argv[1], "-service") == 0)
		{
			if (hasrun())
			{
				putil->ErrorLog("(-service)MonitorSchedule has run already.");
				return 1;
			}
			RunServices();
			return 1;
		}
		else if (strcmp(argv[1], "-stop") == 0)
		{
			stopService();
			return 1;
		}
#endif

		printf("Begin refresh\n");
		BOOL isRefresh = FALSE;
		g_strRootPath = putil->GetRootPath();

		try
		{
			WorkControl *pt = new WorkControl();
			Option *popt = new Option;
			if (popt == NULL)
			{
				putil->ErrorLog("Create Option object failed");
				return 1;
			}
			//load 设置文件 mc.config
			popt->LoadOption();
			g_ServerHost = popt->m_ServerAddress;

			pt->m_pOption = popt;
			g_pOption = popt;

			if (argc == 2)
			{
				pt->InitRefresh(1);
				LoadConfig lc; // monitor device group file
				lc.m_pOption = popt;

				lc.LoadAll();
				Monitors *pM = new Monitors();
				if (!lc.CreateSingleMonitor(pM, argv[1]))
				{
					puts("Create Monitors failed");
					delete pM;
					return -1;
				}
				pt->ExecuteMonitor(pM);
				delete pM;
			}
			else if (argc == 4)
			{
				char buf[256] = { 0 };
				pt->InitRefresh(30);
				printf("Parameter:%s,%s,%s\n", argv[1], argv[2], argv[3]);
				CMonitorList lstMonitor;
				if (GetMonitorListByQueue(lstMonitor, argv[1], argv[2], argv[3]))
				{
					printf("Monitors counts is: %d\n", lstMonitor.size());
					g_RefreshQueueName = argv[2];
					g_QueueAddr = argv[3];
					pt->RefreshMonitors(lstMonitor);
				}
				else
				{
					putil->ErrorLog("Refresh Monitors empty");
				}
				sprintf(buf, "Refresh end");
				::PushMessage(argv[2], "Refresh_END", buf, strlen(buf) + 1, "default", argv[3]);
			}
		} catch (MSException &e)
		{
			putil->ErrorLog(e.GetDescription());
		}
		appendRecordIfNeed();
		ThreadEx::sleep(3000);
		return 1;
	}

#ifdef WIN32
	HANDLE hCommEvent=::CreateEvent(NULL,TRUE,FALSE,"Global\\Siteview-Communictions");
	if(hCommEvent==NULL)
	{
		puts("Create event of communication  failed");
		return -1;
	}
	if(::GetLastError()!=ERROR_ALREADY_EXISTS)
	{
		puts("Parent process isn't exist");
		return -2;
	}
	::SetLastError(0);
#endif

	try
	{
		Run();
	} catch (MSException &e)
	{
		putil->ErrorLog(e.GetDescription());
		appendRecordIfNeed();
		return -3;
	}

#ifdef WIN32
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
		if(msg.message==WM_COMMUNICATION)
		{
			if(selfCheckIsOk())
			::ResetEvent(hCommEvent);
			else
			break;
		}
		TranslateMessage(&msg);
		::DispatchMessage(&msg);
	}

#else

	afterRun();
#endif

	appendRecordIfNeed();
	return 1;

}
