//#pragma once
#ifndef  DRAGONFLOW_WORKTHREAD_H
#define DRAGONFLOW_WORKTHREAD_H

#include "ThreadEx.h"
#include "Monitors.h"
#include "ReturnValue.h"
#include <buffer.h>

#define		RETBUFCOUNT		(10*1024)
#define		INBUFCOUNT		(1024*2)


///////////////////////////////////////////////////////////////////////////////////////
#define		SEPARATOR		'#'
///////////////////////////////////////////////////////////////////////////////////////

class WorkControl;

using namespace svutil;

typedef BOOL(GatherData)(CStringList&, char*);
 
typedef bool (*LPFUNC)(const char *,char *,int &);


class WorkThread :
	public ThreadEx
{
public:
	void ToRunMonitor(Monitors *pMonitor);
	void ToRunMonitor(void);
	virtual void run(void);
	WorkThread();
	WorkThread(WorkControl *pTC)
	{
		SetThreadName("Work thread");
//		m_hEvent=::CreateEvent(NULL,TRUE,FALSE,NULL);
		InitData();
		m_pWorkControl=pTC;
	}
	void SetWorkControl(WorkControl *pTC)
	{
		m_pWorkControl=pTC;
	}
	virtual ~WorkThread();
	enum{ retcount=5 };

	enum{
		Normal=0x1,
		Warning,
		Error,
	};

	void SetMonitor(Monitors *pMonitor)
	{
		m_Monitor=pMonitor;
	}

protected:
	void CloseSocket();
	BOOL InitSocket(void);
	WorkControl* m_pWorkControl;
	void RunMonitor(void);
	Monitors* m_Monitor;
	Event m_Event;

private:
	CTime m_StartTime;
	void ProcessResultV70(void);
	void AppendResultV70(void);
	int ParserExpression(CString strExpression, CStringList &lstOperator, CStringList &lstID);
	BOOL Judge(const char *szSource, const char *szDestination, const char *szRelation);
	void ClearResult(void);
	int m_nRunCount;
	BOOL CheckSingleItemState(/*int Type*/StateCondition *pSt ,int ItemID);
	BOOL CheckStateByType(int Type);
	void ParserMonitorState(void);
	CString m_strDisplay;
	bool BulidStringMap(STRINGMAP &map,const char *buf);
	BOOL GetProperty(const char *szProperty, const CString strSource, int &nRet);
	BOOL GetProperty(const char *szProperty, const CString strSource, float &fRet);
	BOOL GetProperty(const char *szProperty, const CString strSource, char *psret);
	BOOL GetProperty(const char *szProperty, const CString strSource, CString &strRet);
	int MakeInBuf();
	int m_MonitorState;
	BOOL PaserResultV70(void);
	void InitData(void);
	CReturnValueList m_RetValueList;
	char m_RetBuf[RETBUFCOUNT];
	svutil::buffer m_InBuf;
	ReturnValue m_RetValues[retcount];
	int	m_RetValueCount;
	STRINGMAP m_RVmap;

};

#endif
