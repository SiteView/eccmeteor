#include "SUtil.h"
#include "MSException.h"

#include <cc++/file.h>
#include <stlini.h>
#include <svdbapi.h>
#include "Schedule.h"

#include "MakeRecord.h"

extern CString g_strRootPath;
extern string g_ServerHost;

static ost::Mutex g_ErrorLoglock;
static ost::Mutex g_InsertMQLock;
static CString g_SVMQAddress = "127.0.0.1";

CString SUtil::g_strSession = "Refresh";
std::list<SingelRecord> SUtil::listrcd;

std::string getScheduleProcessId()
{
#ifdef	WIN32
	DWORD pid= GetCurrentProcessId();
#else
	DWORD pid= getpid();
#endif
	char buf[32]={0};
	sprintf(buf, "%d", pid);
	return buf;
}

CString SUtil::ProcessID(getScheduleProcessId());

SUtil::SUtil()
{
//	strRootPath[0]='\0';
//	m_hResLibrary=NULL;
	g_SVMQAddress = GetSVMQAddress();

}

SUtil::~SUtil()
{
	/*	if(m_hResLibrary!=NULL)
	 ::FreeLibrary(m_hResLibrary);
	 */
}

CString SUtil::GetSVMQAddress()
{
	char buf[1024] = { 0 };

	// strcpy(buf,"siteview.ini");
	sprintf(buf, "%s/MonitorManager/siteview.ini", GetRootPath().getText());
	INIFile inf = LoadIni(buf);
	std::string name = GetIniSetting(inf, "InstallPath", "SVMQAddress", "");
	if (name.empty())
		return "127.0.0.1";
	else
		return name.c_str();

}

CString SUtil::GetRootPath()
{
//	return ::FuncGetInstallRootPath();
	//  return "/home/siteview/chenxing/monitor";

	string path = ::GetSiteViewRootPath();
	return path.c_str();

	char buf[100] = { 0 };

	strcpy(buf, "siteview.ini");
	INIFile inf = LoadIni(buf);
	std::string name = GetIniSetting(inf, "InstallPath", "RootPath", "");
	if (name.empty())
		return "D:\\v70";
	else
		return name.c_str();

	return "/usr/local";

	return "/usr/local";

}

BOOL SUtil::Init()
{

//	CString strPath=_T("");

	/*	strPath=GetRootPath();
	 if(strPath.IsEmpty())
	 throw MSException("RootPath is empty");

	 strcpy(strRootPath,(LPCSTR)strPath);*/

	/*	strPath.Format("%s\\MonitorManager\\ResLibrary.dll",g_strRootPath);

	 m_hResLibrary=::LoadLibrary(strPath);
	 if(m_hResLibrary==NULL)
	 throw MSException("Load ResLibrary.dll failed");*/

	return TRUE;

}

void SchLog(CString strError, char * fname)
{
	CString mse = getScheduleProcessId();
	mse += "  ";
	mse += svutil::TTime::GetCurrentTimeEx().Format();
	mse += "\t";
	mse += strError.getText();
	mse += "\r\n";

	ThreadFile tf(fname);
	char *pstr = mse.getText();
	tf.append(pstr, (ccxx_size_t) strlen(pstr));
}

void SchErrorLog(CString strError)
{
	ost::MutexLock lock(g_ErrorLoglock);
	printf("%s\n", strError.getText());
	CString strPath = SUtil::GetRootPath().c_str();
	strPath += "/data/schedule.log";

	SchLog(strError, strPath.getText());
}


void SUtil::ErrorLog(CString strError)
{
	return SchErrorLog(strError);

	ost::MutexLock lock(g_ErrorLoglock);
	puts(strError);
//	return;

	CString strPath;

	strPath = GetRootPath();
	strPath += "/data/schedule.log";

	ThreadFile tf(strPath);
	strError += "\r\n";

	CTime stime = CTime::GetCurrentTimeEx();

	CString strlog;
	strlog.Format("%s  %s\t%s", ProcessID.getText(), stime.Format().c_str(), strError.getText());

	char *pstr = strlog.getText();

	tf.append(pstr, (ccxx_size_t) strlen(pstr));

	/*
	 Lock l(g_ErrorLoglock);

	 CString strTemp=_T(""),
	 strFile=_T("");
	 strFile.Format("%s\\MonitorManager\\meerror.log",g_strRootPath);
	 CTime time=CTime::GetCurrentTime();
	 strTemp=time.Format("%Y-%m-%d %H:%M:%S");

	 strTemp+="\t"+strError+"\r\n";

	 #ifndef DEBUG_T
	 FILE *fp=NULL;
	 fp=::fopen(strFile,"a+");
	 if(fp==NULL)
	 {
	 return ;
	 }
	 ::fputs(strTemp,fp);
	 ::fclose(fp);
	 #else
	 printf("%s",strTemp);
	 #endif
	 */
	return;

}

int SUtil::AppendThenClearAllRecords(std::list<SingelRecord> & inrcd)
{
	MutexLock lock(g_InsertMQLock);
	inrcd.clear();
	listrcd.swap(inrcd);
	if (inrcd.empty())
		return 0;
	bool ret = ::AppendMassRecord(inrcd, "default", g_ServerHost);
	std::list<SingelRecord>::iterator it;
	for (it = inrcd.begin(); it != inrcd.end(); ++it)
		if ((it->data) != NULL)
			delete[] it->data;
	if (ret == false)
		return -1;
	return inrcd.size();
}

bool SUtil::CacheRecords(string tablename, const char *pdata, int datalen)
{
	char * tdata;
	try
	{
		tdata = new char[datalen];
		if (tdata == NULL)
			return false;
		memmove(tdata, pdata, datalen);
	} catch (...)
	{
		return false;
	}
	SingelRecord rcd;
	rcd.monitorid = tablename;
	rcd.data = tdata;
	rcd.datalen = datalen;

	listrcd.push_back(rcd);
	return true;
}

bool SUtil::InsertSvdb(string tablename, const char *pdata, int datalen, string addr)
{
	MutexLock lock(g_InsertMQLock);
	if (Univ::enablemass)
		return CacheRecords(tablename, pdata, datalen);

	bool bret = false;
	try
	{
		bret = ::AppendRecord(tablename, pdata, datalen, "default", addr);
		cout << "AppendRecord " << tablename.c_str() << "  to " << addr.c_str() << " is done!" << endl;

	} catch (...)
	{
		return false;
	}

	return bret;

}

bool SUtil::InsertSvdb(string tablename, const char *pdata, int datalen)
{
	MutexLock lock(g_InsertMQLock);
	if (Univ::enablemass)
		return CacheRecords(tablename, pdata, datalen);

	bool bret = false;
	try
	{
//		bret=::AppendRecord(tablename,pdata,datalen,"default",g_ServerHost);
		bret = ::AppendRecord(tablename, pdata, datalen, "default", "localhost");
		cout << "AppendRecord " << tablename.c_str() << "  to localhost is done!" << endl;
	} catch (...)
	{
		return false;
	}

	return bret;

}

bool SUtil::AppendErrorRecord(string monitorid, int state, const char * estr)
{
	char ebuf[1024] = { 0 };
	MakeRecord mr(ebuf, 1024, state);
	mr.MakeError(state, estr);

	char *pt = ebuf;
	int dlen = mr.GetDataSize();
	pt += dlen;
	strcpy(pt, estr);
	dlen += (int) strlen(estr) + 1;
	ebuf[dlen - 1] = '\0';

	return SUtil::InsertSvdb(monitorid.c_str(), ebuf, dlen);
}

#if defined(WIN32)
BOOL SUtil::InitSocket()
{
	WSADATA WSAData;
	int err=0;
	err=WSAStartup(MAKEWORD(2, 2), &WSAData);

	if(err!=0)
	{
		return FALSE;
	}
	if(WSAData.wVersion!=MAKEWORD(2,2))
	{
//	   	AddToErrorLog(::GetStringByID(IDS_INITFAILED));
		return FALSE;
	}

	return TRUE;

}

void SUtil::ClearSocket()
{
	::WSACleanup();

}

#endif

/*!
 \fn SUtil::method_2()
 */
void SUtil::method_2()
{
	/// @todo implement me
}

/*!
 \fn SUtil::FreeStringList(CStringList &lst)
 */
void SUtil::FreeStringList(CStringList &lst)
{

	/*  CStringList::iterator it;
	 for(it=lst.begin();it!=lst.end();it++)
	 free(*it);*/
	lst.clear();
	/// @todo implement me
}

