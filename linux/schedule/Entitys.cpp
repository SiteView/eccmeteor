#include "Entitys.h"

Entitys::Entitys()
{
	m_nCurrentActiveMonitor = 0;
	m_pActiveMonitors = NULL;
	m_nMonitorTypeCount = 0;
	m_DependsCondition = 0;

	m_Depend[0] = '\0';
	m_EntityID[0] = '\0';
	m_IPAdress[0] = '\0';
	m_SystemType[0] = '\0';

}

Entitys::~Entitys()
{
	if (m_pActiveMonitors)
		delete[] m_pActiveMonitors;

}

BOOL Entitys::InitActiveMonitorsArray(int count)
{
	if (count <= 0)
		return FALSE;

	m_nMonitorTypeCount = count;
	m_pActiveMonitors = new int[count];
	if (m_pActiveMonitors == NULL)
		return FALSE;
	memset(m_pActiveMonitors, 0, count * sizeof(int));
	return TRUE;

}

void Entitys::SetMonitorTypeCount(int count)
{
	m_nMonitorTypeCount = count;

}

void Entitys::AdjustActiveMonitorCount(int index, BOOL isA)
{
	if ((!m_pActiveMonitors) || (index > m_nMonitorTypeCount) || (index < 0))
		return;

	MutexLock lock(m_mutex);
	isA ? m_pActiveMonitors[index]++ : m_pActiveMonitors[index]--;

}
