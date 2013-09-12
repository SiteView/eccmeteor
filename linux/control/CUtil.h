//#pragma once
#ifndef		DRAGONFLOW_CUTIL
#define		DRAGONFLOW_CUTIL

#include	<cc++/thread.h>
#include	<svdbapi.h>
#include "TString.h"
#include <string>
#include <list>

#ifndef	WIN32
#include <unistd.h>
typedef pid_t PROCESS_INFORMATION;
#endif

#ifdef	CCXX_NAMESPACES
using namespace ost;
#endif

void CErrorLog(CString strError);

long getServicePid(string pname);
// parameter are no use for unix,
// argv is no use for windows
bool svCreateProcess(CString parameter, char * const argv[], PROCESS_INFORMATION * pi, CString ProcessName,	bool islocal = false);

class CUtil
{
public:
	CUtil(void);
	~CUtil(void);
	static CString GetSVRootPath(void);

};

#endif
