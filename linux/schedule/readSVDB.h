

#ifndef  DRAGONFLOW_READSVDB_FOR_LOADCONFIG
#define  DRAGONFLOW_READSVDB_FOR_LOADCONFIG

#include <addon.h>
#include "Schedule.h"
#include "Monitors.h"
#include "Groups.h"
#include "Subsequent.h"
#include "Task.h"



#include <map>
using std::map;

class readSVDB
{

private:
	string svdbuser;
	string svdbaddr;
	static OBJECT language_obj;

	OBJECT FastGetMonitorTPL(int id);
	static map<int, OBJECT> MonitorTPL;

	OBJECT FastGetEntityTPL(string id);
	static map<string, OBJECT> EntityTPL;	

	OBJECT FastGetMonitor(string id);
	static map<string, OBJECT> svMonitors;

	OBJECT FastGetEntity(string id);
	static map<string, OBJECT> svEntities;

public:

	readSVDB(void);
	~readSVDB(void);

	bool GetMonitorParaValueByName( string strID, string strName, string &strRet );
	long GetMonitorIDLST( list <string> & IDList );
	long GetMonitorIDLSTBySE( list <string> & IDList,int seid );
	bool GetSMCommon( Monitors *pM, string sMonitorID );
	enum	econ{
		Normal, 
		Warning,
		Error,
	};	// Normal=0x1,
	bool GetConditionString(  string strID, unsigned int nType, string &strRet );
	bool GetSMStateConditionItemList( string strID, CStateConditionItemList &ItemList, unsigned int nType );

	bool GetEntityIDList( list <string> & IDList );
	bool GetEntityIDListBySE(list <string> & IDList, int seid );
	bool GetSEParaValue( string strID, string strName, string &strRet );
	bool GetEntityConfigValue( string strID, string strName, string &strRet );
	bool GetEntityList(string strID, list <string> & List);

	bool GetGroupIDList(  list <string> & IDList );
	bool GetGroupIDListBySE(  list <string> & IDList , int seid);
	bool GetSGProValue(string strID,string strName,string & strRet);


	bool GetMLValue( string strID, string strName, string &strRet);
	bool GetMLRunParaNames( string strID, list <string> & List );
	bool GetMLReturnDataList( CReturnDataList &lstrd, int MonitorType );
	bool GetTaskMap(TASKMAP &tmap);

	bool SetSvdbUser(string user);
	bool SetSvdbAddr(string addr);

	int GetSubsequentList(CSubsequentItemList &lstItem);

	bool ReleaseAll();   //如果配置信息有变更，需要读取新的，请调用此函数。
	bool Init();		//没做任何事情，只是预防被老的 6.2 的代码调用

};


#endif
