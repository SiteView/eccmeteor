//#pragma once
#ifndef  DRAGONFLOW_WORKCONTROL_H
#define DRAGONFLOW_WORKCONTROL_H

#include "Schedule.h"

#include "WorkThread.h"
#include "Monitors.h"
#include "SchMain.h"
#include "QueuesManager.h"
#include "MSGQueue.h"

#include "ThreadEx.h"
#include "Option.h"

///////////////////////////////////////////////////////////////////////
#define		MAXCOUNT	300
#define		SAFECOUNT	MAXCOUNT-20
#define		WORKCOUNT	30
///////////////////////////////////////////////////////////////////////
#define		MAXSKIPCOUNT	5


class WorkControl :
	public ThreadEx
{
public:
	void AdjustActiveMonitorCount(Monitors *pMonitor,BOOL isA);
	void PrintTaskQueueInfo(void);
	void AddToIdleThread(ThreadEx *pThread);
	void CheckTaskQueueByMonitor(Monitors *pMonitor);
	void CheckTaskQueue();
	virtual void run(void);
	void SetSchMain(SchMain *pSchMain){
		m_pSchMain=pSchMain;
	}
	BOOL AddTask(Monitors * pMonitor);
	BOOL Init(void);
	WorkControl();
	WorkControl(SchMain *pSchMain):m_pSchMain(pSchMain)
	{
		for(int i=0;i<MAXCOUNT;i++)
			m_Threads[i]=NULL;
		
		m_nThreadCount=0;
		m_pTaskQueueManager=NULL;
		m_isThreadPoolFull=FALSE;
		m_pOption=pSchMain->m_pOption;
		
	}
	virtual ~WorkControl();
    bool InitRefresh(int nthreads);
    void RefreshMonitors(CMonitorList &lstMonitor);
    void ExecuteMonitor(Monitors *pMonitor);

	Option *m_pOption;
	SchMain *m_pSchMain;

	ost::Mutex	m_DemoDllMutex;

private:
	void AddQueue(Monitors *pMonitor);
	QueuesManager *m_pTaskQueueManager;

	ThreadEx * GetIdleThread(void);
	int AddNewThreads(int count);
	int m_nThreadCount;
	ThreadEx * m_Threads[MAXCOUNT];

	Mutex m_ThreadMutex;
	CThreadList m_IdleThreadsQueue;

	MSGQueue m_MSGQueue;
protected:
	BOOL m_isThreadPoolFull;
	void CheckAllTaskQueue(void);
	BOOL ProcessTaskQueueByIndex(int QueueIndex);
	BOOL ProcessMonitorInQueue(Monitors *pMonitor);
	BOOL IsOverSubsequent(Monitors *pMonitor);
	bool IsOverSubsequent(Monitors *pMonitor,bool &bTotal,bool &bPer);
    
};

#endif
