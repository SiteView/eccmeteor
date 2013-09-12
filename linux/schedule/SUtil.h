//#pragma once
#ifndef		DRAGONFLOW_SUTIL
#define		DRAGONFLOW_SUTIL

#include	<cc++/string.h>
#include	<cc++/thread.h>
#include	<cc++/socket.h>
#include	"mydef.h"
#include	<svdbapi.h>

#ifdef	CCXX_NAMESPACES
using namespace ost;
#endif

class SUtil
{
public:

#ifdef	WIN32
	static void ClearSocket(void);
	static BOOL InitSocket(void);
#endif

	static bool InsertSvdb(string tablename, const char *pdata, int datalen);
	static bool InsertSvdb(string tablename, const char *pdata, int datalen, string addr);
	static bool AppendErrorRecord(string monitorid, int state, const char * estr);

	static void ErrorLog(CString strError);

	BOOL Init(void);
	static void FreeStringList(CStringList &lst);
	SUtil(void);
	~SUtil(void);
	static CString GetRootPath(void);
	static CString GetSVMQAddress();
	static CString g_strSession;
	static CString ProcessID;

	static int AppendThenClearAllRecords(std::list<SingelRecord> & inrcd);

	static string GBKToUTF8(string intext);
	static string UTF8ToGBK(string intext);

private:
//	HMODULE m_hResLibrary;

	void method_2();

	static std::list<SingelRecord> listrcd;
	static bool CacheRecords(string tablename, const char *pdata, int datalen);

};

#endif
