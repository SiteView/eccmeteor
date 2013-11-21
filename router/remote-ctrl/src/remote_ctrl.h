#ifndef _REMOTECTRL_H_
#define _REMOTECTRL_H_

#include "soap.h"
#include "iksemel.h"
#include "list.h"


#define ID_LEN 40
#define JID_LEN 128
#define JID_PASS_LEN 64



/* stuff we keep per session */
typedef struct xmpp_session_s {
	iksparser *prs;
	iksid *acc;
	//char *pass;
	int jabReady;
	int features;
	int authorized;
	int xmpp_ping; // 记录连续未接收到ping回复的次数
	//int counter;
	//int set_roster;
	//int job_done;
	char req_id[ID_LEN]; // 发起请求时使用的随机id
	char xmpp_ip[16];
	int xmpp_port;
	char jid[JID_LEN];
	char pass[JID_PASS_LEN];
	list roster;
	list tran_file_list;
}xmpp_session;

typedef struct config_setting_s
{
	xmpp_session 		xmpp_sess;
	soap_session 		soap_sess;
}config_setting;


extern config_setting g_config;

#endif
