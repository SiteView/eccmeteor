#include "WorkThread.h"
#include "Entitys.h"
#include "WorkControl.h"
#include "MakeRecord.h"
#include <svdbapi.h>

#ifndef WIN32
#include <dlfcn.h>
#else
//#include <windows.h>
#include <objbase.h>
#include <excpt.h>
#endif

extern SUtil *putil;
extern CString g_strRootPath;

extern std::string g_RefreshQueueName;
extern std::string g_QueueAddr;
extern string g_ServerHost;

WorkThread::WorkThread() :
		ThreadEx()
{
	SetThreadName("Work thread");
	InitData();

}

WorkThread::~WorkThread()
{
}

void WorkThread::run()
{
	//DWORD dret;
	CString strError = "";
	InitData();

#ifdef WIN32
	if(FAILED(::CoInitialize(NULL)))
	{
		strError.Format("CoInitialize failed when create thread:%s",this->GetThreadName());
		putil->ErrorLog((LPCSTR)strError);
		return;
	}

#endif

//	printf("In Thread :%s\n", this->GetThreadName());

	try
	{

		while (TRUE)
		{
			if (!m_Event.wait())
			{
				strError = "WorkThread wait failed";
				throw MSException((LPCSTR) strError);
			}

			if (m_Monitor == NULL)
			{
				m_Event.reset();
				m_pWorkControl->AddToIdleThread(this);
				continue;
			}

			if (!InitSocket())
				throw MSException("Init socket failed");

			m_nRunCount = 0;
			m_StartTime = CTime::GetCurrentTimeEx();

			try
			{
				RunMonitor();
			} catch (MSException &e)
			{
				if (m_Monitor != NULL)
				{
					m_Monitor->SetSkipCount(m_Monitor->GetSkipCount() + 1);
					char errlog[2048] = { 0 };
					sprintf(errlog, "=== %s,%s,MonitorID:%s, SkipCount:%d. ", this->GetThreadName(), e.GetDescription(),
							m_Monitor->GetMonitorID(), m_Monitor->GetSkipCount());
					string strex = e.GetDescription();
					if ( strex.find("dlopen library failed")==std::string::npos)
						putil->ErrorLog(errlog);
					else
						printf("%s\n", errlog);
				}
			} catch (...)
			{
				if (m_Monitor != NULL)
				{
					m_Monitor->SetSkipCount(m_Monitor->GetSkipCount() + 1);
					char errlog[2048] = { 0 };
					sprintf(errlog, "=== Run monitor exception,MonitorID:%s, SkipCount:%d. ", m_Monitor->GetMonitorID(),
							m_Monitor->GetSkipCount());
					putil->ErrorLog(errlog);
				}
			}
			if (m_Monitor != NULL)
			{
				int oldstate = m_Monitor->GetLastState();
				if (oldstate != m_MonitorState)
				{
					if ((m_MonitorState == Monitors::STATUS_ERROR) || (m_MonitorState == Monitors::STATUS_BAD))
						m_Monitor->CalculateErrorFrequency(true);
					else if ((oldstate == Monitors::STATUS_ERROR) || (oldstate == Monitors::STATUS_BAD))
						m_Monitor->CalculateErrorFrequency(false);

				}
				m_Monitor->SetLastState(m_MonitorState);

				m_pWorkControl->AdjustActiveMonitorCount(m_Monitor, FALSE);

				m_Monitor->SetRunning(FALSE);
			}

			Monitors *pMonitor = m_Monitor;
			InitData();
			m_Event.reset();
			m_pWorkControl->AddToIdleThread(this);
			m_pWorkControl->CheckTaskQueueByMonitor(pMonitor);
		}
	} catch (...)
	{
		char errlog[2048] = { 0 };
		sprintf(errlog, "Thread  exit by exception, thread:%s", this->GetThreadName());

		putil->ErrorLog(errlog);
		return;

	}

#ifdef WIN32

	::CoUninitialize();
#endif

}

void WorkThread::RunMonitor()
{
	m_nRunCount++;

	CString strError = "";

	if (m_Monitor == NULL)
		throw MSException("Monitors is NULL");

	char strDLLName[1024] = { 0 };
	char strFuncName[1024] = { 0 };

	if (m_pWorkControl->m_pOption->m_isDemo)
	{
		sprintf(strDLLName, "%s/fcgi-bin/%s", g_strRootPath.getText(), m_pWorkControl->m_pOption->m_DemoDLL.c_str());
		strcpy(strFuncName, m_pWorkControl->m_pOption->m_DemoFunction.c_str());
		CString test;
		test.Format("%s/fcgi-bin/%s", g_strRootPath.getText(), m_pWorkControl->m_pOption->m_DemoDLL.c_str());
		printf("=== Demo mode,Library:%s, Function:%s ===\n", test.getText(), strFuncName);
	}
	else
	{
		sprintf(strDLLName, "%s/fcgi-bin/%s", g_strRootPath.getText(), m_Monitor->GetLibrary().getText());
		strcpy(strFuncName, m_Monitor->GetProcess().c_str());
	}

	if (strlen(strFuncName) == 0)
	{
		throw MSException("RunMonitor-Function name is empty");
	}

	if (m_Monitor->m_isRefresh)
	{
		printf("--- Load Library:%s, Function:%s ---\n", strDLLName, strFuncName);
		printf("-----------------Input parameter----------------------\n");

		CStringList&lst = m_Monitor->GetParameterList();
		for (CStringList::iterator it = lst.begin(); it != lst.end(); it++)
			printf("%s\n", (*it).c_str());

		printf("----------------End input parameter-------------------\n");
	}
	printf("--- to run monitor:%s ,Load Library:%s, Function:%s ---\n", m_Monitor->GetMonitorID(), strDLLName, strFuncName);

	int iLen = MakeInBuf();
	int buflen = RETBUFCOUNT;

#ifdef	WIN32

	HMODULE hm=::LoadLibrary(strDLLName);
	if(!hm)
	{
		strError.Format("RunMonitor-Load library failed,DLL name:%s, error:%d",strDLLName, GetLastError());
		throw MSException((LPCSTR)strError);
	}

	LPFUNC pfunc = (LPFUNC)GetProcAddress(hm,strFuncName);
	if(!pfunc)
	{
		::FreeLibrary(hm);
		throw MSException("RunMonitor-GetProcAddress failed");

	}
	try
	{
		if(m_pWorkControl->m_pOption->m_isDemo)
		{
			MutexLock lock(m_pWorkControl->m_DemoDllMutex);
//			puts("===== call demo function ... ======\n");
			(*pfunc)(m_InBuf,m_RetBuf,buflen);
		}
		else
		(*pfunc)(m_InBuf,m_RetBuf,buflen);
	}
	catch(MSException &e)
	{
		//	putil->ErrorLog(strError);
		::FreeLibrary(hm);
		throw MSException(e.GetDescription());
	}
	catch(...)
	{
		::FreeLibrary(hm);
		throw MSException("RunMonitor happened exception_2");
	}

	::FreeLibrary(hm);
#else
	void *dp;
	char *error;

	dp = dlopen(strDLLName, RTLD_LAZY);

	if (dp == NULL)
	{
		error = dlerror();
		strError.Format("dlopen library failed,DLL name:%s,Error:%s", strDLLName, error);
		throw MSException((LPCSTR) strError);
	}
//	bool (*pfunc)(const char *, char *, int &);
//	pfunc = (bool (*)(const char *, char *, int &)) dlsym(dp, strFuncName);
	LPFUNC pfunc = (LPFUNC) dlsym(dp, strFuncName);

	error = dlerror();
	if (error != NULL)
	{
		dlclose(dp);
		strError.Format("dlsym(GetProcAddress) failed,DLL name:%s,Error:%s", strDLLName, error);
		throw MSException((LPCSTR) strError);
	}

	try
	{
//		CStringList&lstParam = m_Monitor->GetParameterList();
//
//		CStringList::const_iterator it;
//		it = lstParam.begin();
//		while (it != lstParam.end())
//		{
//			cout << it->c_str() << endl;
//			*it++;
//		}
//
//		(*pGetData)(lstParam, m_RetBuf);

		if (m_pWorkControl->m_pOption->m_isDemo)
		{
			MutexLock lock(m_pWorkControl->m_DemoDllMutex);
			(*pfunc)(m_InBuf, m_RetBuf, buflen);
		}
		else
			(*pfunc)(m_InBuf, m_RetBuf, buflen);

	} catch (...)
	{
		dlclose(dp);
		throw MSException("RunMonitor happened exception_3");
	}
	dlclose(dp);

#endif

	try
	{
		PaserResultV70(buflen);
	} catch (...)
	{
		m_MonitorState = Monitors::STATUS_BAD;
		printf(".....%s.....\n", (char *) m_strDisplay);
		m_strDisplay = "Error:Parse result error";

		AppendResultV70();
		return;
	}

	try
	{
		ParserMonitorState();
	} catch (...)
	{
		m_MonitorState = Monitors::STATUS_BAD;
		printf(".....%s.....\n", (char *) m_strDisplay);
		m_strDisplay = "Error:Set state error";

		AppendResultV70();
		return;
	}
	if (m_MonitorState == Monitors::STATUS_BAD)
	{
		if ((m_Monitor->GetCheckError()) && (m_nRunCount < 2))
		{
			try
			{
				printf("=== to check error, MonitorID:%s  \n", m_Monitor->GetMonitorID());
				ClearResult();
				RunMonitor();
			} catch (MSException &e)
			{
				if (m_Monitor != NULL)
				{
					char errlog[2048] = { 0 };
					sprintf(errlog, "=== %s,%s,MonitorID:%s", this->GetThreadName(), e.GetDescription(),
							m_Monitor->GetMonitorID());
					putil->ErrorLog(errlog);
				}
			} catch (...)
			{
				if (m_Monitor != NULL)
				{
					char errlog[2048] = { 0 };
					sprintf(errlog, "=== Run monitor exception,MonitorID:%s  ", m_Monitor->GetMonitorID());
					putil->ErrorLog(errlog);
				}
			}
			return;
		}
	}

	AppendResultV70();
	m_Monitor->SetSkipCount(0);
}

int WorkThread::MakeInBuf()
{
	CStringList&lstParam = m_Monitor->GetParameterList();

	CStringList::iterator it;
	int len = 0;
	for (it = lstParam.begin(); it != lstParam.end(); it++)
	{
		len += (*it).size() + 1;
	}
	len++;

	if (!m_InBuf.checksize(len))
	{
		throw MSException("Malloc memmory failed for inbuf");
		return 0;
	}

	char *pt = m_InBuf;
	for (it = lstParam.begin(); it != lstParam.end(); it++)
	{
		strcpy(pt, (*it).c_str());
		pt += (*it).size() + 1;
	}
	return len;
}

void WorkThread::InitData()
{
	m_Monitor = NULL;
	memset(m_RetBuf, 0, RETBUFCOUNT);
	m_InBuf.zerobuf();
	m_RetValueCount = 0;
	m_MonitorState = Monitors::STATUS_NULL;
	m_nRunCount = 0;
	m_strDisplay.clear();
	m_strDisplay.clear();
	CReturnValueList::iterator it;
	for (it = m_RetValueList.begin(); it != m_RetValueList.end(); it++)
		delete *it;
	m_RetValueList.clear();

	for (int i = 0; i < retcount; i++)
	{
		m_RetValues[i].Clear();
	}

}
BOOL WorkThread::PaserResultV70(int datalen)
{
	m_RVmap.clear();

//	puts("\n------------------------PaserResult-----------------------");
	if (!BulidStringMap(m_RVmap, m_RetBuf, datalen))
	{
		throw MSException("Build return data failed");
		return false;
	}

	if (m_Monitor->m_isRefresh)
	{
		printf("\n------------------------Return value-----------------------\n");

		STRINGMAP::iterator itm;
		while (m_RVmap.findnext(itm))
			printf("%s=%s\n", (*itm).getkey().getword(), (*itm).getvalue().getword());

		printf("-------------------------End return value--------------------\n");
	}

	if (m_RVmap.size() == 0)
	{
		m_MonitorState = Monitors::STATUS_BAD;
		throw MSException("Return value is empty");
	}

	svutil::word *pv = m_RVmap.find("error");
	if (pv != NULL)
	{
		m_MonitorState = Monitors::STATUS_BAD;
		m_strDisplay = pv->getword();
		return true;

	}

	CReturnDataList &LstRet = m_Monitor->GetReutrnList();
	m_RetValueCount = (int) LstRet.size();

	ReturnValue*prv = NULL;
	BOOL bv = m_RetValueCount > retcount;
	CString strDisplay = "";

	int n = 0;
	ReturnData*prd = NULL;
	CReturnDataList::iterator it;
	svutil::word *pvalue = NULL;

	for (it = LstRet.begin(); it != LstRet.end(); it++)
	{
		prd = (*it);
		if (bv)
			prv = new ReturnValue;
		else
			prv = m_RetValues + n;

		prv->m_pReturnData = prd;

		pvalue = m_RVmap.find((LPCSTR) prd->m_Name);
		if (pvalue == NULL)
		{
			printf("name :%s\n", (LPCSTR) prd->m_Name);
			throw MSException("ParserResult return value is bad, it's name: " + prd->m_Name);
		}

		if (stricmp(prd->m_Type,"Int") == 0)
		{
			prv->m_value.nVal = atoi(pvalue->getword());

			strDisplay.Format("%s=%d, ", (char *) prd->m_Label, prv->m_value.nVal);
		}
		else if (stricmp(prd->m_Type,"Float") == 0)
		{
			prv->m_value.fVal = atof(pvalue->getword());
			strDisplay.Format("%s=%0.2f, ", (char *) prd->m_Label, prv->m_value.fVal);
		}
		else if (stricmp(prd->m_Type,"String") == 0)
		{
			if (strlen(pvalue->getword()) > RETVALUEMAXCOUNT - 1)
				throw MSException("Return string value too big");
			strcpy(prv->m_value.szVal, pvalue->getword());
			strDisplay.Format("%s=%s, ", (char *) prd->m_Label, prv->m_value.szVal);
		}
		else
		{
			if (bv)
				delete prv;
			throw MSException("ParserResult error, unknown type name");
		}
		if (bv)
			m_RetValueList.push_back(prv);

		n++;

		m_strDisplay += strDisplay;

	}

	return TRUE;

}

BOOL WorkThread::GetProperty(const char *szProperty, const CString strSource, CString &strRet)
{
	BOOL bRet = FALSE;

	CString strTemp;
	strTemp = strSource;

	int nLeftIndex = strTemp.Find(szProperty, 0);
	if (nLeftIndex == -1)
		return bRet;

	int nRightIndex = strTemp.Find("$", nLeftIndex);
	if (nRightIndex == -1)
		return bRet;

	int nLength = strlen(szProperty);

	CString str = strTemp.Mid(nLeftIndex + nLength, nRightIndex - nLeftIndex - nLength);
	strRet = str;

	bRet = TRUE;
	return bRet;

}

BOOL WorkThread::GetProperty(const char *szProperty, const CString strSource, char *psret)
{
	BOOL bRet = FALSE;
	CString strTemp;
	strTemp = strSource;

	int nLeftIndex = strTemp.Find(szProperty, 0);
	if (nLeftIndex == -1)
		return bRet;

	int nRightIndex = strTemp.Find("$", nLeftIndex);
	if (nRightIndex == -1)
		return bRet;

	int nLength = (int) strlen(szProperty);

	CString str = strTemp.Mid(nLeftIndex + nLength, nRightIndex - nLeftIndex - nLength);
	int size = str.GetLength();
	size = (size >= RETVALUEMAXCOUNT) ? RETVALUEMAXCOUNT - 1 : size;
	str = str.Left(size);
	sprintf(psret, "%s", str.GetBuffer(size));

	bRet = TRUE;
	return bRet;

}

BOOL WorkThread::GetProperty(const char *szProperty, const CString strSource, float &fRet)
{
	BOOL bRet = FALSE;

	CString strTemp;
	strTemp = strSource;

	int nLeftIndex = strTemp.Find(szProperty, 0);
	if (nLeftIndex == -1)
		return bRet;

	int nRightIndex = strTemp.Find("$", nLeftIndex);
	if (nRightIndex == -1)
		return bRet;

	int nLength = (int) strlen(szProperty);

	CString str = strTemp.Mid(nLeftIndex + nLength, nRightIndex - nLeftIndex - nLength);
	fRet = atof(str);

	bRet = TRUE;
	return bRet;

}

BOOL WorkThread::GetProperty(const char *szProperty, const CString strSource, int &nRet)
{
	BOOL bRet = FALSE;

	CString strTemp;
	strTemp = strSource;

	int nLeftIndex = strTemp.Find(szProperty, 0);
	if (nLeftIndex == -1)
		return bRet;

	int nRightIndex = strTemp.Find("$", nLeftIndex);
	if (nRightIndex == -1)
		return bRet;

	int nLength = (int) strlen(szProperty);

	CString str = strTemp.Mid(nLeftIndex + nLength, nRightIndex - nLeftIndex - nLength);
	nRet = atoi((LPCTSTR) str);

	bRet = TRUE;
	return bRet;

}

void WorkThread::ParserMonitorState()
{
	if (m_MonitorState == Monitors::STATUS_BAD)
		return;

	if (CheckStateByType(Error))
	{
		m_MonitorState = Monitors::STATUS_ERROR;
		return;
	}
	else if (CheckStateByType(Warning))
	{
		m_MonitorState = Monitors::STATUS_WARNING;
		return;
	}
	else if (CheckStateByType(Normal))
	{
		m_MonitorState = Monitors::STATUS_OK;
		return;
	}
	else
	{
		m_MonitorState = Monitors::STATUS_BAD;
		puts("No state be match");
		throw MSException("Parser monitor state error");
	}

}

BOOL WorkThread::CheckStateByType(int Type)
{
	if (m_MonitorState == Monitors::STATUS_ERROR)
	{
		if (Type == Error)
			return TRUE;
		else
			return FALSE;
	}

	BOOL bRet = FALSE;
	CString strTemp = "";

	StateCondition **PSC = m_Monitor->GetStateCondition();

	StateCondition *pSt = NULL;
	for (int i = 0; i < 3; i++)
	{
		if (PSC[i]->m_Type == Type)
		{
			pSt = PSC[i];
			break;
		}
	}

	if (pSt == NULL)
		return FALSE;

	CStringList lstOperator, lstID;
	int nret = ParserExpression(pSt->m_Expression, lstOperator, lstID);
	if (nret < 0)
		return FALSE;

	if (nret == 0)
	{
//		strTemp=lstID.RemoveTail();
		strTemp = lstID.back();
		lstID.pop_back();
		if (strTemp.empty())
		{
			SUtil::FreeStringList(lstOperator);
			SUtil::FreeStringList(lstID);
			return FALSE;
		}
		SUtil::FreeStringList(lstOperator);
		SUtil::FreeStringList(lstID);
		return CheckSingleItemState(pSt, strTemp.getValue());
	}

	if (nret > 0)
	{
		BOOL bTem = FALSE;
		BOOL bLast = FALSE;
		CStringList::iterator it, it2;

		it = lstID.begin();
		it2 = lstOperator.begin();

		if (it != lstID.end())
		{
			strTemp = *it++;
			bRet = CheckSingleItemState(pSt, atoi(strTemp.GetBuffer(strTemp.GetLength())));
			if (it != lstID.end())
			{
				strTemp = *it++;
				bTem = CheckSingleItemState(pSt, atoi(strTemp.GetBuffer(strTemp.GetLength())));
				if (it2 != lstOperator.end())
				{
					strTemp = *it2++;
					if (strTemp.CompareNoCase("or") == 0)
						bLast = bTem || bRet;
					else if (strTemp.CompareNoCase("and") == 0)
						bLast = bTem && bRet;
					else
						bLast = FALSE;
				}
				else
				{
					SUtil::FreeStringList(lstOperator);
					SUtil::FreeStringList(lstID);
					return FALSE;
				}
			}
			else
			{

				SUtil::FreeStringList(lstOperator);
				SUtil::FreeStringList(lstID);
				return FALSE;
			}

			while (it != lstID.end())
			{
				strTemp = *it++;
				bTem = CheckSingleItemState(pSt, atoi(strTemp.GetBuffer(strTemp.GetLength())));
				if (it2 == lstOperator.end())
				{
					SUtil::FreeStringList(lstOperator);
					SUtil::FreeStringList(lstID);
					return FALSE;
				}
				strTemp = *it2++;
				if (strTemp.CompareNoCase("or") == 0)
					bLast = bLast || bTem;
				else if (strTemp.CompareNoCase("and") == 0)
					bLast = bLast && bTem;
				else
					bLast = FALSE;
			}

			SUtil::FreeStringList(lstOperator);
			SUtil::FreeStringList(lstID);

			return bLast;

		}
		else
		{
			SUtil::FreeStringList(lstOperator);
			SUtil::FreeStringList(lstID);
			return FALSE;
		}
	}

	SUtil::FreeStringList(lstOperator);
	SUtil::FreeStringList(lstID);
	return FALSE;

}

BOOL WorkThread::CheckSingleItemState(/*int Type*/StateCondition *pSt, int ItemID)
{
	if (pSt == NULL)
		return FALSE;
	if (ItemID <= 0)
		return FALSE;

	CStateConditionItemList &scl = pSt->GetStateConditionList();
	CStateConditionItemList::iterator it;
	it = scl.begin();
	StateConditionItem *ptem = NULL;
	while (it != scl.end())
	{
		//	ptem=scl.GetNext(pos);
		ptem = *it++;
		if (ptem->m_ItemID == ItemID)
			break;
	}

	if (ptem == NULL)
		return FALSE;

	if (stricmp(ptem->m_Operator,"always") == 0)
		return TRUE;
	if (stricmp(ptem->m_Operator,"none") == 0)
		return FALSE;

	ReturnValue* pRV = NULL;
	CReturnValueList::iterator itv;
	CString strTemp = "";

	for (int n = 0; n < m_RetValueCount; n++)
	{
		if (m_RetValueCount > retcount)
		{
			if (n == 0)
				itv = m_RetValueList.begin();
			pRV = *itv++;
		}
		else
			pRV = m_RetValues + n;

		if (!pRV)
			continue;
		if (pRV->m_pReturnData->m_Name == ptem->m_ParamName)
		{
			if (_stricmp(pRV->m_pReturnData->m_Type,"Int") == 0)
				strTemp.Format("%d", pRV->m_value.nVal);
			else if (_stricmp(pRV->m_pReturnData->m_Type,"Float") == 0)
				strTemp.Format("%0.2f", pRV->m_value.fVal);
			else if (_stricmp(pRV->m_pReturnData->m_Type,"String") == 0)
				strTemp.Format("%s", pRV->m_value.szVal);

			return Judge(strTemp.GetBuffer(strTemp.GetLength()),
					ptem->m_ParamValue.GetBuffer(ptem->m_ParamValue.GetLength()), ptem->m_Operator);

		}

	}

	return FALSE;

}

void WorkThread::ClearResult()
{
	m_MonitorState = Monitors::STATUS_NULL;
	memset(m_RetBuf, 0, RETBUFCOUNT);
	m_strDisplay.clear();

	if (m_RetValueList.size() > 0)
	{
		CReturnValueList::iterator it;
		for (it = m_RetValueList.begin(); it != m_RetValueList.end(); it++)
			delete *it;
		m_RetValueList.clear();
	}

	for (int i = 0; i < retcount; i++)
	{
		m_RetValues[i].Clear();
	}

}

BOOL WorkThread::Judge(const char *szSource, const char *szDestination, const char *szRelation)
{
	if (!strcmp(szRelation, "=="))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS == fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, "!="))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS != fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, ">"))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS > fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, "<"))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS < fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, ">="))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS >= fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, "<="))
	{
		float fS = atof(szSource);
		float fD = atof(szDestination);
		return (fS <= fD) ? TRUE : FALSE;
	}
	else if (!strcmp(szRelation, "contains"))
	{
		if (strstr(szSource, szDestination))
			return TRUE;
		else
			return FALSE;
	}
	else if (!strcmp(szRelation, "!contains"))
	{
		if (strstr(szSource, szDestination))
			return FALSE;
		else
			return TRUE;
	}
	else
	{
		return FALSE;
	}

}

int WorkThread::ParserExpression(CString strExpression, CStringList &lstOperator, CStringList &lstID)
{
	if (strExpression.IsEmpty())
		return -1;

	CString strTemp = "";

	int pos = 0;
	int nb = 0;
	int n = 0;
	if ((pos = strExpression.Find(SEPARATOR, 0)) < 0)
	{
		lstID.push_back(strExpression.getText());
		return 0;
	}

	for (nb = 0; pos > -1; nb++)
	{
		strTemp = strExpression.Mid(nb, pos - nb);
		lstID.push_back(strTemp.getText());
		pos++;
		nb = strExpression.Find(SEPARATOR, pos);
		if (nb < 0)
			return -2;
		strTemp = strExpression.Mid(pos, nb - pos);
		lstOperator.push_back(strTemp.getText());
		pos = strExpression.Find(SEPARATOR, nb + 1);
		n++;
	}

	lstID.push_back(
			strExpression.Right(strExpression.GetLength() - strExpression.ReverseFind(SEPARATOR) - 1).getText());

	return n;

}
bool WorkThread::BulidStringMap(STRINGMAP &map, const char *buf, int datalen)
{
	if (buf == NULL)
		return false;

	const char *pt = buf;
	if (pt[0] == '\0')
		return true;

	string str, name, value;
	int pos = 0;
	do
	{
		str = pt;
		if ((pos = str.find('=', 0)) < 0)
			return false;
		name = str.substr(0, pos);
		value = str.substr(pos + 1, str.size() - pos);
		if (name.empty())
			return false;
		map[name] = value;

		pt += str.size() + 1;
		if ((pt - buf) >= datalen)
			return true;
	} while (pt[0] != '\0');

	return true;
}

void WorkThread::AppendResultV70(void)
{
	ReturnValue* pRV = NULL;
	CReturnValueList::iterator itv;
	CString strTemp = "";

	char buf[2048] = { 0 };
	int buflen = 2048;
	int dlen = 0;
	MakeRecord mr(buf, buflen, m_MonitorState);

	if ((m_MonitorState == Monitors::STATUS_BAD) || (m_MonitorState == Monitors::STATUS_NULL))
	{

		if (!mr.MakeError(m_MonitorState, (LPCSTR) m_strDisplay))
		{
			throw MSException("Make record failed");
		}
		dlen = mr.GetDataSize();
	}
	else
	{

		for (int n = 0; n < m_RetValueCount; n++)
		{
			if (m_RetValueCount > retcount)
			{
				if (n == 0)
					itv = m_RetValueList.begin();
				pRV = *itv++;

			}
			else
				pRV = m_RetValues + n;
			if (pRV == NULL)
			{
				throw MSException("Return value is NULL");
			}

			if (!mr.MakeBuf(pRV))
			{
				throw MSException("Make result failed");
			}

		}
		dlen = mr.GetDataSize();
	}

	char *pt = buf;
	pt += dlen;
	if (buflen - dlen < strlen((char *) m_strDisplay) + 1)
		throw MSException("Process result -- string too big");
	strcpy(pt, (char *) m_strDisplay);
	dlen += strlen((char *) m_strDisplay) + 1;

#ifdef WIN32
	printf("MonitorId:%s,MonitorType:%d,state:%d,dstr:%s\n", m_Monitor->GetMonitorID(), m_Monitor->GetMonitorType(),
			m_MonitorState, (char *) m_strDisplay);
#else
	printf("MonitorId:%s,MonitorType:%d,state:%d,dstr:%s\n", m_Monitor->GetMonitorID(), m_Monitor->GetMonitorType(),
			m_MonitorState, SUtil::GBKToUTF8(m_strDisplay.getText()).c_str());
#endif

	ClearResult();
	if (m_Monitor->isDelete)
		return;

	if (m_Monitor->m_isRefresh)
		putil->InsertSvdb(m_Monitor->GetMonitorID(), buf, dlen, g_ServerHost);
	else
		putil->InsertSvdb(m_Monitor->GetMonitorID(), buf, dlen);

	if (m_Monitor->m_isRefresh)
	{
		char buf[100] = { 0 };
		sprintf(buf, "%s", m_Monitor->GetMonitorID());
		string text = "Refresh ,PushMessage f: \"";
		text += g_RefreshQueueName + "\"";
		if (!::PushMessage(g_RefreshQueueName, "Refresh_OK", buf, strlen(buf) + 1, "default", g_QueueAddr))
			;		//putil->ErrorLog(text.c_str());
	}

}
void WorkThread::ToRunMonitor()
{
	if (m_Monitor == NULL)
		return;
	if (m_Monitor->GetRunning())
		return;
	if (m_Monitor->isDelete)
		return;

	m_Monitor->SetRunning(TRUE);
	m_pWorkControl->AdjustActiveMonitorCount(m_Monitor, TRUE);

	m_Event.signal();
}

void WorkThread::ToRunMonitor(Monitors *pMonitor)
{
	m_Monitor = pMonitor;
	ToRunMonitor();
}

BOOL WorkThread::InitSocket()
{

#ifdef 	WIN32
	int err=0;

	WSADATA WSAData;
	err=WSAStartup(MAKEWORD(2, 2), &WSAData);

	if(err!=0)
	{
		return FALSE;
	}
	if(WSAData.wVersion!=MAKEWORD(2,2))
	{
		return FALSE;
	}
#endif

	return TRUE;

}

void WorkThread::CloseSocket()
{
#ifdef	WIN32
	::WSACleanup();
#endif

}

