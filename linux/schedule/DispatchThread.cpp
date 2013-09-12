#include "DispatchThread.h"
#include "MakeRecord.h"
#include <map>

extern SUtil *putil;
extern CString g_strRootPath;
extern string g_ServerHost;
extern CTime g_LastSchTime;

const char *str_disable = "监测器被禁止";
const char *str_gddisable = "监测器被组依靠禁止所依靠监测器ID:%s";
const char *str_taskplandisable = "监测器被任务计划禁止,任务计划名称:%s";
const char *str_tempdisable = "监测器被监时禁止,起始时间:%s,终止时间:%s";

string s_str_disable = str_disable;
string s_str_gddisable = str_gddisable;
string s_str_taskplandisable = str_taskplandisable;
string s_str_tempdisable = str_tempdisable;

DispatchThread::DispatchThread() :
		ThreadEx()
{
	m_pWorkControl = NULL;

}

DispatchThread::~DispatchThread()
{

}

void DispatchThread::disableMonitor(Monitors *pMonitor, const char * mes)
{
	if (pMonitor == NULL)
		return;
	putil->AppendErrorRecord(pMonitor->GetMonitorID(), Monitors::STATUS_DISABLE, mes);
	pMonitor->SetLastState(Monitors::STATUS_DISABLE);
	pMonitor->CalculateNextRunTime();
}

void DispatchThread::run()
{
	CMonitorList &MonitorList = m_pSchMain->GetMonitorList();
	CTime curTime, endTime;
	CMonitorList::iterator it, tempit;
	Monitors *pMonitor = NULL;
	CString strTemp = "", strError = "", strDependID = "";

	if (m_pWorkControl == NULL)
		return;

	int n = 0;
	int TaskType = 0;
	bool isABS = false;

	try
	{
		while (TRUE)
		{
			curTime = CTime::GetCurrentTimeEx();
			m_pWorkControl->PrintTaskQueueInfo();
//			printf("=== Dispatch Thread work at: %s\n", curTime.Format().c_str());

			{
				ost::MutexLock mlock(m_pSchMain->m_MonitorListMutex);
				g_LastSchTime = curTime;

				it = MonitorList.begin();
				n = 0;
				while (it != MonitorList.end())
				{
					tempit = it;
					pMonitor = *it++;
					if (pMonitor != NULL)
					{
						if (pMonitor->isDelete)
						{
							if ((!pMonitor->GetRunning()) && (!pMonitor->m_isInQueue))
							{
								delete pMonitor;
								MonitorList.erase(tempit);
								continue;
							}
							continue;
						}

						TaskType = pMonitor->GetTaskType();
						if (TaskType == Task::TASK_NULL)
						{
							m_pSchMain->CheckTask(pMonitor, curTime, isABS);
							if (isABS)
								TaskType = Task::TASK_ABSOLUTE;
							else
								TaskType = Task::TASK_RELATIVE;

							pMonitor->SetTaskType(TaskType);
						}

						if ((pMonitor->GetNextRunTime() <= curTime) || (TaskType == Task::TASK_ABSOLUTE))
						{
							if (pMonitor->GetDisable())
							{
								printf("==========monitorid:%s-----disable==================\n",
										pMonitor->GetMonitorID());
								printf("=== current time: %s\n", curTime.Format().c_str());

								disableMonitor(pMonitor, s_str_disable.c_str());
								continue;
							}
							if (pMonitor->GetTempDisableStateByTime(curTime))
							{
								printf("==========monitorid:%s-----temp disable==================\n",
										pMonitor->GetMonitorID());
								printf("=== current time: %s\n", curTime.Format().c_str());

								char mes[256] = { 0 };
								sprintf(mes, (const char *) s_str_tempdisable.c_str(),
										pMonitor->GetBeginTDTime().Format().c_str(),
										pMonitor->GetEndTDTime().Format().c_str());
								disableMonitor(pMonitor, mes);
								continue;
							}
							if (!m_pSchMain->CheckTask(pMonitor, curTime, isABS))
							{
								puts("------------------Disable by task plan------------------------");
								printf("=== current time: %s\n", curTime.Format().c_str());

								if (pMonitor->GetNextRunTime() <= curTime)
								{
									char mes[256] = { 0 };
									sprintf(mes, (const char *) s_str_taskplandisable.c_str(),
											pMonitor->GetTaskName().c_str());

									disableMonitor(pMonitor, mes);
								}
								continue;
							}

							if (m_pSchMain->CheckGroupDependState(pMonitor, strDependID))
							{
								puts("-----------------------Disable by group depend---------------------");
								printf("=== current time: %s\n", curTime.Format().c_str());

								char mes[256] = { 0 };
								sprintf(mes, (const char *) s_str_gddisable.c_str(), (char *) strDependID);
								printf("Disable str:%s\n", mes);

								disableMonitor(pMonitor, mes);
								continue;
							}

							if (pMonitor->CalculateNextRunTime())
								m_pWorkControl->AddTask(pMonitor);
							n++;

						}
					}

				}
			}
			endTime = CTime::GetCurrentTimeEx();
			int seconds = endTime.GetTime() - curTime.GetTime();
			if (n != 0)
				printf("=== Dispatch Thread add %d tasks (%d seconds) at: %s \n", n, seconds, endTime.Format().c_str());

//			/////  for queue test   /////
//			int new_min = endTime.GetMinute();
//			int old_min;
//			if (new_min != old_min)
//			{
//				m_pWorkControl->CheckTaskQueue();
//				puts("=== Dispatch Thread check task queue");
//			}
//			old_min= new_min;
//			/////  for queue test   /////

			if (endTime.GetMinute() == curTime.GetMinute())
				ThreadEx::sleep(5000);
		}
	} catch (MSException &e)
	{
		CString strError = "";
		strError.Format("************dispatch thread error,Message:%s************", e.GetDescription());
		putil->ErrorLog(strError);
	} catch (...)
	{
		CString strError = "************dispatch thread exception*****************";
		putil->ErrorLog(strError);
	}

#ifdef WIN32
	ExitProcess(2);
#else
	::exit(2);
#endif

}

BOOL DispatchThread::Init()
{
	SetThreadName("Main dispatch thread");
	OBJECT robj = ::LoadResource("default", g_ServerHost);
	if (robj != INVALID_VALUE)
	{
		MAPNODE map = GetResourceNode(robj);
		if (map != INVALID_VALUE)
		{
			string svalue = "";
			if (FindNodeValue(map, "IDS_MonitorDisabled", svalue))
				s_str_disable = svalue;
			svalue = "";
			if (FindNodeValue(map, "IDS_GroupDependMonitor", svalue))
				s_str_gddisable = svalue;
			svalue = "";
			if (FindNodeValue(map, "IDS_DisableMonitorSchedule", svalue))
				s_str_taskplandisable = svalue;
			svalue = "";
			if (FindNodeValue(map, "IDS_TempDisableMonitorTime", svalue))
				s_str_tempdisable = svalue;
		}
		::CloseResource(robj);
	}

	m_pWorkControl = new WorkControl(m_pSchMain);
	if (!m_pWorkControl->Init())
		throw MSException("Error : init ControlThread failed");
	if (!m_pWorkControl->Start())
		throw MSException("Error : start ControlThread failed");
	InitMonitorTime();

	return TRUE;
}

BOOL DispatchThread::InitMonitorTime()
{
	CMonitorList &MonitorList = m_pSchMain->GetMonitorList();
	CTime time = CTime::GetCurrentTimeEx();
	CTimeSpan ts, FreSpan;
	CTime temtime;
	Monitors *pMonitor = NULL;
	int nFrequency = 0;
	int n = 1;
	ts = CTimeSpan(0, 0, 1, time.GetSecond());

	CMonitorList::iterator it, it2;
	it = MonitorList.begin();
	it2 = it;

	while (it != MonitorList.end())
	{
		pMonitor = *it++;
		if (pMonitor->GetNextRunTime() < time)
		{
			nFrequency = pMonitor->GetFrequency();
			if (nFrequency <= 0)
				continue;
			temtime = time;
			FreSpan = CTimeSpan(0, 0, nFrequency, 0);
			temtime -= FreSpan;
			pMonitor->CalculateNextRunTime(temtime);

			it2 = it;
			n = 0;
			int sec = 0;

			while (it2 != MonitorList.end())
			{
				pMonitor = *it2++;
				if (pMonitor->GetFrequency() == nFrequency)
				{
					++n;
					++sec;
					temtime = time;
					ts = CTimeSpan(0, 0, n % nFrequency + 1, sec % 60);
					temtime += ts;
					temtime -= FreSpan;
					pMonitor->CalculateNextRunTime(temtime);
				}
			}
		}
	}
	return TRUE;
}
