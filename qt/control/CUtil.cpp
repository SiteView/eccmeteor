#include "CUtil.h"

#include <svtime.h>
#include <util.h>
#include <cc++/file.h>

static ost::Mutex g_ErrorLoglock;
static ost::Mutex g_EventLoglock;

extern std::string g_rootpath;

CUtil::CUtil()
{
}

CUtil::~CUtil()
{
}

CString CUtil::GetSVRootPath()
{
	string path = GetSiteViewRootPath();
	return path.c_str();
}

std::string getCtonrolProcessId()
{
#ifdef	WIN32
	DWORD pid= GetCurrentProcessId();
#else
	DWORD pid= getpid();
#endif
	char buf[32]={0};
	sprintf(buf, "%d", pid);
	return buf;
}

void CLog(CString strError, char * fname)
{
	CString mse = getCtonrolProcessId();
	mse += "  ";
	mse += svutil::TTime::GetCurrentTimeEx().Format();
	mse += "\t";
	mse += strError.getText();
	mse += "\r\n";

	ThreadFile tf(fname);
	char *pstr = mse.getText();
	tf.append(pstr, (ccxx_size_t) strlen(pstr));
}

void CErrorLog(CString strError)
{
//	ost::MutexLock lock(g_ErrorLoglock);
	printf("%s\n", strError.getText());
	CString strPath = g_rootpath.c_str();
	strPath += "/data/contrl.log";

	CLog(strError, strPath.getText());
}

bool svCreateProcess(PROCESS_INFORMATION * pi, CString ProcessName, CString parameter, bool islocal)
{
#ifdef	WIN32
	CString strCommandLine;

	STARTUPINFO si;
	CString strDir = g_rootpath.c_str();
	strDir += "\\fcgi-bin\\";

	ZeroMemory(&si, sizeof(si));
	si.cb = sizeof(si);
	ZeroMemory(pi, sizeof(PROCESS_INFORMATION));

	CString arg;
	if (!parameter.IsEmpty())
	{
		arg += " ";
		arg += parameter;
	}

	if (islocal)
	strCommandLine.Format("%s%s", (LPCSTR) ProcessName, (LPCSTR) arg);
	else
	strCommandLine.Format("%s\\fcgi-bin\\%s%s", g_rootpath.c_str(), (LPCSTR) ProcessName, (LPCSTR) arg);

	printf("commandline:%s\n", strCommandLine.GetBuffer(0));

	int n = 0;
	bool bRet = true;

	while (!::CreateProcess(NULL, strCommandLine.GetBuffer(strCommandLine.GetLength()), NULL, NULL, FALSE,
					/*CREATE_NO_WINDOW*/CREATE_NEW_CONSOLE, NULL, strDir.GetBuffer(strDir.GetLength()), &si, pi))
	{
		::Sleep(500);
		n++;
		if (n >= 4)
		{
			bRet = false;
			printf("RunProcess:%s failed,error id:%d\n", (LPCSTR) ProcessName, GetLastError());
			break;
		}

		DWORD dw = GetLastError();
		printf("RunProcess error:%d\n", dw);
	}

	return bRet;
#else
	return true;
#endif
}

