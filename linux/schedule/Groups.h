//#pragma once

#ifndef  DRAGONFLOW_GROUPS
#define DRAGONFLOW_GROUPS

#include "Schedule.h"

#include "Entitys.h"
#include "GroupsItem.h"



class Groups
{
public:
	BOOL InitAllEntityActiveMonitorArray(int nCount);
	GroupsItem * GetSingleGroupByID(const char *GroupID);
	Entitys * GetEntityByID(const char *EntityID);
	Groups();
	virtual ~Groups();

	CGroupsItemList & GetGroupsList(void)
	{
		return m_GroupsList;
	}
	CEntityList & GetEntityList(void)
	{
		return m_EntityList;
	}
	const char * GetSEID(void) const
	{
		return m_SEID;
	}
	void SetSEID(const char *seid)
	{
		if(seid)
			strcpy(m_SEID,seid);
	}

	int GetGroupsCount(void)
	{
		return (int)m_GroupsList.size();
	}
	int GetEntitysCount(void)
	{
		return (int)m_EntityList.size();
	}

private:
	char m_SEID[10];
	CGroupsItemList m_GroupsList;
	CEntityList m_EntityList;
};

#endif
