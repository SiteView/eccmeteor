//#pragma once
#ifndef  DRAGONFLOW_SUBSEQUENT
#define DRAGONFLOW_SUBSEQUENT

#include "SubsequentItem.h"
#include "Monitors.h"


class Subsequent
{
public:
	BOOL GetValueByMonitor(Monitors *pMonitor,int &nTotal,int &nPer);
	BOOL GetValueByClassName(const char *ClassName,int &nTotal,int &nPer);
	Subsequent();
	virtual ~Subsequent();

	CSubsequentItemList & GetSubsequentItemList(void)
	{
		return m_ItemList;
	}

private:
	CSubsequentItemList m_ItemList;
};


#endif
