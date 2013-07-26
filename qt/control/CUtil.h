//#pragma once
#ifndef		DRAGONFLOW_CUTIL
#define		DRAGONFLOW_CUTIL

#include	<cc++/thread.h>
#include	<svdbapi.h>
#include "TString.h"
#include <string>
#include <list>

#ifndef	WIN32
typedef char PROCESS_INFORMATION;
#endif

#ifdef	CCXX_NAMESPACES
using namespace ost;
#endif

void CErrorLog(CString strError);
bool svCreateProcess(PROCESS_INFORMATION * pi, CString ProcessName, CString parameter="", bool islocal = false);



class CUtil
{
public:
	CUtil(void);
	~CUtil(void);
	static CString GetSVRootPath(void);

};

#endif
