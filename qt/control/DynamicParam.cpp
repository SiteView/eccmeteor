#include "DynamicParam.h"
#include "CUtil.h"

#ifndef	WIN32
#include <dlfcn.h>
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
#include <buffer.h>

extern CString g_ScheduleProcessName;
extern CString g_strRefreshQueueName;

typedef bool (ListDevice)(const char* szQuery, char* szReturn, int &nSize);
int getDynamicParam(const char queueInit);

DynamicParam::DynamicParam(COption * option)
{
	m_toExit = false;
	m_option = option;
	m_pi = NULL;
}

DynamicParam::~DynamicParam()
{

}

void DynamicParam::ReadParamFromQueue(const string &qname, string &sDll, string &sFunc, char * &sParam)
{
	MQRECORD mrd = PopMessage(qname, 1000, "default");
	if (mrd == INVALID_VALUE)
	{
		ThreadEx::sleep(1000);
		return;
	}

	string label;
	svutil::TTime ct;
	unsigned int dlen = 0;
	if (!GetMessageData(mrd, label, ct, NULL, dlen))
	{
		::CloseMQRecord(mrd);
		return;
	}
	if (label == "PARAMS")
	{
		if(sParam)
			delete [] sParam;
		sParam = new char[dlen];
        if(sParam)
        {
        	if (!::GetMessageData(mrd, label, ct, sParam, dlen))
            {
                delete [] sParam;
                sParam = NULL;
                ::CloseMQRecord(mrd);
            }
        }
        ::CloseMQRecord(mrd);
	}
	else
	{
		if (dlen > 510)
		{
			::CloseMQRecord(mrd);
			return;
		}
		char text[512] = { 0 };
		if (!::GetMessageData(mrd, label, ct, text, dlen))
		{
			::CloseMQRecord(mrd);
			return;
		}
		::CloseMQRecord(mrd);

		if (label == "DLL")
		{
			sDll = text;
		}
		else if (label == "FUNC")
		{
			sFunc = text;
		}
	}
}

bool DynamicParam::runDynamicParamDll(const char *pszDll, const char *pszFunc, const char *pszParam, char * pBuffer,
		int &nSize)
{
	bool bRet = false;
	string szDllName("");
	string szFunc;
	if (m_option->m_isDemo)
	{
		szDllName = GetSiteViewRootPath() + "/fcgi-bin/";
		szDllName += m_option->m_DemoDLL;
		szFunc = pszFunc;
		cout << "--- demo mode, library: " << szDllName.c_str() << " , func: " << szFunc.c_str() << endl;
	}
	else
	{
		szDllName = GetSiteViewRootPath() + "/fcgi-bin/";
		szDllName += pszDll;
		szFunc = pszFunc;
	}

#ifdef WIN32
	HINSTANCE hDll = LoadLibrary(szDllName.c_str());
	if (hDll)
	{
		try
		{
			ListDevice* func = (ListDevice*)GetProcAddress(hDll, szFunc.c_str());
			if (func)
			{
				bRet = (*func)(pszParam, pBuffer, nSize);
			}
			else
			{
				sprintf(pBuffer, "error=Get Proc's address failed(%s)", szFunc.c_str());
				cout << "Get Proc " << szFunc.c_str() << "'s Address failed!" << endl;
			}
		}
		catch(...)
		{
			sprintf(pBuffer, "error=exception happend in:%s, func:%s", szDllName.c_str(), szFunc.c_str());
			::FreeLibrary(hDll);
			cout<<"exception happend in runDynamicParamDll"<<endl;
		}
		::FreeLibrary(hDll);
	}
	else
	{
		sprintf(pBuffer, "error=LoadLibrary Failed(%s)", szDllName.c_str());
		cout << "load dll failed" << endl;
	}
#else
	void *dp;
	char *error;

	dp = dlopen(szDllName.c_str(), RTLD_LAZY);

	if (dp == NULL)
	{
		sprintf(pBuffer, "error=dlopen(LoadLibrary) Failed(%s)", szDllName.c_str());
		error = dlerror();
		cout << "load " << szDllName.c_str() << " failed, " << error << endl;
		return false;
	}
	try
	{
		ListDevice* func = (ListDevice*) dlsym(dp, szFunc.c_str());
		error = dlerror();
		if (error == NULL || func != NULL)
		{
			MutexLock lock(m_DemoDllMutex);
			bRet = (*func)(pszParam, pBuffer, nSize);
		}
		else
		{
			sprintf(pBuffer, "error=Get Proc's address failed(%s)", szFunc.c_str());
			cout << "dlsym(GetProcAddress): " << szFunc.c_str() << " failed " << error << endl;
		}
	} catch (...)
	{
		sprintf(pBuffer, "error=exception happend in:%s, func:%s", szDllName.c_str(), szFunc.c_str());
		dlclose(dp);
		cout << "exception happend in runDynamicParamDll" << endl;
	}
	dlclose(dp);
#endif
	return bRet;
}

int DynamicParam::getDynamicParam(const char * queueInit)
{
	static const int BUFFSIZE = 10 * 1024;
	static const char szSeparator = '#';

	string qread(queueInit);
	qread += "_R";
	string qwrite(queueInit);
	qwrite += "_W";

	int nTimes = 0;
	string sDll, sFunc;
	char * sParam=NULL;
	while (sDll.empty() || sFunc.empty() || sParam==NULL )
	{
		if (nTimes >= 40)
			break;
		ReadParamFromQueue(qread, sDll, sFunc, sParam);
		nTimes++;
	}
#ifndef WIN32
	if (!sDll.empty())
	{
		int posd = sDll.find(".dll");
		if (posd != std::string::npos)
			sDll = sDll.substr(0, posd) + ".so";
		if (sDll.find("lib") != 0)
			sDll = "lib" + sDll;
	}
#endif
	if (sDll.empty() || sFunc.empty() || sParam==NULL)
	{
		cout << "Can not to getDynamicParam, because Dll or Func or Param is empty." << endl;
		return 0;
	}
	cout << "getDynamicParam, Dll name is :" << sDll.c_str() << endl;
	cout << "getDynamicParam, Func name is :" << sFunc.c_str() << endl;
	cout << "getDynamicParam, Param is :" << sParam << endl;

	DeleteQueue(qread, "default");

	char szBuffer[BUFFSIZE + 1] = { 0 };
	int nSize = BUFFSIZE;
	bool isok = true;
	try
	{
		isok = runDynamicParamDll(sDll.c_str(), sFunc.c_str(), sParam, szBuffer, nSize);
	} catch (...)
	{
		printf("getDynamicParam, calling library exception happend. \n");
	}

	if(sParam)
	{
		delete [] sParam;
		sParam = NULL;
	}
	if (isok)
	{
		if (!PushMessage(qwrite, "DYNPARAM", szBuffer, nSize, "default"))
			cout << "getDynamicParam, write data into queue failed --- " << qwrite << endl;
	}
	cout << "getDynamicParam, part result: " << szBuffer << endl;
	char pEnd[2] = { 0 };
	if (!PushMessage(qwrite, "DYNEND", pEnd, 2, "default"))
	{
		//maybe call DeleteQueue by java, it's ok.
		//cout << "getDynamicParam, write data into queue failed --- " << qwrite << endl;
	}
	cout << "getDynamicParam done!\n" << endl;
	return 0;
}

bool DynamicParam::RunRefresh(string queuename, string label)
{
	CString win_arg;
	win_arg.Format(" %s %s %s", queuename.c_str(), label.c_str(), GetSvdbAddr().c_str());

	char a0[1024] = { 0 };
	char a1[256] = { 0 };
	char a2[256] = { 0 };
	char a3[256] = { 0 };
	strcpy(a0, g_ScheduleProcessName.getText());
	strcpy(a1, queuename.c_str());
	strcpy(a2, label.c_str());
	strcpy(a3, GetSvdbAddr().c_str());

	char * unix_argv[] = { a0, a1, a2, a3, NULL };

	return svCreateProcess(win_arg, unix_argv, m_pi, g_ScheduleProcessName);
}

void DynamicParam::toExit()
{
	m_toExit = true;
	this->exit();
}

void DynamicParam::run()
{
	string label("");
	svutil::TTime ct;
	unsigned int len = 0;
	string oldlabel("");

	int n = 0;
	::CreateQueue(g_strRefreshQueueName.GetBuffer(0), 1, "default");
	::ClearQueueMessage(g_strRefreshQueueName.GetBuffer(0), "default");

	OBJECT objMonitor = GetMonitorTemplet(1);
	if (objMonitor != INVALID_VALUE)
		CloseMonitorTemplet(objMonitor);
	objMonitor = Cache_GetMonitorTemplet(1);
	if (objMonitor != INVALID_VALUE)
		CloseMonitorTemplet(objMonitor);

	if (m_option->m_isDemo)
	{
		String DllName = GetSiteViewRootPath() + "/fcgi-bin/";
		DllName += m_option->m_DemoDLL;
		printf("to preLoad demo library: %s\n", DllName.c_str());
		try
		{
#ifdef WIN32
			HMODULE hm=::LoadLibrary(DllName.c_str());
			if(!hm)
			{
				printf("Failed to preload library: %s, error:%d\n",DllName.c_str(), GetLastError());
			}
#else
			void *dp = dlopen(DllName.c_str(), RTLD_LAZY);
			if (dp == NULL)
			{
				printf("Failed to pre-dlopen library: %s,Error:%s", DllName.c_str(), dlerror());
			}
#endif
		} catch (...)
		{
			printf("Eexception happended to preLoad: %s \n", DllName.c_str());
		}
	}

	PROCESS_INFORMATION pi;
	m_pi = &pi;
	while (true)
	{
		if (m_toExit)
			return;

		try
		{
			ThreadEx::sleep(3 * 1000);   //delay

			MQRECORD mrd = ::BlockPeekMQMessage(g_strRefreshQueueName.GetBuffer(0), "default");
			if (mrd == INVALID_VALUE)
			{
				printf("queue name:%s\n", g_strRefreshQueueName.GetBuffer(0));
				puts("Peek failed\n");
				ThreadEx::sleep(10 * 1000);
				continue;
			}
			if (!::GetMessageData(mrd, label, ct, NULL, len))
			{
				puts("Get message data failed\n");
				::CloseMQRecord(mrd);
				continue;
			}
			if (label.compare("DYNPARAM") == 0)
			{
				svutil::buffer buf;
				if (!buf.checksize(len))
				{
					::CloseMQRecord(mrd);
					continue;
				}

				if (!::GetMessageData(mrd, label, ct, buf.getbuffer(), len))
				{

					::CloseMQRecord(mrd);
					continue;
				}

				::CloseMQRecord(mrd);

				printf("to get DYNPARAM, %s\n",buf.getbuffer());
				getDynamicParam(buf.getbuffer());

				MQRECORD mddd = ::PopMessage(g_strRefreshQueueName.getText(), 0, "default");
				if (mddd != INVALID_VALUE)
					::CloseMQRecord(mddd);

				continue;
			}
			::CloseMQRecord(mrd);

			printf("oldlabel:%s,label:%s\n", oldlabel.c_str(), label.c_str());
			if (label.compare(oldlabel) == 0)
			{
				n++;
				ThreadEx::sleep(3 * 1000);
				if (n > 3)
				{
					MQRECORD mddd = ::PopMessage(g_strRefreshQueueName.getText(), 0, "default");
					if (mddd != INVALID_VALUE)
						::CloseMQRecord(mddd);
				}
				continue;
			}

			n = 0;
			oldlabel = "";

			if (!RunRefresh(g_strRefreshQueueName.getText(), label))
			{
				puts("RunRefresh failed\n");
				char buf[256] = { 0 };
				sprintf(buf, "Start %s failed", g_ScheduleProcessName.getText());
				::PushMessage(label, "Refresh_ERROR", buf, strlen(buf) + 1, "default");
				::ClearQueueMessage(g_strRefreshQueueName.GetBuffer(0), "default");
			}
			else
				puts("RunRefresh done!\n");

			oldlabel = label;

		} catch (...)
		{
			printf("DynamicParam::run() exception happend. \n");
		}
	}
}

