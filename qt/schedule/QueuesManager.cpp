#include "QueuesManager.h"

QueuesManager::QueuesManager()
{
	m_nQueueCount = 0;
	for (int i = 0; i < MAXQUEUE; i++)
		m_Queue[i] = NULL;

	m_pSchMain = NULL;
}

QueuesManager::~QueuesManager()
{

}

BOOL QueuesManager::Init()
{
	if (!m_pSchMain)
		throw MSException("Error : m_pSchMain is NULL when QueueManager initialization");
	CreateMainQueue();
	CreateQueueBySubsequent();

	Groups *pG = m_pSchMain->GetGroups();
	pG->InitAllEntityActiveMonitorArray(m_nQueueCount);
	return TRUE;
}

BOOL QueuesManager::CreateQueueBySubsequent()
{
	Subsequent *pSub = m_pSchMain->GetSubsequtent();
	if (!pSub)
		return FALSE;
	CSubsequentItemList &ItemList = pSub->GetSubsequentItemList();
	int count = (int) ItemList.size();
	if (count <= 0)
		return FALSE;

	CSubsequentItemList::iterator it;
	SubsequentItem*pItem = NULL;
	QueueItem *pQueueItem = NULL;
	it = ItemList.begin();
	for (int i = 0; (i < count) && (i < MAXQUEUE - 1); i++)
	{
		pItem = *it++;
		pQueueItem = new QueueItem(pItem->m_strClass);
		m_Queue[i + 1] = pQueueItem;
		m_nQueueCount++;
	}
	return TRUE;
}

BOOL QueuesManager::CreateMainQueue()
{
	QueueItem *pQueue = new QueueItem("MainQueueName");
	if (pQueue == NULL)
		throw MSException("Error : Create main queue error");
	m_Queue[0] = pQueue;
	m_nQueueCount++;

	return TRUE;
}

int QueuesManager::GetQueueIndexByClass(const char *ClassName)
{
	Subsequent *pSub = m_pSchMain->GetSubsequtent();
	if (!pSub)
		return FALSE;
	CSubsequentItemList &ItemList = pSub->GetSubsequentItemList();
	int count = (int) ItemList.size();
	if (count <= 0)
		return FALSE;

	CSubsequentItemList::iterator it;
	SubsequentItem*pItem = NULL;
	QueueItem *pQueueItem = NULL;
	it = ItemList.begin();
	for (int i = 0; (i < count) && (i < MAXQUEUE - 1); i++)
	{
		pItem = *it++;
		if (stricmp(ClassName,pItem->m_strClass) == 0)
			return i + 1;
	}
	return 0;
}

Monitors* QueuesManager::Pop(const char *ClassName)
{
	if (ClassName == NULL)
		return m_Queue[0]->Pop();
	int index = GetQueueIndexByClass(ClassName);
	return m_Queue[index]->Pop();
}

Monitors* QueuesManager::Pop(int QueueIndex)
{
	if ((QueueIndex < 0) || (QueueIndex >= MAXQUEUE))
		return NULL;
	return m_Queue[QueueIndex]->Pop();
}

BOOL QueuesManager::Push(Monitors *pMonitor, BOOL isTail)
{
	if (!pMonitor)
		return FALSE;

	return Push(pMonitor, pMonitor->GetQueueIndex(), isTail);
}

BOOL QueuesManager::Push(Monitors *pMonitor, int QueueIndex, BOOL isTail)
{
	if (!pMonitor)
		return FALSE;

	if (QueueIndex < 0)
		return Push(pMonitor, (LPCSTR) pMonitor->GetMonitorClass(), isTail);

	if (QueueIndex >= MAXQUEUE)
		return FALSE;
	m_Queue[QueueIndex]->Push(pMonitor, isTail);
	return TRUE;
}

BOOL QueuesManager::Push(Monitors *pMonitor, const char *ClassName, BOOL isTail)
{
	if (!pMonitor)
		return FALSE;

	int index = 0;
	if (ClassName != NULL)
		index = GetQueueIndexByClass(ClassName);
	if (index < 0 || index >= MAXQUEUE)
		return FALSE;

	pMonitor->SetQueueIndex(index);
	return Push(pMonitor, index, isTail);
}

void QueuesManager::ListAllQueueInfo()
{
	for (int i = 0; i < m_nQueueCount; i++)
	{
		int mcount = (int) (m_Queue[i]->GetMonitorList().size());
		if (mcount != 0)
			printf("=== Queue name:%s--Monitors count:%d\n", m_Queue[i]->GetQueueName(), mcount);
	}

}
