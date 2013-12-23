//////////////////////////////////////////////////////////////////////////
//
// Copyright (C), 2002-2012, SiteView.
// FileName: svdbapi.h
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

#ifndef	__SVDB_API_H__
#define	__SVDB_API_H__

#include "svapi.h"
#include "..\libutil\svtime.h"

typedef int BOOL;
typedef void*	RECORD;
typedef void*	RECORDSET;
typedef void*	MQRECORD;

using namespace svutil;

struct sv_dyn
{
	sv_dyn()
	{
		m_state=0;
		m_laststatekeeptimes=0;
		m_displaystr=NULL;
	}
	~sv_dyn()
	{
		if(m_displaystr!=NULL)
			free(m_displaystr);
	}

	TTime m_time;
	int	 m_state;
	TTimeSpan m_keeplaststatetime;
	unsigned int m_laststatekeeptimes;
	char *m_displaystr; // AppendRecord 时创建的

};
typedef struct sv_dyn	SVDYN;

//一条监测数据
class SingelRecord
{
public:
	SingelRecord():monitorid(""),datalen(0),data(NULL) {}
	~SingelRecord()	{}

	string monitorid;		//表名称
	unsigned int datalen;	//数据长度
	const char *data;		//二进制数据指针
};

namespace SV
{
	//////////////////////////////////////////////////////////////////////////
	// svdyn
	SV_API bool GetSVDYN(string monitorid,SVDYN &dyn,string user="default",string addr="localhost");
	SV_API bool BuildDynByData(const char *data,unsigned int len,SVDYN &dyn);
	SV_API bool GetSVDYNNODisplayString(string monitorid,SVDYN &dyn,string user="default",string addr="localhost");
	SV_API bool SetDYN(string monitorid,int type,string user="default",string addr="localhost");
	// 以下2个函数配套使用，首次获取的速度比老函数快 5 倍，二次获取快 10 倍
	// 为 parentid 的所有子孙从服务器获取 dyn ,并缓存在本地. parentid 最高可以是 "1"、"2" 等 SE 的 id
	SV_API bool CacheRefreshSVDYNs(string parentid);
	SV_API bool Cache_GetSVDYN(string monitorid,SVDYN &dyn);//返回本地缓存的 dyn (不询问服务器)

	// fmap 为此次刷新得到的 record , command=0 为标准功能/ =1 是给 OneCMDB 的
	// 为 parentid 的所有子孙从服务器获取最新 record ,并缓存在本地
	// parentid 最高可以是 "1"、"2" 等 SE 的 id
	SV_API bool CacheRefreshLatestRecords(string parentid, ForestMap & fmap, int command=0);


	//////////////////////////////////////////////////////////////////////////
	// DB
	//查询数据库的三种方法，均返回一个 RECORDSET 对象，再从这个对象中查询相应的 记录或数据
	SV_API RECORDSET QueryRecords(string monitorid,TTimeSpan recenttimespan,string user="default",string addr="localhost");
	//根据 TTimeSpan 查询某个表，   表名称，       时间段，
	SV_API RECORDSET QueryRecords(string monitorid,TTime begin,TTime end,string user="default",string addr="localhost");
	//根据 TTime查询某个表，       表名称， 起始时间， 结束时间
	SV_API RECORDSET QueryRecords(string monitorid,int count,string user="default",string addr="localhost");
	//根据 最新的记录条数 查询某个表， 表名称， 指定最新的记录条数
	SV_API bool  QueryRecordCount(string monitorid,int & count,string user="default",string addr="localhost");
	// 远程获取某个表中的记录条数
	SV_API bool  GetRecordCount(RECORDSET rset,size_t &count);
	// 获取某个 RECORDSET 对象 中的记录条数
	SV_API bool GetReocrdSetField(RECORDSET rset,std::list<string> &fieldlist);
	// 获取某个 RECORDSET 对象 中的字段名
	SV_API bool GetReocrdSetMonitorType(RECORDSET rset,int &type);
	// 获取某个 RECORDSET 对象的监测器type
	SV_API bool GetRecordSetMonitorID(RECORDSET rset,string &monitorid);
	// 获取某个 RECORDSET 对象的监测器id
	SV_API bool FindRecordFirst(RECORDSET rset,LISTITEM &item);
	// 获取某个 RECORDSET 对象 中的第一个记录，并将所有的记录放到 LISTITEM 中
	SV_API RECORD FindNextRecord(LISTITEM &item);
	// 获取LISTITEM 中的下一个记录
	SV_API void ReleaseRecordList(LISTITEM &item);
	// 删除 LISTITEM ，以免内存泄漏
	SV_API bool ResetRecordList(LISTITEM &item);
	// 重置 LISTITEM
	SV_API RECORD FindPreReocrd(LISTITEM &item);
	// 获取LISTITEM 中的上一个记录
	SV_API bool GetRecordState(RECORD rd,int &state);
	SV_API bool GetRecordCreateTime(RECORD rd,TTime &tm);
	//获取一个记录的创建时间
	SV_API bool GetRecordValueByField(RECORD rd,string Field,int &type,int &state,int &iv,float &fv,string &sv);
	//获取一个记录中的数据            指定记录的字段名，某字段值的类型，记录状态
	//本函数要根据int &type 的值，决定采用下列哪一个引用值： int &iv,float &fv,string &sv
	//字段值的类型:nulltype=0, inttype=1, floattype=2, stringtype=3
	SV_API bool GetRecordDisplayString(RECORD rd,int &state,string &dstr);
	//获取某个记录的 状态，和 dstr( svapi 动态地将各字段拼接成一个字符串)
	SV_API void CloseRecordSet(RECORDSET &rset);
	//删除一个RECORDSET对象，以免内存泄漏
	SV_API bool DeleteRecords(string monitorid,svutil::TTime before,string user="default",string addr="localhost");
	//删除某个表中的指定时间以前的记录，因为删除是按 4KB 一页的页式删除, 因此没法精确删除所有指定时间之前的记录,可能会少删


	//获取所有数据库表的名字
	SV_API bool GetAllTableNames(std::list<string> &namelist,string user="default",string addr="localhost");
	//插入一个数据库表       表名称，   监测器type
	SV_API bool InsertTable(string monitorid,int monitortype,string user="default",string addr="localhost");
	//删除一个数据库表
	SV_API bool DeleteTable(string monitorid,string user="default",string addr="localhost");
	//插入一条记录到指定表中     表名称，  二进制数据指针，   数据长度
	SV_API bool AppendRecord(string monitorid,const char *data,unsigned int len,string user="default",string addr="localhost");
	//插入若干条记录 
	SV_API bool AppendMassRecord(std::list<SingelRecord> & listrcd,string user="default",string addr="localhost");
	SV_API bool SetLogKeepDays(int days,string user="default",string addr="localhost");
	SV_API bool GetLogKeepDays(int &days,string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// Message queue
	//	CreateQueue //创建一个 消息队列
	//	PushMessage //向一个消息队列里 压入一条 二进制数据的 消息
	//  PushStringMessage //向一个消息队列里 压入一条 string 消息

	//	Bool PopMessage //获取一条消息的数据，并删除该消息
	//	Bool BlockPopMessage //阻塞获取一条消息的数据，并删除该消息

	//	MQRECORD PopMessage //获取一条消息的对象（再用GetMessageData 获取其数据），并删除该消息
	//	MQRECORD BlockPopMessage //阻塞获取一条消息的对象（再用GetMessageData 获取其数据），并删除该消息

	//	Bool PeekMQMessage //只获取一条消息的数据，不删除该消息
	//	Bool BlockPeekMQMessage//只阻塞获取一条消息的数据，不删除该消息

	//	MQRECORD PeekMQMessage //只获取一条消息的对象（再用GetMessageData 获取其数据），并不删除该消息
	//	MQRECORD BlockPeekMQMessage//只阻塞获取一条消息的对象（再用GetMessageData 获取其数据），并不删除该消息

	//	GetMessageData // 从消息对象里获取消息数据
	//	CloseMQRecord // 删除消息对象，以免内存泄漏
	//	GetMQRecordCount //得到一个消息队列中的消息个数
	//	GetAllQueueNames //获取所有消息队列的名字
	//	DeleteQueue //删除一个消息队列
	//	ClearQueueMessage //清空一个消息队列

	//  GetAllMessageLabels  //获取一个消息队列的所有消息的 label 和 创建时间
	// 创建一个 消息队列		//这个type别管它，取1就行
	SV_API bool CreateQueue(string queuename,int type=1,string user="default",string addr="localhost");
	// 队列名称 ,    队列 label ,   二进制数据指针，  数据长度
	SV_API bool PushMessage(string queuename,string label,const char *data,unsigned int datalen,string user="default",string addr="localhost");
	// 队列名称 ,    队列 label ,     消息内容
	SV_API bool PushStringMessage(string queuename,string label,string content,string user="default",string addr="localhost");
	//	获取消息label ,   获取消息创建时间. 等待时间 单位timer：秒
	SV_API bool PopMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API bool BlockPopMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,string user="default",string addr="localhost");
	SV_API MQRECORD PopMessage(string queuename,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API MQRECORD BlockPopMessage(string queuename,string user="default",string addr="localhost");
	SV_API bool PeekMQMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API bool BlockPeekMQMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,string user="default",string addr="localhost");
	SV_API MQRECORD PeekMQMessage(string queuename,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API MQRECORD BlockPeekMQMessage(string queuename,string user="default",string addr="localhost");
	// 从消息对象里获取消息数据
	SV_API bool GetMessageData(MQRECORD record,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen);
	SV_API bool CloseMQRecord(MQRECORD &record);
	// 得到一个消息队列中的消息个数
	SV_API bool GetMQRecordCount(string queuename,unsigned int &count,string user="default",string addr="localhost");
	// 获取所有消息队列的名字
	SV_API bool GetAllQueueNames(std::list<string> &namelist,string user="default",string addr="localhost");
	//删除一个消息队列
	SV_API bool DeleteQueue(string queuename,string user="default",string addr="localhost");
	//清空一个消息队列
	SV_API bool ClearQueueMessage(string queuename,string user="default",string addr="localhost");
	//获取一个消息队列的所有消息的        label(string) 和 创建时间(string)
	SV_API bool GetAllMessageLabels(string queuename,std::list<string> & retlist,string user="default",string addr="localhost");
	
}	// namespace SV

#endif	// __SVDB_API_H__



