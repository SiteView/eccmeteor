#ifndef  DRAGONFLOW_MONITORSCHMAIN
#define DRAGONFLOW_MONITORSCHMAIN

#include "Schedule.h"
#include "Monitors.h"
#include "LoadConfig.h"
#include "ConfigChangeThread.h"
#include "Task.h"
#include "Option.h"
#include "appendmassrecord.h"

class DispatchThread;

class SchMain
{
public:
	Monitors* GetMonitorByID(const char *MonitorID);
	bool DeleteMonitorV70(string monitorid);
	Groups *GetGroups(void)
	{
		return m_pGroups;
	}
	BOOL CheckGroupDependState(Monitors *pMonitor,CString &strDependID);
	bool CheckTask(Monitors *pMonitor,CTime ct,bool &isabs);
	CMonitorList & GetMonitorList(void);
	Subsequent* GetSubsequtent(void)
	{
		return m_pSub;
	}
	void Run(void);
	BOOL Init(void);
	SchMain();
	virtual ~SchMain();

	bool ProcessConfigChange(string opt,string id);

	ost::Mutex	m_MonitorListMutex;
	ost::Mutex	m_DemoDllMutex;
	Option *m_pOption;

	bool m_bDataChange;

private:
	LoadConfig m_lc;
protected:

	bool AddEntityV70(string entityid,bool isEdit);
	bool AddGroupV70(string groupid,bool isEdit);
	bool ReLoadMonitorsV70(string parentid);
	bool ReLoadTaskV70();
	bool InitMonitorsGroupDependV70(string parentid);
	bool InitGroupDependByMonitorChangeV70(Monitors *oldpm,Monitors* newpm,bool isdel);
	bool EntityChangeV70(Entitys *oldE,Entitys *newE,bool isdel);
	bool AddMonitorV70(string monitorid,bool isEdit);
	static bool ParseOpt(string opt,string &name,string &type);

	int GetMonitorLastState(const char *MonitorID);

	DispatchThread * m_DispatchThread;
	Subsequent * m_pSub;
	Groups * m_pGroups;
	CMonitorList m_MonitorList;

	ConfigChangeThread * m_pConfThread;
	CAppendMassRecord * m_pAppendThread;

	TASKMAP	m_TaskMap;
	ost::Mutex	m_TaskMutex;

public:
	bool LoadPreLibrary(void);
};

#endif
