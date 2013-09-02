#include <stlini.h>
#include <addon.h>
#include <util.h>
#include <set>

#include "COption.h"
#include "TString.h"

#ifndef WIN32
#include <dlfcn.h>
#endif

extern bool g_bool_watch_AlertServer;
extern bool g_bool_watch_ReportGenerate;
extern bool g_bool_watch_Monitorshedule;

extern CString g_strRefreshQueueName;
extern std::set<std::string> g_exes;
extern std::string g_rootpath;

COption::COption(InspectSch * inspect)
{
	m_inspect = inspect;

	m_isDemo = false;
	m_PreLoadLibrary = "Monitors.dll,AimParser.dll,NTPerfTest.dll,SNMPMonitor.dll,GetRandomValue.dll,";
	m_DemoDLL = "GetRandomValue.dll";
	m_DemoFunction = "GetMonitorRandomValue";
	m_seid = 1;
	m_ServerAddress = "localhost";
}

COption::~COption(void)
{
}

bool COption::LoadOption()
{
	m_RootPath = GetRootPath();
	if (m_RootPath.empty())
		return false;
	g_rootpath= m_RootPath;

	char filepath[1024] = { 0 };
	sprintf(filepath, "%s/fcgi-bin/mc.config", g_rootpath.c_str());
	printf("to load config: %s\n", filepath);

	if(GetSvdbAddr().empty())
	{
		char filepath2[1024] = { 0 };
		sprintf(filepath2, "%s/fcgi-bin/svapi.ini", g_rootpath.c_str());
		SetSvdbAddrByFile(filepath2);
		if(GetSvdbAddr().empty())
		{
			SetSvdbAddrByFile(filepath);
			if(!GetSvdbAddr().empty())
			{
				printf("SetSvdbAddr ByFile: %s\n",filepath);
			}
		}
		else
		{
			printf("SetSvdbAddr ByFile: %s\n",filepath2);
		}
	}
	printf("\n");

	string svalue;
	INIFile inif = LoadIni(filepath);
	svalue = GetIniSetting(inif, "MonitorSchedule", "DemoMode", "");
	if (!svalue.empty())
		m_isDemo = (svalue == "true") ? true : false;
	printf("DemoMode:%d\n", m_isDemo);

	svalue.clear();
	svalue = GetIniSetting(inif, "MonitorSchedule", "PreLoadLibrary", "");
	if (!svalue.empty())
		m_PreLoadLibrary += svalue + ",";

	svalue.clear();
	svalue = GetIniSetting(inif, "MonitorSchedule", "DemoLibrary", "");
	if (!svalue.empty())
		m_DemoDLL = svalue;
	printf("DemoLibrary:%s\n", m_DemoDLL.c_str());

	svalue.clear();
	svalue = GetIniSetting(inif, "MonitorSchedule", "DemoFunction", "");
	if (!svalue.empty())
		m_DemoFunction = svalue;
	printf("DemoFunction:%s\n", m_DemoFunction.c_str());

	svalue.clear();
	svalue = GetIniSetting(inif, "MonitorSchedule", "SEID", "");
	if (!svalue.empty())
	{
		m_seid = atoi(svalue.c_str());
	}
	printf("SEID:%d\n", m_seid);

	char strr[1024] = { 0 };
	sprintf(strr, "%s_%d", g_strRefreshQueueName.GetBuffer(1), m_seid);
	g_strRefreshQueueName = strr;
	printf("Refresh queue: %s\n", g_strRefreshQueueName.getText());

	printf("SvdbHostAddr:%s\n", GetSvdbAddr().c_str());

	svalue.clear();
	svalue = GetIniSetting(inif, "EnableWatch", "AlertServer", "");
	if (!svalue.empty())
		g_bool_watch_AlertServer = (atoi(svalue.c_str()) != 0);

	svalue.clear();
	svalue = GetIniSetting(inif, "EnableWatch", "reportgenerate", "");
	if (!svalue.empty())
		g_bool_watch_ReportGenerate = (atoi(svalue.c_str()) != 0);

	svalue.clear();
	svalue = GetIniSetting(inif, "EnableWatch", "MonitorSchedule", "");
	if (!svalue.empty())
		g_bool_watch_Monitorshedule = (atoi(svalue.c_str()) != 0);

	printf("\n(EnableWatch)AlertServer: %d\n", g_bool_watch_AlertServer);
	printf("(EnableWatch)reportgenerate: %d\n", g_bool_watch_ReportGenerate);
	printf("(EnableWatch)MonitorSchedule: %d\n", g_bool_watch_Monitorshedule);

	svalue.clear();
	svalue = GetIniSetting(inif, "ExeToBeWatched", "exes", "");
	if (!svalue.empty())
	{
		try
		{
			char buf[1024] = { 0 };
			strcpy(buf, svalue.c_str());
			std::string exename;
			char * token = strtok(buf, ",");
			while (token != NULL)
			{
				exename = TrimSpace(token);
				if (!exename.empty())
					g_exes.insert(exename);
				token = strtok(NULL, ",");
			}
		} catch (...)
		{
			printf("Exception to strtok  ExeToBeWatched \n");
		}
	}
	std::set<std::string>::iterator sit;
	for (sit = g_exes.begin(); sit != g_exes.end(); ++sit)
		printf("Exe to be Watched: \"%s\"\n", sit->c_str());

	if (m_inspect == NULL)
		return false;

	svalue.clear();
	svalue = GetIniSetting(inif, "information", "CheckTime", "");
	if (!svalue.empty())
		m_inspect->m_CheckTime = atoi(svalue.c_str());
	if (g_bool_watch_Monitorshedule)
		printf("(Schedule)CheckTime:%d\n", m_inspect->m_CheckTime);

	svalue.clear();
	svalue = GetIniSetting(inif, "information", "MaxMemory", "");
	if (!svalue.empty())
		m_inspect->m_MaxMemory = atoi(svalue.c_str());
	if (g_bool_watch_Monitorshedule)
		printf("(Schedule)MaxMemory:%d\n", m_inspect->m_MaxMemory);

	svalue.clear();
	svalue = GetIniSetting(inif, "information", "RestartTime", "");
	if (!svalue.empty())
		m_inspect->m_RestartTime = atoi(svalue.c_str());
	if (g_bool_watch_Monitorshedule)
		printf("(Schedule)RestartTime:%d\n", m_inspect->m_RestartTime);

	printf("\n");
	return true;
}
