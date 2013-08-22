// SnmpMonitor.cpp : Defines the initialization routines for the DLL.
//

#include "SnmpMonitor.h"
//#include "stlini.h"
#include <svtime.h>
#include <stdlib.h>
#include <fstream>
#include <vector>
//#include "Base/SVDefines.h"
//#include "windows.h"

//#include "..\..\base\funcGeneral.h"
//#include "SNMP_lib.h"


#ifdef	WIN32
#include <atltime.h>
#else
#include <time.h>
#include <string.h>
#include <stdio.h>
#include <sys/timeb.h>
#endif

#include "SnmpOperate.h"

using namespace SV_ECC_SNMP_LIB;
using namespace svutil;

#define     COUNTER_MAX    4294976295

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

#ifdef WIN32
#include <windows.h>
#endif

typedef struct
{
	std::string strServer;
	std::string strDevID;
	std::string strPwd;
	std::string strPwdPrompt;
	std::string strCMD;
	std::string strCmdPrompt;
	int nPort;
	bool bAlive;	// 线程存在标志

} PARM;

//===============================================================
//打印日志函数(zou_xiao)
//===============================================================
#include <time.h>
#include <sys/types.h>
#include <sys/stat.h>

void myPrintLog(const char *LogMes)
{
	//return;
	FILE *fp = NULL;
	if ((fp = fopen("dyMonitorSnmpError.log", "a")) == NULL)
	{
		printf("file not find ,then create it ..\r\n");
		return;
	}

	fprintf(fp, "%s \t%s\n", svutil::TTime::GetCurrentTimeEx().Format().c_str(), LogMes);
	fclose(fp);
}

void WriteDebugLog(const char* str)
{
	return;
	char szLogFile[] = "snmperror.log";

#ifdef WIN32
	// 判断文件大小：在不打开文件的情况下实现
	struct _stat buf;
	if (_stat(szLogFile, &buf) == 0)
	{
		if (buf.st_size > 1000 * 1024)
		{
			FILE *log = fopen(szLogFile, "w");
			if (log != NULL)
			fclose(log);
		}
	}
#endif

	FILE *log = fopen(szLogFile, "a+");
	if (log != NULL)
	{
		fprintf(log, "%s \t%s\n", svutil::TTime::GetCurrentTimeEx().Format().c_str(), str);
		fclose(log);
	}
}

void WriteTxt(const char* str, const char* pszFileName = NULL)
{
	return;

	char szProgramName[] = "Snmp.log";
	char szLogFile[128];

	if (pszFileName != NULL)
	{
		sprintf(szLogFile, "%s.log", pszFileName);
	}
	else
	{
		sprintf(szLogFile, "%s", szProgramName);
	}

#ifdef WIN32
	// 判断文件大小：在不打开文件的情况下实现
	struct _stat buf;
	if (_stat(szLogFile, &buf) == 0)
	{
		if (buf.st_size > 1000 * 1024)
		{
			FILE *log = fopen(szLogFile, "w");
			if (log != NULL)
			fclose(log);
		}
	}
#endif

	FILE *log = fopen(szLogFile, "a+");
	if (log != NULL)
	{
		fprintf(log, "%s \t%s\n", svutil::TTime::GetCurrentTimeEx().Format().c_str(), str);
		fclose(log);
	}
	else
	{
		fclose(log);
	}
}

//#define TOFILE

void PrintDebug(const char * str)
{
#ifdef TOFILE
	WriteDebugLog(str);
#endif

#ifdef TOCONSOLE
	OutputDebugString(str);
#endif
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
void PrintDebugString(const char * szMsg)
{
#ifdef WIN32
	OutputDebugString("SNMPMonitor : ");
	OutputDebugString(szMsg);
	OutputDebugString("\n");
#endif
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
void PrintDebugString(const string & szMsg)
{
	PrintDebugString(szMsg.c_str());
}

bool MakeStringListByChar(StringList& pList, const char * pInput)	//将字符转化为字符串链表形式
{
	const char * p;	//*p是常量，不能作为左值，p是变量，可以作为左值。这样确保输入串的内容不被显示的修改
	int nSize;
	p = pInput;	//将输入串保存到p中。确保输入串不被改动。
	while (*p != '\0')
	{
		nSize = static_cast<int>(strlen(p));	//nSize保存串的长度
		if (nSize > 0)
		{
			//pList.AddHead(p);
			pList.push_back((char*) p);
		}
		p = p + nSize + 1;
	}

	return true;
}

inline int Find(char * m_Str1, char * m_Str2)
{
	int num = 0;
	char * m_Temp = m_Str2;
	char * m_Temp1 = m_Str1;

	for (; *m_Str1 != '\0'; m_Str1++)
	{
		if (*m_Str1 == *m_Str2)
		{
			num = 0;
			for (; (*m_Str1 != '\0') && (*m_Temp != '\0') && (*m_Str1 == *m_Temp); m_Str1++, m_Temp++)
			{
				num++;

			}
			if (num == strlen(m_Str2))
			{

				//break;

				return static_cast<int>(m_Str1 - m_Temp1 - num);
			}
			else
			{
				m_Temp = m_Str2;
				m_Str1 -= num;
			}
		}

	}
	return -1;
}

inline char * Right(char * m_Str1, int pos)
{
	char * m_Temp = NULL;
	int len = static_cast<int>(strlen(m_Str1));
	m_Temp = (char*) malloc(len - pos);
	memset(m_Temp, 0, len - pos);
	memcpy(m_Temp, m_Str1 + pos, len - pos);
	return m_Temp;
}

inline char * Left(char * m_Str1, int pos)
{
	char * m_Temp = NULL;
	int len = static_cast<int>(strlen(m_Str1));
	m_Temp = (char*) malloc(pos);
	memset(m_Temp, 0, pos);
	memcpy(m_Temp, m_Str1, pos);
	return m_Temp;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 拆分参数表
// 参数表
// 输入参数 参数表
// 返回值类型 bool(拆分成功true|拆分失败false)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool splitparam(const char *pszParams, map<string, string, less<string> > &Params)
{
	const char * pPos = pszParams;
	while (*pPos != '\0')
	{
		int nSize = static_cast<int>(strlen(pPos));
		cout << pPos << endl;
		char *chTmp = strdup(pPos);
		if (chTmp)
		{
			char *pEqualSign = strchr(chTmp, '=');
			if (pEqualSign)
			{
				*pEqualSign = '\0';
				pEqualSign++;
				Params[chTmp] = pEqualSign;
			}
			free(chTmp);
		}
		else
		{
			return false;
		}
		pPos = pPos + nSize + 1;
	}
	return true;
}

CSnmpMonitorApp::CSnmpMonitorApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
	gRoot_path = FuncGetInstallPath();

}
bool CSnmpMonitorApp::InitInstance()
{
	gRoot_path = FuncGetInstallPath();
	return true;

}

/////////////////////////////////////////////////////////////////////////////
// The one and only CSnmpMonitorApp objectstring

int CheckOIDIndex(StringList &lsIndex, char* strIniFilePath, CSVSnmpOID &objOID, int nTplID);

enum
{
	forReading,	//
	forWriting,
	forAppending
};

/////////////////////////////////////////////////////////////////////////////

bool MakeCharByString(char *pOut, int &nOutSize, std::string strInput)
{
	char *p;

	int nSize = strInput.length();
	if (nSize + 2 < nOutSize)
	{
		strcpy(pOut, strInput.c_str());
	}
	else
		return false;
	p = pOut;
	//printf("%d\n",nSize);23028830 13602067678 王波
	for (int i = 0; i < nSize; i++)
	{
		if (*p == '$')
			*p = '\0';
		p++;
	}
	nOutSize = nSize + 1;
	return true;

}

SNMP_MONITOR_DLL int SNMPDone(const char * strParas, char * szReturn, int& nSize)
{
//	AFX_MANAGE_STATE(AfxGetStaticModuleState());

	int bReturn = TRUE;
	std::string strIP;
	std::string strCommunity;
	std::string strMonitorID;
	std::string strIniFilePath;
	std::string strIndex;
	std::string strSelValue;
	std::string strValue;

	int nTplID = 0, nPort = 161, nSnmpVer = 2;
	//int	nTimeout = 300;//, nIfIndex = 0;   //nTimeout = 300;原来的
	int nTimeout = 2000;	//yi.duan 上海检察院2010-06-07

	map<string, string, less<string> > InputParams;
	map<string, string, less<string> >::iterator paramItem;

	if (!splitparam(strParas, InputParams))
	{
		string szErrMsg = FuncGetStringFromIDS("IDS_MONITOR_PARAM_ERROR");
		nSize = sprintf(szReturn, "error=some parameter is wrong"); //, FuncGetStringFromIDS("IDS_MONITOR_PARAM_ERROR"));
		return FALSE;
	}
	/*	_sleep(1000);

	 FILE *stream;
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n\nFunction:SNMPDone:\n");
	 map<string, string, less<string> >::iterator Item;
	 for(Item=InputParams.begin();Item!=InputParams.end();Item++)
	 {
	 fprintf(stream,"%s=%s\n",Item->first.c_str(),Item->second.c_str());
	 }
	 fclose(stream);
	 */

	paramItem = InputParams.find(SV_MonitorID);

	if (paramItem != InputParams.end())
		strMonitorID = paramItem->second;

	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;
//////////解决接口信息的显示问题。	张驹武 2007.12.28
	paramItem = InputParams.find(SV_InterfaceIndex);
	if (paramItem != InputParams.end())
		strIndex = paramItem->second;

	//
	int nPos = strIndex.find('_');
	if (nPos != -1)
		strIndex.erase(nPos, strIndex.length() - nPos);
//////////解决接口信息的显示问题。	张驹武 2007.12.28

	paramItem = InputParams.find(SV_SNMPDisk);
	if (paramItem != InputParams.end())
		strIndex = paramItem->second;
/////////解决进程显示问题
	paramItem = InputParams.find(SV_SNMPSelvalue);

	if (paramItem != InputParams.end())
	{
		/*
		 string strIn=paramItem->second;
		 int n=strIn.find("_");

		 string strSub=strIn.substr(n+1);

		 strSelValue = strSub;
		 */
		strSelValue = paramItem->second;
		//nPos=strSelValue.find('_');
		//if(nPos !=-1)
		//	strSelValue.erase(nPos,strSelValue.length()-nPos);

	}
/////////解决进程显示问题
	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_TimeOut);
	if (paramItem != InputParams.end())
	{
		nTimeout = atoi(paramItem->second.c_str());
		if (nTimeout <= 0)
		{
			nTimeout = 300;
		}
		else
			nTimeout = nTimeout * 100;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find(SV_TPLID);
	if (paramItem != InputParams.end())
		nTplID = atoi(paramItem->second.c_str());

	StringList::iterator pos;
	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", m_Ret.c_str());
		nSize = static_cast<int>(strlen(szReturn));
		return FALSE;
	}
	strIniFilePath = "smi.ini";

	CSnmpOperate snmpOperate(strIniFilePath.c_str(), strMonitorID.c_str(), strIP.c_str(), strCommunity.c_str(),
			strIndex.c_str(), strSelValue.c_str(), nTplID, nPort, nSnmpVer, nTimeout);

	SV_ECC_SNMP_LIB::InitLib();

	snmpOperate.GetResult(szReturn, nSize);

	//bin.liu 0 的话补值
	if (nTplID == 433)
	{

		char chTempFile[MAX_BUFF_LEN] = { 0 };
		sprintf(chTempFile, "snmpresult_%s.ini", strMonitorID.c_str());
		char oldvalue1[MAX_BUFF_LEN];
		char oldvalue2[MAX_BUFF_LEN];
		//GetPrivateProfileString1("", "HistoryValue", "13", pOidList[i].chHisValue, MAX_BUFF_LEN, chTempFile);
		GetPrivateProfileString1("result", "ifInOctetsRate", "13", oldvalue1, MAX_BUFF_LEN, chTempFile);
		GetPrivateProfileString1("result", "ifOutOctetsRate", "12.00", oldvalue2, MAX_BUFF_LEN, chTempFile);
		const char * p;
		//char * pszReturn;
		// memset(pszReturn,0,100000);
		//char * p;
		int nSize1 = 0;
		p = szReturn;
		//pszReturn=szReturn;
		while (*p != '\0')
		{
			nSize1 += strlen(p) + 1;
			p += strlen(p) + 1;
		}

		//将'\0' 替换为'$'
		std::string strOut;
		std::string allstrOut;
		std::string temptrOut;
		char value1[512] = { 0 };
		char value2[512] = { 0 };
		int poss = 0;
		for (int j = 0; j < nSize1; j++)
		{
			if (szReturn[j] == '\0')
			{

				poss = strOut.find("ifInOctetsRate");		// ifInOctetsRate

				if (poss == 0)
				{
					poss = strOut.find("=");
					std::string tempp = strOut.substr(poss + 1, strOut.length() - poss - 1);
					printf("dddddddddddddddddddd   %s \n", tempp.c_str());
					if (tempp != "0.00")
					{
						strcpy(value1, tempp.c_str());
						WritePrivateProfileString1("result", "ifInOctetsRate", value1, chTempFile);
					}
					else
					{

						temptrOut = oldvalue1;
						printf("dddddddddddddddddddd   %s \n", temptrOut.c_str());
						strOut = "ifInOctetsRate=" + temptrOut;
						printf("dddddddddddddddddddd   %s \n", strOut.c_str());
					}

				}
				poss = strOut.find("ifOutOctetsRate");
				if (poss == 0)
				{
					poss = strOut.find("=");
					std::string tempp = strOut.substr(poss + 1, strOut.length() - poss - 1);
					if (tempp != "0.00")
					{
						strcpy(value2, tempp.c_str());
						WritePrivateProfileString1("result", "ifOutOctetsRate", value2, chTempFile);
					}
					else
					{
						temptrOut = oldvalue2;
						strOut = "ifOutOctetsRate=" + temptrOut;
					}

				}
				/*if (strOut.Mid("ifInOctetsRate")!=-1)
				 {
				 value1="1";
				 }*/
				allstrOut += strOut;
				allstrOut += "$";

				strOut = "";
			}
			else
			{
				strOut += szReturn[j];
			}
		}
		//GetBuffer(strTest.GetLength());

		printf("dddddddddddddddddddd   %s", allstrOut.c_str());
		sprintf(szReturn, allstrOut.c_str());
		char * strEnd = szReturn;
		while (*strEnd)
		{
			if (*strEnd == '$')
				*strEnd = '\0';
			strEnd++;
		}
		//bool dd= MakeCharByString(szReturn,nSize1,strInput);	
		//printf("dddddddddddddddddddd   %d",dd);

	}

	SV_ECC_SNMP_LIB::ReleaseLib();

	/*
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n100%c\n",'_');
	 map<string, string, less<string> > OutputParams;
	 splitparam(szReturn, OutputParams);
	 map<string, string, less<string> > ::iterator I;
	 for(I=OutputParams.begin();I!=OutputParams.end();I++)
	 {
	 fprintf(stream,"%s=%s\n",I->first.c_str(),I->second.c_str());
	 }

	 fclose(stream);
	 */

	WriteTxt("结果：", strMonitorID.c_str());
	char* pszTemp = szReturn;
	while (*pszTemp)
	{
		WriteTxt(pszTemp, strMonitorID.c_str());
		pszTemp += strlen(pszTemp) + 1;
	}

	return bReturn;
}

//字符串分割函数
std::vector<std::string> split(std::string str, std::string pattern)
{
	std::string::size_type pos;
	std::vector < std::string > result;
	str += pattern;		//扩展字符串以方便操作
	int size = str.size();

	for (int i = 0; i < size; i++)
	{
		pos = str.find(pattern, i);
		if (pos < size)
		{
			std::string s = str.substr(i, pos - i);
			result.push_back(s);
			i = pos + pattern.size() - 1;
		}
	}
	return result;
}

SNMP_MONITOR_DLL int SNMPProcListDone(const char * strParas, char * szReturn, int& nSize)
{
//	AFX_MANAGE_STATE(AfxGetStaticModuleState());

	int bReturn = TRUE;
	std::string strIP;
	std::string strCommunity;
	std::string strMonitorID;
	std::string strIniFilePath;
	std::string strIndex;
	std::string strSelValue;
	std::string strValue;

	int nTplID = 0, nPort = 161, nSnmpVer = 2;
	//int	nTimeout = 300;//, nIfIndex = 0;   //nTimeout = 300;原来的
	int nTimeout = 2000;		//yi.duan 上海检察院2010-06-07

	map<string, string, less<string> > InputParams;
	map<string, string, less<string> >::iterator paramItem;

	if (!splitparam(strParas, InputParams))
	{
		string szErrMsg = FuncGetStringFromIDS("IDS_MONITOR_PARAM_ERROR");
		nSize = sprintf(szReturn, "error=some parameter is wrong"); //, FuncGetStringFromIDS("IDS_MONITOR_PARAM_ERROR"));
		return FALSE;
	}

	paramItem = InputParams.find(SV_MonitorID);

	if (paramItem != InputParams.end())
		strMonitorID = paramItem->second;

	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;
//////////解决接口信息的显示问题。	张驹武 2007.12.28
	paramItem = InputParams.find(SV_InterfaceIndex);
	if (paramItem != InputParams.end())
		strIndex = paramItem->second;

	//
	int nPos = strIndex.find('_');
	if (nPos != -1)
		strIndex.erase(nPos, strIndex.length() - nPos);
//////////解决接口信息的显示问题。	张驹武 2007.12.28

	paramItem = InputParams.find(SV_SNMPDisk);
	if (paramItem != InputParams.end())
		strIndex = paramItem->second;
/////////解决进程显示问题
	paramItem = InputParams.find(SV_SNMPSelvalue);

	if (paramItem != InputParams.end())
	{
		/*
		 string strIn=paramItem->second;
		 int n=strIn.find("_");

		 string strSub=strIn.substr(n+1);

		 strSelValue = strSub;
		 */
		strSelValue = paramItem->second;
		//nPos=strSelValue.find('_');
		//if(nPos !=-1)
		//	strSelValue.erase(nPos,strSelValue.length()-nPos);

	}
/////////解决进程显示问题
	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_TimeOut);
	if (paramItem != InputParams.end())
	{
		nTimeout = atoi(paramItem->second.c_str());
		if (nTimeout <= 0)
		{
			nTimeout = 300;
		}
		else
			nTimeout = nTimeout * 100;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find(SV_TPLID);
	if (paramItem != InputParams.end())
		nTplID = atoi(paramItem->second.c_str());

	StringList::iterator pos;
	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", m_Ret.c_str());
		nSize = static_cast<int>(strlen(szReturn));
		return FALSE;
	}

	strIniFilePath = "smi.ini";

	std::vector < std::string > strProcList = split(strSelValue.c_str(), ",");
	std::string strProc, strTmp;
	int nProcCount = 0;

	SV_ECC_SNMP_LIB::InitLib();

	for (int i = 0; i < strProcList.size(); i++)
	{
		CSnmpOperate snmpOperate(strIniFilePath.c_str(), strMonitorID.c_str(), strIP.c_str(), strCommunity.c_str(),
				strIndex.c_str(), strProcList[i].c_str(), nTplID, nPort, nSnmpVer, nTimeout);

		snmpOperate.GetResult(szReturn, nSize);

		strTmp = szReturn;
		const std::string PCount("ProcessCount=");
		int postemp = strTmp.find(PCount);
		if (postemp != -1)
		{
			int postemp2 = strTmp.find(".00");
			if (postemp2 == -1)
				strTmp = strTmp.substr(postemp + PCount.length());
			else
				strTmp = strTmp.substr(postemp + PCount.length(), postemp2 - postemp - PCount.length());
			nProcCount += atoi(strTmp.c_str());
		}
		strProc += strProcList[i].c_str();
		strProc += ":";
		strProc += strTmp;
		strProc += " ";

	}

	SV_ECC_SNMP_LIB::ReleaseLib();

	char strInput[1024] = { 0 };
	sprintf(strInput, "ProcessCount=%d$Dstr=%s", nProcCount, strProc.c_str());
	nSize = strlen(strInput) + 3;
	//strInput =szReturn;
	MakeCharByString(szReturn, nSize, strInput);

	/*	WriteTxt( "结果：", strMonitorID.c_str() );
	 char* pszTemp = szReturn;
	 while(*pszTemp)
	 {
	 WriteTxt( pszTemp, strMonitorID.c_str() );
	 pszTemp += strlen(pszTemp) + 1;
	 }
	 */
	return bReturn;
}

/////////////////////////////////////////////////////////////////////////////

SNMP_MONITOR_DLL int SNMPList(const char * strParas, char * szReturn, int& nSize)
{
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(szReturn, "error=some parameter is wrong");
		return FALSE;
	}

	/*
	 FILE *stream;
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n\nFunction:SNMPList:\n");
	 map<string, string, less<string> >::iterator Item;
	 for(Item=InputParams.begin();Item!=InputParams.end();Item++)
	 {
	 fprintf(stream,"%s=%s\n",Item->first.c_str(),Item->second.c_str());
	 }
	 fclose(stream);
	 */

	string strIP(""), strCommunity("");
	int nTplID = 0, nPort = 161, nIfIndex = 0, nSnmpVer = 2;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find(SV_TPLID);
	if (paramItem != InputParams.end())
		nTplID = atoi(paramItem->second.c_str());

	//paramItem = InputParams.find(SV_InterfaceIndex);
	//if(paramItem != InputParams.end())
	//    nIfIndex = atoi(paramItem->second.c_str());

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	char chSection[MAX_BUFF_LEN] = { 0 };    //项
	string strIniFilePath("smi.ini");
	sprintf(chSection, "monitor-%d", nTplID);    //Section
	//读取总数
	int nCount = FuncGetProfileIntBy(chSection, "showoid", (char*) strIniFilePath.c_str());
	if (nCount == 0)
	{    //如果OID总数为零
		char szReturn[MAX_BUFF_LEN] = { 0 };
		std::string m_Ret = FuncGetStringFromIDS("SV_SNMP_MONITOR", "SNMP_LIST_PARAM_ERROR");
		sprintf(szReturn, "error=%s(tplmib-%d)$", m_Ret.c_str(), nTplID);
		return FALSE;
	}
	/////////////////////////////////////////////////////////////////////////
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		std::string m_TempBuf = FuncGetStringFromIDS("IDS_InitSNMPFailed");
		sprintf(szReturn, "error=%s", (char*) m_TempBuf.c_str());
		return FALSE;
	}

	StringList lstValues;
	////得到索引
	int bReturn = CheckOIDIndex(lstValues, (char*) strIniFilePath.c_str(), objOID, nTplID);

	for (StringList::iterator pos = lstValues.begin(); pos != lstValues.end(); pos++)
	{
	}

	if (bReturn != FALSE)
	{
		int nRealValue = FuncGetProfileIntBy(chSection, "index_sure", (char*) strIniFilePath.c_str());

		StringList lstTexts, lsRealValue, lsTemp;
		char chOID[MAX_BUFF_LEN] = { 0 }, key[256] = { 0 }, chFixLable[MAX_BUFF_LEN] = { 0 };
		int nResult = 0, nSubSize = 0, nSubStr = 0;
		string szTemp("");
		MonitorResult resultList;
		resultItem resultIt;
		for (StringList::iterator pos = lstValues.begin(); pos != lstValues.end(); pos++)
		{
			for (int i = 1; i <= nCount; i++)
			{
				sprintf(key, "showoid_substring%d", i);
				nSubStr = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_subsize%d", i);
				nSubSize = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_fixlable%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				if (szTemp.c_str() != "error")
					strcpy(chFixLable, szTemp.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_oid%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				sprintf(chOID, "%s.%s", szTemp.c_str(), (*pos).c_str());
				objOID.SetOIDValue(chOID);
				objOID.SetOIDType(0);

				resultList.clear();
				cout << "-------------- SNMPList, GetResult Start ------------------" << endl;
				nResult = objOID.GetResult(resultList);    //得到结果
				cout << "-------------- SNMPList, GetResult End ------------------" << endl;
				if (nResult == 0)
				{
					resultIt = resultList.begin();

					/*
					 char str[10000];

					 FILE *stream;
					 sprintf(str,"%s\n%s:%s,%s\n",str,resultIt->second.m_szOID.c_str(),
					 resultIt->second.m_szValue.c_str(),
					 resultIt->second.m_szIndex.c_str());
					 stream = fopen( "fread.txt", "a+" );
					 fwrite( str, sizeof( char ), strlen(str), stream );
					 fclose(stream);
					 */

					if (resultIt != resultList.end())
					{
						string szValue(resultIt->second.m_szValue);

						cout << "szValue = " << szValue << endl;

						if (strlen(chFixLable) == 0)
						{
							if (nSubStr == 1)
							{
								szValue = szValue.substr(0, nSubSize);
							}
							else if (nSubStr == 2)
							{
								szValue = szValue.substr(nSubSize, szValue.size() - nSubSize);
							}
						}
						else
						{
							szValue = chFixLable;
						}
						cout << "szValue2 = " << szValue << endl;
						lsTemp.push_back(szValue);
						if (nRealValue == i)
							lsRealValue.push_back(szValue);
					}
				}
			}
			MakeLabel(lsTemp, lstTexts, chFixLable, nSubStr, nSubSize);
			lsTemp.clear();
		}

		if (nRealValue > 0)
		{
			lstValues.clear();
			for (StringList::iterator pos = lsRealValue.begin(); pos != lsRealValue.end(); pos++)
				lstValues.push_back(*pos);
		}

		if (lstTexts.size() == lstValues.size())
		{
			int nLen = 0;
			int nOneLen;
			StringList::iterator pos1 = lstValues.begin();
			for (StringList::iterator pos = lstTexts.begin(), pos1 = lstValues.begin();
					pos != lstTexts.end() || pos1 != lstValues.end(); pos++, pos1++)
			{

				nOneLen = static_cast<int>((*pos1).length()) + (static_cast<int>((*pos).length()) + 2);
				if (nOneLen + nLen > nSize)
					break;

				memcpy(szReturn + nLen, (*pos1).c_str(), (*pos1).length());
				nLen += static_cast<int>((*pos1).length());
				memcpy(szReturn + nLen, "_", 1);
				nLen++;
				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += static_cast<int>((*pos).length());
				memcpy(szReturn + nLen, "=", 1);
				nLen++;
				memcpy(szReturn + nLen, (*pos1).c_str(), (*pos1).length());
				nLen += static_cast<int>((*pos1).length());
				memcpy(szReturn + nLen, "_", 1);
				nLen++;
				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += (static_cast<int>((*pos).length()) + 1);

			}
			nSize = nLen;
		}
		else
		{
			bReturn = FALSE;
		}
	}

	SV_ECC_SNMP_LIB::ReleaseLib();

	/////////////////////////////////////////////////////////////////////////
	/*
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n100%c\n",'_');
	 map<string, string, less<string> > OutputParams;
	 splitparam(szReturn, OutputParams);
	 map<string, string, less<string> > ::iterator I;
	 for(I=OutputParams.begin();I!=OutputParams.end();I++)
	 {
	 fprintf(stream,"%s=%s\n",I->first.c_str(),I->second.c_str());
	 }
	 */

	return bReturn;
}

SNMP_MONITOR_DLL int SNMPProList(const char * strParas, char * szReturn, int& nSize)
{
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(szReturn, "error=some parameter is wrong");
		return FALSE;
	}

	string strIP(""), strCommunity("");
	int nTplID = 0, nPort = 161, nIfIndex = 0, nSnmpVer = 2;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find(SV_TPLID);
	if (paramItem != InputParams.end())
		nTplID = atoi(paramItem->second.c_str());

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	char chSection[MAX_BUFF_LEN] = { 0 };    //项
	string strIniFilePath("smi.ini");
	sprintf(chSection, "monitor-%d", nTplID);    //Section
	//读取总数
	int nCount = FuncGetProfileIntBy(chSection, "showoid", (char*) strIniFilePath.c_str());
	if (nCount == 0)
	{    //如果OID总数为零
		char szReturn[MAX_BUFF_LEN] = { 0 };
		std::string m_Ret = FuncGetStringFromIDS("SV_SNMP_MONITOR", "SNMP_LIST_PARAM_ERROR");
		sprintf(szReturn, "error=%s(tplmib-%d)$", m_Ret.c_str(), nTplID);
		return FALSE;
	}
	/////////////////////////////////////////////////////////////////////////
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		std::string m_TempBuf = FuncGetStringFromIDS("IDS_InitSNMPFailed");
		sprintf(szReturn, "error=%s", (char*) m_TempBuf.c_str());
		return FALSE;
	}

	StringList lstValues;
	////得到索引
	int bReturn = CheckOIDIndex(lstValues, (char*) strIniFilePath.c_str(), objOID, nTplID);

	for (StringList::iterator pos = lstValues.begin(); pos != lstValues.end(); pos++)
	{
	}

	if (bReturn != FALSE)
	{
		int nRealValue = FuncGetProfileIntBy(chSection, "index_sure", (char*) strIniFilePath.c_str());

		StringList lstTexts, lsRealValue, lsTemp;
		char chOID[MAX_BUFF_LEN] = { 0 }, key[256] = { 0 }, chFixLable[MAX_BUFF_LEN] = { 0 };
		int nResult = 0, nSubSize = 0, nSubStr = 0;
		string szTemp("");
		MonitorResult resultList;
		resultItem resultIt;
		for (StringList::iterator pos = lstValues.begin(); pos != lstValues.end(); pos++)
		{
			for (int i = 1; i <= nCount; i++)
			{
				sprintf(key, "showoid_substring%d", i);
				nSubStr = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_subsize%d", i);
				nSubSize = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_fixlable%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				if (szTemp.c_str() != "error")
					strcpy(chFixLable, szTemp.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_oid%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				sprintf(chOID, "%s.%s", szTemp.c_str(), (*pos).c_str());
				objOID.SetOIDValue(chOID);
				objOID.SetOIDType(0);

				resultList.clear();
				nResult = objOID.GetResult(resultList);    //得到结果
				if (nResult == 0)
				{
					resultIt = resultList.begin();

					if (resultIt != resultList.end())
					{
						string szValue(resultIt->second.m_szValue);
						if (strlen(chFixLable) == 0)
						{
							if (nSubStr == 1)
							{
								szValue = szValue.substr(0, nSubSize);
							}
							else if (nSubStr == 2)
							{
								szValue = szValue.substr(nSubSize, szValue.size() - nSubSize);
							}
						}
						else
						{
							szValue = chFixLable;
						}

						lsTemp.push_back(szValue);
						if (nRealValue == i)
							lsRealValue.push_back(szValue);
					}
				}
			}
			MakeLabel(lsTemp, lstTexts, chFixLable, nSubStr, nSubSize);
			lsTemp.clear();
		}

		if (nRealValue > 0)
		{
			lstValues.clear();
			for (StringList::iterator pos = lsRealValue.begin(); pos != lsRealValue.end(); pos++)
				lstValues.push_back(*pos);
		}

		if (lstTexts.size() == lstValues.size())
		{
			int nLen = 0;
			int nOneLen;
			StringList::iterator pos1 = lstValues.begin();
			for (StringList::iterator pos = lstTexts.begin(), pos1 = lstValues.begin();
					pos != lstTexts.end() || pos1 != lstValues.end(); pos++, pos1++)
			{
				nOneLen = static_cast<int>((*pos1).length()) + (static_cast<int>((*pos).length()) + 2);
				if (nOneLen + nLen > nSize)
					break;

				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += static_cast<int>((*pos).length());
				memcpy(szReturn + nLen, "=", 1);
				nLen++;
				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += (static_cast<int>((*pos).length()) + 1);

			}
			nSize = nLen;
		}
		else
		{
			bReturn = FALSE;
		}
	}
	SV_ECC_SNMP_LIB::ReleaseLib();

	return bReturn;
}

void MakeLabel(StringList &lsTemp, StringList &lsLable, char* strFixLable, int nSelSub, int nSubSize)
{
	//POSITION posTmp, posLable, posLables;
	StringList::iterator posTmp;
	int nLableCount = static_cast<int>(lsTemp.size());
	//int nTmpCount = lsTemp.size();    
	std::string strTmp("");
	if (nLableCount == 1)
	{
		for (posTmp = lsTemp.begin(); posTmp != lsTemp.end(); posTmp++)
		{
			lsLable.push_back((*posTmp));
		}
	}
	else
	{
		for (posTmp = lsTemp.begin(); posTmp != lsTemp.end(); posTmp++)
		{
			strTmp += *posTmp;
			strTmp += "_";
			posTmp++;
			strTmp += *posTmp;
		}
		lsLable.push_back(strTmp);
	}
}

int CheckOIDIndex(StringList &lsIndex, char* strIniFilePath, CSVSnmpOID &objOID, int nTplID)
{
	int nResult = 0;
	char chTmp[MAX_BUFF_LEN] = { 0 }, chOID[MAX_BUFF_LEN] = { 0 }, chSection[MAX_BUFF_LEN] = { 0 },
			chValue[MAX_BUFF_LEN] = { 0 };

	StringList lsTemp;
	sprintf(chSection, "monitor-%d", nTplID);
	//索引值 OID
	std::string szTempBuf = FuncGetProfileStringBy(chSection, "index_oid", strIniFilePath);
	if (szTempBuf == "error")
		return FALSE;

	objOID.SetOIDValue(szTempBuf.c_str());
	//OID类型(0 简单变量;1 表格变量)
	objOID.SetOIDType(FuncGetProfileIntBy(chSection, "index_type", strIniFilePath) - 1);

	MonitorResult resultList;
	nResult = objOID.GetResult(resultList);    //得到结果
	if (nResult == 0)
	{    //
		for (resultItem it = resultList.begin(); it != resultList.end(); it++)
			lsTemp.push_back(it->second.m_szIndex);

		//sprintf(chSection, "monitor-%d", nTplID);
		szTempBuf = FuncGetProfileStringBy(chSection, "match_oid", strIniFilePath);
		memset(chOID, 0, MAX_BUFF_LEN);
		if (szTempBuf != "error")
		{
			strcpy(chOID, szTempBuf.c_str());
		}

		if (strcmp(chOID, "") == 0 || strlen(chOID) <= 0)
		{
			for (StringList::iterator pos = lsTemp.begin(); pos != lsTemp.end(); pos++)
			{    //根据每一条索引值查询类型
				lsIndex.push_back((*pos));
			}
		}
		else if (strlen(chOID) > 0)
		{
			szTempBuf = FuncGetProfileStringBy(chSection, "match_value", strIniFilePath);
			if (szTempBuf == "error")
				return FALSE;

			strcpy(chValue, szTempBuf.c_str());

			for (StringList::iterator pos = lsTemp.begin(); pos != lsTemp.end(); pos++)
			{    //根据每一条索引值查询类型
				szTempBuf = (*pos);
				memset(chTmp, 0, MAX_BUFF_LEN);
				sprintf(chTmp, "%s.%s", chOID, szTempBuf.c_str());
				objOID.SetOIDValue(chTmp);
				objOID.SetOIDType(0);
				resultList.clear();
				nResult = objOID.GetResult(resultList);
				if (nResult == 0)
				{
					resultItem resultIt = resultList.begin();
					if (resultIt != resultList.end())
					{
						if (strcmp(chValue, resultIt->second.m_szValue.c_str()) == 0)
							lsIndex.push_back(szTempBuf);
					}
				}
				else
				{
					return FALSE;
				}
			}
		}
	}
	else
	{
		return FALSE;
	}
	return TRUE;
}

SNMP_MONITOR_DLL bool INTERFACES(const char * strParas, char *pszReturn, int & nSize)
{

	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(pszReturn, "error=some parameter is wrong");
		return false;
	}

	/*
	 FILE *stream;
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n\nFunction:INTERFACES:\n");
	 map<string, string, less<string> >::iterator Item;
	 for(Item=InputParams.begin();Item!=InputParams.end();Item++)
	 {
	 fprintf(stream,"%s=%s\n",Item->first.c_str(),Item->second.c_str());
	 }
	 fclose(stream);
	 */

	string strIP(""), strCommunity("");
	int nPort = 161, nSnmpVer = 1;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(pszReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	/////////////////////////////////////////////////////////////////////////
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		std::string m_TempBuf = FuncGetStringFromIDS("IDS_InitSNMPFailed");
		sprintf(pszReturn, "error=%s", (char*) m_TempBuf.c_str());
		ofstream fout("snmperror.log", ios::app);
		fout << pszReturn << "\r\n";
		fout << flush;
		fout.close();
		return false;
	}

	objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.1");
	objOID.SetOIDType(1);

	MonitorResult resultList;
	map<int, string, less<int> > lsInterfaces;
	map<int, string, less<int> >::iterator itInterfaces;
	resultList.clear();
	int nResult = objOID.GetResult(resultList);    //得到结果
	if (nResult == 0)
	{
		resultItem resultIt;
		for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
		{
			lsInterfaces[atoi(resultIt->second.m_szIndex.c_str())] = resultIt->second.m_szValue;
		}

		resultList.clear();

		objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.2"); //description
		objOID.SetOIDType(1);

		nResult = objOID.GetResult(resultList); //得到结果

		if (nResult == 0)
		{
			for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
			{
				itInterfaces = lsInterfaces.find(atoi(resultIt->second.m_szIndex.c_str()));
				if (itInterfaces != lsInterfaces.end())
				{
					itInterfaces->second += "_";
					itInterfaces->second += resultIt->second.m_szValue;

				}
			}

			resultList.clear();

			objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.3");
			objOID.SetOIDType(1);

			nResult = objOID.GetResult(resultList); //得到结果
			if (nResult == 0)
			{
				for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
				{
					itInterfaces = lsInterfaces.find(atoi(resultIt->second.m_szIndex.c_str()));
					if (itInterfaces != lsInterfaces.end())
					{
						unsigned long nifType = (unsigned long) atoi(resultIt->second.m_szValue.c_str());
						itInterfaces->second += "_";
						itInterfaces->second += (nifType == 1 ? "other" : nifType == 2 ? "regular1822" :
													nifType == 3 ? "hdh1822" : nifType == 4 ? "ddn-x25" :
													nifType == 5 ? "rfc877-x25" : nifType == 6 ? "ethernet-csmacd" :
													nifType == 7 ? "iso88023-csmacd" :
													nifType == 8 ? "iso88024-tokenBus" :
													nifType == 9 ? "iso88025-tokenRing" :
													nifType == 10 ? "iso88026-man" : nifType == 11 ? "starLan" :
													nifType == 12 ? "proteon-10Mbit" :
													nifType == 13 ? "proteon-80Mbit" : nifType == 14 ? "hyperchannel" :
													nifType == 15 ? "fddi" : nifType == 16 ? "lapb" :
													nifType == 17 ? "sdlc" : nifType == 18 ? "ds1" :
													nifType == 19 ? "e1" : nifType == 20 ? "basicISDN" :
													nifType == 21 ? "primaryISDN" :
													nifType == 22 ? "propPointToPointSerial" : nifType == 23 ? "ppp" :
													nifType == 24 ? "softwareLoopback" : nifType == 25 ? "eon" :
													nifType == 26 ? "ethernet-3Mbit" : nifType == 27 ? "nsip" :
													nifType == 28 ? "slip" : nifType == 29 ? "ultra" :
													nifType == 30 ? "ds3" : nifType == 31 ? "sip" :
													nifType == 32 ? "frame-relay" : "unknown");
					}

				}
				resultList.clear();

				objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.8");
				objOID.SetOIDType(1);

				nResult = objOID.GetResult(resultList); //得到结果
				if (nResult == 0)
				{
					for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
					{
						itInterfaces = lsInterfaces.find(atoi(resultIt->second.m_szIndex.c_str()));
						if (itInterfaces != lsInterfaces.end())
						{
							unsigned long nifType = (unsigned long) atoi(resultIt->second.m_szValue.c_str());

							itInterfaces->second += "_";
							itInterfaces->second += (nifType == 1 ? "up" : nifType == 2 ? "down" :
														nifType == 3 ? "testing" : "unknown");
						}
					}

					resultList.clear();

					objOID.SetOIDValue("1.3.6.1.2.1.31.1.1.1.1");
					objOID.SetOIDType(1);

					nResult = objOID.GetResult(resultList); //得到结果
					if (nResult == 0)
					{
						for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
						{
							itInterfaces = lsInterfaces.find(atoi(resultIt->second.m_szIndex.c_str()));
							if (itInterfaces != lsInterfaces.end())
							{
								itInterfaces->second += "_";
								itInterfaces->second += resultIt->second.m_szValue;
							}
						}
					}
					else
					{
						ofstream fout("snmperror.log", ios::app);
						fout << "Get 1.3.6.1.2.1.31.1.1.1.1 failed" << "\r\n";
						fout << flush;
						fout.close();
					}
				}
				else
				{
					ofstream fout("snmperror.log", ios::app);
					fout << "Get 1.3.6.1.2.1.2.2.1.8 failed" << "\r\n";
					fout << flush;
					fout.close();
				}
			}
			else
			{
				ofstream fout("snmperror.log", ios::app);
				fout << "Get 1.3.6.1.2.1.2.2.1.3 failed" << "\r\n";
				fout << flush;
				fout.close();
			}
		}
		else
		{
			ofstream fout("snmperror.log", ios::app);
			fout << "Get 1.3.6.1.2.1.2.2.1.2 failed" << "\r\n";
			fout << flush;
			fout.close();
		}
	}
	else
	{
		ofstream fout("snmperror.log", ios::app);
		fout << "Get 1.3.6.1.2.1.2.2.1.1 failed" << "\r\n";
		fout << flush;
		fout.close();
	}

	char *pPosition = pszReturn;
	int nWritten = 0;
	int nLen = 0;
	int nOneLen = 0;
	char tmpchar[50] = { 0 };
	for (itInterfaces = lsInterfaces.begin(); itInterfaces != lsInterfaces.end(); itInterfaces++)
	{
		nLen = pPosition - pszReturn;
		//itoa(itInterfaces->first,tmpchar,49);
		sprintf(tmpchar, "%d", itInterfaces->first);
		//nOneLen = strlen(tmpchar) + itInterfaces->second.size()+2;
		nOneLen = strlen(tmpchar) + strlen(tmpchar) + 2;
		if (nOneLen + nLen > nSize)
		{
			break;
		}

		//nWritten = sprintf(pPosition, "%d=%s", itInterfaces->first, itInterfaces->second.c_str());
		//nWritten = sprintf(pPosition, "%d=%d", itInterfaces->first, itInterfaces->first);
		nWritten = sprintf(pPosition, "%s=%s", itInterfaces->second.c_str(), itInterfaces->second.c_str());
		if (nWritten != -1)
		{
			pPosition += nWritten;
			pPosition[0] = '\0';
			pPosition++;
		}
		else
		{
			break;
		}
	}

	SV_ECC_SNMP_LIB::ReleaseLib();
	return true;
}
//备注:
//在SNMPInterfaceStatus(StringList &paramList, char *szReturn)函数中屏蔽了INTERFACES函数

SNMP_MONITOR_DLL int SNMPListForPro(const char * strParas, char * szReturn, int& nSize)
{
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(szReturn, "error=some parameter is wrong");
		return FALSE;
	}

	/*
	 FILE *stream;
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n\nFunction:SNMPListForPro:\n");
	 map<string, string, less<string> >::iterator Item;
	 for(Item=InputParams.begin();Item!=InputParams.end();Item++)
	 {
	 fprintf(stream,"%s=%s\n",Item->first.c_str(),Item->second.c_str());
	 }
	 fclose(stream);
	 */

	string strIP(""), strCommunity("");
	int nTplID = 0, nPort = 161, nIfIndex = 0, nSnmpVer = 2;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find(SV_TPLID);
	if (paramItem != InputParams.end())
		nTplID = atoi(paramItem->second.c_str());

	//paramItem = InputParams.find(SV_InterfaceIndex);
	//if(paramItem != InputParams.end())
	//    nIfIndex = atoi(paramItem->second.c_str());

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	char chSection[MAX_BUFF_LEN] = { 0 };  //项
	string strIniFilePath("smi.ini");
	sprintf(chSection, "monitor-%d", nTplID);  //Section
	//读取总数
	int nCount = FuncGetProfileIntBy(chSection, "showoid", (char*) strIniFilePath.c_str());
	if (nCount == 0)
	{  //如果OID总数为零
		char szReturn[MAX_BUFF_LEN] = { 0 };
		std::string m_Ret = FuncGetStringFromIDS("SV_SNMP_MONITOR", "SNMP_LIST_PARAM_ERROR");
		sprintf(szReturn, "error=%s(tplmib-%d)$", m_Ret.c_str(), nTplID);
		return FALSE;
	}
	/////////////////////////////////////////////////////////////////////////
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		std::string m_TempBuf = FuncGetStringFromIDS("IDS_InitSNMPFailed");
		sprintf(szReturn, "error=%s", (char*) m_TempBuf.c_str());
		return FALSE;
	}

	StringList lstValues;
	////得到索引
	int bReturn = CheckOIDIndex(lstValues, (char*) strIniFilePath.c_str(), objOID, nTplID);
	if (bReturn != FALSE)
	{
		int nRealValue = FuncGetProfileIntBy(chSection, "index_sure", (char*) strIniFilePath.c_str());

		StringList lstTexts, lsRealValue, lsTemp;
		char chOID[MAX_BUFF_LEN] = { 0 }, key[256] = { 0 }, chFixLable[MAX_BUFF_LEN] = { 0 };
		int nResult = 0, nSubSize = 0, nSubStr = 0;
		string szTemp("");
		MonitorResult resultList;
		resultItem resultIt;
		for (StringList::iterator pos = lstValues.begin(); pos != lstValues.end(); pos++)
		{
			for (int i = 1; i <= nCount; i++)
			{
				sprintf(key, "showoid_substring%d", i);
				nSubStr = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_subsize%d", i);
				nSubSize = GetPrivateProfileInt1(chSection, key, 0, (char*) strIniFilePath.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_fixlable%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				if (szTemp.c_str() != "error")
					strcpy(chFixLable, szTemp.c_str());

				memset(key, 0, 256);
				sprintf(key, "showoid_oid%d", i);
				szTemp = FuncGetProfileStringBy(chSection, key, (char*) strIniFilePath.c_str());
				sprintf(chOID, "%s.%s", szTemp.c_str(), (*pos).c_str());
				objOID.SetOIDValue(chOID);
				objOID.SetOIDType(0);

				resultList.clear();
				nResult = objOID.GetResult(resultList);  //得到结果
				if (nResult == 0)
				{
					resultIt = resultList.begin();
					if (resultIt != resultList.end())
					{
						string szValue(resultIt->second.m_szValue);
						if (strlen(chFixLable) == 0)
						{
							if (nSubStr == 1)
							{
								szValue = szValue.substr(0, nSubSize);
							}
							else if (nSubStr == 2)
							{
								szValue = szValue.substr(nSubSize, szValue.size() - nSubSize);
							}
						}
						else
						{
							szValue = chFixLable;
						}

						lsTemp.push_back(szValue);
						if (nRealValue == i)
							lsRealValue.push_back(szValue);
					}
				}
			}
			MakeLabel(lsTemp, lstTexts, chFixLable, nSubStr, nSubSize);
			lsTemp.clear();
		}

		if (nRealValue > 0)
		{
			lstValues.clear();
			for (StringList::iterator pos = lsRealValue.begin(); pos != lsRealValue.end(); pos++)
				lstValues.push_back(*pos);
		}

		if (lstTexts.size() == lstValues.size())
		{
			int nLen = 0;
			int nOneLen;
			StringList::iterator pos1 = lstValues.begin();
			for (StringList::iterator pos = lstTexts.begin(), pos1 = lstValues.begin();
					pos != lstTexts.end() || pos1 != lstValues.end(); pos++, pos1++)
			{
				nOneLen = static_cast<int>((*pos1).length()) + (static_cast<int>((*pos).length()) + 2);
				if (nOneLen + nLen > nSize)
					break;

				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += static_cast<int>((*pos).length());
				memcpy(szReturn + nLen, "=", 1);
				nLen++;
				memcpy(szReturn + nLen, (*pos).c_str(), (*pos).length());
				nLen += (static_cast<int>((*pos).length()) + 1);

			}
			nSize = nLen;
		}
		else
		{
			bReturn = FALSE;
		}
	}
	SV_ECC_SNMP_LIB::ReleaseLib();

	/////////////////////////////////////////////////////////////////////////
	return bReturn;
}

SNMP_MONITOR_DLL bool INTERFACESTest(const char * strParas, char *strReturn, int & nSize)
{
	//const char szInPut[1024]=_T("_Community=public1\0_MachineName=192.168.0.251\0_Port=161\0Version=2\0_MonitorID=1.22.7.67\0\0");
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(strReturn, "error=some parameter is wrong");
		return false;
	}

	/*
	 FILE *stream;
	 stream = fopen( "finputdata.txt", "a+" );
	 fprintf(stream,"\n\nFunction:INTERFACES:\n");
	 map<string, string, less<string> >::iterator Item;
	 for(Item=InputParams.begin();Item!=InputParams.end();Item++)
	 {
	 fprintf(stream,"%s=%s\n",Item->first.c_str(),Item->second.c_str());
	 }
	 fclose(stream);
	 */
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;
	cout << "===================" << endl;

	string strIP(""), strCommunity("");
	int nPort = 161, nSnmpVer = 1;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(strReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	///////////////////////////////////////////////////////////////////////// 
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		std::string m_TempBuf = FuncGetStringFromIDS("IDS_InitSNMPFailed");
		sprintf(strReturn, "error=%s", (char*) m_TempBuf.c_str());
		ofstream fout("snmperror.log", ios::app);
		fout << strReturn << "\r\n";
		fout << flush;
		fout.close();
		return false;
	}

	objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.1");
	objOID.SetOIDType(1);

	MonitorResult resultList;
	map<int, string, less<int> > lsInterfaces;
	map<int, string, less<int> >::iterator itInterfaces;
	resultList.clear();
	int nResult = objOID.GetResult(resultList); //得到结果
	if (nResult == 0)
	{
		resultItem resultIt;
		for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
		{

			lsInterfaces[atoi(resultIt->second.m_szIndex.c_str())] = resultIt->second.m_szValue;

		}

		resultList.clear();

		objOID.SetOIDValue("1.3.6.1.2.1.2.2.1.2");
		objOID.SetOIDType(1);

		nResult = objOID.GetResult(resultList); //得到结果
		if (nResult == 0)
		{
			for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
			{
				itInterfaces = lsInterfaces.find(atoi(resultIt->second.m_szIndex.c_str()));
				if (itInterfaces != lsInterfaces.end())
				{
					itInterfaces->second = resultIt->second.m_szValue;

				}
			}

			resultList.clear();

		}
		else
		{
			ofstream fout("snmperror.log", ios::app);
			fout << "Get 1.3.6.1.2.1.2.2.1.2 failed" << "\r\n";
			fout << flush;
			fout.close();
		}
	}
	else
	{
		ofstream fout("snmperror.log", ios::app);
		fout << "Get 1.3.6.1.2.1.2.2.1.1 failed" << "\r\n";
		fout << flush;
		fout.close();
	}

	char *pPosition = strReturn;
	int nWritten = 0;
	int nLen = 0;
	int nOneLen = 0;
	char tmpchar[50] = { 0 };
	for (itInterfaces = lsInterfaces.begin(); itInterfaces != lsInterfaces.end(); itInterfaces++)
	{
		nLen = pPosition - strReturn;
		//itoa(itInterfaces->first,tmpchar,49);
		sprintf(tmpchar, "%d", itInterfaces->first);
		//nOneLen = strlen(tmpchar) + itInterfaces->second.size()+2;
		nOneLen = strlen(tmpchar) + strlen(tmpchar) + 2;
		if (nOneLen + nLen > nSize)
		{
			break;
		}

		//nWritten = sprintf(pPosition, "%d=%s", itInterfaces->first, itInterfaces->second.c_str());
		//nWritten = sprintf(pPosition, "%d=%d", itInterfaces->first, itInterfaces->first);
		nWritten = sprintf(pPosition, "%s=%s", itInterfaces->second.c_str(), itInterfaces->second.c_str());
		if (nWritten != -1)
		{
			pPosition += nWritten;
			pPosition[0] = '\0';
			pPosition++;

		}
		else
		{
			break;
		}
	}
	//sprintf(strReturn,"Size=%d\0\0",strlen(strReturn));

	SV_ECC_SNMP_LIB::ReleaseLib();
	return true;
}

//yi.duan 2011-09-14 HDS监测器
//ams2500
//dfRegressionStatus	1.3.6.1.4.1.116.5.11.1.2.2.1
//
//dfRegressionStatus OBJECT-TYPE
//SYNTAX    INTEGER
//ACCESS    read-only
//STATUS    mandatory
//DESCRIPTION
//"A value of regression status.
//
//Bit          Comment
//0           drive status.
//1           spare drive status.
//2           data drive status.
//3           ENC status.
//4-5         not used,always 0.
//6           warning status.
//7           Other controller status.
//8           UPS status.
//9           loop status.
//10          path status.
//11          NAS Server status.
//12          NAS Path status.
//13          NAS UPS status.
//14-15       not used,always 0.
//16          battery status.
//17          power supply status.
//18          AC status.
//19          BK status.
//20          fan status.
//21          additional battery status.
//22-23       not used,always 0.
//24          cache memory status.
//25          SATA spare drive status.
//26          SATA data drive status.
//27          SENC status.
//28          HostConnector status.
//29          NNC status.
//30          I/F board status.
//31          not used,always 0.
//
//When the status is normal,each bit value
//is 0. When the status is abnormal,each bit 
//value is 1.
//"

//int 装换为2进制字符串返回
string int_to_bit(int a)
{
	int i;
	int n = sizeof(int) * CHAR_BIT;
	int mask = 1 << (n - 1);
	string strBinary("");

	for (i = 1; i <= n; ++i)
	{
		if (((a & mask) == 0))
		{
			strBinary += "0";
		}
		else
		{
			strBinary += "1";
		}
		a <<= 1;
		if (i % CHAR_BIT == 0 && i < n)
		{
			strBinary += " ";
		}
	}
	return strBinary;
}

//获取变量num中的index位 0或1
int get_bit(int num, int index)
{
	return (num >> (index - 1)) & 0x00000001;
}

SNMP_MONITOR_DLL bool SnmpHDS(const char * strParas, char *strReturn, int & nSize)
{

	//const char szInPut[1024]=_T("_Community=public1\0_MachineName=192.168.0.251\0_Port=161\0Version=2\0_MonitorID=1.22.7.67\0\0");
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(strReturn, "error=some parameter is wrong");
		return false;
	}

	string strIP(""), strCommunity(""), strHDSDevice("");
	//string strOid = "1.3.6.1.4.1.116.5.11.1.2.2.1";
	string strOid = "1.3.6.1.2.1.1.7"; //for test
	int nPort = 161, nSnmpVer = 1;

	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Community);
	if (paramItem != InputParams.end())
		strCommunity = paramItem->second;

	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	paramItem = InputParams.find(SV_Port);
	if (paramItem != InputParams.end())
	{
		nPort = atoi(paramItem->second.c_str());
		if (nPort <= 0)
			nPort = 161;
	}

	paramItem = InputParams.find(SV_SNMPVersion);
	if (paramItem != InputParams.end())
	{
		nSnmpVer = atoi(paramItem->second.c_str());
		if (nSnmpVer <= 0)
			nSnmpVer = 2;
	}

	paramItem = InputParams.find("_HDSRegressionStatus");
	if (paramItem != InputParams.end())
	{
		strHDSDevice = paramItem->second;
		printf("strHDSDevice=%s\n", strHDSDevice.c_str());
	}

	if (strIP.empty())
	{
		printf("error=IP empty");
		return FALSE;
	}

	///////////////////////////////////////////////////////////////////////// 
	SV_ECC_SNMP_LIB::InitLib();
	//BasicSNMP objSnmp;
	CSVSnmpOID objOID;
	objOID.SetIPAddress((char*) strIP.c_str());
	objOID.SetCommunity((char*) strCommunity.c_str());
	objOID.SetNetworkPort(nPort);
	objOID.SetVersion(nSnmpVer);

	if (objOID.InitSNMP() != 0)
	{
		ofstream fout("snmperror.log", ios::app);
		fout << strReturn << "\r\n";
		fout << flush;
		fout.close();
		return false;
	}

	objOID.SetOIDValue(strOid.c_str());
	//objOID.SetOIDValue("1.3.6.1.2.1.1");
	//objOID.SetOIDValue("1.3.6.1.2.1.25.3.2");

	objOID.SetOIDType(1);

	MonitorResult resultList;
	map<int, string, less<int> > lsInterfaces;
	map<int, string, less<int> >::iterator itInterfaces;
	resultList.clear();
	int nResult = objOID.GetResult(resultList);	//得到结果
	if (nResult == 0)
	{
		resultItem resultIt;
		for (resultIt = resultList.begin(); resultIt != resultList.end(); resultIt++)
		{
			lsInterfaces[atoi(resultIt->second.m_szIndex.c_str())] = resultIt->second.m_szValue;
			//	percentFull根据strHDSDevice的前2位获取其32位中的位置, 再换算成0或者1
			int iHDS = atoi((strHDSDevice.substr(0, 2)).c_str());
			printf("iHDS:%d\n", iHDS);

			sprintf(strReturn, "percentFull=%d$totalStatus=%s$",
					get_bit(atoi((resultIt->second.m_szValue).c_str()), iHDS + 1),
					(int_to_bit(atoi((resultIt->second.m_szValue).c_str()))).c_str());

			printf("result:%s\n", (resultIt->second.m_szValue).c_str());

		}
		resultList.clear();
	}
	else
	{
		printf("error");
		sprintf(strReturn, "error");
	}

	MakeCharByString(strReturn, nSize, strReturn);

	printf("strReturn=%s\n", strReturn);
	SV_ECC_SNMP_LIB::ReleaseLib();
	return true;
}

SNMP_MONITOR_DLL int SnmpHDSList(const char * strParas, char * szReturn, int& nSize)
{
	map<string, string, less<string> > InputParams;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(szReturn, "error=some parameter is wrong");
		return FALSE;
	}

	string strIP("");
	map<string, string, less<string> >::iterator paramItem;
	paramItem = InputParams.find(SV_Host);
	if (paramItem != InputParams.end())
		strIP = paramItem->second;

	if (strIP.empty())
	{
		std::string m_Ret = FuncGetStringFromIDS("SV_NETWORK_SET", "NETWORK_SET_IP_ADDRESS_NULL");
		sprintf(szReturn, "error=%s", (char*) m_Ret.c_str());
		return FALSE;
	}

	const char *k[] = { "00 drive status.", "01 spare drive status.", "02 data drive status.", "03 ENC status.",
			"04 not used,always 0.", "05 not used,always 0.", "06 warning status.", "07 Other controller status.",
			"08 UPS status.", "09 loop status.", "10 path status.", "11 NAS Server status.", "12 NAS Path status.",
			"13 NAS UPS status.", "14 not used,always 0.", "15 not used,always 0.", "16 battery status.",
			"17 power supply status.", "18 AC status.", "19 BK status.", "20 fan status.",
			"21 additional battery status.", "22 not used,always 0.", "23 not used,always 0.",
			"24 cache memory status.", "25 SATA spare drive status.", "26 SATA data drive status.", "27 SENC status.",
			"28 HostConnector status.", "29 NNC status.", "30 I/F board status.", "31 not used,always 0." };

	char *p = szReturn;
	for (int i = 0; i < 32; i++)
	{
		//printf("line=%s\n", k[i]);
		sprintf(p, "%s=%s", k[i], k[i]);
		p += 2 * strlen(k[i]) + 2;
	}
	/*
	 if(gRoot_path == "")
	 gRoot_path =FuncGetInstallPath();
	 //gRoot_path = "D:\\SiteView\\SiteView ECC";  //zjw

	 char szPath[1024]={0};
	 sprintf(szPath,"%s/data/tmpinifile/FDSList.ini",gRoot_path.c_str());

	 FILE *fp = NULL;
	 if ((fp = fopen(szPath,"r"))==NULL)
	 {
	 sprintf(szReturn, "open FDSlist error");
	 return false;
	 }

	 char  *p = szReturn;

	 char line[256] = {0};
	 while( fgets(line,sizeof(line),fp) !=NULL )
	 {
	 printf("line=%s\n", line);
	 sprintf(p,"%s=%s",line,line);
	 p+= 2* strlen(line)+2;
	 }
	 fclose(fp);
	 */
	return TRUE;
}

