#ifndef  DRAGONFLOW_CONFIGCHANGETHREAD_H
#define DRAGONFLOW_CONFIGCHANGETHREAD_H

#include "ThreadEx.h"

class SchMain;


class ConfigChangeThread :
	public ThreadEx
{
public:
	void SetSchMain(SchMain *pSchMain);
	virtual void run(void);
	ConfigChangeThread();
	ConfigChangeThread(SchMain *pSchMain)
	{
		m_pSchMain=pSchMain;
	}
	virtual ~ConfigChangeThread();

private:
	SchMain * m_pSchMain;
};

#endif
