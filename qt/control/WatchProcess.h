#ifndef  DRAGONFLOW_WATCHPROCESS_H
#define DRAGONFLOW_WATCHPROCESS_H

#include "ThreadEx.h"

#ifdef	WIN32
#include <windows.h>
#include "PSAPI.h"
#endif

#include <string.h>
using std::string;

#include "TString.h"
#include "CUtil.h"

class WatchProcess: public ThreadEx
{
public:
	virtual void run(void);
	WatchProcess();
	virtual ~WatchProcess();

	void toExit();
	void toTerminateProcess();
	bool init(PROCESS_INFORMATION * pi, string pname);

private:
	bool runProcess();

	string m_pName;
	bool m_toExit;
	PROCESS_INFORMATION * m_pi;

};

#endif
