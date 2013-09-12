#ifndef  DRAGONFLOW_DYNAMICPARAM_H
#define DRAGONFLOW_DYNAMICPARAM_H

#include "ThreadEx.h"
#include "COption.h"
#include "CUtil.h"

#include <string.h>
using std::string;

#include "TString.h"

#ifdef	WIN32
#include <windows.h>
#include "PSAPI.h"
#endif

class DynamicParam :
	public ThreadEx
{
public:
	virtual void run(void);
	DynamicParam(COption * option);
	virtual ~DynamicParam();

	void toExit();
	ost::Mutex	m_DemoDllMutex;

private:
	bool m_toExit;
	COption * m_option;
	PROCESS_INFORMATION * m_pi;

	bool RunRefresh(string queuename, string label);
	int getDynamicParam(const char * queueInit);
	void ReadParamFromQueue(const string &qname, string &sDll, string &sFunc, char * &sParam);
	bool runDynamicParamDll(const char *pszDll, const char *pszFunc, const char *pszParam, char * pBuffer, int &nSize);
};

#endif
