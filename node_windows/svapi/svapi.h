//////////////////////////////////////////////////////////////////////////
 //
 // Copyright (C), 2002-2012, SiteView.
 // FileName: svapi.h
 // Author:
 // Version:
 // Date:
 // Description:
 //-----------------------------------------------------------------
 // History:
 // Date: 2013/12/12
 // Author:
 // Modification:
 //
//////////////////////////////////////////////////////////////////////////

#ifndef __SV_API_H__
#define __SV_API_H__

#include <iostream>
#include <string>
#include <map>
#include <list>

#ifdef WIN32
	#ifndef __MINGW__
		//#ifdef SV_EXPORTS
		//   #define SV_API __declspec(dllexport)
		//#else
		//   #define SV_API __declspec(dllimport)
		//#endif
		#define SV_API
	#else
		#define SV_API
	#endif
#else
	#define SV_API __attribute__ ((visibility("default")))
#endif

#define INVALID_VALUE	0
// 下面是GetIniFileValueType可能返回的值
#define INIVALUE_FAILED	-1			//获取失败
#define INIVALUE_NULL	0			//未知类型
#define INIVALUE_INT	1			//整型数据
#define	INIVALUE_STRING	2			//字符串型数据
#define INIVALUE_BINARY	3			//二进制类型数据

using namespace std;

typedef void* OBJECT;
typedef void* MAPNODE;

struct sv_list{
	sv_list()
	{
		list=INVALID_VALUE;
		iterator=INVALID_VALUE;
	}
	sv_list(const struct sv_list &item)
	{
		list=item.list;
		iterator=item.iterator;
	}

	const struct sv_list &operator=(const struct sv_list &item)
	{
		list=item.list;
		iterator=item.iterator;

		return *this;
	}

	OBJECT list;
	OBJECT iterator;
};

struct sv_pair{
	sv_pair(){;}
	sv_pair(const struct sv_pair &pi)
	{
		name=pi.name;
		value=pi.value;
	}
	~sv_pair(){;}
	struct sv_pair& operator=(const struct sv_pair &pi)
	{
		name=pi.name;
		value=pi.value;
		return *this;
	}
	string name;
	string value;
};

typedef struct sv_list LISTITEM;
typedef struct sv_pair SVPAIR;
typedef list<struct sv_pair> PAIRLIST;
typedef map<string, string> StdMapStr, NodeData;
typedef list<StdMapStr> StdListMapStr, ForestList;
typedef map<string, NodeData> ForestMap, SvIniFile;

namespace SV
{
	//////////////////////////////////////////////////////////////////////////
	// svapi
	// Functionality:
	//    从SVDB服务器获取数据.
	// Parameters:
	//    0) [in] fmap:		从SVDB服务器获取数据
	//    1) [in] inwhat:		传入的请求
	//    2) [in] estr:			返回的错误信息
	// Returned value:
	//    0 - success, other - failed.
	SV_API int GetUnivData(ForestMap & fmap, const NodeData & inwhat, string & estr);

	// Functionality:
	//    从SVDB服务器获取树数据.
	// Parameters:
	//    0) [in] fmap:		从SVDB服务器获取数据
	//    1) [in] inwhat:		传入的请求
	//    2) [in] estr:			返回的错误信息
	// Returned value:
	//    0 - success, other - failed.
	SV_API int GetForestData(ForestMap & fmap, const NodeData & inwhat, string & estr);

	// Functionality:
	//    到SVDB服务器提交数据.
	// Parameters:
	//    0) [in] flist:		到SVDB服务器提交数据
	//    1) [in] inwhat:		传入的请求
	//    2) [in] estr:			返回的错误信息
	// Returned value:
	//    0 - success, other - failed.
	SV_API int SubmitUnivData(ForestList & flist, const NodeData & inwhat, string & estr);


	//////////////////////////////////////////////////////////////////////////
	// General API
	SV_API bool	EnumNodeAttrib(MAPNODE node,PAIRLIST &retlist);
	SV_API unsigned int GetNodeSize(MAPNODE node);
	SV_API bool	ClearMapNode(MAPNODE node);//清空所有的值
	SV_API bool	FindNodeValue(MAPNODE node,string name,string &value);
	SV_API bool	DeleteNodeAttrib(MAPNODE node,string name);
	SV_API bool	AddNodeAttrib(MAPNODE node,const SVPAIR &data);
	SV_API bool	AddNodeAttrib(MAPNODE node,string name,string value);
	SV_API MAPNODE	CreateNewMapNode();
	SV_API MAPNODE CloneMapNode(MAPNODE node);
	SV_API void	CloseMapNodeObject(OBJECT &obj);  //坏函数，不可用

	SV_API MAPNODE FindNext(const LISTITEM &item);
	SV_API unsigned int GetListItemSize(const LISTITEM &item);
	SV_API bool	DeleteItem(const LISTITEM &item);
	SV_API MAPNODE	GetItemNode(const LISTITEM &item);
	SV_API bool	ResetListItem(const LISTITEM &item);
	SV_API bool	AddItemToList(const LISTITEM &listi,const MAPNODE item);
	SV_API bool	InsertItemToList(const LISTITEM &listi,const MAPNODE item);
	SV_API void	ReleaseItemList(const LISTITEM &listi);
	SV_API bool	CreateNewItemList(LISTITEM&listi);


	//////////////////////////////////////////////////////////////////////////
	// INI API
	SV_API bool SetSvdbAddrByFile(string fileName);
	SV_API string GetSvdbAddr();
	SV_API bool SetCgiVersionByFile(string filename);
	//读取指定文件的指定字段，并保存为一个全局 string 变量
	//退设置的方法: SetCgiVersionByFile(""); 这样会返回false 并同时取消之前的设置;   任何使该函数返回false的情况,都会退设置。
	SV_API string GetCgiVersion(void);//获取上一函数设置的全局 string 变量
	SV_API string	GetSiteViewRootPath();//读取 svapi.dll 所在机器的注册表,而不是 svdb.exe 所在机器的注册表
	SV_API string GetMasterAddress();
	SV_API bool isDemoMode();
	SV_API string	FindParentID(string id);
	SV_API int	FindIndexByID(string id);
	SV_API bool IsSVSEID(string id);
	SV_API string FindSEID(string id);
	//每个ini 文件可以有多个 section, 每个section 可以有多个“ key = value ”的数据对
	//每一个key 有三种类型： int，string, binary ,读或写须调用相应函数
	//  注意：  ------------------------------   注意
	//  注意：如果 svdb.exe 启动为非idc版，则以下函数传入的 user 参数全部被抛弃，即全部解析为“default”取得总目录下的 ini 文件
	//  注意：  ------------------------------   注意
	SV_API bool GetIniFileSections(std::list<string> &sectionlist,string filename,string addr="localhost",string user="default");
	//获取某个ini文件的所有的 section  ，//传出 section的list 引用， ini文件名，SVDB 地址， idc用户id
	
	SV_API bool GetIniFileKeys(string section,std::list<string> &keylist,string filename,string addr="localhost",string user="default");
	//获取某个section 下的所有的key
	
	SV_API int	GetIniFileValueType(string section,string key,string filename,string addr="localhost",string user="default");
	//获取某个 key 的类型


	//批量写入(追加)string 型值到某section中：// 批量数据,   section名，      ini文件名，   SVDB 地址，             idc用户id
	SV_API bool WriteIniSectionManyString(const NodeData & ndata, string section, string filename, string addr="localhost",string user="default");


	// 根据key的类型写ini的3个函数 ：// section名，   key 名，value 值，  ini文件名，SVDB 地址， idc用户id
	SV_API bool WriteIniFileString(string section,string key,string str,string filename,string addr="localhost",string user="default");
	SV_API bool WriteIniFileInt(string section,string key,int value,string filename,string addr="localhost",string user="default");
	SV_API bool WriteIniFileStruct(string section,string key, void *data,unsigned int len,string filename,string addr="localhost",string user="default");

	// 根据key的类型读ini的3个函数：            // 默认返回值（随便设）
	SV_API string GetIniFileString(string section,string key,string defaultret,string filename,string addr="localhost",string user="default");
	SV_API int	GetIniFileInt(string section,string key,int defaultret,string filename,string addr="localhost",string user="default");
	SV_API bool GetIniFileStruct(string section,string key,void *buf,unsigned int &len,string filename,string addr="localhost",string user="default");
	SV_API bool DeleteIniFileSection(string section,string filename,string addr="localhost",string user="default");
	//删除某个 section
	SV_API bool DeleteIniFileKey(string section,string key,string filename,string addr="localhost",string user="default");
	//删除某个 key
	SV_API bool EditIniFileSection(string oldsection,string newsection,string filename,string addr="localhost",string user="default");
	//修改某个 section
	SV_API bool EditIniFileKey(string section,string oldkey,string newkey,string filename,string addr="localhost",string user="default");
	//修改某个 key
	SV_API bool CopyIniFile(string filecopy,string addr="localhost",string user="default");
	//拷贝 .ini 文件 , 此函数提供给 idc 版使用，会将总目录下的 .ini 拷贝到某个 idc 用户的目录下,并重命名
	//string filecopy 的规则,如：“yewuhumenu.ini,menu.ini;license.ini,license.ini”
	//                             源文件名    ,目标文件名; 源文件名    ,目标文件名
	// 返回的数据    ， ini文件名，     需要的 sections 串           SVDB 地址，         idc用户id
	//根据传入的以英文逗号“,”分割的 sections 串，返回相应的 svinifile ，如果传入 sections 为 “default” 则返回全部
	//若 key 的类型为 int ,则转为 string 返回； 其他类型只返回说明（如 INIVALUE_BINARY 二进制类型，只返回“Binary data”） 
	//由于只要一次函数调用，将比原来的旧方法快很多 
	SV_API bool GetSvIniFileBySections(SvIniFile & inifile, string filename, string sections="default", string addr="localhost", string user="default");


	//////////////////////////////////////////////////////////////////////////
	// SVSE API
	SV_API OBJECT	CreateSVSE(string label);
	SV_API OBJECT	GetSVSE(string id, string user = "default", string addr = "localhost");
	SV_API string GetSVSELabel(OBJECT svseobj);
	SV_API bool PutSVSELabel(OBJECT svseobj, string label);
	SV_API bool GetSubGroupsIDBySE(OBJECT svseobj,std::list<string> &idlist);
	SV_API bool GetSubGroupsIDBySEEx(OBJECT svseobj,std::list<char *> &idlist);
	SV_API bool GetSubEntitysIDBySE(OBJECT svseobj,std::list<string> &idlist);
	SV_API bool DeleteSVSE(string id,string user="default",string addr="localhost");
	//删除对象，以免内存泄漏
	SV_API bool CloseSVSE(OBJECT &svseobj);
	SV_API string AddNewSVSE(OBJECT svseobj,string user="default",string addr="localhost");
	SV_API bool SubmitSVSE(OBJECT svseobj,string user="default",string addr="localhost");
	//返回所有 SE 的 label
	SV_API bool GetAllSVSEInfo(PAIRLIST &retlist,string user="default",string addr="localhost");
	// 传入"ObjectVersion"，则返回 obj 版本戳
	SV_API bool GetAllSVSEObjInfo(PAIRLIST &retlist,string infoname,string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// Monitor templet API
	SV_API OBJECT	GetMonitorTemplet(int id,string user="default",string addr="localhost");
	SV_API MAPNODE	GetMTMainAttribNode(OBJECT mtobj);
	SV_API bool	FindMTParameterFirst(OBJECT mtobj,LISTITEM &item);
	SV_API bool	FindMTAdvanceParameterFirst(OBJECT mtobj,LISTITEM &item);
	SV_API bool	FindMTReturnFirst(OBJECT mtobj,LISTITEM &item);
	SV_API MAPNODE	GetMTErrorAlertCondition(OBJECT mtobj);
	SV_API MAPNODE GetMTWarningAlertCondition(OBJECT mtobj);
	SV_API MAPNODE	GetMTGoodAlertCondition(OBJECT mtobj);
	SV_API OBJECT CreateMonitorTemplet(int id);
	SV_API bool DeleteMonitorTemplet(int id,string user="default",string addr="localhost");
	SV_API void CloseMonitorTemplet(OBJECT &obj);
	SV_API bool	SubmitMonitorTemplet(OBJECT mtobj,string user="default",string addr="localhost");
	SV_API bool GetAllMonitorTempletInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");
	SV_API OBJECT CloneMonitorTemplet(OBJECT mtobj,int targetid);


	//////////////////////////////////////////////////////////////////////////
	// Monitor
	SV_API OBJECT	GetMonitor(string monitorid,string user="default",string addr="localhost");
	SV_API OBJECT CreateMonitor(void);
	SV_API MAPNODE GetMonitorMainAttribNode(OBJECT monitorobj);
	SV_API MAPNODE GetMonitorParameter(OBJECT monitorobj);
	SV_API MAPNODE GetMonitorAdvanceParameterNode(OBJECT monitorobj);
	SV_API MAPNODE	GetMonitorErrorAlertCondition(OBJECT monitorobj);
	SV_API MAPNODE GetMonitorWarningAlertCondition(OBJECT monitorobj);
	SV_API MAPNODE	GetMonitorGoodAlertCondition(OBJECT monitorobj);
	SV_API bool DeleteSVMonitor(string monitorid,string user="default",string addr="localhost");
	SV_API void CloseMonitor(OBJECT &monitorobj);
	SV_API string AddNewMonitor(OBJECT monitorobj,string entityid,string user="default",string addr="localhost");
	SV_API bool	SubmitMonitor(OBJECT monitorobj,string user="default",string addr="localhost");
	// infoname传入"ObjectVersion"则返回 obj 版本戳,  user 可以指定父 id 
	SV_API bool GetAllMonitorsInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");
	SV_API string MonitorCopy(string srcmonitorid,string objentityid,string user="default",string addr="localhost");
	//拷贝监测器，并创建相应的 table
	SV_API string MonitorCopyAndCreateTable(string srcmonitorid,string objentityid,string user="default",string addr="localhost");
	SV_API bool GetMonitorsInfoBySE(string seid,PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// Group
	// 创建一个 idc 用户   ， userindex 是 cgi程序要用到的一个 用户index，本函数只是替 cgi 程序自动保存这一属性
	// pid 是idc 用户的 se 父亲的 id ， 当 pid=="0" 时 由系统自动寻找合适的 se 来添加，  当 pid!="0" 时 由调用者指定
	SV_API string  CreatIdcUser(string userindex, string pid="0", string addr="localhost");
	SV_API OBJECT	GetGroup(string groupid,string user="default",string addr="localhost");
	SV_API OBJECT CreateGroup();
	SV_API MAPNODE GetGroupMainAttribNode(OBJECT groupobj);
	SV_API bool GetSubGroupsIDByGroup(OBJECT groupobj,std::list<string> &idlist);
	SV_API bool GetSubGroupsIDByGroupEx(OBJECT groupobj,std::list<char *> &idlist);
	SV_API bool GetSubEntitysIDByGroup(OBJECT groupobj,std::list<string> &idlist);
	SV_API bool DeleteGroup(string groupid,string user="default",string addr="localhost");
	SV_API string AddNewGroup(OBJECT groupobj,string pid="1",string user="default",string addr="localhost");
	SV_API bool CloseGroup(OBJECT &groupobj);//删除对象，以免内存泄漏
	SV_API bool SubmitGroup(OBJECT groupobj,string user="default",string addr="localhost");
	// infoname传入"ObjectVersion"则返回 obj 版本戳,  user 可以指定父 id 
	SV_API bool GetAllGroupsInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");

	//////////////////////////////////////////////////////////////////////////
	// Task
	SV_API OBJECT GetTask(string taskname,string user="default",string addr="localhost");
	SV_API OBJECT CreateTask(string taskname);
	SV_API string GetTaskValue(string key,OBJECT taskobj);
	SV_API bool  SetTaskValue(string key,string value,OBJECT taskobj);
	SV_API bool  DeleteTaskKey(string key,OBJECT taskobj);
	SV_API bool  DeleteTask(string taskname,string user="default",string addr="localhost");
	SV_API bool GetAllTaskName(std::list<string> &tasknamelist,string user="default",string addr="localhost");
	SV_API bool GetAllTaskKeyName(std::list<string> &keynamelist,OBJECT taskobj);
	SV_API bool SubmitTask(OBJECT taskobj,string user="default",string addr="localhost");
	SV_API void CloseTask(OBJECT &taskobj);//删除对象，以免内存泄漏
	SV_API bool EditTask(OBJECT taskobj,string taskname="",string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// EntityGroup
	SV_API OBJECT GetEntityGroup(string entitygroupid,string user="default",string addr="localhost");
	SV_API OBJECT CreateEntityGroup(string entitygroupid);
	SV_API MAPNODE GetEntityGroupMainAttribNode(OBJECT egobj);
	SV_API bool GetSubEntityTempletIDByEG(std::list<string> &etlist,OBJECT egobj);
	SV_API bool DeleteEntityGroup(string entitygroupid,string user="default",string addr="localhost");
	SV_API bool AddSubEntityTempletIDToEG(OBJECT egobj,string entitytempletid);
	SV_API bool DeleteSubEntityTempletIDInEG(OBJECT egobj,string entitytempletid);
	SV_API bool SubmitEntityGroup(OBJECT egobj,string user="default",string addr="localhost");
	SV_API bool CloseEntityGroup(OBJECT &egobj);//删除对象，以免内存泄漏
	SV_API bool GetAllEntityGroups(PAIRLIST &retlist,string infoname="sv_Name",string user="default",string addr="localhost");
	SV_API OBJECT CloneEntityGroup(OBJECT egobj,string entitygroupid);


	//////////////////////////////////////////////////////////////////////////
	// EntityTemplet
	SV_API OBJECT GetEntityTemplet(string entitytempletid,string user="default",string addr="localhost");
	SV_API OBJECT CreateEntityTemplet(string entitytempletid);
	SV_API bool DeleteEntityTemplet(string entitytempletid,string user="default",string addr="localhost");
	SV_API MAPNODE GetEntityTempletMainAttribNode(OBJECT etobj);
	SV_API bool FindETContrlFirst(OBJECT etobj,LISTITEM &item);
	SV_API bool GetSubMonitorTypeByET(OBJECT etobj,std::list<int> &mtlist);
	SV_API std::list<int> & GetSubMonitorTypeList(OBJECT etobj);
	SV_API bool AddSubMonitorTypeToET(OBJECT etobj,int MonitorType);
	SV_API bool DeleteSubMonitorTypeInET(OBJECT etobj,int MonitorType);
	SV_API bool SubmitEntityTemplet(OBJECT etobj,string user="default",string addr="localhost");
	SV_API bool CloseEntityTemplet(OBJECT &etobj);//删除对象，以免内存泄漏
	SV_API bool GetAllEntityTemplets(PAIRLIST &retlist,string infoname="sv_Name",string user="default",string addr="localhost");
	SV_API bool GetAllEntityTempletsInProperty(string key,string value,std::list<string> &idlist,string user="default",string addr="localhost");
	SV_API OBJECT CloneEntityTemplet(OBJECT etobj,string entitytempletid);


	//////////////////////////////////////////////////////////////////////////
	// cache函数
	// 以下 14 个函数会将获取到的 object 缓存在本地，再次调用时将返回同一个引用
	// 务必保证不对以下 13 个函数获得的 object ,执行 CloseXXX(object); 因为万一之后在进程中其他地方引用该 object,将会导致“缓冲区溢出“.
	// 此函数会同时清空所有以下 13 个函数 (及CacheRefreshSVDYNs 2 函数) 创建的本地缓存,此函数非线程安全
	SV_API void SetCacheUserAddr(string user="default",string addr="localhost");

	// 以下 5 个函数获取最新 object 的方法是重启进程
	// 以下 5 个函数二次获取的时间极短，几乎不可测量
	SV_API OBJECT	Cache_GetMonitorTemplet(int id);
	SV_API OBJECT	Cache_GetEntityGroup(string entitygroupid);
	SV_API OBJECT	Cache_GetEntityTemplet(string entitytempletid);
	SV_API OBJECT	Cache_LoadResourceByKeys(string needkeys, string language="default");
	SV_API OBJECT	Cache_LoadResource(string language="default");
	
	// 以下 4 个函数在每次调用时都询问服务器，并保证获取最新版本的 object 。
	// 以下 4 个函数二次获取的速度比老函数快1-3倍
	SV_API OBJECT	Cache_GetSVSE(string id);
	SV_API OBJECT	Cache_GetGroup(string groupid);
	SV_API OBJECT	Cache_GetEntity(string entityid);
	SV_API OBJECT	Cache_GetMonitor(string monitorid);
	
	//以下2个函数配套使用，首次获取的速度比老函数快 五 倍，二次获取快 十几 倍 
	SV_API bool	CacheRefreshEntities(string parentid="default");//为 parentid 的所有子孙 entity 从服务器集中刷新最新版本
	SV_API OBJECT	CacheRefresh_GetEntity(string entityid);//返回本地缓存的 object (不询问服务器)

	// 以下2个函数配套使用，首次获取的速度比老函数快 五 倍，二次获取快 十几 倍 
	SV_API bool	CacheRefreshMonitors(string parentid="default");//为 parentid 的所有子孙 monitor 从服务器集中刷新最新版本
	SV_API OBJECT	CacheRefresh_GetMonitor(string monitorid);//返回本地缓存的 object (不询问服务器)


	//////////////////////////////////////////////////////////////////////////
	// Entity
	SV_API OBJECT	GetEntity(string entityid,string user="default",string addr="localhost");
	SV_API OBJECT CreateEntity();
	SV_API MAPNODE GetEntityMainAttribNode(OBJECT entityobj);
	SV_API bool GetSubMonitorsIDByEntity(OBJECT entityobj,std::list<string> &monitoridlist);
	SV_API bool DeleteEntity(string entityid,string user="default",string addr="localhost");
	SV_API string AddNewEntity(OBJECT entityobj,string groupid="1",string user="default",string addr="localhost");
	SV_API bool CloseEntity(OBJECT &entityobj);//删除对象，以免内存泄漏
	SV_API bool SubmitEntity(OBJECT entityobj,string user="default",string addr="localhost");
	// infoname传入"ObjectVersion"则返回 obj 版本戳,  user 可以指定父 id
	SV_API bool GetAllEntitysInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");
	SV_API string EntityCopy(string srcentityid,string objgroupid,string user="default",string addr="localhost");
	//拷贝设备及其下所有监测器，并创建相应的 table
	SV_API string EntityCopyAndCreateTable(string srcentityid,string objgroupid,string user="default",string addr="localhost");

	//////////////////////////////////////////////////////////////////////////
	// Resource API
	// 根据传入的以英文逗号“,”分割的 key 串，返回相应的 OBJECT , 由于只返回所需要的数据，速度将快得多。 
	// 注意：这种不完整的 obj ,是不可以 submit 的，如果强行 submit 会返回 false 。
	SV_API OBJECT LoadResourceByKeys(string needkeys, string language="default",string addr="localhost");
	SV_API OBJECT LoadResource(string language="default",string addr="localhost");
	SV_API OBJECT CreateResource(string language);
	SV_API MAPNODE GetResourceNode(OBJECT rcobj);
	SV_API bool	EnumResourceAttrib(OBJECT rcobj,PAIRLIST &retlist);
	SV_API bool	CloseResource(OBJECT &rcobj);//删除对象，以免内存泄漏
	SV_API bool	DeleteResource(string language,string addr="localhost");
	SV_API bool	SubmitResource(OBJECT rcobj,string addr="localhost");
	SV_API bool GetAllResourceInfo(PAIRLIST &retlist,string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	//                     返回的数据          父id   是否只包含直接儿子
	//当父id为"default" onlySon为false 时，返回整棵树；	当父id为"default" onlySon为true 时,返回最高一层节点
	//当父id是一个设备时，返回的监测器数据中将包含 creat_time 、dstr 等其他 dyn 信息
	//当某个节点只要有一个 监测器子孙 状态为 error、warning , 该节点的 status 就为 error、warning (另：error 覆盖 warning)
	//此功能不返回 pid 节点, 只返回其所有子孙
	SV_API bool GetForestData(ForestList & flist, string pid, bool onlySon=true, string addr="localhost");
	//                 父id   是否同时自动删除与监测器对应的 Table
	//递归删除服务器端的 pid 节点及其所有子孙, pid 不能是“default”,不能是 se 
	//注意一个问题：删除了pid 节点及其所有子孙后，pid的父亲 最好从服务器端 重新获取一下，
	//              否则客户端的 pid的父亲 仍然记忆着 pid (但pid其实已经被删除了)
	SV_API bool DelChildren(string pid, bool autoDelTable=true, string addr="localhost");
	//									传入的数据          父id  
	//此功能对 pid 节点及其所有子孙起作用, pid 不能是“default”,不能是 se 
	//比如要禁止监测器，就 sv_disable=true  (或 sv_disable=time  sv_starttime=XXX  sv_endtime=XXX )  给某一个节点及其所有子孙
	//比如要启动监测器，就 sv_disable=false (或 sv_disable=      sv_starttime=     sv_endtime=    )  给某一个节点及其所有子孙
	SV_API bool PutValueIntoChildren(const NodeData & ndata, string pid, string addr="localhost");
	// 在 ForestMap 中查找值
	SV_API string GetValueInForestMap(const ForestMap & fmap, string section, std::string key, string & estr);
	// 在输入参数 NodeData 中查找值
	SV_API string GetValueInNodeData(const NodeData & inwhat, string key, string & estr);
	// 设置 NodeData
	SV_API void PutValueInNodeData(NodeData & inwhat, string key, string value);
	// 设置返回的 ForestMap
	SV_API void PutReturnForestMap(ForestMap & fmap, string section, string key, string value);
	// 把 svapi 的 MAPNODE 转换入 ForestMap	
	SV_API bool PutMapnodeIntoForestMap(ForestMap & fmap, string section, MAPNODE ma);
	//把 MAPNODE 中的 “sv_dependson”解析到 “sv_dependson_text”
	SV_API bool PutSvDependsonText(ForestMap & fmap, string section, MAPNODE ma);
	// 删除字符串前后的空格
	SV_API string TrimSpace(const std::string & input);

}	// namespace SV

#endif	// __SV_API_H__