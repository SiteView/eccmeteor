#include "InspectSch.h"

#include "CUtil.h"

#ifndef	WIN32
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <limits.h>
#include <unistd.h>
#endif

#ifdef	WIN32
#include <windows.h>
#include "PSAPI.h"
#endif
#define		WM_COMMUNICATION	WM_USER+135

#include <svdbapi.h>
#include <buffer.h>
#include <svtime.h>

InspectSch::InspectSch()
{
	m_toExit = false;

	m_RestartTime = 340;    //重启 schedule 的间隔时间(分钟);
	m_MaxMemory = 600;      //许可内存占用大小（MB）
	m_ExitTimeOut = 1000;   //终止子进程时要等待的时间(毫秒);
	m_CheckTime = 5;        //尝试跟 schedule 通讯的时间间隔(分钟)

	m_pi = NULL;  //no use in linux

#ifdef	WIN32
	m_hCom = NULL;
#endif
}

InspectSch::~InspectSch()
{

}


bool InspectSch::init(PROCESS_INFORMATION * pi, string pname)
{
#ifdef	WIN32
	if(pi==NULL)
	return false;
	m_pi = pi; //no use in linux
#endif
	m_pName = pname;
	return true;
}


bool InspectSch::createEvent()
{
#ifdef	WIN32
	m_hCom = ::CreateEvent(NULL, TRUE, FALSE, "Global\\Siteview-Communictions");
	if (m_hCom == NULL)
	{
		CErrorLog("创建跟子进程通信事件失败\n");
		return false;
	}
	if (::GetLastError() == ERROR_ALREADY_EXISTS)
	{
		CErrorLog("该进程已经存在!");
		return false;
	}
#endif
	return true;
}

#ifdef	WIN32
int GetProcessMemSize(DWORD ProcessID)
{
	DWORD dwSize = 0;
	HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, ProcessID);
	if (NULL != hProcess)
	{
		PROCESS_MEMORY_COUNTERS pmc;
		if (GetProcessMemoryInfo(hProcess, &pmc, sizeof(pmc)))
		{
			dwSize = pmc.WorkingSetSize / (1024 * 1024);
		}
	}
	CloseHandle(hProcess);
	return dwSize;
}
#endif

void InspectSch::toExit()
{
	m_toExit = true;
	this->exit();
}

void InspectSch::toStopSch()
{
#ifdef	WIN32
	if(m_pi==NULL)
	return;
	CErrorLog("To stop process MonitorSchedule.");
	if (m_pi->dwThreadId)
	PostThreadMessage(m_pi->dwThreadId, WM_QUIT, (WPARAM) 0, (LPARAM) 0);

	if (m_pi->hProcess == NULL)
	return;

	if (::WaitForSingleObject(m_pi->hProcess, m_ExitTimeOut) == WAIT_TIMEOUT)
	{
		CErrorLog("Force to TerminateProcess MonitorSchedule!");
		::TerminateProcess(m_pi->hProcess, 2);
	}
#else
	long pid = getServicePid(m_pName);
	if (pid == 0)
		printf("Failed to getServicePid for %s\n", m_pName.c_str());
	else
	{
		int ret = kill(pid, SIGQUIT);
		printf("stop %s by: kill -QUIT %ld , ret:%d\n", m_pName.c_str(), pid, ret);
		ThreadEx::sleep(m_ExitTimeOut);
		kill(pid, SIGKILL);
	}
#endif
}

void InspectSch::run()
{
	svutil::TTime startupTime = svutil::TTime::GetCurrentTimeEx();
	svutil::TTime curtime = startupTime;
	svutil::TTime lastchecktime = startupTime;
	svutil::TTimeSpan st, sct;

	bool first = true;

	while (true)
	{
		if (m_toExit)
			return;

		try
		{
			curtime = svutil::TTime::GetCurrentTimeEx();
			if (first || ((curtime - lastchecktime).GetTotalMinutes() >= m_CheckTime))
			{
				first = false;
#ifdef	WIN32
				int size = GetProcessMemSize(m_pi->dwProcessId);
				printf("MonitorSchedule memory size: %dMB at %s ... \n", size, curtime.Format().c_str());
#else
				int size = 0;
#endif

				lastchecktime = curtime;
				if (size > m_MaxMemory)
				{
					CErrorLog("--- MonitorSchedule will restart for over-memory.");
					puts("\n");
					toStopSch();
					startupTime = curtime;
					continue;
				}
			}
			if (m_toExit)
				return;

			if ((curtime - startupTime).GetTotalMinutes() >= m_RestartTime)
			{
				puts("--- MonitorSchedule RestartTime's up\n");
				toStopSch();
				startupTime = curtime;
				continue;
			}
			if (m_toExit)
				return;

			ThreadEx::sleep(m_CheckTime * 60 * 1000);

#ifdef	WIN32
			bool willtermi = true;
			for (int t = 1; t <= 2; ++t)
			{
				ThreadEx::sleep(1000);
				::SetEvent (m_hCom);
				for (int i = 1; i <= 3; ++i)
				{
					if (::PostThreadMessage(m_pi->dwThreadId, WM_COMMUNICATION, (WPARAM) 0, (LPARAM) 0))
					break;
				}
				ThreadEx::sleep(1000);
				if (::WaitForSingleObject(m_hCom, 1) == WAIT_TIMEOUT)
				{
					willtermi = false;
					break;
				}
			}
			if (willtermi)
			{
				CErrorLog("Failed to communicate with MonitorSchedule.");
				toStopSch();
				startupTime = curtime;
			}
			else
			printf("MonitorSchedule communicated at %s ... \n", svutil::TTime::GetCurrentTimeEx().Format().c_str());
#endif
		} catch (...)
		{
			printf("InspectSch::run() exception happend. \n");
		}

	}
}

