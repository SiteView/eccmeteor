#ifdef HAVE_GETOPT_LONG
#include <getopt.h>
#endif
#ifdef _WIN32
#include <winsock.h>
#endif
#include <string.h>
#include <stdlib.h>
#include <netdb.h>
#include "common.h"
#include "xmpp_main.h"
#include "remote_ctrl.h"
#include "xmpp.h"
#include "util.h"
#include "remotedlna.h"
#include "sha1.h"


/* out packet filter */
iksfilter *my_filter;
/* connection flags */
int opt_use_tls;
int opt_use_sasl;
int opt_use_plain;
int opt_log;


int t_init_jid(xmpp_session *sess)
{
	const char *domain = NULL;
	char arrDevInfo[100];
	char *ip;

	// 根据mac地址以及路由器所在区域确定用户的jid
	domain = j_get_domain(sess);
	CHK_PTR_ERR_RET(domain, errXMPPServer);
	dbg_printf(Mod_jabber, "get domain: %s\n", domain);

	int retinfo= tGetDevInfo(IFNAME, eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
	if(retinfo!=errOK)
	{
		retinfo= tGetDevInfo("eth1", eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
		if(retinfo!=errOK)
		{
			retinfo= tGetDevInfo("eth2", eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
			if(retinfo!=errOK)
			{
				retinfo= tGetDevInfo("eth3", eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
				if(retinfo!=errOK)
				{
					retinfo= tGetDevInfo("eth4", eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
					if(retinfo!=errOK)
					{
						retinfo= tGetDevInfo("eth5", eIT_MACADDR, arrDevInfo, sizeof arrDevInfo);
					}
				}
			}
		}
	}
	FUN_ERR(retinfo);

	ip = ip_get(domain);
	CHK_PTR_ERR_RET(ip, errXMPPServer);
	strcpy(sess->xmpp_ip, ip);
	INFO("xmpp server ipaddr \"%s\"\n", sess->xmpp_ip);
	sprintf(sess->jid, "%s@%s", arrDevInfo, domain);
	INFO("jid=%s\n", sess->jid);
	return errOK;
}

int
on_iq_result (xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = NULL;
	iks *z = NULL;
	char *id = iks_find_attrib(x, "id");

	//dbg_printf(Mod_jabber, "id=%s, req_id=%s\n", id, sess->req_id);
	// 与发出的ID不符，不处理
	/*
	if (iks_strcmp(id, sess->req_id))
	{
		return IKS_FILTER_PASS;
	}
	*/
	
	if (strstr(id, ID_KEY_REG1))
	{
		p_register_post(sess, pak);
	}
	else if (strstr(id, ID_KEY_REG2))
	{
		// 注册成功，进行登录动作
		if (opt_use_sasl)  {
			if (sess->features & IKS_STREAM_SASL_MD5)
				iks_start_sasl (sess->prs, IKS_SASL_DIGEST_MD5, sess->acc->user, sess->pass);
			else if (sess->features & IKS_STREAM_SASL_PLAIN)
				iks_start_sasl (sess->prs, IKS_SASL_PLAIN, sess->acc->user, sess->pass);
		} else {
			if (!opt_use_sasl) {
				char *sid = NULL;

				dbg_trace();
				if (!opt_use_plain) {
					dbg_trace();
					sid = iks_find_attrib (x, "id");
				}
				y = iks_make_auth (sess->acc, sess->pass, sid);
				iks_insert_attrib (y, "id", ID_KEY_AUTH);
				iks_send(sess->prs, y);
				iks_delete (y);
			}
		}
	}
	else if (strstr(id, ID_KEY_AUTH))
	{
		sess->authorized = 1;
		
		// 认证成功，发送出席信息
		y = iks_make_pres(IKS_SHOW_CHAT, "online");
		iks_insert_cdata(iks_insert(y, "priority"), "5", 0);
		iks_send(sess->prs, y);
		iks_delete(y);

		// 认证成功，获取好友列表
		y = iks_make_iq (IKS_TYPE_GET, IKS_NS_ROSTER);
		iks_insert_attrib (y, "id", ID_KEY_GETROSTER);
		iks_send(sess->prs, y);
		iks_delete (y);

		//更新vCard
		y = iks_new ("iq");
		iks_insert_attrib (y, "type", "set");
		iks_insert_attrib (y, "id", "set-vCard");//liyuan-todo
		iks_insert_attrib (y, "from", sess->acc->full);
		z = iks_insert (y, "vCard");
		iks_insert_attrib (z, "xmlns", IKS_NS_VCARD);
		//获取设备型号
		char router_type[32] = {};
		get_router_type(router_type, sizeof(router_type));
		//获取设备fireware版本号
		char router_fw_version[32] = {};
		get_router_fireware_version(router_fw_version, sizeof(router_fw_version));
		//nickname的格式为:设备类型;fireware版本号
		char nickname[64] = {};
		sprintf(nickname, "%s;%s", router_type, router_fw_version);
		iks_insert_cdata (iks_insert(z, "NICKNAME"), nickname, 0);
		iks_send(sess->prs, y);
		iks_delete (y);
		
		p_ready(sess);
	}
	else if (strstr(id, ID_KEY_GETROSTER))
	{
		dbg_trace();
		//初始化好友列表
		for (y = iks_child(pak->x); 
			NULL!=y; 
			y = iks_strcmp(iks_name(y), "item")? iks_child(y) : iks_next_tag(y))
		{
			dbg_printf(Mod_jabber, " y name = %s\n", iks_name(y));
			if (iks_strcmp(iks_name(y), "item"))
				continue;
			
			xmpp_user *user = (xmpp_user *)MALLOC(sizeof(xmpp_user));
			strcpy(user->jid, iks_find_attrib(y, "jid"));
			dbg_printf(Mod_jabber, "liyuan-debug;jid:%s\n", user->jid);
			user->status = BIND_CODE_OK_ALREADY_FRIEND;
			list_add(sess->roster, user);
		}
		/*
		// 循环发送在线状态
		found = it_roster(sess, pak, t_get_redirector(NULL));

		// 当前列表中没有指定好友，增加
		if (!found) {
			p_iq_send(sess, IKS_TYPE_SET, IKS_NS_ROSTER);
		} else {
		
			// 告知已经是好友
			p_ready(sess);
		}*/
	}
	/*
	else if (strstr(id, ID_KEY_ADDROSTER)) {

		p_ready(sess);
		
		// add 好友成功，增加订阅通知
		y = iks_make_s10n(IKS_TYPE_SUBSCRIBE, t_get_redirector(GSESS), NULL);
		iks_insert_attrib (y, "from", sess->acc->partial);
		iks_send(sess->prs, y);
		iks_delete (y);
	} 
	
	*/
	else if (strstr(id, "si") ||strstr(id, "open") || strstr(id, "senddata") || strstr(id, "close")) {
		it_file_trans_send(sess, pak);
	}
	else if (strstr(id, "ping")) { // ping result
		sess->xmpp_ping = 0; // ping 只要收到就清零
	}
	return IKS_FILTER_EAT;
}

int
on_stream (xmpp_session *sess, int type, iks *node)
{
        switch (type) {
                case IKS_NODE_START:
                        if (opt_use_tls && !iks_is_secure (sess->prs)) {
                                iks_start_tls (sess->prs);
                                break;
                        }
                        if (!opt_use_sasl) {
                                iks *x;
                                char *sid = NULL;
                                if (!opt_use_plain) sid = iks_find_attrib (node, "id");
                                x = iks_make_auth (sess->acc, sess->pass, sid);
                                iks_insert_attrib (x, "id", ID_KEY_AUTH);
                                iks_send (sess->prs, x);
                                iks_delete (x);
                        }
                        break;
                case IKS_NODE_NORMAL:
                        if (strcmp ("stream:features", iks_name (node)) == 0) {
                                sess->features = iks_stream_features (node);
                                if (opt_use_sasl) {
                                        if (opt_use_tls && !iks_is_secure (sess->prs)) break;
                                        if (sess->authorized) {
                                                iks *t;
                                                if (sess->features & IKS_STREAM_BIND) {
                                                        t = iks_make_resource_bind (sess->acc);
                                                        iks_send (sess->prs, t);
                                                        iks_delete (t);
                                                }
                                                if (sess->features & IKS_STREAM_SESSION) {
                                                        t = iks_make_session ();
                                                        iks_insert_attrib (t, "id", ID_KEY_AUTH);
                                                        iks_send (sess->prs, t);
                                                        iks_delete (t);
                                                }
                                        } else {
                                                if (sess->features & IKS_STREAM_SASL_MD5)
                                                        iks_start_sasl (sess->prs, IKS_SASL_DIGEST_MD5, sess->acc->user, sess->pass);
                                                else if (sess->features & IKS_STREAM_SASL_PLAIN)
                                                        iks_start_sasl (sess->prs, IKS_SASL_PLAIN, sess->acc->user, sess->pass);
                                        }
                                }
                        } else if (strcmp ("failure", iks_name (node)) == 0) {
                                ERROR ("sasl authentication failed\n");
								// 登录失败，执行注册过程
								p_iq_send(sess, IKS_TYPE_GET, IKS_NS_REGISTER);
                        } else if (strcmp ("success", iks_name (node)) == 0) {
                                sess->authorized = 1;
                                iks_send_header (sess->prs, sess->acc->server);
                        } else {
                                ikspak *pak;
                                pak = iks_packet (node);
                                iks_filter_packet (my_filter, pak);
                        }
                        break;
                case IKS_NODE_STOP:
					ERROR ("server disconnected\n");
					sess->authorized = 0;
					return IKS_NET_NOCONN;

				case IKS_NODE_ERROR:
					ERROR ("stream error\n");
					sess->authorized = 0;
					return IKS_NET_NOCONN;
        }
        if (node) iks_delete (node);
        return IKS_OK;
}


int
on_msg (xmpp_session *sess, ikspak *pak) 
{
	//根据ikspak 的类型判读
	if(pak->type==IKS_PAK_MESSAGE) //接收到的是message pak
	{
		if(pak->subtype==IKS_TYPE_CHAT)
		{
		    char *recvmsg = iks_find_cdata(pak->x, "body");
			
		    printf("recv msg:%s from %s(%s)\n", recvmsg, pak->from->full, pak->from->user);
			
			//非扩展内容不需要进行分析处理
			if (strncmp(recvmsg, "<extend ", 8) != 0)
				return IKS_FILTER_EAT;

			iksparser *prs;
			iks *x = NULL;
			//int e;
			//int err; liyuan-doubt,error handle


			//解析xml
			prs = iks_dom_new (&x);
			iks_parse (prs, recvmsg, strlen(recvmsg), 1);
			
			handle_extend_message(sess, x, pak);
			
			iks_parser_delete (prs);
			if (x) iks_delete (x);
		}
	}
	return IKS_FILTER_EAT;
}

int on_presence(xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = iks_child(x);
	char *type = iks_find_attrib(x, "type");
	char *from = iks_find_attrib(x, "from");

	//<presence id='PQ701-89' type='unavailable' from='redirector@siteviewwzp/Spark 2.6.3' to='i-f54b9784@siteviewwzp'/>
	dbg_printf(Mod_jabber, "liyuan-debug\n");
	if (type && !strcasecmp(type, "unavailable")) {
		dbg_trace();
		return IKS_FILTER_EAT;
	}
	else if (type && from && !strcasecmp(type, "subscribe")) {
		//liyuan-todo
		return IKS_FILTER_EAT;
	}
	else if (type && !strcasecmp(type, "subscribed")) {
		it_present(sess, pak->from->full);
		return IKS_FILTER_EAT;
	}

	if (y && ( !strcasecmp(iks_name(y), "status") ||  !strcasecmp(iks_name(y), "priority"))) {
		it_present(sess, pak->from->full);
	}
	
	return IKS_FILTER_EAT;
}

int on_presence_subscribe(xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y;
	char *from = iks_find_attrib(x, "from");

	if (from) {
		
		//绑定未成功不能加好友
		int code = get_user_status(sess->roster, pak->from->partial);
		if (BIND_CODE_OK != code && BIND_CODE_OK_ALREADY_FRIEND != code)
		{
			response_extend_message(sess, "bind", pak->from->full, NULL, BIND_CODE_ERR_NO_BIND, "liyuan");
			return	IKS_FILTER_EAT;
		}
		
		dbg_printf(Mod_jabber, "liyuan-debug\n");
		y = iks_make_s10n(IKS_TYPE_SUBSCRIBE, from, NULL);
		iks_insert_attrib (y, "from", sess->acc->partial);
		iks_insert_attrib (y, "id", "liyuan-debug-1");
		iks_send(sess->prs, y);
		iks_delete (y);

		y = iks_make_s10n(IKS_TYPE_SUBSCRIBED, from, NULL);
		iks_insert_attrib (y, "from", sess->acc->partial);
		iks_insert_attrib (y, "id", "liyuan-debug-2");
		iks_send(sess->prs, y);
		iks_delete (y);

		set_user_status(sess->roster, pak->from->partial, BIND_CODE_OK_ALREADY_FRIEND);
		
	}
	return IKS_FILTER_EAT;
}

int on_presence_unsubscribe(xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y;
	char *from = iks_find_attrib(x, "from");

	//删除好友
	if (from) {
		x = iks_make_iq(IKS_TYPE_GET, IKS_NS_ROSTER);
		iks_insert_attrib(x, "id", ID_KEY_DELROSTER);

		y = iks_new("item");
		iks_insert_attrib(y, "jid", pak->from->partial);
		iks_insert_attrib(y, "subscription", "remove");
		iks_insert_node(iks_child(x), y);
		iks_send(sess->prs, x);
		iks_delete(x);
	}
	return IKS_FILTER_EAT;
}

int on_presence_unsubscribed(xmpp_session *sess, ikspak *pak)
{
	on_presence_unsubscribe(sess, pak);
	char *from = iks_find_attrib(pak->x, "from");
	element e = NULL;
	if (from)
	{
		e = find_user_from_roster_list(sess->roster, pak->from->partial);
		free_list_element(sess->roster, e);
	}
}

void
on_log (xmpp_session *sess, const char *data, size_t size, int is_incoming)
{
        if (iks_is_secure (sess->prs)) fprintf (stderr, "Sec");
        if (is_incoming) fprintf (stderr, "RECV"); else fprintf (stderr, "SEND");
        fprintf (stderr, "[%s]\n", data);
}

iks *response_disco_info(xmpp_session *sess, char *req_id, char *to)
{
	iks *x;
	iks *y;

	x = iks_new ("iq");

	// iq
	iks_insert_attrib (x, "id", req_id);
	iks_insert_attrib (x, "from", sess->acc->full);
	iks_insert_attrib (x, "to", to);
	iks_insert_attrib (x, "type", "result");

	// query
	iks_insert_attrib (iks_insert (x, "query"), "xmlns", IKS_NS_XMPP_DISCO_INFO);
	y = iks_child(x);

	//feature
	y = iks_insert(y, "feature");
	iks_insert_attrib(y, "var", IKS_FILE_PROTOCOL_BYTESTREAMS);

	return x;
}

int
on_iq_get (xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = NULL;
	iks *z = NULL;
	char *id = iks_find_attrib(x, "id");
	char *from = iks_find_attrib(x, "from");
	char *xmlns = iks_find_attrib(iks_child(x), "xmlns");

	if (!xmlns || !sess->acc)
		return IKS_FILTER_PASS;

	
	if (!iks_strcmp(xmlns, IKS_NS_XMPP_DISCO_INFO)) {

		y = response_disco_info(sess, id, from);

		iks_send(sess->prs, y);
		iks_delete(y);
		
	}
	/*
	if (!iks_strcmp(xmlns, IKS_NS_XMPP_DISCO_INFO)) {

		// 回复支持的特性
		y = iks_make_iq(IKS_TYPE_RESULT, IKS_NS_XMPP_DISCO_INFO);
		iks_insert_attrib(y, "id", id);
		iks_insert_attrib(y, "from", sess->acc->full);
		iks_insert_attrib(y, "to", from);
		//iks_insert_attrib(iks_insert(y, "feature"), "var", IKS_NS_XMPP_PING);
		iks_insert_attrib(iks_insert(y, "feature"), "var", IKS_FILE_PROTOCOL_BYTESTREAMS);
		
		iks_send(sess->prs, y);
		iks_delete(y);
		
	}*/ else if (!iks_strcmp(xmlns, IKS_NS_XMPP_PING)) {

		// 返回支持xmpp 的ping
		it_iq_result(sess, id, from);
	} else {
		return IKS_FILTER_PASS;
	}

	return IKS_FILTER_EAT;
}

int on_iq_set (xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = iks_child(x);
	char *id = iks_find_attrib(x, "id");
	char *xmlkey = iks_name(y);
	char *xmlns = NULL;
	char *from = iks_find_attrib(x, "from");
	char *to = iks_find_attrib(x, "to");
	
	if (NULL == y) 
	{
		printf("y is null!\n");
		return IKS_FILTER_PASS;
	}

	xmlns = iks_find_attrib(y, "xmlns");
	
	if (NULL==xmlns)
	{  
		printf("y-xmlns is null!\n");
		return IKS_FILTER_PASS;
	}
	
	
	// 文件传输，接收文件
	if ((!iks_strcmp(xmlkey, "si")) || (!iks_strcmp(xmlkey, "open")) || (!iks_strcmp(xmlkey, "data")) || (!iks_strcmp(xmlkey, "close")))
	{
		return it_file_trans_recv(sess, pak);
	}
	else if (!iks_strcmp(xmlkey, "query"))
	{
		//xmlns = iks_find_attrib(y, "xmlns");
		char *sid = iks_find_attrib(y, "sid");
		y = iks_find(y, "streamhost");
		int cnt = 0;
		int flag = 0;
		char *port = NULL;
		char *host = NULL;
		char *jid = NULL;
		element e = NULL;
		tran_file *file_desc = NULL;

		
		if (NULL == y) 
		{
			printf("y of <streamhost> is null!%d\n", __LINE__);
			return IKS_FILTER_PASS;
		}
		while (y)	//liyuan-todo,依次连接每个代理，直到通为止
		{
			port = iks_find_attrib(y, "port");
			host = iks_find_attrib(y, "host");
			jid = iks_find_attrib(y, "jid");
			
			printf("cnt %d ---- port:%s;host:%s;jid:%s\n", ++cnt, port, host, jid);
			y = iks_next(y);
		}
		
		e = get_tran_file(sess->tran_file_list, sid);
		file_desc = (tran_file *)(e->data);
		char path[128] = {};
		int ret = get_usb_device_mount_path(path);
		if (ret)
		{
			free_list_element(sess->tran_file_list, e);
			return IKS_FILTER_EAT;
		}
		
		char host_name_src[256] = {};	//sid+from+to
		sprintf(host_name_src, "%s%s%s", sid, from, to);
		SHA1_Digest host_name_sha1 = SHA1_get(host_name_src, strlen(host_name_src));
		char host_name[41] = {};  // two bytes per digit plus terminator
        SHA1_Digest_toStr(&host_name_sha1, host_name);

		int proxy_sock = socks5_conn(host_name, atoi(port), XMPP_DFT_DOMAIN);//liyuan-todo,返回错误给终端
		if (proxy_sock > 0)	//socks5建立连接成功，通知初始方使用的代理jid
		{
			pthread_t pid;
			
			tlv tlvs[MES_ELE_LAST] = {};

			strcat(path, file_desc->name);
			tlvs[MES_ELE_FILE_NAME].type = MES_ELE_FILE_NAME;
			tlvs[MES_ELE_FILE_NAME].len = strlen(path);
			tlvs[MES_ELE_FILE_NAME].value = path;
			
			tlvs[MES_ELE_RD_UUID].type = MES_ELE_RD_UUID;
			tlvs[MES_ELE_RD_UUID].len = strlen(file_desc->rd_uuid);
			tlvs[MES_ELE_RD_UUID].value = file_desc->rd_uuid;

			tran_file_thread_arg *sock_mes = (tran_file_thread_arg *)MALLOC(sizeof(tran_file_thread_arg));
			sock_mes->mes_data_len = make_mes_data(&(sock_mes->mes_data), tlvs);
			sock_mes->recv_sock = proxy_sock;
			sock_mes->file_size = file_desc->size;
			strcpy(sock_mes->jid, file_desc->jid_from);
			
			/* 将file_desc的内容拷贝到sock_mes中，而不是将file_desc直接作为线程的参数的目的
			** 是避免在线程中操作链表，省略了线程锁的处理。
			*/
			if (0 != pthread_create(&pid, NULL, recv_file, sock_mes))
			{
				printf("pthread create recv_file error\n");
			}
			else
			{
				flag = 1;		//成功
			}
		}
		
		free_list_element(sess->tran_file_list, e);
		
		y = response_streamhost_used(id, from, to, XMPP_DFT_PROXY_DOMAIN, flag);
		iks_send(sess->prs, y);
		iks_delete(y);
		
	}
	else 
	{
		printf("%s;%d;\n", __FUNCTION__, __LINE__);
		return IKS_FILTER_PASS;	
	}

	return IKS_FILTER_EAT;
}


int
on_iq_error (xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = NULL;
	char *id = iks_find_attrib(x, "id");

	// 与发出的ID不符，不处理
	/*
	if (NULL == id ||iks_strcmp(id, sess->req_id)) {
		return IKS_FILTER_PASS;
	}
	*/
	
	if (strstr(id, ID_KEY_AUTH)) {
		p_iq_send(sess, IKS_TYPE_GET, IKS_NS_REGISTER);
	} else if (strstr(id, ID_KEY_REG2)) {
		for (y = iks_child(x); y ; y = iks_next_tag(y)) {
			if (!iks_strcmp(iks_name(y), "error")) {
				ERROR("error reason [%s] code [%s] type [%s] \n", 
				iks_name(iks_child(y)), iks_find_attrib(y, "code"), iks_find_attrib(y, "type"));
			}
		}
	}
	else if (strstr(id, ID_KEY_ADDROSTER)) {
		ERROR("add friend failure\n");
	} 
	dbg_trace();
	return IKS_FILTER_EAT;
}

void
j_setup_filter (xmpp_session *sess)
{
        if (my_filter) iks_filter_delete (my_filter);
        my_filter = iks_filter_new ();
		
        iks_filter_add_rule (my_filter, (iksFilterHook *) on_iq_result, sess,
                IKS_RULE_TYPE, IKS_PAK_IQ,
                IKS_RULE_SUBTYPE, IKS_TYPE_RESULT,
                IKS_RULE_DONE);
        iks_filter_add_rule (my_filter, on_iq_error, sess,
                IKS_RULE_TYPE, IKS_PAK_IQ,
                IKS_RULE_SUBTYPE, IKS_TYPE_ERROR,
                IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *) on_msg, sess,
                IKS_RULE_TYPE, IKS_PAK_MESSAGE,
                IKS_RULE_DONE);
                iks_filter_add_rule (my_filter, (iksFilterHook *) on_presence, sess,
                IKS_RULE_TYPE, IKS_PAK_PRESENCE,
                IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *)on_iq_set, sess,
				IKS_RULE_TYPE, IKS_PAK_IQ,
				IKS_RULE_SUBTYPE, IKS_TYPE_SET,
				IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *)on_iq_get, sess,
				IKS_RULE_TYPE, IKS_PAK_IQ,
				IKS_RULE_SUBTYPE, IKS_TYPE_GET,
				IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *)on_presence_subscribe, sess,
				IKS_RULE_TYPE, IKS_PAK_S10N,
				IKS_RULE_SUBTYPE, IKS_TYPE_SUBSCRIBE,
				IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *)on_presence_unsubscribe, sess,
				IKS_RULE_TYPE, IKS_PAK_S10N,
				IKS_RULE_SUBTYPE, IKS_TYPE_UNSUBSCRIBE,
				IKS_RULE_DONE);
		iks_filter_add_rule (my_filter, (iksFilterHook *)on_presence_unsubscribed, sess,
				IKS_RULE_TYPE, IKS_PAK_S10N,
				IKS_RULE_SUBTYPE, IKS_TYPE_UNSUBSCRIBED,
				IKS_RULE_DONE);
}

int j_connect (xmpp_session *sess)
{
	int e;
	int port;

	CHK_PTR_ERR_RET(sess, errSysError);
	CHK_PTR_ERR_RET(sess->acc, errSysError);
	CHK_PTR_ERR_RET(sess->acc->server, errSysError);

	INFO("connectting server[%s] port[%d] ...\n", sess->acc->server, sess->xmpp_port);
	e = iks_connect_tcp (sess->prs, sess->acc->server, sess->xmpp_port);
	switch (e) {
		case IKS_OK:
			{
				INFO("connect server[%s] port[%d] ...OK\n", sess->acc->server, sess->xmpp_port);
			}
			break;
		case IKS_NET_NODNS:
			ERROR ("hostname lookup failed\n");
			break;
		case IKS_NET_NOCONN:
			ERROR ("connection failed\n");
			break;
		default:
			ERROR ("io error\n");
	}

	return e;
	
}

int j_sess_init(xmpp_session *sess)
{
	if (!sess) return IKS_NOMEM;

	if (opt_use_tls) {
		sess->xmpp_port = IKS_JABBER_TLS_PORT;
	} else {
		sess->xmpp_port  = IKS_JABBER_PORT;
	}

	/* 文件传输队列 */
	if (sess->tran_file_list == NULL)
	{
		sess->tran_file_list = alloc_list(free_tran_file, NULL);
	}

	// 自动生成jid
	FUN_ERR(t_init_jid(sess));

	// 创建xml流解析器
	if (NULL==sess->prs)
	{
		sess->prs = iks_stream_new (IKS_NS_CLIENT, sess, (iksStreamHook *) on_stream);
	}
	iks_set_log_hook (sess->prs, (iksLogHook *) on_log);

	// 用户名的md5值作为密码
	sess->acc = iks_id_new (iks_parser_stack (sess->prs), sess->jid);
	memset(sess->pass, 0, sizeof(sess->pass));
	iks_md5(sess->acc->user, sess->pass);
	printf("---------- debug, username:%s, password:%s\n", sess->acc->user, sess->pass);

	// 用户的源: 路由器为router，vpn服务器为:vpnserver
	if (NULL == sess->acc->resource) {
		/* user gave no resource name, use the default */
		char tmp[JID_LEN];
		sprintf (tmp, "%s@%s/%s", sess->acc->user, sess->acc->server, XMPP_RESOURCE_REMOTECTRL);
		sess->acc = iks_id_new (iks_parser_stack (sess->prs), tmp);
	}

	//初始化soap
	/*liyuan
	struct hostent *host;

	host = gethostbyname("routerlogin.net");
	if(!host) {
		fprintf(stderr, "Error: Unable to resolve hostname routerlogin.net\n");
		return -1;
	}
	
	strcpy(g_config.soap_sess.soap_ip, host->h_addr);
	g_config.soap_sess.soap_port = 5000;	//liyuan-todo
	*/


	//初始化用于保存好友信息的列表
	if (NULL == sess->roster)
	{
		sess->roster = alloc_list(free_user, NULL);
	}
	
	// 加载过滤器
	j_setup_filter (sess);

	return IKS_OK;
}

int loop_chk_xmpp_disconnect(xmpp_session *sess, long cycle)
{
	static int runtime = 0;
	static int disconnect_count = 0;

	if (!tTimeout(&runtime, cycle)) {
		return 0;
	}

	CHK_PTR_ERR_RET(sess, errFuncParam);

	dbg_printf(Mod_jabber, "test xmpp server[%s], port[%d]  ...  \n", sess->xmpp_ip, sess->xmpp_port);
	if (0==tcp_connect_test_timeout(sess->xmpp_ip, sess->xmpp_port, 10)) {  //  telnet xmpp server
		ERROR("test xmpp server[%s], port[%d] failure (%d)!!!! \n", sess->xmpp_ip, sess->xmpp_port, disconnect_count+1);
		disconnect_count++;
		if (disconnect_count < 3) return 0;
		else {
			disconnect_count = 0;
			return 1;
		}
	}

	disconnect_count = 0;
	return 0;
}

void p_logout(xmpp_session *sess)
{
	CHK_PTR_ERR_VOID(sess, errFuncParam);
	
	sess->authorized = 0; // 重新连接
	sess->jabReady = 0;
}

void t_free_session(xmpp_session *sess)
{
	if (!sess) return;
	if (sess->prs) {
		iks_parser_reset(sess->prs); 
	}
	if (sess->tran_file_list)
	{
		free_list(sess->tran_file_list);
	}
	/* liyuan-doubu free rouster list? mes_from_dlna? mes_from_xmpp?*/
}

void* xmpp_main(void *lparam)
{
	int e;
	long connect_time = 0;

	xmpp_session *sess = &g_config.xmpp_sess;

	*(int*)lparam = getpid();
	
	// 有加密则尽量使用加密
	if (iks_has_tls()) {
		opt_use_tls = 1;
		opt_use_sasl = 0;
	} else {
		opt_use_tls = 0;
		opt_use_sasl = 0;
	}

	while (1) {

		if (IKS_OK != j_sess_init(sess)) {
			sleep(4);
			continue;
		}
		INFO("Jabber session init ... OK!\n");
		
		// 连接xmpp网络
		if (IKS_OK != j_connect (sess)) {
			sleep(2);
			continue;
		}
		INFO("jabber connect OK!\n");

		connect_time = getUptime();
		// 接收数据
		while (1) {

			if (!JABREADY && tTimeout(&connect_time, 30)) {
				ERROR("auth timeout !!!\n");
				p_logout(sess);
				break;
			}
			
			if (loop_chk_xmpp_disconnect(sess, 10)) {
				ERROR("xmpp server %s is disconnected, jabber logout!!!\n", sess->acc->server);
				p_logout(sess);
				break;
			}
			
			e = iks_recv (sess->prs, 1);

			if (IKS_HOOK == e) {
				ERROR ("IKS_HOOK error!!!!\n");
				break;
			}
			
			if (IKS_NET_TLSFAIL == e) {
				ERROR ("tls handshake failed\n");
				break;
			}

			if (IKS_NET_NOCONN == e ) {
				ERROR ("disconnected or no user by deleted!\n");
				p_logout(sess);
				break;
			}

			if (errOK != msg_online(sess, 30)) {
				ERROR ("xmpp server no response\n");
				p_logout(sess);
				break;
			}

//			handle_message_from_dlna(sess);
		}

		// session reset
		INFO("reset session ...\n");
		t_free_session(sess);
		
		sleep(2);
		
	}

	return 0;
}


