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

	int m_RestartTime;      //���� schedule �ļ��ʱ��(����);
	int m_MaxMemory;        //����ڴ�ռ�ô�С��MB��
	int m_ExitTimeOut;      //��ֹ�ӽ���ʱҪ�ȴ���ʱ��(����);
	int m_CheckTime;       //����Ƿ���ڵ�ʱ����(����)

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
