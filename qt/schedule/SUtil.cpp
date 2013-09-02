#include "SUtil.h"
#include "MSException.h"

#ifdef	WIN32
#include "windows.h"
#else
#include <iconv.h>
#endif

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
	DWORD pid = getpid();
#endif
	char buf[32] = { 0 };
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

#ifdef	WIN32
void UnicodeToUTF8(char* pOut,wchar_t* pText)
{
	char* pchar = (char *)pText;
	pOut[0] = (0xE0 | ((pchar[1] & 0xF0) >> 4));
	pOut[1] = (0x80 | ((pchar[1] & 0x0F) << 2)) + ((pchar[0] & 0xC0) >> 6);
	pOut[2] = (0x80 | (pchar[0] & 0x3F));
}

string GB2312ToUTF8(string intext)
{
	if(intext.empty())
	return "";

	int pLen= intext.size();
	int nLength = pLen* 3;  // exactly should be:  *3/2 +1

	char *pText=new char[nLength];
	if(pText==NULL)
	return "";
	memset(pText,0,nLength);
	strcpy(pText,intext.c_str());

	char* rst = new char[nLength];
	if(rst==NULL)
	{
		delete []pText;
		return "";
	}
	memset(rst,0,nLength);

	char buf[4]=
	{	0};
	int i=0,j=0;
	for(; i<pLen; )
	{
		if( *(pText + i) >= 0)
		rst[j++] = pText[i++];
		else
		{
			wchar_t pbuffer;
			MultiByteToWideChar(CP_ACP,MB_PRECOMPOSED,pText+i,2,&pbuffer,1); //Gb2312ToUnicode
			UnicodeToUTF8(buf,&pbuffer);
			memmove(rst+j,buf,3);

			j += 3;
			i += 2;
		}
	}
	rst[j] = '\0';

	string str = rst;
	delete []rst;
	delete []pText;

	return str;
}

void UTF8ToUnicode(wchar_t* pOut, char* pText)
{
	char* uchar = (char *)pOut;
	uchar[1] = ((pText[0] & 0x0F) << 4) + ((pText[1] >> 2) & 0x0F);
	uchar[0] = ((pText[1] & 0x03) << 6) + (pText[2] & 0x3F);
}

string UTF8ToGB2312(string intext)
{
	if(intext.empty())
	return "";

	int pLen= intext.size();
	int nLength = pLen* 3; // exactly should be:  +1

	char *pText=new char[nLength];
	if(pText==NULL)
	return "";
	memset(pText,0,nLength);
	strcpy(pText,intext.c_str());

	char* rst = new char[nLength];
	if(rst==NULL)
	{
		delete []pText;
		return "";
	}
	memset(rst,0,nLength);

	char buf[4]=
	{	0};
	int i=0,j=0;
	for(; i<pLen; )
	{
		if( *(pText + i) >= 0)
		rst[j++] = pText[i++];
		else
		{
			wchar_t pbuffer;
			UTF8ToUnicode(&pbuffer,pText+i);
			WideCharToMultiByte(CP_ACP,WC_COMPOSITECHECK,&pbuffer,1,buf,sizeof(WCHAR),NULL,NULL); //UnicodeToGb2312
			memmove(rst+j,buf,2);

			i += 3;
			j += 2;
		}
	}
	rst[j] = '\0';

	string str = rst;
	delete []rst;
	delete []pText;

	return str;
}
#else
int code_convert(char *from_charset, char *to_charset, char *inbuf, int inlen, char *outbuf, int outlen)
{
	iconv_t cd;
	int rc;
	char **pin = &inbuf;
	char **pout = &outbuf;

	cd = iconv_open(to_charset, from_charset);
	if (cd == 0)
		return -1;
	memset(outbuf, 0, outlen);
	if (iconv(cd, pin, (size_t* __restrict__) (&inlen), pout, (size_t* __restrict__) (&outlen)) == -1)
		return -1;
	iconv_close(cd);
	return 0;
}

string str_code(string intext, const char *c_from_charset, const char *c_to_charset)
{
	if (intext.empty())
		return "";

	int pLen = intext.size();
	int nLength = pLen * 3;
	// GB2312ToUTF8 exactly should be:  *3/2 +1
	// UTF8ToGB2312 exactly should be: +1

	char *pText = new char[nLength];
	if (pText == NULL)
		return "";
	memset(pText, 0, nLength);
	strcpy(pText, intext.c_str());

	char* rst = new char[nLength];
	if (rst == NULL)
	{
		delete[] pText;
		return "";
	}
	memset(rst, 0, nLength);

	char from_charset[128] = { 0 };
	char to_charset[128] = { 0 };
	strcpy(from_charset, c_from_charset);
	strcpy(to_charset, c_to_charset);
	code_convert(from_charset, to_charset, pText, nLength, rst, nLength);

	string str = rst;
	delete[] rst;
	delete[] pText;

	return str;
}

string GB2312ToUTF8(string intext)
{
	return str_code(intext, "gb2312", "utf-8");
}

string UTF8ToGB2312(string intext)
{
	return str_code(intext, "utf-8", "gb2312");
}
#endif

string SUtil::GBKToUTF8(string intext)
{
	return GB2312ToUTF8(intext);
}
string SUtil::UTF8ToGBK(string intext)
{
	return UTF8ToGB2312(intext);
}
