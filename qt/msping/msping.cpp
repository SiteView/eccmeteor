// msping.cpp : Defines the initialization routines for the DLL.
//

#include "Ping.h"
#include <fstream>
#include <iostream>

#include <cc++/thread.h>
#include <svtime.h>
#include <addon.h>

using namespace std;

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

#ifdef WIN32
class CMspingApp : public CWinApp
{
public:
	CMspingApp();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CMspingApp)
	//}}AFX_VIRTUAL

	//{{AFX_MSG(CMspingApp)
	// NOTE - the ClassWizard will add and remove member functions here.
	//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

BEGIN_MESSAGE_MAP(CMspingApp, CWinApp)
//{{AFX_MSG_MAP(CMspingApp)
// NOTE - the ClassWizard will add and remove mapping macros here.
//    DO NOT EDIT what you see in these blocks of generated code!
//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CMspingApp construction

CMspingApp::CMspingApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}

int WSA_Init();
void WSA_Free();

CMspingApp theApp;

#endif

int PrintLog(const char * strInfo)
{
	return 0;

	ofstream FileStream;
	FileStream.open("PingMonitor.log", ios::app);
	FileStream << svutil::TTime::GetCurrentTimeEx().Format().c_str() << "\t" << strInfo << endl;
	FileStream.close();
	return 0;
}

string GetResourceValue(const string rkey)
{
	string rvalue = "";
	OBJECT obj = LoadResourceByKeys(rkey);
	if (obj == INVALID_VALUE)
		return rvalue;

	MAPNODE ma = GetResourceNode(obj);
	if (ma == INVALID_VALUE)
	{
		CloseResource(obj);
		return rvalue;
	}

	FindNodeValue(ma, rkey, rvalue);
	CloseResource(obj);
	return rvalue;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
string FuncGetStringFromIDS(const char * szIDS)
{
	return GetResourceValue(szIDS);
}

string FuncGetStringFromIDS(const char* szSection, const char * szIDS)
{
	return GetResourceValue(szIDS);
}

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

DLL int PING(const char * strParas, char * szReturn, int& nSize)
{
#ifdef WIN32
	AFX_MANAGE_STATE (AfxGetStaticModuleState());
#endif

	map<string, string, less<string> > InputParams;
	map<string, string, less<string> >::iterator paramItem;
	if (!splitparam(strParas, InputParams))
	{
		nSize = sprintf(szReturn, "error=parameter is wrong");
		return FALSE;
	}

//	printf("--- msping parameter:\n");
//	map<string, string, less<string> >::iterator Item;
//	for (Item = InputParams.begin(); Item != InputParams.end(); Item++)
//	{
//		printf("%s=%s\n", Item->first.c_str(), Item->second.c_str());
//	}

	string strHost;
	int nTimeout = 5000, nBytes = 64, nSendNums = 6;

	paramItem = InputParams.find(__MACHINENAME__);
	if (paramItem != InputParams.end())
		strHost = paramItem->second;

	paramItem = InputParams.find(__TIMEOUT__);
	if (paramItem != InputParams.end())
		nTimeout = atoi(paramItem->second.c_str());

	paramItem = InputParams.find(__SENDNUMS__);
	if (paramItem != InputParams.end())
		nSendNums = atoi(paramItem->second.c_str());

	paramItem = InputParams.find(__SENDBYTES__);
	if (paramItem != InputParams.end())
		nBytes = atoi(paramItem->second.c_str());
	if (nBytes > 256)
		nBytes = 256;

	if (strHost.empty())
	{
		sprintf(szReturn, "error=%s", FuncGetStringFromIDS("SV_PING", "PING_IP_ADDRESS_NULL").c_str());	//<%IDS_Monitor_93%>"缺少主机名或IP地址"
		return FALSE;
	}
	if (nTimeout <= 0)
	{
		sprintf(szReturn, "error=%s", FuncGetStringFromIDS("SV_PING", "PING_TIMEOUT_VALUE_ERROR").c_str());	//<%IDS_Monitor_94%>"输入超时错误"
		return FALSE;
	}
	if (nBytes <= 0 || nBytes > 256)
	{
		sprintf(szReturn, "error=%s", FuncGetStringFromIDS("SV_PING", "PING_INPUT_BYTE_ERROR").c_str());//<%IDS_Monitor_95%>"输入字节大小错误"
		return FALSE;
	}
#ifdef WIN32
	if (WSA_Init())
	{
		sprintf(szReturn, "error=%s", FuncGetStringFromIDS("SV_BASIC", "BASIC_WSA_INIT_FAILED").c_str());//<%IDS_Monitor_96%>"通信初始化错误"
		return FALSE;
	}
#endif

//	nTimeout =2000;
//	nBytes =32;
	int bResult;

#ifndef WIN32
	ost::Mutex ping_mutex;
	{
		ost::MutexLock lock(ping_mutex);
#endif

		bResult = PING_MONITOR(strHost.c_str(), nTimeout, nBytes, nSendNums, szReturn, nSize);

#ifndef WIN32
	}
#endif

#ifdef WIN32
	WSA_Free();
#endif

	return bResult;
}

DLL int PINGHOST(const char * strParas, char * szReturn, int& nSize)
{
	return PING(strParas, szReturn, nSize);
}
