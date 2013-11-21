#ifndef _REMOTEDLNA_H_
#define _REMOTEDLNA_H_

#include "list.h"
#include "xmpp.h"

#define UUID_LEN 40


typedef struct tran_file_thread_arg_s
{
	int recv_sock;		//接收文件的sock
	int file_size;
	char jid[JID_LEN];
	//char file_name[128];
	int mes_data_len;
	char *mes_data;		//通知dlna的消息内容
}tran_file_thread_arg;	

typedef struct tran_file_thread_arg_2_s
{
	xmpp_session *sess;
	char uuid[UUID_LEN];
	char url[128];
	char jid_from[JID_LEN];
	char req_id[ID_LEN];
}tran_file_thread_arg_2;	

typedef struct tran_file_thread_arg_3_s
{
	int sock;
	char filename[128];
}tran_file_thread_arg_3;	

enum dlna_device_type {
	DLNA_SERVER,
	DLNA_RENDER,
};

enum tran_file_status {
	TRAN_FILE_INIT,
	TRAN_FILE_HTTP_ING,
	TRAN_FILE_HTTP_SUCC,
	TRAN_FILE_HTTP_FAIL,
};


typedef struct tran_file_s
{
	char *name;		//文件名
	char *id;		//文件传输协商的文件SID
	char *jid_from;	//发起请求的JID
	char *rd_uuid;	//\u6e32\u67d3\u8bbe\u5907uuid
	char *req_id;	//message请求ID
	int size;		//文件大小
	int sock;		//传输文件socket
	int status;		//文件传输状态
}tran_file;

typedef struct device_dlna_s
{
	enum dlna_device_type type;
	char *friendly_name;
	char uuid[UUID_LEN];
	
}device_dlna;

enum mes_type {
	MES_FIRST,
	MES_REQ_DEV_LISTS,		//获取设备列表
	MES_REQ_OBJ_LISTS,
	MES_REQ_PLAY_REMOTE,	//播放媒体文件
	MES_REQ_PLAY_LOCAL,
	MES_REQ_PAUSE,
	MES_REQ_STOP,
	MES_REQ_SET_VOLUME,
	MES_REQ_SET_PROGRESS,
	MES_REQ_SET_MUTE,
/* ------------------------------------ */
	MES_RES_DEV_LISTS,	//ServerList RenderList from dlan
	MES_RES_OBJ_LISTS,
	MES_RES_PLAY_REMOTE,
	MES_RES_PLAY_LOCAL,
	MES_RES_PAUSE,
	MES_RES_STOP,
	MES_RES_VOLUME,
	MES_RES_PROGRESS,
	MES_RES_MUTE,
	MES_LAST
};

typedef struct message_s
{
	enum mes_type type;
	char id[ID_LEN];
	char jid[JID_LEN];
	char code[5];
	int data_len;
	void *data;
}message_t;

enum mes_element_type {
	MES_ELE_FIRST = 0,
	MES_ELE_FILE_NAME,		//
	MES_ELE_RD_UUID,		//
	MES_ELE_SRV_UUID,
	MES_ELE_OBJ_ID,
	MES_ELE_PARENT_ID,
	MES_ELE_VOLUME,
	MES_ELE_PROGRESS,
	MES_ELE_MUTE,
	MES_ELE_OBJ_START,	//请求文件列表的起始index
	MES_ELE_OBJ_COUNT,	//请求文件列表的个数
	//MES_ELE_OBJ_LIST,
	//MES_ELE_DEV_LIST,
	MES_ELE_LAST
};

typedef struct tlv_s {
	int type;
	int len;
	char *value;
}tlv;

typedef struct dlna_obj_s
{
	char objectId[16];
	char parentId[16];
	char title[32];
	//creator();
	char upnpClass[64];
	char upnpClassName[64];
	char url[128];
	//writeStatus;
	//dateStr;
	//albumArtURIList;
	//resourceList;
	long long resourceSize;
	
}dlna_obj;


extern list mes_from_xmpp;
extern list mes_from_dlna;

extern void init_message_list(void);
extern void free_message_list(void);
extern 	void send_mes(list l, enum mes_type t, void *data, int data_size, char *id, char *jid);
extern element recv_mes(list l, enum mes_type t);
extern void mes_ele_parser(tlv *tlvs, void *data, int data_len);
extern void get_dev_list(iks *x, const char *id, const char *jid);
extern void get_obj_list(iks *x, const char *id, const char *jid);
extern void set_play_local(iks *x, const char *id, const char *jid);
extern void set_play_remote(iks *x, const char *id, const char *jid);
extern void recv_file (void *lparam);
extern void send_file (void *lparam);
extern void free_tran_file(void *data);
extern int make_mes_data(char **data, tlv *tlvs);


#endif
