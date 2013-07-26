#include "SchMain.h"
#include "Schedule.h"
#include "DispatchThread.h"
#include <stlini.h>

extern SUtil *putil;
extern CString g_strRootPath;
extern string g_ServerHost;

SchMain::SchMain()
{
	m_pGroups = NULL;
	m_pSub = NULL;
	m_DispatchThread = NULL;
	m_pOption = NULL;
	m_bDataChange = false;
	m_pAppendThread = NULL;

}

SchMain::~SchMain()
{
	delete m_pGroups;
	delete m_pSub;

	CMonitorList::iterator it;
	while (it != m_MonitorList.end())
	{
		Monitors *pMonitor = *it++;
		delete pMonitor;
	}
	TASKMAP::iterator itt;
	while (m_TaskMap.findnext(itt))
	{
		Task *p = (*itt).getvalue();
		if (p)
			delete p;
	}

}

BOOL SchMain::Init()
{
	m_pOption = new Option;
	if (m_pOption == NULL)
		throw MSException("Create option object failed");
	m_pOption->LoadOption();

	g_ServerHost = m_pOption->m_ServerAddress;
	m_lc.m_pOption = m_pOption;

	LoadPreLibrary();

	bool flag = false;

	m_lc.LoadAll();

	m_pSub = new Subsequent;
	m_lc.CreateSubsequent(m_pSub);

	m_pGroups = new Groups;
	m_lc.CreateGroups(m_pGroups);
	m_lc.LoadTaskPlan(m_TaskMap);
	m_lc.CreateMonitors(m_MonitorList);
	m_lc.ReleaseAll();

	if (m_MonitorList.size() == 0)
		throw MSException("Monitors list is empty");

	m_DispatchThread = new DispatchThread(this);
	if (m_DispatchThread == NULL)
		throw MSException("Create schdule thread failed");
	m_DispatchThread->Init();

	m_pConfThread = new ConfigChangeThread(this);
	if (m_pConfThread == NULL)
		throw MSException("Create communication thread failed");
	m_pConfThread->Start();

	if (Univ::enablemass)
	{
		m_pAppendThread = new CAppendMassRecord();
		if (m_pConfThread == NULL)
			throw MSException("Create append mass records thread failed");
		m_pAppendThread->Start();
	}
	return TRUE;
}

void SchMain::Run()
{
	if (m_DispatchThread != NULL)
		m_DispatchThread->Start();

}

CMonitorList & SchMain::GetMonitorList()
{
	return m_MonitorList;

}

BOOL SchMain::CheckGroupDependState(Monitors *pMonitor, CString &strDependID)
{
	int nstate = 0;

	char mes[500] = { 0 };

	Monitors *pGM = NULL;
	switch (pMonitor->GetGroupDependState())
	{
	case Monitors::groupdependno:
		return FALSE;
	case Monitors::groupdependyes:
		pGM = pMonitor->GetGroupDependMonitor();
		if (pGM == NULL)
			break;
		nstate = pGM->GetLastState();
		nstate = (nstate == Monitors::STATUS_BAD) ? Monitors::STATUS_ERROR : nstate;

		if (nstate != pMonitor->GetGroupDependCondition())
		{
			strDependID = pGM->GetMonitorID();
			return TRUE;
		}
		else
			return FALSE;
	default:
		break;

	}

	string seid = pMonitor->GetSEID();
	string pParentID = pMonitor->GetParentID();

	if (stricmp(seid.c_str(),pParentID.c_str()) == 0)
	{
		pMonitor->SetGroupDependState(Monitors::groupdependno);
		return FALSE;
	}

	Entitys *pEntity = m_pGroups->GetEntityByID(pParentID.c_str());
	if (pEntity == NULL)
	{
		pMonitor->SetGroupDependState(Monitors::groupdependno);
		return FALSE;
	}
	int nCondition = 0;
	const char* DependMonitorID = NULL;

	bool isy = false;

	DependMonitorID = pEntity->GetDepend();
	if (strlen(DependMonitorID) > 0)
	{
		nCondition = pEntity->GetDependsCondition();
		if (nCondition < 1 || nCondition > 4)
		{
			pMonitor->SetGroupDependState(Monitors::groupdependno);
			return FALSE;
		}

		pGM = GetMonitorByID(DependMonitorID);
		if (pGM == NULL)
		{
			pMonitor->SetGroupDependState(Monitors::groupdependno);
			return FALSE;
		}

		pMonitor->SetGroupDependState(Monitors::groupdependyes);
		pMonitor->SetGroupDependMonitor(pGM);
		pMonitor->SetGroupDependCondition(nCondition);

		nstate = pGM->GetLastState();
		nstate = (nstate == Monitors::STATUS_BAD) ? Monitors::STATUS_ERROR : nstate;

		if (nCondition != nstate)
		{
			strDependID = DependMonitorID;
			return TRUE;
		}
		isy = true;

	}

	pParentID = pEntity->GetParentID();
	while (stricmp(pParentID.c_str(),seid.c_str()) != 0)
	{
		GroupsItem *pGroup = m_pGroups->GetSingleGroupByID(pParentID.c_str());
		if (pGroup == NULL)
		{
			pMonitor->SetGroupDependState(Monitors::groupdependno);
			return FALSE;
		}

		DependMonitorID = pGroup->GetDependSon();
		if (strlen(DependMonitorID) > 0)
		{
			nCondition = pGroup->GetDependsCondition();
			if (nCondition < 1 || nCondition > 4)
			{
				pMonitor->SetGroupDependState(Monitors::groupdependno);
				return FALSE;
			}

			pGM = GetMonitorByID(DependMonitorID);
			if (pGM == NULL)
			{
				pMonitor->SetGroupDependState(Monitors::groupdependno);
				return FALSE;
			}

			pMonitor->SetGroupDependState(Monitors::groupdependyes);
			pMonitor->SetGroupDependMonitor(pGM);
			pMonitor->SetGroupDependCondition(nCondition);

			nstate = pGM->GetLastState();
			nstate = (nstate == Monitors::STATUS_BAD) ? Monitors::STATUS_ERROR : nstate;

			if (nCondition != nstate)
			{
				strDependID = DependMonitorID;
				return TRUE;
			}
			isy = true;

		}
		pParentID = pGroup->GetParentID();
	}

	if (!isy)
		pMonitor->SetGroupDependState(Monitors::groupdependno);

	return FALSE;

}

bool SchMain::CheckTask(Monitors *pMonitor, CTime ct, bool &isabs)
{
	ost::MutexLock lock(m_TaskMutex);
	isabs = false;

	string task = pMonitor->GetTaskName();
	if (task.empty())
		return true;
	Task **pt = m_TaskMap.find(task);
	if (pt == NULL)
		return true;

	int wd = ct.GetWeekDay();
	if ((wd < 0) || (wd > 6))
		return true;

	int hour = ct.GetHour();
	int minute = ct.GetMinute();

	int n = (*pt)->m_week[wd].m_task.size();

	if ((*pt)->m_type == Task::TASK_ABSOLUTE)
	{
		isabs = true;
		for (int i = 0; i < n; i++)
		{
			if (hour == (*pt)->m_week[wd].m_task[i].m_beginhour)
				if (minute == (*pt)->m_week[wd].m_task[i].m_beginminute)
				{
					if ((*pt)->m_week[wd].m_enable)
						return true;
					else
						return false;
				}
		}

		if ((*pt)->m_week[wd].m_enable)
			return false;
		else
			return true;

	}
	else if ((*pt)->m_type == Task::TASK_RELATIVE)
	{
		isabs = false;

		CTime btm;
		CTime etm;
		for (int i = 0; i < n; i++)
		{
			btm = CTime(ct.GetYear(), ct.GetMonth(), ct.GetDay(), (*pt)->m_week[wd].m_task[i].m_beginhour,
					(*pt)->m_week[wd].m_task[i].m_beginminute, 0);
			etm = CTime(ct.GetYear(), ct.GetMonth(), ct.GetDay(), (*pt)->m_week[wd].m_task[i].m_endhour,
					(*pt)->m_week[wd].m_task[i].m_endminute, 59);

			if ((ct >= btm) && (ct <= etm))
			{
				if ((*pt)->m_week[wd].m_enable)
					return true;
				else
					return false;
			}

		}

		if ((*pt)->m_week[wd].m_enable)
			return false;
		else
			return true;

	}

	return true;
}

int SchMain::GetMonitorLastState(const char *MonitorID)
{
	if (m_MonitorList.empty())
		return 0;

	CMonitorList::iterator it;
	for (it = m_MonitorList.begin(); it != m_MonitorList.end(); it++)
	{
		Monitors *pMonitor = *it;
		if (strcmp(MonitorID, pMonitor->GetMonitorID()) == 0)
			return pMonitor->GetLastState();
	}
	return 0;

}

Monitors* SchMain::GetMonitorByID(const char *MonitorID)
{
	if (m_MonitorList.empty())
		return NULL;

	CMonitorList::iterator it;
	for (it = m_MonitorList.begin(); it != m_MonitorList.end(); it++)
	{
		Monitors *pMonitor = *it;
		if (strcmp(MonitorID, pMonitor->GetMonitorID()) == 0)
			return pMonitor;
	}
	return NULL;

}
bool SchMain::ParseOpt(string opt, string &name, string &type)
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
bool SchMain::AddMonitorV70(string monitorid, bool isEdit)
{
	ost::MutexLock lock(m_MonitorListMutex);

	if (monitorid.empty())
		return false;
	CString strError = "";

	puts("In Add Monitors");

	Monitors *pItem = new Monitors;
	m_lc.LoadAll();

	if (!m_lc.CreateSingleMonitor(pItem, monitorid.c_str()))
	{
		puts("Create monitor failed");

		delete pItem;
		strError.Format("Create monitor failed while update config", monitorid.c_str());
		throw MSException(strError);
	}

	if (!isEdit)
	{

		CTime ct = CTime::GetCurrentTimeEx();
		CTimeSpan ts = CTimeSpan(0, 0, 0, 60 - ct.GetSecond());
		ct += ts;
		pItem->SetNextRunTime(ct);
		DeleteMonitorV70(monitorid);

		m_MonitorList.push_back(pItem);

	}
	else
	{

		CMonitorList::iterator it;
		it = m_MonitorList.begin();
		while (it != m_MonitorList.end())
		{

			Monitors *pM = *it++;
			if (stricmp(pM->GetMonitorID(),monitorid.c_str()) == 0)
			{
				puts("Get edit monitor");

				if (pItem->GetFrequency() == pM->GetFrequency())
					pItem->SetNextRunTime(pM->GetNextRunTime());
				else
				{
					CTime ct = CTime::GetCurrentTimeEx();
					CTimeSpan ts = CTimeSpan(0, 0, 0, 60 - ct.GetSecond());
					ct += ts;
					pItem->SetNextRunTime(ct);

				}
				pItem->SetLastState(pM->GetLastState());
				InitGroupDependByMonitorChangeV70(pM, pItem, false);
				DeleteMonitorV70(monitorid);
				pM->isDelete = TRUE;
				m_MonitorList.push_back(pItem);
				break;

			}

		}
	}

	puts("Add Monitors Ok");

	return true;
}
bool SchMain::DeleteMonitorV70(string monitorid)
{
	ost::MutexLock lock(m_MonitorListMutex);

	if (monitorid.empty())
		return false;

	CMonitorList::iterator it;
	it = m_MonitorList.begin();
	while (it != m_MonitorList.end())
	{
		Monitors *pM = *it++;

		if (stricmp(pM->GetMonitorID(),monitorid.c_str()) == 0)
		{
			InitGroupDependByMonitorChangeV70(pM, NULL, true);
			pM->isDelete = TRUE;
		}
	}

	return true;

}
bool SchMain::InitGroupDependByMonitorChangeV70(Monitors *oldpm, Monitors* newpm, bool isdel)
{
	ost::MutexLock lock(m_MonitorListMutex);

	CMonitorList::iterator it;
	it = m_MonitorList.begin();
	while (it != m_MonitorList.end())
	{
		Monitors *pM = *it++;
		if (oldpm == pM->GetGroupDependMonitor())
		{
			if (!isdel)
				pM->SetGroupDependMonitor(newpm);
			else
				pM->SetGroupDependState(Monitors::groupdependnull);

		}

	}

	return true;
}
bool SchMain::AddEntityV70(string entityid, bool isEdit)
{
	if (entityid.empty())
		return false;

	puts("In Add Entitys");

	CString strError = "";

	Entitys *pItem = new Entitys;
	if (!m_lc.CreateSingleEntity(pItem, entityid.c_str()))
	{
		delete pItem;
		strError.Format("Create entity failed while update config", entityid.c_str());
		throw MSException(strError);

	}

	CEntityList &EntityList = m_pGroups->GetEntityList();

	if (!isEdit)
		EntityList.push_back(pItem);
	else
	{
		CEntityList::iterator it, tempit;
		it = EntityList.begin();
		tempit = it;
		while (it != EntityList.end())
		{
			tempit = it;
			Entitys *pE = *it++;
			if (stricmp(pE->GetEntityID(),entityid.c_str()) == 0)
			{
				pItem->CopyTempData(pE);
				EntityChangeV70(pE, pItem, false);
				EntityList.erase(tempit);
				//		delete pE;                          //不删除此对像,防止有线程正在用它.(会丢掉部分内存)
				break;
			}

		}

		EntityList.push_back(pItem);
		ReLoadMonitorsV70(entityid);

	}
	puts("Add Entitys ok");

	return true;
}
bool SchMain::EntityChangeV70(Entitys *oldE, Entitys *newE, bool isdel)
{
	ost::MutexLock lock(m_MonitorListMutex);

	CMonitorList::iterator it;
	it = m_MonitorList.begin();
	while (it != m_MonitorList.end())
	{
		Monitors *pM = *it++;
		if (pM->GetEntity() == oldE)
			pM->SetEntity(newE);
	}

	return true;

}
bool SchMain::ReLoadMonitorsV70(string parentid)
{
	ost::MutexLock lock(m_MonitorListMutex);

	std::list < string > listid;

	string monitorid = "";

	CMonitorList::iterator it;
	it = m_MonitorList.begin();
	while (it != m_MonitorList.end())
	{

		Monitors *pM = *it++;
		int pos = 0;
		monitorid = pM->GetMonitorID();
		if ((pos = monitorid.find(parentid)) == 0)
			listid.push_back(monitorid);
	}

	if (!listid.empty())
	{
		std::list<string>::iterator its;
		for (its = listid.begin(); its != listid.end(); its++)
			AddMonitorV70((*its), true);
	}

	return true;
}
bool SchMain::InitMonitorsGroupDependV70(string parentid)
{
	ost::MutexLock lock(m_MonitorListMutex);

	std::list < string > listid;

	string monitorid = "";

	CMonitorList::iterator it;
	it = m_MonitorList.begin();
	while (it != m_MonitorList.end())
	{

		Monitors *pM = *it++;
		pM->SetGroupDependState(Monitors::groupdependnull);
	}

	return true;

}
bool SchMain::AddGroupV70(string groupid, bool isEdit)
{
	if (groupid.empty())
		return false;

	puts("In AddGroup");

	CString strError = "";

	GroupsItem *pItem = new GroupsItem;
	if (!m_lc.CreateSingleGroup(pItem, groupid.c_str()))
	{
		delete pItem;
		strError.Format("Create group failed while update config", groupid.c_str());
		throw MSException(strError);
	}
	CGroupsItemList &GroupsList = m_pGroups->GetGroupsList();

	if (!isEdit)
		GroupsList.push_back(pItem);
	else
	{
		CGroupsItemList::iterator it, tempit;
		it = GroupsList.begin();
		tempit = it;
		while (it != GroupsList.end())
		{
			tempit = it;
			GroupsItem *pGI = *it++;
			if (stricmp(pGI->GetGroupID(),groupid.c_str()) == 0)
			{
				GroupsList.erase(tempit);
//				delete pGI;				//不删除此对像,防止有线程正在用它.(会丢掉部分内存)
				break;
			}

		}
		GroupsList.push_back(pItem);
		InitMonitorsGroupDependV70(groupid);
	}

	puts("Add group ok");

	return true;

}

bool SchMain::ReLoadTaskV70()
{
	ost::MutexLock lock(m_TaskMutex);

	TASKMAP::iterator it;
	while (m_TaskMap.findnext(it))
	{
		Task*pt = (*it).getvalue();
		if (pt)
			delete pt;
	}
	m_TaskMap.clear();

	return m_lc.LoadTaskPlan(m_TaskMap);

}

bool SchMain::ProcessConfigChange(string opt, string id)
{
	puts("InProcessConfigChange");

	if (opt.empty() || id.empty())
		return false;
	string name;
	string type;
	if (!ParseOpt(opt, name, type))
		return false;

	m_lc.ClearBuffer();

	if (name.compare("MONITOR") == 0)
	{
		if (type.compare("ADDNEW") == 0)
			AddMonitorV70(id, false);
		else if (type.compare("UPDATE") == 0)
			AddMonitorV70(id, true);
		else if (type.compare("DELETE") == 0)
			DeleteMonitorV70(id);
		else
			return false;
	}
	else if (name.compare("ENTITY") == 0)
	{
		if (type.compare("ADDNEW") == 0)
			AddEntityV70(id, false);
		else if (type.compare("UPDATE") == 0)
			AddEntityV70(id, true);
		else
			return false;

	}
	else if (name.compare("GROUP") == 0)
	{
		if (type.compare("ADDNEW") == 0)
			AddGroupV70(id, false);
		else if (type.compare("UPDATE") == 0)
			AddGroupV70(id, true);
		else
			return false;

	}
	else if (name.compare("TASK") == 0)
	{
		ReLoadTaskV70();
	}
	else
		return false;

	return true;

}

bool SchMain::LoadPreLibrary(void)
{
	if (m_pOption->m_PreLoadLibrary.empty())
		return true;

	char filepath[1024] = { 0 };

	int pos = m_pOption->m_PreLoadLibrary.find(',');
	string str;
	if (pos < 0)
		return true;
	int tpos = 0;
	while (pos >= 0)
	{
		str = m_pOption->m_PreLoadLibrary.substr(tpos, pos - tpos);
		tpos = pos + 1;
		pos = m_pOption->m_PreLoadLibrary.find(',', tpos);
		if (str.empty())
			continue;
		sprintf(filepath, "%s/fcgi-bin/%s", g_strRootPath.getText(), str.c_str());
		printf("PreLoad:%s\n", filepath);
		try
		{
#ifdef WIN32
			::LoadLibrary(filepath);
#else
#endif
		} catch (...)
		{
			continue;
		}
	}

	return false;
}
