#include "WatchProcess.h"
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

#include <svdbapi.h>

WatchProcess::WatchProcess()
{
	m_toExit = false;
	m_pi = NULL;  //no use in linux
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
#endif
	ThreadEx::sleep(100);
	this->exit();
}


bool WatchProcess::init(PROCESS_INFORMATION * pi, string pname)
{
#ifdef	WIN32
	if(pi==NULL)
	return false;
	m_pi = pi; //no use in linux
#endif
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
	if (!::svCreateProcess(m_pi, m_pName.c_str(), "", true))
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

	ThreadEx::sleep(3600 * 1000);
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

