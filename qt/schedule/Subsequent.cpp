#include "Subsequent.h"

Subsequent::Subsequent()
{

}

Subsequent::~Subsequent()
{
	CSubsequentItemList::iterator it;
	for(it=m_ItemList.begin();it!=m_ItemList.end();it++)
	{
		delete (*it);
	}
	m_ItemList.clear();
}

BOOL Subsequent::GetValueByClassName(const char *ClassName, int &nTotal, int &nPer)
{
	CSubsequentItemList::iterator it;
	for(it=m_ItemList.begin();it!=m_ItemList.end();it++)
	{
		if((*it)->m_strClass==ClassName)
		{
			nTotal=(*it)->m_nTotal;
			nPer=(*it)->m_nPerEntity;
			return TRUE;
		}
	}

	return FALSE;
}

BOOL Subsequent::GetValueByMonitor(Monitors *pMonitor, int &nTotal, int &nPer)
{

	CSubsequentItemList::iterator it;
	for(it=m_ItemList.begin();it!=m_ItemList.end();it++)
	{
		if((*it)->m_strClass==pMonitor->GetMonitorClass())
		{
			nTotal=(*it)->m_nTotal;
			nPer=(*it)->m_nPerEntity;
			pMonitor->SetSubsequentItem((*it));
			pMonitor->SetSubsequent(Monitors::subsequentyes);

			return TRUE;
		}
	}

	pMonitor->SetSubsequent(Monitors::subsequentno);
	return FALSE;
}
