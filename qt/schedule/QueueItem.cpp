#include "QueueItem.h" //此处不同

extern SUtil *putil;


QueueItem::QueueItem()
{
	m_QueueName=NULL;

}

QueueItem::~QueueItem()
{
	if(m_QueueName)
		::free(m_QueueName);

}

void QueueItem::Push(Monitors *pMonitor, BOOL isTail)
{
	ost::MutexLock lock(m_mutex);
	if(pMonitor->m_isInQueue)
	{
		char buf[100]={0};
		sprintf(buf,"%s has in queue\n",pMonitor->GetMonitorID());
		putil->ErrorLog(buf);
		return;
	}

	if(isTail)
		m_MonitorList.push_back(pMonitor);
	else
		m_MonitorList.push_front(pMonitor);
	pMonitor->m_isInQueue=true;
}

Monitors * QueueItem::Pop()
{
	ost::MutexLock lock(m_mutex);

	if(m_MonitorList.size()>0)
	{
		Monitors*pm=m_MonitorList.front();
		m_MonitorList.pop_front();
		pm->m_isInQueue=false;
		return pm;
	}else
		return NULL;
}
