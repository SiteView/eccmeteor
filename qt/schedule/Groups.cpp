#include "Groups.h"

Groups::Groups()
{
	memset(m_SEID, 0, 10);

}

Groups::~Groups()
{

	CEntityList::iterator it;
	if (!m_EntityList.empty())
	{
		for (it = m_EntityList.begin(); it != m_EntityList.end(); it++)
		{
			if ((*it) != NULL)
				delete (*it);
		}
		m_EntityList.clear();
	}

	CGroupsItemList::iterator itt;
	if (!m_GroupsList.empty())
	{
		for (itt = m_GroupsList.begin(); itt != m_GroupsList.end(); itt++)
		{
			delete (*itt);
		}
		m_GroupsList.clear();
	}
}

Entitys * Groups::GetEntityByID(const char *EntityID)
{
	if (m_EntityList.empty())
		return NULL;

	CEntityList::iterator it;
	for (it = m_EntityList.begin(); it != m_EntityList.end(); it++)
	{
		if (stricmp((*it)->GetEntityID(),EntityID) == 0)
			return *it;
	}
	return NULL;

}

GroupsItem * Groups::GetSingleGroupByID(const char *GroupID)
{
	if (m_GroupsList.empty())
		return NULL;

	CGroupsItemList::iterator it;
	for (it = m_GroupsList.begin(); it != m_GroupsList.end(); it++)
	{
		if (stricmp((*it)->GetGroupID(),GroupID) == 0)
			return *it;
	}

	return NULL;
}

BOOL Groups::InitAllEntityActiveMonitorArray(int nCount)
{
	if (m_EntityList.empty())
		return TRUE;
	CEntityList::iterator it;
	for (it = m_EntityList.begin(); it != m_EntityList.end(); it++)
	{
		(*it)->InitActiveMonitorsArray(nCount);
	}

	return TRUE;
}
