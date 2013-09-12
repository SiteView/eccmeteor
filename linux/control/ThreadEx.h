//#pragma once
#ifndef  DRAGONFLOW_THREADEX
#define DRAGONFLOW_THREADEX

#include <strkey.h>
#include <list>
#include <cc++/thread.h>

class ThreadEx: public ost::Thread
{
public:
	ThreadEx(void);
	~ThreadEx(void);

	virtual void run(void)=0;

	void SetThreadName(const char *threadName)
	{
		m_ThreadName = threadName;

	}

	const char * GetThreadName()
	{
		return m_ThreadName.getword();
	}

	int Start(void)
	{
		return (start() >= 0);
	}

protected:
	svutil::word m_ThreadName;
	unsigned int m_ThreadID;

};

typedef std::list<ThreadEx *> CThreadList;

#endif
