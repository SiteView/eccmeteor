#include "WatchProcess.h"
#include "CUtil.h"

#ifndef	WIN32
#include <sys/types.h>
#include <sys/stat.h>
#include<sys/wait.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <limits.h>
#include <unistd.h>
#endif

#include <svdbapi.h>

WatchProcess::WatchProcess()
{
	m_toExit = false;
	m_pi = NULL;
}

WatchProcess::~WatchProcess()
{

}

void WatchProcess::toTerminateProcess()
{
#ifdef	WIN32
	if(m_pi==NULL)
	return;
	if (m_pi->hProcess)
	{
		::TerminateProcess(m_pi->hProcess,3);
	}
	::CloseHandle(m_pi->hProcess);
	::CloseHandle(m_pi->hThread);
#else
	long pid = getServicePid(m_pName);
	if (pid == 0)
		printf("Failed to getServicePid for %s\n", m_pName.c_str());
	else
	{
		int ret = kill(pid, SIGKILL);
		printf("stop %s by: kill -KILL %ld , ret:%d\n", m_pName.c_str(), pid, ret);
	}
#endif
}

void WatchProcess::toExit()
{
	m_toExit = true;
#ifdef	WIN32
	if (m_pi && m_pi->dwThreadId)
	{
		::PostThreadMessage(m_pi->dwThreadId,WM_QUIT,0,0);
	}
#else
	long pid = getServicePid(m_pName);
	if (pid == 0)
		printf("Failed to getServicePid for %s\n", m_pName.c_str());
	else
	{
		int ret = kill(pid, SIGQUIT);
		printf("stop %s by: kill -QUIT %ld , ret:%d\n", m_pName.c_str(), pid, ret);
	}
#endif
	ThreadEx::sleep(500);
	this->exit();
}

bool WatchProcess::init(PROCESS_INFORMATION * pi, string pname)
{
	if (pi == NULL)
		return false;
	m_pi = pi;
	m_pName = pname;
	return true;
}

bool WatchProcess::runProcess()
{
	if (m_toExit)
		return true;

#ifdef	WIN32
	if(m_pi==NULL)
	return false;
	ZeroMemory(m_pi, sizeof(PROCESS_INFORMATION));
	if (!::svCreateProcess("", NULL, m_pi, m_pName.c_str(), true))
	{
		string error= "Failed to run process: " + m_pName;
		CErrorLog(error.c_str());
		return false;
	}
	string text= "Succeeded to start process: " + m_pName;
	puts(text.c_str());

	::WaitForSingleObject(m_pi->hProcess, INFINITE);
	::CloseHandle(m_pi->hProcess);
	::CloseHandle(m_pi->hThread);

#else

	char a0[1024] = { 0 };
	strcpy(a0, m_pName.c_str());
	char * unix_argv[] = { a0, NULL };

	//	char a1[32] = { 0 };
	//	strcpy(a1, "-service");
	//	char * unix_argv[] = { a0, a1, NULL };

	if (m_pi)
	{
		svCreateProcess("", unix_argv, m_pi, m_pName);
		ThreadEx::sleep(2000);
		pid_t pid = getServicePid(m_pName);
		if (pid == 0)
			printf("Failed to getServicePid for %s\n", m_pName.c_str());
		else
		{
			while (true)
			{
				pid_t pret = waitpid(pid, NULL, 0);   //parent wait child process to return
				printf("waitpid for %s , ret: %d (%s)\n", m_pName.c_str(), pret, strerror(errno));
				if (pret = pid)
					return true;
				ThreadEx::sleep(1000);
			}
		}
	}

#endif

	return true;
}

void WatchProcess::run()
{
	while (!m_toExit)
	{
		try
		{
			runProcess();
			ThreadEx::sleep(5000);

		} catch (...)
		{
			printf("WatchProcess::run() exception happend. \n");
		}
	}
}

