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
	char *m_displaystr; // AppendRecord ʱ������

};
typedef struct sv_dyn	SVDYN;

//һ���������
class SingelRecord
{
public:
	SingelRecord():monitorid(""),datalen(0),data(NULL) {}
	~SingelRecord()	{}

	string monitorid;		//������
	unsigned int datalen;	//���ݳ���
	const char *data;		//����������ָ��
};

namespace SV
{
	//////////////////////////////////////////////////////////////////////////
	// svdyn
	SV_API bool GetSVDYN(string monitorid,SVDYN &dyn,string user="default",string addr="localhost");
	SV_API bool BuildDynByData(const char *data,unsigned int len,SVDYN &dyn);
	SV_API bool GetSVDYNNODisplayString(string monitorid,SVDYN &dyn,string user="default",string addr="localhost");
	SV_API bool SetDYN(string monitorid,int type,string user="default",string addr="localhost");
	// ����2����������ʹ�ã��״λ�ȡ���ٶȱ��Ϻ����� 5 �������λ�ȡ�� 10 ��
	// Ϊ parentid ����������ӷ�������ȡ dyn ,�������ڱ���. parentid ��߿����� "1"��"2" �� SE �� id
	SV_API bool CacheRefreshSVDYNs(string parentid);
	SV_API bool Cache_GetSVDYN(string monitorid,SVDYN &dyn);//���ر��ػ���� dyn (��ѯ�ʷ�����)

	// fmap Ϊ�˴�ˢ�µõ��� record , command=0 Ϊ��׼����/ =1 �Ǹ� OneCMDB ��
	// Ϊ parentid ����������ӷ�������ȡ���� record ,�������ڱ���
	// parentid ��߿����� "1"��"2" �� SE �� id
	SV_API bool CacheRefreshLatestRecords(string parentid, ForestMap & fmap, int command=0);


	//////////////////////////////////////////////////////////////////////////
	// DB
	//��ѯ���ݿ�����ַ�����������һ�� RECORDSET �����ٴ���������в�ѯ��Ӧ�� ��¼������
	SV_API RECORDSET QueryRecords(string monitorid,TTimeSpan recenttimespan,string user="default",string addr="localhost");
	//���� TTimeSpan ��ѯĳ����   �����ƣ�       ʱ��Σ�
	SV_API RECORDSET QueryRecords(string monitorid,TTime begin,TTime end,string user="default",string addr="localhost");
	//���� TTime��ѯĳ����       �����ƣ� ��ʼʱ�䣬 ����ʱ��
	SV_API RECORDSET QueryRecords(string monitorid,int count,string user="default",string addr="localhost");
	//���� ���µļ�¼���� ��ѯĳ���� �����ƣ� ָ�����µļ�¼����
	SV_API bool  QueryRecordCount(string monitorid,int & count,string user="default",string addr="localhost");
	// Զ�̻�ȡĳ�����еļ�¼����
	SV_API bool  GetRecordCount(RECORDSET rset,size_t &count);
	// ��ȡĳ�� RECORDSET ���� �еļ�¼����
	SV_API bool GetReocrdSetField(RECORDSET rset,std::list<string> &fieldlist);
	// ��ȡĳ�� RECORDSET ���� �е��ֶ���
	SV_API bool GetReocrdSetMonitorType(RECORDSET rset,int &type);
	// ��ȡĳ�� RECORDSET ����ļ����type
	SV_API bool GetRecordSetMonitorID(RECORDSET rset,string &monitorid);
	// ��ȡĳ�� RECORDSET ����ļ����id
	SV_API bool FindRecordFirst(RECORDSET rset,LISTITEM &item);
	// ��ȡĳ�� RECORDSET ���� �еĵ�һ����¼���������еļ�¼�ŵ� LISTITEM ��
	SV_API RECORD FindNextRecord(LISTITEM &item);
	// ��ȡLISTITEM �е���һ����¼
	SV_API void ReleaseRecordList(LISTITEM &item);
	// ɾ�� LISTITEM �������ڴ�й©
	SV_API bool ResetRecordList(LISTITEM &item);
	// ���� LISTITEM
	SV_API RECORD FindPreReocrd(LISTITEM &item);
	// ��ȡLISTITEM �е���һ����¼
	SV_API bool GetRecordState(RECORD rd,int &state);
	SV_API bool GetRecordCreateTime(RECORD rd,TTime &tm);
	//��ȡһ����¼�Ĵ���ʱ��
	SV_API bool GetRecordValueByField(RECORD rd,string Field,int &type,int &state,int &iv,float &fv,string &sv);
	//��ȡһ����¼�е�����            ָ����¼���ֶ�����ĳ�ֶ�ֵ�����ͣ���¼״̬
	//������Ҫ����int &type ��ֵ����������������һ������ֵ�� int &iv,float &fv,string &sv
	//�ֶ�ֵ������:nulltype=0, inttype=1, floattype=2, stringtype=3
	SV_API bool GetRecordDisplayString(RECORD rd,int &state,string &dstr);
	//��ȡĳ����¼�� ״̬���� dstr( svapi ��̬�ؽ����ֶ�ƴ�ӳ�һ���ַ���)
	SV_API void CloseRecordSet(RECORDSET &rset);
	//ɾ��һ��RECORDSET���������ڴ�й©
	SV_API bool DeleteRecords(string monitorid,svutil::TTime before,string user="default",string addr="localhost");
	//ɾ��ĳ�����е�ָ��ʱ����ǰ�ļ�¼����Ϊɾ���ǰ� 4KB һҳ��ҳʽɾ��, ���û����ȷɾ������ָ��ʱ��֮ǰ�ļ�¼,���ܻ���ɾ


	//��ȡ�������ݿ�������
	SV_API bool GetAllTableNames(std::list<string> &namelist,string user="default",string addr="localhost");
	//����һ�����ݿ��       �����ƣ�   �����type
	SV_API bool InsertTable(string monitorid,int monitortype,string user="default",string addr="localhost");
	//ɾ��һ�����ݿ��
	SV_API bool DeleteTable(string monitorid,string user="default",string addr="localhost");
	//����һ����¼��ָ������     �����ƣ�  ����������ָ�룬   ���ݳ���
	SV_API bool AppendRecord(string monitorid,const char *data,unsigned int len,string user="default",string addr="localhost");
	//������������¼ 
	SV_API bool AppendMassRecord(std::list<SingelRecord> & listrcd,string user="default",string addr="localhost");
	SV_API bool SetLogKeepDays(int days,string user="default",string addr="localhost");
	SV_API bool GetLogKeepDays(int &days,string user="default",string addr="localhost");


	//////////////////////////////////////////////////////////////////////////
	// Message queue
	//	CreateQueue //����һ�� ��Ϣ����
	//	PushMessage //��һ����Ϣ������ ѹ��һ�� ���������ݵ� ��Ϣ
	//  PushStringMessage //��һ����Ϣ������ ѹ��һ�� string ��Ϣ

	//	Bool PopMessage //��ȡһ����Ϣ�����ݣ���ɾ������Ϣ
	//	Bool BlockPopMessage //������ȡһ����Ϣ�����ݣ���ɾ������Ϣ

	//	MQRECORD PopMessage //��ȡһ����Ϣ�Ķ�������GetMessageData ��ȡ�����ݣ�����ɾ������Ϣ
	//	MQRECORD BlockPopMessage //������ȡһ����Ϣ�Ķ�������GetMessageData ��ȡ�����ݣ�����ɾ������Ϣ

	//	Bool PeekMQMessage //ֻ��ȡһ����Ϣ�����ݣ���ɾ������Ϣ
	//	Bool BlockPeekMQMessage//ֻ������ȡһ����Ϣ�����ݣ���ɾ������Ϣ

	//	MQRECORD PeekMQMessage //ֻ��ȡһ����Ϣ�Ķ�������GetMessageData ��ȡ�����ݣ�������ɾ������Ϣ
	//	MQRECORD BlockPeekMQMessage//ֻ������ȡһ����Ϣ�Ķ�������GetMessageData ��ȡ�����ݣ�������ɾ������Ϣ

	//	GetMessageData // ����Ϣ�������ȡ��Ϣ����
	//	CloseMQRecord // ɾ����Ϣ���������ڴ�й©
	//	GetMQRecordCount //�õ�һ����Ϣ�����е���Ϣ����
	//	GetAllQueueNames //��ȡ������Ϣ���е�����
	//	DeleteQueue //ɾ��һ����Ϣ����
	//	ClearQueueMessage //���һ����Ϣ����

	//  GetAllMessageLabels  //��ȡһ����Ϣ���е�������Ϣ�� label �� ����ʱ��
	// ����һ�� ��Ϣ����		//���type�������ȡ1����
	SV_API bool CreateQueue(string queuename,int type=1,string user="default",string addr="localhost");
	// �������� ,    ���� label ,   ����������ָ�룬  ���ݳ���
	SV_API bool PushMessage(string queuename,string label,const char *data,unsigned int datalen,string user="default",string addr="localhost");
	// �������� ,    ���� label ,     ��Ϣ����
	SV_API bool PushStringMessage(string queuename,string label,string content,string user="default",string addr="localhost");
	//	��ȡ��Ϣlabel ,   ��ȡ��Ϣ����ʱ��. �ȴ�ʱ�� ��λtimer����
	SV_API bool PopMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API bool BlockPopMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,string user="default",string addr="localhost");
	SV_API MQRECORD PopMessage(string queuename,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API MQRECORD BlockPopMessage(string queuename,string user="default",string addr="localhost");
	SV_API bool PeekMQMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API bool BlockPeekMQMessage(string queuename,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen,string user="default",string addr="localhost");
	SV_API MQRECORD PeekMQMessage(string queuename,unsigned int timer=0,string user="default",string addr="localhost");
	SV_API MQRECORD BlockPeekMQMessage(string queuename,string user="default",string addr="localhost");
	// ����Ϣ�������ȡ��Ϣ����
	SV_API bool GetMessageData(MQRECORD record,string &label,svutil::TTime &createtime,char *databuf,unsigned int &buflen);
	SV_API bool CloseMQRecord(MQRECORD &record);
	// �õ�һ����Ϣ�����е���Ϣ����
	SV_API bool GetMQRecordCount(string queuename,unsigned int &count,string user="default",string addr="localhost");
	// ��ȡ������Ϣ���е�����
	SV_API bool GetAllQueueNames(std::list<string> &namelist,string user="default",string addr="localhost");
	//ɾ��һ����Ϣ����
	SV_API bool DeleteQueue(string queuename,string user="default",string addr="localhost");
	//���һ����Ϣ����
	SV_API bool ClearQueueMessage(string queuename,string user="default",string addr="localhost");
	//��ȡһ����Ϣ���е�������Ϣ��        label(string) �� ����ʱ��(string)
	SV_API bool GetAllMessageLabels(string queuename,std::list<string> & retlist,string user="default",string addr="localhost");
	
}	// namespace SV

#endif	// __SVDB_API_H__



