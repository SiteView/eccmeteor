#include "WorkControl.h"

extern SUtil *putil;
extern CString g_strRootPath;

#ifdef	WIN32
#define		WM_CHECKTASKS		WM_USER+100
#define		WM_CHECKSINGLETASK	WM_USER+101
#else
#define		WM_CHECKTASKS		100
#define		WM_CHECKSINGLETASK	101
#endif

WorkControl::WorkControl()
{
	for (int i = 0; i < MAXCOUNT; i++)
		m_Threads[i] = NULL;

	m_nThreadCount = 0;
	m_pTaskQueueManager = NULL;
	m_isThreadPoolFull = FALSE;
	m_pOption = NULL;

}

WorkControl::~WorkControl()
{

}

BOOL WorkControl::Init()
{
	m_pTaskQueueManager = new QueuesManager(m_pSchMain);
	if (m_pTaskQueueManager == NULL)
		throw MSException("Error : Create QueueManager failed");
	m_pTaskQueueManager->Init();

	SetThreadName("Task check thread");
	m_pOption = m_pSchMain->m_pOption;

	return AddNewThreads(WORKCOUNT + Univ::pluscount) > 0;

}

int WorkControl::AddNewThreads(int count)
{
	if (count + m_nThreadCount >= MAXCOUNT)
		count = MAXCOUNT - m_nThreadCount;

	int nold = m_nThreadCount;
	CString str;

	WorkThread *pmt = NULL;
	for (int i = 0; i < count; i++)
	{
		pmt = new WorkThread();
		pmt->SetWorkControl(this);
		if (!pmt)
			continue;
		str.Format("Work thread %d", m_nThreadCount);
		pmt->SetThreadName((LPCSTR) str);
		m_Threads[m_nThreadCount] = pmt;
		m_IdleThreadsQueue.push_back(pmt);
		if (!pmt->Start())
		{
			delete pmt;
			continue;
		}
		m_nThreadCount++;
	}

	printf("=== Total start %d WorkThreads (new %d)\n\n", m_nThreadCount, count);

	ThreadEx::sleep(1000);
	return m_nThreadCount - nold;

}

ThreadEx * WorkControl::GetIdleThread()
{
	MutexLock lock(m_ThreadMutex);

	if (m_IdleThreadsQueue.size() > 0)
	{
		ThreadEx *pte = m_IdleThreadsQueue.front();
		m_IdleThreadsQueue.pop_front();
		return pte;
	}
	else
	{
		if (AddNewThreads(2) == 0)
			return NULL;
		return GetIdleThread();
	}

}

BOOL WorkControl::AddTask(Monitors *pMonitor)
{
	CString strError = "";
	if (pMonitor == NULL)
		throw MSException("Monitors is empty");

	if (pMonitor->GetSkipCount() >= MAXSKIPCOUNT)
	{
		strError.Format("=== SkipCount > %d, MonitorID:%s, this monitor will be deleted. ", MAXSKIPCOUNT,
				pMonitor->GetMonitorID());
		m_pSchMain->DeleteMonitorV70(pMonitor->GetMonitorID());
		putil->ErrorLog(strError);
		putil->AppendErrorRecord(pMonitor->GetMonitorID(), Monitors::STATUS_BAD,
				"Error:This monitor running too long or other error, will be killed.");
		return false;
	}

	if (pMonitor->GetRunning())
	{
		pMonitor->SetSkipCount(pMonitor->GetSkipCount() + 1);
		strError.Format("=== running long, MonitorID:%s, SkipCount:%d", pMonitor->GetMonitorID(), pMonitor->GetSkipCount());
		putil->ErrorLog(strError);
	}
	else
	{
		if (!IsOverSubsequent(pMonitor))
		{
			WorkThread *pThread = (WorkThread*) GetIdleThread();
			if (pThread == NULL)
			{
				m_isThreadPoolFull = TRUE;
				AddQueue(pMonitor);
			}
			else
			{
				pThread->ToRunMonitor(pMonitor);
//				AddQueue(pMonitor);//for queue test
			}
		}
		else
		{
			AddQueue(pMonitor);
		}
	}

	return TRUE;

}

void WorkControl::CheckTaskQueue()
{
	m_MSGQueue.SendMsg(WM_CHECKTASKS, NULL);
}

void WorkControl::CheckTaskQueueByMonitor(Monitors *pMonitor)
{
	m_MSGQueue.SendMsg(WM_CHECKSINGLETASK, (void *) pMonitor);
}

void WorkControl::run()
{
	TMSG tmsg;
	Monitors *pMonitor = NULL;

	try
	{
		while (m_MSGQueue.RecMsg(&tmsg) == 0)
		{
			switch (tmsg.type)
			{
			case WM_CHECKTASKS:
				CheckAllTaskQueue();
				break;
			case WM_CHECKSINGLETASK:
				pMonitor = (Monitors*) tmsg.pdata;
				ProcessMonitorInQueue(pMonitor);
				break;
			}
		}
	} catch (MSException &e)
	{
		CString strError = "";
		strError.Format("WorkControl thread exit by :%s", e.Description);
		putil->ErrorLog((LPCSTR) strError);
	} catch (...)
	{
		CString strError = "";
#ifdef WIN32
		strError.Format("WorkControl thread exit by :%d", ::GetLastError());
#else
		strError.Format("WorkControl thread exception happended.");
#endif
		putil->ErrorLog((LPCSTR) strError);
	}
#ifdef WIN32
	ExitProcess(3);
#else
	::exit(3);
#endif

}

bool WorkControl::IsOverSubsequent(Monitors *pMonitor, bool &bTotal, bool &bPer)
{
	bTotal = false;
	bPer = false;

	int nTotal = 0, nPer = 0;
	if (pMonitor->GetSubsequent() == Monitors::subsequentno)
		return false;

	SubsequentItem*pItem = pMonitor->GetSubsequentItem();
	if (pItem == NULL)
	{
		Subsequent *pSub = m_pSchMain->GetSubsequtent();
		if (!pSub->GetValueByMonitor(pMonitor, nTotal, nPer))
			return false;
		pItem = pMonitor->GetSubsequentItem();
	}
	else
	{
		nTotal = pItem->m_nTotal;
		nPer = pItem->m_nPerEntity;
	}

	if (nTotal <= pItem->GetCurrentTotal())
	{
		bTotal = true;
		return true;
	}

	Entitys*pEntity = pMonitor->GetEntity();
	if (pEntity == NULL)
	{
		string eid = pMonitor->GetParentID();
		pEntity = m_pSchMain->GetGroups()->GetEntityByID(eid.c_str());
		if (pEntity == NULL)
			return false;
		pMonitor->SetEntity(pEntity);
	}

	if (pMonitor->GetQueueIndex() >= 0)
	{
		if (nPer <= pEntity->GetActiveMonitorByIndex(pMonitor->GetQueueIndex()))
		{
			bPer = true;
			return true;
		}
	}
	else
	{
		int n = m_pTaskQueueManager->GetQueueIndexByClass((LPCSTR) pMonitor->GetMonitorClass());
		pMonitor->SetQueueIndex(n);
		if (nPer <= pEntity->GetActiveMonitorByIndex(n))
		{
			bPer = true;
			return true;
		}
		else
			return false;
	}

	return false;

}

BOOL WorkControl::IsOverSubsequent(Monitors *pMonitor)
{
	bool bTotal, bPer;
	return IsOverSubsequent(pMonitor, bTotal, bPer);
}

void WorkControl::AddQueue(Monitors *pMonitor)
{
	m_pTaskQueueManager->Push(pMonitor);
}

BOOL WorkControl::ProcessMonitorInQueue(Monitors *pMonitor)
{
	if (m_isThreadPoolFull)
	{
		CheckAllTaskQueue();
		return TRUE;
	}
	Monitors *pTa = NULL;
	if (pMonitor->GetQueueIndex() >= 0)
		pTa = m_pTaskQueueManager->Pop(pMonitor->GetQueueIndex());
	else
		pTa = m_pTaskQueueManager->Pop((LPCSTR) pMonitor->GetMonitorClass());

	Monitors *ptemp = NULL;
	while (pTa != NULL)
	{
		if (ptemp == pTa)
		{
			m_pTaskQueueManager->Push(pTa, FALSE);
			break;
		}
		if (ptemp == NULL)
			ptemp = pTa;

		bool bTotal = false;
		bool bPer = false;
		if ((!IsOverSubsequent(pTa, bTotal, bPer)) && (!pTa->GetRunning()))
		{
			WorkThread *pThread = (WorkThread*) GetIdleThread();
			if (pThread == NULL)
			{
				m_isThreadPoolFull = TRUE;
				m_pTaskQueueManager->Push(pTa, FALSE);
				return TRUE;
			}
			else
			{
				if (pTa == NULL)
				{
					return FALSE;
				}
				if (pTa == ptemp)
					ptemp = NULL;

				printf("=== monitor: %s in queue to run... (WorkControl::ProcessMonitorInQueue)\n",
						pTa->GetMonitorID());
				pThread->ToRunMonitor(pTa);
			}
		}
		else
		{
			if (bTotal)
			{
				m_pTaskQueueManager->Push(pTa, FALSE);
				return TRUE;
			}
			m_pTaskQueueManager->Push(pTa);
		}

		if (pTa->GetQueueIndex() >= 0)
			pTa = m_pTaskQueueManager->Pop(pTa->GetQueueIndex());
		else
			pTa = m_pTaskQueueManager->Pop((LPCSTR) pTa->GetMonitorClass());
	}
	return TRUE;
}

BOOL WorkControl::ProcessTaskQueueByIndex(int QueueIndex)
{
	Monitors *pTa = NULL;
	pTa = m_pTaskQueueManager->Pop(QueueIndex);
	while (pTa != NULL)
	{
		if (!IsOverSubsequent(pTa))
		{
			WorkThread *pThread = (WorkThread*) GetIdleThread();
			if (pThread == NULL)
			{
				m_isThreadPoolFull = TRUE;
				m_pTaskQueueManager->Push(pTa, FALSE);
				return TRUE;
			}
			else
			{
				printf("=== monitor: %s in queue to run... (WorkControl::ProcessTaskQueueByIndex)\n",
						pTa->GetMonitorID());
				pThread->ToRunMonitor(pTa);
			}
		}
		else
		{
			m_pTaskQueueManager->Push(pTa, FALSE);
			return TRUE;
		}
		pTa = m_pTaskQueueManager->Pop(QueueIndex);
	}
	return TRUE;
}

void WorkControl::CheckAllTaskQueue()
{
	m_isThreadPoolFull = FALSE;
	for (int i = 0; i < m_pTaskQueueManager->GetQueueCount(); i++)
		ProcessTaskQueueByIndex(i);

}

void WorkControl::AddToIdleThread(ThreadEx *pThread)
{
	MutexLock lock(m_ThreadMutex);
	m_IdleThreadsQueue.push_back(pThread);

}

void WorkControl::PrintTaskQueueInfo()
{
	m_pTaskQueueManager->ListAllQueueInfo();
}

void WorkControl::AdjustActiveMonitorCount(Monitors *pMonitor, BOOL isA)
{
	if (pMonitor->GetSubsequentItem() != NULL)
	{
		pMonitor->GetSubsequentItem()->AdjustTotal(isA);
		if ((pMonitor->GetEntity() != NULL))
		{
			if (pMonitor->GetQueueIndex() >= 0)
				pMonitor->GetEntity()->AdjustActiveMonitorCount(pMonitor->GetQueueIndex(), isA);
			else
			{
				int n = m_pTaskQueueManager->GetQueueIndexByClass((LPCSTR) pMonitor->GetMonitorClass());
				pMonitor->GetEntity()->AdjustActiveMonitorCount(n, isA);
				pMonitor->SetQueueIndex(n);
			}
		}
	}

}

void WorkControl::ExecuteMonitor(Monitors *pMonitor)
{
	if (pMonitor == NULL)
		return;

	WorkThread *pThread = (WorkThread*) GetIdleThread();
	if (pThread == NULL)
	{
		throw MSException("Get Idle thread error");
	}
	pMonitor->m_isRefresh = true;

	puts("*****Start monitor...*****");
	pThread->ToRunMonitor(pMonitor);

	int i = 0;
	while (pMonitor->GetRunning() && i < 120)
	{
		ThreadEx::sleep(1000);
		i++;
	}

	if (pMonitor->GetRunning())
		puts("*****Timeout*****");
	else
		puts("*****Success*****");

}

bool WorkControl::InitRefresh(int nthreads)
{
	if (nthreads < 1)
		return false;

	SetThreadName("Task check thread");
	return AddNewThreads(nthreads) > 0;
}

void WorkControl::RefreshMonitors(CMonitorList &lstMonitor)
{
	if (lstMonitor.size() == 1)
	{
		Monitors *pm = lstMonitor.front();
		ExecuteMonitor(pm);
		lstMonitor.pop_front();
		delete pm;

		return;
	}
	CMonitorList::iterator it;
	for (it = lstMonitor.begin(); it != lstMonitor.end(); it++)
	{
		Monitors *pM = *it;
		pM->m_isRefresh = true;
		while (1)
		{
			WorkThread *pThread = (WorkThread*) GetIdleThread();
			if (pThread)
			{
				pThread->ToRunMonitor(pM);
				break;
			}
			else
			{
				ThreadEx::sleep(1000);
				continue;
			}
		}
	}

	//wait for monitor complete
	BOOL hasRuning;
	for (int n = 0; n < 300; n++)
	{
		hasRuning = TRUE;
		for (it = lstMonitor.begin(); it != lstMonitor.end(); it++)
		{
			if ((*it)->GetRunning())
			{
				hasRuning = FALSE;
				break;
			}
		}
		if (hasRuning)
			break;
		ThreadEx::sleep(1000);
	}

}
