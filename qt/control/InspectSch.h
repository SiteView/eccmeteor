#ifndef  DRAGONFLOW_INSPECTSCHEDULE_H
#define DRAGONFLOW_INSPECTSCHEDULE_H

#include "ThreadEx.h"

#include <string.h>
using std::string;

#include "TString.h"
#include "CUtil.h"

class InspectSch: public ThreadEx
{
public:
	virtual void run(void);
	InspectSch();
	virtual ~InspectSch();

	bool createEvent();
	void toExit();

	int m_RestartTime;      //重启 schedule 的间隔时间(分钟);
	int m_MaxMemory;        //许可内存占用大小（MB）
	int m_ExitTimeOut;      //终止子进程时要等待的时间(毫秒);
	int m_CheckTime;       //检查是否过期的时间间隔(分钟)

	bool init(PROCESS_INFORMATION * pi, string pname);


private:
	string m_pName;
	bool m_toExit;
	void toStopSch();

	PROCESS_INFORMATION * m_pi;  //no use in linux
#ifdef	WIN32
	HANDLE m_hCom;
#endif

};

#endif
