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
// ������GetIniFileValueType���ܷ��ص�ֵ
#define INIVALUE_FAILED	-1			//��ȡʧ��
#define INIVALUE_NULL	0			//δ֪����
#define INIVALUE_INT	1			//��������
#define	INIVALUE_STRING	2			//�ַ���������
#define INIVALUE_BINARY	3			//��������������

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
	//    ��SVDB��������ȡ����.
	// Parameters:
	//    0) [in] fmap:		��SVDB��������ȡ����
	//    1) [in] inwhat:		���������
	//    2) [in] estr:			���صĴ�����Ϣ
	// Returned value:
	//    0 - success, other - failed.
	SV_API int GetUnivData(ForestMap & fmap, const NodeData & inwhat, string & estr);

	// Functionality:
	//    ��SVDB��������ȡ������.
	// Parameters:
	//    0) [in] fmap:		��SVDB��������ȡ����
	//    1) [in] inwhat:		���������
	//    2) [in] estr:			���صĴ�����Ϣ
	// Returned value:
	//    0 - success, other - failed.
	SV_API int GetForestData(ForestMap & fmap, const NodeData & inwhat, string & estr);

	// Functionality:
	//    ��SVDB�������ύ����.
	// Parameters:
	//    0) [in] flist:		��SVDB�������ύ����
	//    1) [in] inwhat:		���������
	//    2) [in] estr:			���صĴ�����Ϣ
	// Returned value:
	//    0 - success, other - failed.
	SV_API int SubmitUnivData(ForestList & flist, const NodeData & inwhat, string & estr);


	//////////////////////////////////////////////////////////////////////////
	// General API
	SV_API bool	EnumNodeAttrib(MAPNODE node,PAIRLIST &retlist);
	SV_API unsigned int GetNodeSize(MAPNODE node);
	SV_API bool	ClearMapNode(MAPNODE node);//������е�ֵ
	SV_API bool	FindNodeValue(MAPNODE node,string name,string &value);
	SV_API bool	DeleteNodeAttrib(MAPNODE node,string name);
	SV_API bool	AddNodeAttrib(MAPNODE node,const SVPAIR &data);
	SV_API bool	AddNodeAttrib(MAPNODE node,string name,string value);
	SV_API MAPNODE	CreateNewMapNode();
	SV_API MAPNODE CloneMapNode(MAPNODE node);
	SV_API void	CloseMapNodeObject(OBJECT &obj);  //��������������

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
	//��ȡָ���ļ���ָ���ֶΣ�������Ϊһ��ȫ�� string ����
	//�����õķ���: SetCgiVersionByFile(""); �����᷵��false ��ͬʱȡ��֮ǰ������;   �κ�ʹ�ú�������false�����,���������á�
	SV_API string GetCgiVersion(void);//��ȡ��һ�������õ�ȫ�� string ����
	SV_API string	GetSiteViewRootPath();//��ȡ svapi.dll ���ڻ�����ע���,������ svdb.exe ���ڻ�����ע���
	SV_API string GetMasterAddress();
	SV_API bool isDemoMode();
	SV_API string	FindParentID(string id);
	SV_API int	FindIndexByID(string id);
	SV_API bool IsSVSEID(string id);
	SV_API string FindSEID(string id);
	//ÿ��ini �ļ������ж�� section, ÿ��section �����ж���� key = value �������ݶ�
	//ÿһ��key ���������ͣ� int��string, binary ,����д�������Ӧ����
	//  ע�⣺  ------------------------------   ע��
	//  ע�⣺��� svdb.exe ����Ϊ��idc�棬�����º�������� user ����ȫ������������ȫ������Ϊ��default��ȡ����Ŀ¼�µ� ini �ļ�
	//  ע�⣺  ------------------------------   ע��
	SV_API bool GetIniFileSections(std::list<string> &sectionlist,string filename,string addr="localhost",string user="default");
	//��ȡĳ��ini�ļ������е� section  ��//���� section��list ���ã� ini�ļ�����SVDB ��ַ�� idc�û�id
	
	SV_API bool GetIniFileKeys(string section,std::list<string> &keylist,string filename,string addr="localhost",string user="default");
	//��ȡĳ��section �µ����е�key
	
	SV_API int	GetIniFileValueType(string section,string key,string filename,string addr="localhost",string user="default");
	//��ȡĳ�� key ������


	//����д��(׷��)string ��ֵ��ĳsection�У�// ��������,   section����      ini�ļ�����   SVDB ��ַ��             idc�û�id
	SV_API bool WriteIniSectionManyString(const NodeData & ndata, string section, string filename, string addr="localhost",string user="default");


	// ����key������дini��3������ ��// section����   key ����value ֵ��  ini�ļ�����SVDB ��ַ�� idc�û�id
	SV_API bool WriteIniFileString(string section,string key,string str,string filename,string addr="localhost",string user="default");
	SV_API bool WriteIniFileInt(string section,string key,int value,string filename,string addr="localhost",string user="default");
	SV_API bool WriteIniFileStruct(string section,string key, void *data,unsigned int len,string filename,string addr="localhost",string user="default");

	// ����key�����Ͷ�ini��3��������            // Ĭ�Ϸ���ֵ������裩
	SV_API string GetIniFileString(string section,string key,string defaultret,string filename,string addr="localhost",string user="default");
	SV_API int	GetIniFileInt(string section,string key,int defaultret,string filename,string addr="localhost",string user="default");
	SV_API bool GetIniFileStruct(string section,string key,void *buf,unsigned int &len,string filename,string addr="localhost",string user="default");
	SV_API bool DeleteIniFileSection(string section,string filename,string addr="localhost",string user="default");
	//ɾ��ĳ�� section
	SV_API bool DeleteIniFileKey(string section,string key,string filename,string addr="localhost",string user="default");
	//ɾ��ĳ�� key
	SV_API bool EditIniFileSection(string oldsection,string newsection,string filename,string addr="localhost",string user="default");
	//�޸�ĳ�� section
	SV_API bool EditIniFileKey(string section,string oldkey,string newkey,string filename,string addr="localhost",string user="default");
	//�޸�ĳ�� key
	SV_API bool CopyIniFile(string filecopy,string addr="localhost",string user="default");
	//���� .ini �ļ� , �˺����ṩ�� idc ��ʹ�ã��Ὣ��Ŀ¼�µ� .ini ������ĳ�� idc �û���Ŀ¼��,��������
	//string filecopy �Ĺ���,�磺��yewuhumenu.ini,menu.ini;license.ini,license.ini��
	//                             Դ�ļ���    ,Ŀ���ļ���; Դ�ļ���    ,Ŀ���ļ���
	// ���ص�����    �� ini�ļ�����     ��Ҫ�� sections ��           SVDB ��ַ��         idc�û�id
	//���ݴ������Ӣ�Ķ��š�,���ָ�� sections ����������Ӧ�� svinifile ��������� sections Ϊ ��default�� �򷵻�ȫ��
	//�� key ������Ϊ int ,��תΪ string ���أ� ��������ֻ����˵������ INIVALUE_BINARY ���������ͣ�ֻ���ء�Binary data���� 
	//����ֻҪһ�κ������ã�����ԭ���ľɷ�����ܶ� 
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
	//ɾ�����������ڴ�й©
	SV_API bool CloseSVSE(OBJECT &svseobj);
	SV_API string AddNewSVSE(OBJECT svseobj,string user="default",string addr="localhost");
	SV_API bool SubmitSVSE(OBJECT svseobj,string user="default",string addr="localhost");
	//�������� SE �� label
	SV_API bool GetAllSVSEInfo(PAIRLIST &retlist,string user="default",string addr="localhost");
	// ����"ObjectVersion"���򷵻� obj �汾��
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
	// infoname����"ObjectVersion"�򷵻� obj �汾��,  user ����ָ���� id 
	SV_API bool GetAllMonitorsInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");
	SV_API string MonitorCopy(string srcmonitorid,string objentityid,string user="default",string addr="localhost");
	//�������������������Ӧ�� table
	SV_API string MonitorCopyAndCreateTable(string srcmonitorid,string objentityid,string user="default",string addr="localhost");
	SV_API bool GetMonitorsInfoBySE(string seid,PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// Group
	// ����һ�� idc �û�   �� userindex �� cgi����Ҫ�õ���һ�� �û�index��������ֻ���� cgi �����Զ�������һ����
	// pid ��idc �û��� se ���׵� id �� �� pid=="0" ʱ ��ϵͳ�Զ�Ѱ�Һ��ʵ� se ����ӣ�  �� pid!="0" ʱ �ɵ�����ָ��
	SV_API string  CreatIdcUser(string userindex, string pid="0", string addr="localhost");
	SV_API OBJECT	GetGroup(string groupid,string user="default",string addr="localhost");
	SV_API OBJECT CreateGroup();
	SV_API MAPNODE GetGroupMainAttribNode(OBJECT groupobj);
	SV_API bool GetSubGroupsIDByGroup(OBJECT groupobj,std::list<string> &idlist);
	SV_API bool GetSubGroupsIDByGroupEx(OBJECT groupobj,std::list<char *> &idlist);
	SV_API bool GetSubEntitysIDByGroup(OBJECT groupobj,std::list<string> &idlist);
	SV_API bool DeleteGroup(string groupid,string user="default",string addr="localhost");
	SV_API string AddNewGroup(OBJECT groupobj,string pid="1",string user="default",string addr="localhost");
	SV_API bool CloseGroup(OBJECT &groupobj);//ɾ�����������ڴ�й©
	SV_API bool SubmitGroup(OBJECT groupobj,string user="default",string addr="localhost");
	// infoname����"ObjectVersion"�򷵻� obj �汾��,  user ����ָ���� id 
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
	SV_API void CloseTask(OBJECT &taskobj);//ɾ�����������ڴ�й©
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
	SV_API bool CloseEntityGroup(OBJECT &egobj);//ɾ�����������ڴ�й©
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
	SV_API bool CloseEntityTemplet(OBJECT &etobj);//ɾ�����������ڴ�й©
	SV_API bool GetAllEntityTemplets(PAIRLIST &retlist,string infoname="sv_Name",string user="default",string addr="localhost");
	SV_API bool GetAllEntityTempletsInProperty(string key,string value,std::list<string> &idlist,string user="default",string addr="localhost");
	SV_API OBJECT CloneEntityTemplet(OBJECT etobj,string entitytempletid);


	//////////////////////////////////////////////////////////////////////////
	// cache����
	// ���� 14 �������Ὣ��ȡ���� object �����ڱ��أ��ٴε���ʱ������ͬһ������
	// ��ر�֤�������� 13 ��������õ� object ,ִ�� CloseXXX(object); ��Ϊ��һ֮���ڽ����������ط����ø� object,���ᵼ�¡������������.
	// �˺�����ͬʱ����������� 13 ������ (��CacheRefreshSVDYNs 2 ����) �����ı��ػ���,�˺������̰߳�ȫ
	SV_API void SetCacheUserAddr(string user="default",string addr="localhost");

	// ���� 5 ��������ȡ���� object �ķ�������������
	// ���� 5 ���������λ�ȡ��ʱ�伫�̣��������ɲ���
	SV_API OBJECT	Cache_GetMonitorTemplet(int id);
	SV_API OBJECT	Cache_GetEntityGroup(string entitygroupid);
	SV_API OBJECT	Cache_GetEntityTemplet(string entitytempletid);
	SV_API OBJECT	Cache_LoadResourceByKeys(string needkeys, string language="default");
	SV_API OBJECT	Cache_LoadResource(string language="default");
	
	// ���� 4 ��������ÿ�ε���ʱ��ѯ�ʷ�����������֤��ȡ���°汾�� object ��
	// ���� 4 ���������λ�ȡ���ٶȱ��Ϻ�����1-3��
	SV_API OBJECT	Cache_GetSVSE(string id);
	SV_API OBJECT	Cache_GetGroup(string groupid);
	SV_API OBJECT	Cache_GetEntity(string entityid);
	SV_API OBJECT	Cache_GetMonitor(string monitorid);
	
	//����2����������ʹ�ã��״λ�ȡ���ٶȱ��Ϻ����� �� �������λ�ȡ�� ʮ�� �� 
	SV_API bool	CacheRefreshEntities(string parentid="default");//Ϊ parentid ���������� entity �ӷ���������ˢ�����°汾
	SV_API OBJECT	CacheRefresh_GetEntity(string entityid);//���ر��ػ���� object (��ѯ�ʷ�����)

	// ����2����������ʹ�ã��״λ�ȡ���ٶȱ��Ϻ����� �� �������λ�ȡ�� ʮ�� �� 
	SV_API bool	CacheRefreshMonitors(string parentid="default");//Ϊ parentid ���������� monitor �ӷ���������ˢ�����°汾
	SV_API OBJECT	CacheRefresh_GetMonitor(string monitorid);//���ر��ػ���� object (��ѯ�ʷ�����)


	//////////////////////////////////////////////////////////////////////////
	// Entity
	SV_API OBJECT	GetEntity(string entityid,string user="default",string addr="localhost");
	SV_API OBJECT CreateEntity();
	SV_API MAPNODE GetEntityMainAttribNode(OBJECT entityobj);
	SV_API bool GetSubMonitorsIDByEntity(OBJECT entityobj,std::list<string> &monitoridlist);
	SV_API bool DeleteEntity(string entityid,string user="default",string addr="localhost");
	SV_API string AddNewEntity(OBJECT entityobj,string groupid="1",string user="default",string addr="localhost");
	SV_API bool CloseEntity(OBJECT &entityobj);//ɾ�����������ڴ�й©
	SV_API bool SubmitEntity(OBJECT entityobj,string user="default",string addr="localhost");
	// infoname����"ObjectVersion"�򷵻� obj �汾��,  user ����ָ���� id
	SV_API bool GetAllEntitysInfo(PAIRLIST &retlist,string infoname="sv_label",string user="default",string addr="localhost");
	SV_API string EntityCopy(string srcentityid,string objgroupid,string user="default",string addr="localhost");
	//�����豸���������м��������������Ӧ�� table
	SV_API string EntityCopyAndCreateTable(string srcentityid,string objgroupid,string user="default",string addr="localhost");

	//////////////////////////////////////////////////////////////////////////
	// Resource API
	// ���ݴ������Ӣ�Ķ��š�,���ָ�� key ����������Ӧ�� OBJECT , ����ֻ��������Ҫ�����ݣ��ٶȽ���öࡣ 
	// ע�⣺���ֲ������� obj ,�ǲ����� submit �ģ����ǿ�� submit �᷵�� false ��
	SV_API OBJECT LoadResourceByKeys(string needkeys, string language="default",string addr="localhost");
	SV_API OBJECT LoadResource(string language="default",string addr="localhost");
	SV_API OBJECT CreateResource(string language);
	SV_API MAPNODE GetResourceNode(OBJECT rcobj);
	SV_API bool	EnumResourceAttrib(OBJECT rcobj,PAIRLIST &retlist);
	SV_API bool	CloseResource(OBJECT &rcobj);//ɾ�����������ڴ�й©
	SV_API bool	DeleteResource(string language,string addr="localhost");
	SV_API bool	SubmitResource(OBJECT rcobj,string addr="localhost");
	SV_API bool GetAllResourceInfo(PAIRLIST &retlist,string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	//                     ���ص�����          ��id   �Ƿ�ֻ����ֱ�Ӷ���
	//����idΪ"default" onlySonΪfalse ʱ��������������	����idΪ"default" onlySonΪtrue ʱ,�������һ��ڵ�
	//����id��һ���豸ʱ�����صļ���������н����� creat_time ��dstr ������ dyn ��Ϣ
	//��ĳ���ڵ�ֻҪ��һ�� ��������� ״̬Ϊ error��warning , �ýڵ�� status ��Ϊ error��warning (��error ���� warning)
	//�˹��ܲ����� pid �ڵ�, ֻ��������������
	SV_API bool GetForestData(ForestList & flist, string pid, bool onlySon=true, string addr="localhost");
	//                 ��id   �Ƿ�ͬʱ�Զ�ɾ����������Ӧ�� Table
	//�ݹ�ɾ���������˵� pid �ڵ㼰����������, pid �����ǡ�default��,������ se 
	//ע��һ�����⣺ɾ����pid �ڵ㼰�����������pid�ĸ��� ��ôӷ������� ���»�ȡһ�£�
	//              ����ͻ��˵� pid�ĸ��� ��Ȼ������ pid (��pid��ʵ�Ѿ���ɾ����)
	SV_API bool DelChildren(string pid, bool autoDelTable=true, string addr="localhost");
	//									���������          ��id  
	//�˹��ܶ� pid �ڵ㼰����������������, pid �����ǡ�default��,������ se 
	//����Ҫ��ֹ��������� sv_disable=true  (�� sv_disable=time  sv_starttime=XXX  sv_endtime=XXX )  ��ĳһ���ڵ㼰����������
	//����Ҫ������������� sv_disable=false (�� sv_disable=      sv_starttime=     sv_endtime=    )  ��ĳһ���ڵ㼰����������
	SV_API bool PutValueIntoChildren(const NodeData & ndata, string pid, string addr="localhost");
	// �� ForestMap �в���ֵ
	SV_API string GetValueInForestMap(const ForestMap & fmap, string section, std::string key, string & estr);
	// ��������� NodeData �в���ֵ
	SV_API string GetValueInNodeData(const NodeData & inwhat, string key, string & estr);
	// ���� NodeData
	SV_API void PutValueInNodeData(NodeData & inwhat, string key, string value);
	// ���÷��ص� ForestMap
	SV_API void PutReturnForestMap(ForestMap & fmap, string section, string key, string value);
	// �� svapi �� MAPNODE ת���� ForestMap	
	SV_API bool PutMapnodeIntoForestMap(ForestMap & fmap, string section, MAPNODE ma);
	//�� MAPNODE �е� ��sv_dependson�������� ��sv_dependson_text��
	SV_API bool PutSvDependsonText(ForestMap & fmap, string section, MAPNODE ma);
	// ɾ���ַ���ǰ��Ŀո�
	SV_API string TrimSpace(const std::string & input);

}	// namespace SV

#endif	// __SV_API_H__