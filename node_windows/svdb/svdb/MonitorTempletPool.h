//////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////

#ifndef	__SVDB_MONITORTEMPLETPOOL_H__
#define	__SVDB_MONITORTEMPLETPOOL_H__

#include "PoolBase.h"
#include "SerialBase.h"
#include "svdbtype.h"
#include "MonitorTemplet.h"
#include <cc++/file.h>
#include <vector>

using namespace std;

class MonitorTempletPool :
	public PoolBase,public SerialBase
{
public:
	MonitorTempletPool();
	~MonitorTempletPool(void);

	MonitorTempletPool(word filepath,bool orig=false):PoolBase(filepath)
	{
		m_data.resize(initsize);
		m_count=initsize;
		m_loaded=false;
		m_changed=false;

		isorig= orig;

		for(int i=0;i<initsize;i++)
			m_data[i]=NULL;
	}

	enum{ initsize=1000, maxsize=5000};

	bool Load(void);
	bool Submit();

	S_UINT	GetRawDataSize(void);
	char*	GetRawData(char *lpbuf,S_UINT bufsize);
	bool	CreateObjectByRawData(const char *lpbuf,S_UINT bufsize);

	bool	push(MonitorTemplet *pmt)
	{
		ost::MutexLock lock(m_UpdateLock);
		if(pmt==NULL)
			return false;
		S_UINT n = (S_UINT)pmt->GetID();
		if((n<=0) || (n>maxsize))
			return false;
		if(n >= m_count)
		{
			m_count = (m_count==n) ? m_count+1 : n;
			m_data.resize(m_count,NULL);
		}
		if(m_data[n]!=NULL)
			delete m_data[n];
		m_data[n]=pmt;

		m_changed=true;
		return true;
	}

	inline bool Find(S_UINT id)
	{
		if((id >= m_count) || (id<1))
			return false;

		if(m_data[id]==NULL)
			return false;
		return true;
	}
	bool GetMonitorTempletData(int id,char *buf,S_UINT &len);
	bool PushData(const char *buf,S_UINT len, Resource *m_pLanguage=NULL);

	MonitorTemplet *GetMonitorTemplet(int id , bool readonly)
	{
		if(!Find(id))
			return false;
		if(!readonly)
	    	m_changed=true;
		return m_data[id];
	}

	bool DeleteMonitorTemplet(int id)
	{
		ost::MutexLock lock(m_UpdateLock);
		if(!Find(id))
			return false;
		if(m_data[id] != NULL)
		{
			delete m_data[id];
			m_data[id]=NULL;
			m_changed=true;
		}
		return true;
	}

	void DisplayAllData(void)
	{
		puts("************************************Begin********************************");
		printf("Sapce size :%d\n",m_count);
		puts("--------------------------------------------------------------------------");
		for (S_UINT i=0; i<m_count; i++)
		{
			if(m_data[i]!=NULL)
				m_data[i]->DisplayAllData();
		}
	}

	bool GetInfo(word infoname,StringMap &map);
	bool ResolveIds(Resource *m_pLanguage);	// 非线程安全函数
	bool SaveNewIds(int id,Resource *m_pLanguage);

protected:
	std::vector<MonitorTemplet *>	m_data;
	std::vector<MonitorTemplet *>::size_type m_count;
	//S_UINT	m_count;
	bool isorig;
};

#endif	// __SVDB_MONITORTEMPLETPOOL_H__
