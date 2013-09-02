#include "Monitors.h"

Monitors::Monitors()
{
	m_nQueueIndex = -1;
	m_nSkipCount = 0;
	m_pSubsequentItem = NULL;
	m_isSubsequent = subsequentnull;
	m_pEntity = NULL;

	m_isGroupDepend = groupdependnull;
	m_GroupDependCondition = 0;
	m_GroupDependMonitor = NULL;
	m_NextRunTime = CTime(1971, 1, 1, 1, 1, 1);
	m_Running = FALSE;
	isDelete = FALSE;
	m_isDisable = FALSE;
	m_isTempDisable = FALSE;
	m_LastState = STATUS_NULL;
	m_MonitorID[0] = '\0';
	m_EntityType[0] = '\0';
	m_Frequency = 0;
	m_TaskType = Task::TASK_NULL;

	m_isRefresh = false;
	m_ErrorFreq = 0;
	m_CheckError = true;
	m_isInQueue = false;

	for (int i = 0; i < 3; i++)
		m_StateConditions[i] = NULL;

}

Monitors::~Monitors()
{
	CReturnDataList::iterator it;
	if (!m_ReturnList.empty())
	{
		for (it = m_ReturnList.begin(); it != m_ReturnList.end(); it++)
		{
			ReturnData *prd = (*it);
			if (prd != NULL)
				delete prd;

		}
		m_ReturnList.clear();
	}
	m_ParamList.clear();

	for (int i = 0; i < 3; i++)
	{
		if (m_StateConditions[i])
			delete m_StateConditions[i];
	}
}

BOOL Monitors::SetReturnList(CReturnDataList &lst)
{
	CReturnDataList::iterator it;
	if (!m_ReturnList.empty())
	{
		for (it = m_ReturnList.begin(); it != m_ReturnList.end(); it++)
		{
			if ((*it) != NULL)
				delete (*it);
		}
		m_ReturnList.clear();
	}
	if (!lst.empty())
	{

		for (it = lst.begin(); it != lst.end(); it++)
		{
			m_ReturnList.push_back((*it));
		}
		lst.clear();
	}

	return TRUE;

}

BOOL Monitors::SetParameterList(CStringList &lstParameter)
{
	CStringList::iterator it;
	if (!m_ParamList.empty())
	{
		m_ParamList.clear();
	}

	if (lstParameter.empty())
		return TRUE;

	for (it = lstParameter.begin(); it != lstParameter.end(); it++)
	{
		m_ParamList.push_back((*it));
	}
	lstParameter.clear();

	return TRUE;

}

bool Monitors::CalculateNextRunTime(CTime time)
{
	m_LastRunTime = time;

	CTimeSpan stime(0, 0, m_Frequency, 0);
	m_NextRunTime = time;
	m_NextRunTime += stime;

//	printf("=== monitor: %s runtime: %s\n", m_MonitorID, m_NextRunTime.Format().c_str());
	return true;
}

bool Monitors::CalculateNextRunTime()
{
	int nFre = m_Frequency;
	if ((m_LastState == STATUS_BAD) || (m_LastState == STATUS_ERROR))
	{
		if (m_ErrorFreq > 0)
			nFre = m_ErrorFreq;
	}

	CTime curTime = CTime::GetCurrentTimeEx();
	if (m_NextRunTime > curTime)
	{
//		printf("=== monitor: %s runtime: %s\n",m_MonitorID,m_NextRunTime.Format().c_str());
		return false;
	}

	CTimeSpan stime(0, 0, nFre, 0);
	m_NextRunTime += stime;

	while (m_NextRunTime <= curTime)
		m_NextRunTime += stime;

//	printf("=== monitor: %s runtime: %s\n",m_MonitorID,m_NextRunTime.Format().c_str());
	return true;
}
void Monitors::CalculateErrorFrequency(bool ise)
{
	if (m_ErrorFreq > 0)
	{
		if (ise)
		{
			CTimeSpan stime(0, 0, m_Frequency, 0);
			m_NextRunTime -= stime;
			CTimeSpan eftime(0, 0, m_ErrorFreq, 0);
			m_NextRunTime += eftime;
		}
		else
		{
			CTimeSpan eftime(0, 0, m_ErrorFreq, 0);
			m_NextRunTime -= eftime;
			CTimeSpan stime(0, 0, m_Frequency, 0);
			m_NextRunTime += stime;

		}
	}

}
