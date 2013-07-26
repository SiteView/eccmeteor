#include "ConfigChangeThread.h"
#include "SchMain.h"

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

extern SUtil *putil;
extern CString g_strRootPath;
extern std::string g_ConfigTrackQueueName;
extern std::string g_ServerHost;

ConfigChangeThread::ConfigChangeThread()
{
	m_pSchMain = NULL;

}

ConfigChangeThread::~ConfigChangeThread()
{

}

void ConfigChangeThread::run()
{
	char seid[100] = { 0 };
	sprintf(seid, "_%d", m_pSchMain->m_pOption->m_seid);
	string configtq = g_ConfigTrackQueueName;
	configtq += seid;

	printf("configtq:%s,scaddr:%s\n", configtq.c_str(), g_ServerHost.c_str());

	::CreateQueue(configtq, 1, "default", g_ServerHost);
	::ClearQueueMessage(configtq, "default", g_ServerHost);

	while (true)
	{
		MQRECORD mrd = ::BlockPopMessage(configtq, "default", g_ServerHost);
		if (mrd == INVALID_VALUE)
		{
			ThreadEx::sleep(10 * 1000);
			continue;
		}

//		::Sleep(1000*2);

		string label;
		svutil::TTime ct;
		char id[256] = { 0 };
		S_UINT dlen = 0;
		if (!::GetMessageData(mrd, label, ct, NULL, dlen))
		{
			::CloseMQRecord(mrd);
			continue;
		}

		if (dlen > 255)
		{
			::CloseMQRecord(mrd);
			continue;
		}

		if (!::GetMessageData(mrd, label, ct, id, dlen))
		{
			::CloseMQRecord(mrd);
			continue;
		}
		::CloseMQRecord(mrd);
		try
		{
			printf("------------Config update:OPT:%s,ID:%s----------------", label.c_str(), id);
			m_pSchMain->ProcessConfigChange(label, id);
			m_pSchMain->m_bDataChange = true;

		} catch (MSException &e)
		{
			putil->ErrorLog(e.GetDescription());
		} catch (...)
		{
			putil->ErrorLog("Update config exception");

		}

	}

}

void ConfigChangeThread::SetSchMain(SchMain *pSchMain)
{
	m_pSchMain = pSchMain;

}
