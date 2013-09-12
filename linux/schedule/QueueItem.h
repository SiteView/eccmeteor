#ifndef  DRAGONFLOW_QUEUEITEM
#define DRAGONFLOW_QUEUEITEM

#include "Schedule.h"
#include "Monitors.h"


class QueueItem
{
public:
	Monitors * Pop(void);
	void Push(Monitors *pMonitor,BOOL isTail=TRUE);
	QueueItem();
	QueueItem(const char *QueueName){
		m_QueueName=::strdup(QueueName);
	}
	void SetQueueName(const char *QueueName)
	{
		m_QueueName=::strdup(QueueName);
	}
	CMonitorList &GetMonitorList(void)
	{
		return m_MonitorList;
	}
	const char * GetQueueName(void) const
	{
		return m_QueueName;
	}
	virtual ~QueueItem();

private:
	CMonitorList m_MonitorList;
	char* m_QueueName;
	ost::Mutex	m_mutex;
};
#endif
