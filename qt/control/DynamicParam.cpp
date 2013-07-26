#include "DynamicParam.h"
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
#include <buffer.h>

extern CString g_ScheduleProcessName;
extern CString g_strRefreshQueueName;

typedef bool (ListDevice)(const char* szQuery, char* szReturn, int &nSize);
int getDynamicParam(const char queueInit);

DynamicParam::DynamicParam(COption * option)
{
	m_toExit = false;
	m_option = option;
	m_pi = NULL;  //no use in linux
}

DynamicParam::~DynamicParam()
{

}

void DynamicParam::ReadParamFromQueue(const string &qname, string &sDll, string &sFunc, string &sParam)
{
	MQRECORD mrd = PopMessage(qname, 1000, "default");
	if (mrd == INVALID_VALUE)
	{
		ThreadEx::sleep(300);
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
	else if (label == "PARAMS")
	{
		sParam = text;
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
		szFunc = m_option->m_DemoFunction;
	}
	else
	{
		szDllName = GetSiteViewRootPath() + "/fcgi-bin/";
		szDllName += pszDll;
		szFunc = pszFunc;
	}

	cout << "load library name : " << szDllName.c_str() << endl;

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
	string sDll, sFunc, sParam;
	while (sDll.empty() || sFunc.empty() || sParam.empty())
	{
		if (nTimes >= 20)
			break;
		ReadParamFromQueue(qread, sDll, sFunc, sParam);
		nTimes++;
	}
	cout << "getDynamicParam, Dll name is :" << sDll.c_str() << endl;
	cout << "getDynamicParam, Func name is : " << sFunc.c_str() << endl;
	cout << "getDynamicParam, Param is : " << sParam.c_str() << endl;
	if (sDll.empty() || sFunc.empty() || sParam.empty())
	{
		cout << "Can not to getDynamicParam, because Dll or Func or Param is empty." << endl;
		return 0;
	}

	DeleteQueue(qread, "default");

	char szBuffer[BUFFSIZE + 1] = { 0 };
	int nSize = BUFFSIZE;
	bool isok = true;
	try
	{
		isok = runDynamicParamDll(sDll.c_str(), sFunc.c_str(), sParam.c_str(), szBuffer, nSize);
	} catch (...)
	{
		printf("getDynamicParam, calling library exception happend. \n");
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
	CString arg;
	arg.Format(" %s %s %s", queuename.c_str(), label.c_str(), GetSvdbAddr().c_str());
	return svCreateProcess(m_pi, g_ScheduleProcessName, arg);
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

	PROCESS_INFORMATION pi;
	m_pi = &pi;
	while (true)
	{
		if (m_toExit)
			return;

		try
		{
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
				puts("to get DYNPARAM ...");
				svutil::buffer buf;
				if (!buf.checksize(len))
				{
					::CloseMQRecord(mrd);
					continue;
				}

				if (!::GetMessageData(mrd, label, ct, buf, len))
				{

					::CloseMQRecord(mrd);
					continue;
				}

				::CloseMQRecord(mrd);

				getDynamicParam(buf);

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
				puts("RunRefresh failed");
				char buf[256] = { 0 };
				sprintf(buf, "Start %s failed", g_ScheduleProcessName.getText());
				::PushMessage(label, "Refresh_ERROR", buf, strlen(buf) + 1, "default");
				::ClearQueueMessage(g_strRefreshQueueName.GetBuffer(0), "default");
			}
			else
				puts("RunRefresh done!\n");

			oldlabel = label;

			ThreadEx::sleep(3 * 1000);   //delay

		} catch (...)
		{
			printf("DynamicParam::run() exception happend. \n");
		}
	}
}

