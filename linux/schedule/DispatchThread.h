//#pragma once
#ifndef  DRAGONFLOW_DISPATCHTHREAD_H
#define DRAGONFLOW_DISPATCHTHREAD_H

#include "ThreadEx.h"
#include "SchMain.h"
#include "WorkControl.h"

class DispatchThread: public ThreadEx
{
public:
	BOOL Init(void);
	virtual void run(void);
	DispatchThread();
	DispatchThread(SchMain *pSchMain) :
			ThreadEx()
	{
		m_pSchMain = pSchMain;

	}

	void SetSchMain(SchMain *pSchMain)
	{
		m_pSchMain = pSchMain;
	}
	virtual ~DispatchThread();

protected:
	void disableMonitor(Monitors *pMonitor, const char * mes);
	BOOL InitMonitorTime(void);
	WorkControl* m_pWorkControl;
	SchMain * m_pSchMain;
};

#endif
