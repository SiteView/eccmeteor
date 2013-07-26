#ifndef  DRAGONFLOW_QUEUESMANAGER
#define DRAGONFLOW_QUEUESMANAGER

#include "Schedule.h"

#include "QueueItem.h"
#include "SchMain.h"

#define		MAXQUEUE	100

class QueuesManager
{
public:
	void ListAllQueueInfo(void);
	Monitors* Pop(int QueueIndex);
	Monitors* Pop(const char *ClassName);

	BOOL Push(Monitors *pMonitor, BOOL isTail = TRUE);
	BOOL Push(Monitors *pMonitor, int QueueIndex, BOOL isTail);
	BOOL Push(Monitors *pMonitor, const char *ClassName, BOOL isTail);

	int GetQueueIndexByClass(const char *ClassName);
	BOOL Init(void);
	QueuesManager();
	QueuesManager(SchMain *pSchMain)
	{
		m_nQueueCount = 0;
		for (int i = 0; i < MAXQUEUE; i++)
			m_Queue[i] = NULL;

		m_pSchMain = pSchMain;
	}
	virtual ~QueuesManager();
	void SetSchMain(SchMain *pSchMain)
	{
		m_pSchMain = pSchMain;
	}

	int GetQueueCount(void)
	{
		return m_nQueueCount;
	}

private:
	BOOL CreateMainQueue(void);
	BOOL CreateQueueBySubsequent(void);
	SchMain * m_pSchMain;
	QueueItem * m_Queue[MAXQUEUE];
	int m_nQueueCount;
};

#endif
