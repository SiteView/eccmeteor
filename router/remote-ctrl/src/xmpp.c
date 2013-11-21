#include "xmpp.h"
#include "util.h"
#include "sha1.h"
#include "remotedlna.h"
#include <unistd.h>
#include <string.h>


iks *response_streamhost_used(char *req_id, char *to, char *from, char *jid, int flag)
{
	iks *x;
	iks *y;

	x = iks_new ("iq");

	// iq
	iks_insert_attrib (x, "id", req_id);
	iks_insert_attrib (x, "from", from);
	iks_insert_attrib (x, "to", to);
	iks_insert_attrib (x, "type", "result");

	// query
	iks_insert_attrib (iks_insert (x, "query"), "xmlns", IKS_FILE_PROTOCOL_BYTESTREAMS);
	y = iks_child(x);

	//feature
	y = iks_insert(y, "streamhost-used");
	iks_insert_attrib(y, "jid", jid);

	return x;

	return 0;
}

void it_present(xmpp_session *sess, char* jid)
{
	iks *x = NULL;
	
	x = iks_make_s10n(IKS_TYPE_NONE,jid, NULL);
	iks_insert_attrib (x, "from", sess->acc->full);
	iks_insert_cdata(iks_insert(x, "status"), "online", 0);
	iks_insert_cdata(iks_insert(x, "priority"), "5", 0);
	iks_send(sess->prs, x);
	iks_delete (x);
}

// 发送出席消息
int it_roster(xmpp_session *sess, ikspak *pak, char* jid)
{
	iks *y = NULL;
	int found = 0;
	char *temp = NULL;
	
	for (y = iks_child(pak->x); 
			NULL!=y; 
			y = iks_strcmp(iks_name(y), "item")? iks_child(y) : iks_next_tag(y))
	{
		dbg_printf(Mod_jabber, " y name = %s\n", iks_name(y));
		if (iks_strcmp(iks_name(y), "item"))
			continue;
		temp = iks_find_attrib(y, "jid");
		if (!iks_strcmp(temp, jid)) {
			found = 1;
		}
	}

	return found;
}


int p_iq_send(xmpp_session *sess, enum iksubtype eSub, char *xmlns)
{
	iks *t = NULL;
	iks *x = NULL;
	char tmp[100];

	t = iks_make_iq(eSub, xmlns);
	switch (eSub)
	{
		case IKS_TYPE_GET:
		{
			if (!strcmp(xmlns, IKS_NS_REGISTER)) {
				iks_insert_attrib(t, "to", sess->acc->server);
				iks_insert_attrib(t, "id", ID_KEY_REG1);
			} else {
				ERROR("not support now!\n");
			}
			

			break;
		}
/*
		case IKS_TYPE_SET:
			if (!strcmp(xmlns, IKS_NS_ROSTER)) {
				// RFC6121
				memset(tmp, 0, sizeof(tmp));
				
				iks_insert_attrib(t, "from", sess->acc->full);
				iks_insert_attrib(t, "id", ID_KEY_DELROSTER);

				x = iks_new("item");
				iks_insert_attrib(x, "jid", sess->fr);
				iks_insert_attrib(x, "subscription", "remove");
				iks_insert_node(iks_child(t), x);
			} else {
				ERROR("not support now!\n");
			}*/

		default:
			break;
	}
	iks_send(sess->prs, t);
	iks_delete(t);
}

void p_ready(xmpp_session *sess)
{
	CHK_PTR_ERR_VOID(sess, errFuncParam);


	sess->jabReady = 1;
	INFO("jabber ready \n");
}

void set_bind_router_flag(int code)
{
	
}

element find_user_from_roster_list(list l, char *jid)
{
	element e;
	xmpp_user *user;

	for (e = LIST_HEAD(l); e; ELEMENT_NEXT(e)) {
		user = (xmpp_user *)(ELEMENT_DATA(e));
		if (0 == iks_strcasecmp(user->jid, jid)) {
			
			return e;
		}
	}
	return NULL;
}

void free_user(void *data)
{
	xmpp_user *user = data;
	FREE(user);
}

/*
void init_roster_list(void)
{
	mes_from_xmpp = alloc_list(free_message, NULL);
	mes_from_dlna = alloc_list(free_message, NULL);
}

void free_roster_list(void)
{
	free_list(mes_from_xmpp);
	free_list(mes_from_dlna);
}
*/
int get_user_status(list roster, char *jid)
{
	xmpp_user *user = NULL;
	element e = NULL;
	e = find_user_from_roster_list(roster, jid);

	//非好友
	if (e == NULL)
	{
		return BIND_CODE_ERR_NO_BIND;
	}
	
	user = (xmpp_user *)(ELEMENT_DATA(e));
	return user->status;
}

void set_user_status(list roster, char *jid, int status)
{
	xmpp_user *user = NULL;
	element e = NULL;
	e = find_user_from_roster_list(roster, jid);

	//非好友
	if (e == NULL)
	{
		user = (xmpp_user *)MALLOC(sizeof(xmpp_user));
		strcpy(user->jid, jid);
		user->status = status;
		list_add(roster, user);
	}
	else
	{
		user = (xmpp_user *)(ELEMENT_DATA(e));
		user->status = status;
	}

}

void t_new_id(char *id, char* id_key)
{
	char randBuf[16] = {};

	tGetRandStr(sizeof(randBuf)-1, randBuf);
	sprintf(id, "%s%s", randBuf, id_key);

	return;
}

// XEP-0199: XMPP Ping
int it_xmpp_ping(xmpp_session *sess, char *to)
{
	iks *x = NULL;

	if (!sess->jabReady) {
		return errOK;
	}

	dbg_printf(Mod_jabber, "xmpp_ping = %d\n", sess->xmpp_ping);
	if (sess->xmpp_ping > 3) {
		sess->xmpp_ping = 0; // 出错也要清 0
		return errXMPPServer;
	}
	
	x = iks_new("iq");
	iks_insert_attrib(x, "type", "get");
	iks_insert_attrib(x, "from", sess->acc->full);
	iks_insert_attrib(x, "to", to);
	memset(sess->req_id, 0, ID_LEN);
	t_new_id(sess->req_id, "ping");
	iks_insert_attrib(x, "id", sess->req_id);
	iks_insert_attrib (iks_insert (x, "ping"), "xmlns", IKS_NS_XMPP_PING);
	iks_send(sess->prs, x);
	(sess->xmpp_ping)++; // ping send plus 1
	iks_delete(x);

	return errOK;
}

int msg_online(xmpp_session *sess, long cycle)
{
	static long runtime = 0;
	iks *x = NULL;

	if (!tTimeout(&runtime, cycle)) {
		return errOK;
	}

	if (!JABREADY) {
		return errOK;
	}

	// 在线消息
	//it_present(sess, t_get_redirector(sess));
	return it_xmpp_ping(sess, sess->acc->server);
}

// iq消息处理回复
void it_iq_result(xmpp_session *sess, char *id, char *to)
{
	iks *y = NULL;

	if (!sess->acc) return;

	//y = iks_make_iq(IKS_TYPE_RESULT, NULL);
	y = iks_new("iq");
	iks_insert_attrib(y, "type", "result");
	if (id) iks_insert_attrib(y, "id", id);
	iks_insert_attrib(y, "from", sess->acc->full);
	if (to) iks_insert_attrib(y, "to", to);
	iks_send(sess->prs, y);
	iks_delete(y);
}

void handle_dlna_message(xmpp_session *sess, iks *x, char *from, char *id)
{
	char *dlna_name = NULL;
	char *uuid = NULL;

	if (strcmp(iks_name(x), "dlna"))
		return;
	
	dlna_name = iks_find_attrib(x, "name");
	

	if (0 == strcmp(dlna_name, "dlna-objlist:get"))
	{
		get_obj_list(x, id, from);
	}
	else if (0 == strcmp(dlna_name, "dlna-devlist:get"))
	{
		get_dev_list(x, id, from);
	}
	else if (0 == strcmp(dlna_name, "stop:set"))
	{
		
	}
	else if (0 == strcmp(dlna_name, "play-local:set"))
	{
		set_play_local(x, id, from);
	}
	else if (0 == strcmp(dlna_name, "play-remote:set"))
	{
		set_play_remote(x, id, from);
	}
	else if (0 == strcmp(dlna_name, "download:set"))
	{
		set_download(sess, x, id, from);
	}
	else if (0 == strcmp(dlna_name, "pause:set"))
	{
		;
	}
	else if (0 == strcmp(dlna_name, "volume:set"))
	{
		;
	}
	else if (0 == strcmp(dlna_name, "progress:set"))
	{
		;
	}
	else if (0 == strcmp(dlna_name, "mute:set"))
	{
		;
	}
	else
	{
		printf("unknow <dlna> dlna-name:%s\n", dlna_name);
	}
}

void response_extend_message(xmpp_session *sess, char *type, char *to, char *buf, int code, char *id)
{
	iks *x, *y, *z, *msg;
	char *xml;
	char str_code[8] = {};
	
	//extend
	x = iks_new ("extend");
	iks_insert_attrib(x, "version", EXTEND_MES_VER);
	iks_insert_attrib(x, "type", type);

	sprintf(str_code, "%d", code);
	printf("liyuan-debug;code:%s\n", str_code);

	if (strcmp(type, "soap") == 0)
	{
		//soap
		//content
		y = iks_insert(x, "soap");
		iks_insert_attrib(y, "status", str_code);
		
		z = iks_insert(y, "content");
		iks_insert_attrib(z, "encode", "base64");
		char *soap = get_soap_content(buf);
		if (soap)
		{
			char *soap_encode = iks_base64_encode(soap, strlen(soap));
			iks_insert_cdata (z, soap_encode, strlen(soap_encode));//liyuan-doubt 此长度在转义之后是否有问题
			
			if (soap_encode) iks_free(soap_encode);
		}

	}
	else if (strcmp(type, "bind") == 0)
	{
		y = iks_insert(x, "bind");
		iks_insert_attrib(y, "code", str_code);
	}
	else
	{
		iks_delete(x);
		return;
	}

	
	//获取转义后的xml
	xml = iks_string (iks_stack (x), x);
	msg = iks_make_msg(IKS_TYPE_CHAT, to, xml);
	iks_insert_attrib(msg, "id", id);
		
	iks_send(sess->prs, msg);
	iks_delete(x);
	iks_delete(msg);
}

int handle_extend_message(xmpp_session *sess, iks *x, ikspak *pak)
{
	char *extend_ver = NULL;
	char *extend_type = NULL;
	iks *child = NULL;
	int code = 0;
	char *id = iks_find_attrib(pak->x, "id");
	char *from = pak->from->full;
	
	if (strcmp(iks_name(x), "extend"))
		return 0;
	
	extend_ver = iks_find_attrib(x, "version");
	extend_type = iks_find_attrib(x, "type");

	if (extend_ver == NULL || extend_type == NULL || strcmp(extend_ver, EXTEND_MES_VER) != 0)
		return 0;

	
	child = iks_find(x, extend_type);
	if (child == NULL)
		return 0;

	if (strcmp(extend_type, "soap") == 0)
	{
		//还未加好友成功，要求对端重新进行绑定
		if (BIND_CODE_OK_ALREADY_FRIEND != get_user_status(sess->roster, pak->from->partial))
		{
			response_extend_message(sess, "bind", from, NULL, BIND_CODE_ERR_NO_BIND, id);
			return 0;
		}
		
		g_config.soap_sess.sock = init_soap_sock(g_config.soap_sess.soap_ip, g_config.soap_sess.soap_port);
		
		char *action = iks_find_attrib(child, "action");
		char *content = iks_find_cdata(child, "content");
		char *decode_soap = iks_base64_decode(content);
		char header[SOAP_HEADER_LEN] = {};
		
		get_soap_header(header, action, strlen(decode_soap));
		char *recv = get_soap_web(g_config.soap_sess.sock, header, decode_soap);
		
		if (decode_soap) iks_free(decode_soap);
		
		if (recv)
		{
			code = get_soap_response_code(recv);
			printf("liyuan-debug code:%d\n", code);
			response_extend_message(sess, extend_type, from, recv, code, id);
			free(recv);
		}
		delete_soap_sock(g_config.soap_sess.sock);
	}
	else if (strcmp(extend_type, "bind") == 0)
	{
		//如果已经是好友则不处理bind消息，告知已经是好友
		if (BIND_CODE_OK_ALREADY_FRIEND == get_user_status(sess->roster, pak->from->partial))
		{
			response_extend_message(sess, "bind", from, NULL, BIND_CODE_OK_ALREADY_FRIEND, id);
			return 0;
		}
		
		char *mac = iks_find_attrib(child, "mac");
		char *uname = iks_find_attrib(child, "uname");
		char *password = iks_find_attrib(child, "password");
		code = BIND_CODE_OK;
		
		if (!chk_if_attached(mac))
		{
			code = BIND_CODE_ERR_NO_ATTACH;
		}
		else
		{
			dbg_printf(Mod_jabber, "liyuan-debug\n");
			if (errOK != chk_router_http_uname_passwd(uname, password))
			{
				code = BIND_CODE_ERR_NO_AUTH;
			}
		}
		printf("liyuan-debug;func:%s,line:%d\n", __FUNCTION__, __LINE__);
		set_user_status(sess->roster, pak->from->partial, code);
		response_extend_message(sess, extend_type, from, NULL, code, id);
	}
	else if (strcmp(extend_type, "dlna") == 0)
	{
		//还未加好友成功，要求对端重新进行绑定
		if (BIND_CODE_OK_ALREADY_FRIEND != get_user_status(sess->roster, pak->from->partial))
		{
			response_extend_message(sess, "bind", from, NULL, BIND_CODE_ERR_NO_BIND, id);
			return 0;
		}
		
		handle_dlna_message(sess, child, from, id);
	}
	else
	{
		printf("unknow extend message type (%s)!\n", extend_type);
	}
	return 0;
}

int p_register_post(xmpp_session *sess, ikspak *pak)
{
	#define REG_USERNAME 	1
	#define REG_PASSWORD 	2
	#define REG_EMAIL 		4
	#define REG_FULLNAME 	8
	
	int required = 0;
	iks *t = pak->x;
	iks *p = NULL;
	iks *x = NULL;

	for (t = iks_child(t); t; t = iks_child(t)) {
		if (!iks_strcmp(iks_name(t), "query"))
			break;
	}

	for (t = iks_child(t); t; t = iks_next_tag(t)) {
		if (iks_strcmp(iks_name(t), "x")) 
			continue;

		for (p = iks_child(t); p; p = iks_next_tag(p)) {
			
			// 跳过非field节点
			if (iks_strcmp(iks_name(p), "field")) {
				continue;
			}
			
			// 不处理hidden节点
			if (!iks_strcmp(iks_find_attrib(p, "type"), "hidden")) {
				continue;
			}
			
			// 不处理无子节点的节点
			if (NULL == iks_child(p)) {
				continue;
			}

			// 找到符合要求的节点
			if (!iks_strcmp(iks_name(iks_child(p)), "required")) {
				if (!iks_strcmp(iks_find_attrib(p, "var"), "username"))
					required |= REG_USERNAME;
				else if (!iks_strcmp(iks_find_attrib(p, "var"), "password"))
					required |= REG_PASSWORD;
				else if (!iks_strcmp(iks_find_attrib(p, "var"), "email"))
					required |= REG_EMAIL;
				else if (!iks_strcmp(iks_find_attrib(p, "var"), "name"))
					required |= REG_FULLNAME;
				else 
					ERROR("don't support register info : %s \n", iks_find_attrib(p, "var"));
			}
		}
	}

	
	// 依据required来组织注册报文
	x = iks_make_iq(IKS_TYPE_SET, IKS_NS_REGISTER);
	iks_insert_attrib(x, "to", sess->acc->server);
	iks_insert_attrib(x, "id", ID_KEY_REG2);
	t = iks_child(x); // point to "query" node
	if (required & REG_USERNAME)
		iks_insert_cdata(iks_insert(t, "username"), sess->acc->user, 0);
	if (required & REG_PASSWORD)
		iks_insert_cdata(iks_insert(t, "password"), sess->pass, 0);
	iks_send(sess->prs, x);
	iks_delete(x);
	
	return required;
}

const char* j_get_domain(xmpp_session *sess)
{
	return XMPP_DFT_DOMAIN;
}

#if 0//def _LIYUAN_DEBUG_
//#define _TRACE printf("liyuan-debug;%s-%d\n", __FUNCTION__, __LINE__)
#define CONFIG_FILE_PATH "/etc/xmpp.conf"

typedef struct config_file_s
{
	char uname[32];
	char password[32];
	char host[16];
	char proxy[16];
	int	 port;
}config_file;	

config_file g_config;

static void init_config(void)
{
	memset(&g_config, 0, sizeof(g_config));
	sprintf(g_config.uname, "%s", "jerry@siteviewwzp");
	sprintf(g_config.password, "%s", "liyuan0714");
	sprintf(g_config.host, "%s", "192.168.9.11");
	sprintf(g_config.proxy, "%s", "192.168.9.11");
	g_config.port = IKS_JABBER_PORT;
}


/*********************************/
static int read_config_file(void)
{
	char szBuf[128] = {0};
	char szTemp[64] = {0};
	FILE *pFile = NULL;
	char *sp = NULL;
	char *sp1 = NULL;
	//uint32_t ulTemp = 0;
	
	pFile = fopen(CONFIG_FILE_PATH, "r+");
	if (NULL == pFile)
	{
		printf("%s not exist!\n", CONFIG_FILE_PATH);
		return -1;
	}

	while (NULL != fgets(szBuf, sizeof(szBuf), pFile))	
	{
		sp = strchr(szBuf, '\n');
		if (NULL != sp)
		{
			*sp = '\0';
		}
		else
		{	
			//防止编辑文件未加换行符
			printf("%s has no Enter\n", szBuf);
		}
		sp = szBuf;
		sp1 = strchr(sp, ':');
		if (NULL == sp1)
		{
			printf("%s has no \":\" ignore this line\n", szBuf);
			continue;
		}
		*sp1 = '\0';
		//printf("key word:%s\n", sp);
		if (strlen(sp) >= sizeof(szTemp))
		{	
			printf("file ignore,key word is too long\n");
			continue;
		}
		//printf("value:%s\n", sp1+1);
		
		if (0 == strncmp(sp, "uname", strlen("uname")))
		{
			sprintf(g_config.uname, "%s", sp1+1);
		}
		else if (0 == strncmp(sp, "password", strlen("password")))
		{
			sprintf(g_config.password, "%s", sp1+1);
		}
		else if (0 == strncmp(sp, "host", strlen("host")))
		{
			sprintf(g_config.host, "%s", sp1+1);
		}
		else if (0 == strncmp(sp, "proxy", strlen("proxy")))
		{
			sprintf(g_config.proxy, "%s", sp1+1);
		}
		else if (0 == strncmp(sp, "port", strlen("port")))
		{
			g_config.port = atoi(sp1+1);
		}
		else
		{
			printf("key word illegal:%s\n", sp);
		}
	}
	
	fclose(pFile);

	printf("uname:%s\n", g_config.uname);
	printf("password:%s\n", g_config.password);
	printf("host:%s\n", g_config.host);
	printf("proxy:%s\n", g_config.proxy);
	printf("port:%d\n", g_config.port);
	
	return 0;
}

#endif

// 文件传输协议协商(带内?? 带外??)
iks *it_file_trans_negotiation (enum iksubtype type, xmpp_session *sess, char *req_id, tran_file *filedesc)
{
	iks *x;
	iks *y;
	char *t = NULL;
	char sid[ID_LEN];
	char size[16];

	x = iks_new ("iq");
	switch (type) {
	//case IKS_TYPE_GET: t = "get"; break;
	case IKS_TYPE_SET: t = "set"; break;
	case IKS_TYPE_RESULT: t = "result"; break;
	//case IKS_TYPE_ERROR: t = "error"; break;
	default: return NULL;
	}

	// iq
	iks_insert_attrib (x, "id", req_id);
	iks_insert_attrib (x, "from", sess->acc->full);
	iks_insert_attrib (x, "to", filedesc->jid_from);
	iks_insert_attrib (x, "type", t);

	// si
	iks_insert_attrib (iks_insert (x, "si"), "xmlns", IKS_NS_XMPP_SI);
	y = iks_child(x);

	if (IKS_TYPE_SET == type) {
		sprintf(sid, "%s-sid", req_id);
		iks_insert_attrib (y, "id", sid);
		
		char *mime_type = tGetMimeType(filedesc->name);
		if (mime_type != NULL)
		{
			iks_insert_attrib (y, "mime-type", mime_type);
		}
		
		iks_insert_attrib (y, "profile", IKS_NS_XMPP_SI_FILE);
	}

	// file
	if (IKS_TYPE_SET == type) {
		y = iks_insert(y, "file");
		iks_insert_attrib (y, "xmlns", IKS_NS_XMPP_SI_FILE);
		if (filedesc->name) iks_insert_attrib (y, "name", filedesc->name);
		if (filedesc->size)
		{
			sprintf(size, "%d", filedesc->size);
			iks_insert_attrib (y, "size", size);
		}
		char desc[48] = {};
		sprintf(desc, "send-%s", filedesc->rd_uuid);
		iks_insert_cdata(iks_insert(y, "desc"), desc, 0);

		y = iks_parent(y);
	}

	//feature
	y = iks_insert(y, "feature");
	iks_insert_attrib (y, "xmlns", IKS_NS_XMPP_SI_FILE_FEATURE);
	// feature - x
	y = iks_insert(y, "x");
	iks_insert_attrib(y, "xmlns", IKS_NS_XDATA);
	if (IKS_TYPE_SET == type) {
		iks_insert_attrib(y, "type", "from");
	} else if (IKS_TYPE_RESULT == type) {
		iks_insert_attrib(y, "type", "submit");
	}
	//feature - x - field
	y = iks_insert(y, "field");
	iks_insert_attrib(y, "var", "stream-method");
	if (IKS_TYPE_SET == type) {
		iks_insert_attrib(y, "type", "list-single");
		iks_insert_cdata(iks_insert(iks_insert(y, "option"), "value"), IKS_FILE_PROTOCOL_BYTESTREAMS, 0);
		//iks_insert_cdata(iks_insert(iks_insert(y, "option"), "value"), IKS_FILE_PROTOCOL_IBB, 0);
	} else if (IKS_TYPE_RESULT == type) {
		iks_insert_cdata(iks_insert(y, "value"), IKS_FILE_PROTOCOL_BYTESTREAMS, 0);
	}

	return x;
}


// 文件接收协议交互
int it_file_trans_recv(xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = iks_child(x);
	char *id = iks_find_attrib(x, "id");
	char *xmlns = NULL;
	char *xmlkey = iks_name(y);
	char *from = iks_find_attrib(x, "from");

	xmlns = iks_find_attrib(y, "xmlns");
	if (!iks_strcmp(xmlkey, ID_KEY_FILE_SI)) 
	{
		// 文件传输协议握手
		if (!iks_strcmp(xmlns, IKS_NS_XMPP_SI)) {
			char *name = NULL;
			char *fid = NULL;
			int size = 0;

			fid = iks_find_attrib(y, "id");
			y = iks_find(y, "file");
			name = iks_find_attrib(y, "name");
			size = atoi(iks_find_attrib(y, "size"));
			printf("liyuan-debug:name=%s;id=%s;size=%d;from=%s\n", name, fid, size, from);

			char *desc = iks_find_cdata(y, "desc");
			char *rd_uuid = desc + strlen("send-");
			printf("liyuan-debug;desc:%s!!!!rd-uuid:%s\n", desc, rd_uuid);
			// 保存文件信息
			tran_file *filedesc = add_tran_file(sess->tran_file_list, name, fid, from, rd_uuid, id, size);
			
			//dbg_printf(Mod_jabber, "filesize = %d\n", size);
			
			//FUN_ERR(t_new_filetrans(&(sess->filetrans), DIR_CONFIG, file, size));
			//sess->filetrans.transFlag = 1;
			y = it_file_trans_negotiation(IKS_TYPE_RESULT, sess, id, filedesc);

			iks_send(sess->prs, y);
			iks_delete(y);
		}
		
	} 
	/*
	else if (!iks_strcmp(xmlkey, ID_KEY_FILE_OPEN)) 
	{
		// 文件传输会话初始化
		if (!iks_strcmp(xmlns, IKS_FILE_PROTOCOL_IBB)) {

			int blocksize = atoi(iks_find_attrib(y, "block-size"));

			if (blocksize > 4096)  {
				// 最大只接收4K的数据
				it_file_trans_error(sess, pak, "modify", "resource-constraint");
			} else {
				dbg_printf(Mod_none, "fullpath = %s\n", sess->filetrans.fullpath);
				sess->filetrans.fd = fopen(sess->filetrans.fullpath, "wb");
				if (NULL == sess->filetrans.fd) {
					dbg_printf(Mod_none, "create file, %s\n", strerror(errno));
					return IKS_FILTER_EAT;
				}
				sess->filetrans.blocksize = blocksize;
				it_iq_result(sess, id, from);
			}
		}
		else if (!iks_strcmp(xmlns, IKS_FILE_PROTOCOL_BYTESTREAMS)) 
		{
			// 不支持bytestreams传输方式
			it_file_trans_error(sess, pak, "cancel", "service-unavailable");
		}
	}
	else if (!iks_strcmp(xmlkey, ID_KEY_FILE_DATA)) 
	{
		it_file_recv_data(sess, pak);
	}
	else if (!iks_strcmp(xmlkey, ID_KEY_FILE_CLOSE)) 
	{
		// 传输完成
		dbg_printf(Mod_jabber, "\r\n completed recv %d/%d \r\n", sess->filetrans.cursize, sess->filetrans.filesize);
		it_iq_result(sess, id, from);
		
		// 如果请求转发出现的文件传输，则把传输结果返回
		if (strstr(sess->reqtrans.request, connStr(KEY_OPER_GET, KEY_FILE))) {
			if ( sess->filetrans.cursize >= sess->filetrans.filesize) {
				dbg_trace();
				sess->reqtrans.response = tErr2xmppStr(connStr(KEY_OPER_GET, KEY_FILE), errOK, NULL);
			} else {
				dbg_trace();
				sess->reqtrans.response = tErr2xmppStr(connStr(KEY_OPER_GET, KEY_FILE), errFileTransfer, NULL);
			}
		}

//		dbg_trace();
//		FREE_FILETRANS(sess->filetrans);
	} 
	*/

	return IKS_FILTER_EAT;
}


// 文件发送初始化
int it_file_send_init(xmpp_session *sess, char *from, char *id, char *filedir, char *filename, char *uuid)
{
	iks *x = NULL;
	int filesize = 0;
	char temp[0xFF] = {};
	char sid[ID_LEN] = {};
	char req_id[ID_LEN] = {};

	// 发送文件，主动发起的文件传输，步骤:检查文件是否存在，发送发起报文 
	sprintf(temp, "%s%s", filedir, filename);
	if (0 != access(temp, 0))
	{
		RET_ERR(errFileNotFound);
	}
	
	t_new_id(req_id, "si1");	//step-1:xxxxxxsi1
	filesize = tGetFileSize(temp);
	sprintf(sid, "%s-sid", req_id); //sid:xxxxxxxxxsi1-sid
	// 保存文件信息
	tran_file * filedesc = add_tran_file(sess->tran_file_list, filename, sid, from, uuid, id, filesize);
	x = it_file_trans_negotiation(IKS_TYPE_SET, sess, req_id, filedesc);
	iks_send(sess->prs, x);
	iks_delete(x);
	
	return errOK;
}

/* SOCKS5 Bytestreams
** step-2:初始方给服务器发送信息，请求提供代理服务器
** step-3:这里选择name=“Socks 5 Bytestreams Proxy”的代理，初始方给这个代理发送信息获取代理连接信息
*/

void it_file_send_query(xmpp_session *sess, ikspak *pak, char *id, int step)
{
	iks *x = NULL;
	
	x = iks_new("iq");
	memset(sess->req_id, 0, ID_LEN);
	strncpy(sess->req_id, id, (strlen(id)-1));
	sprintf(sess->req_id, "%s%d", sess->req_id, step);
	
	iks_insert_attrib(x, "type", "get");
	iks_insert_attrib(x, "id", sess->req_id);
	
	if (step == 2)	//step-2:xxxxxxsi2
	{
		iks_insert_attrib(iks_insert(x, "query"), "xmlns", IKS_NS_XMPP_DISCO_ITEMS);
	}
	else if (step == 3)	////step-3:xxxxxxsi3
	{
		char *jid = NULL;
		char *name = NULL;
		iks *query = iks_find(pak->x, "query");
		iks *item = iks_child(query);

		if (item == NULL)
			goto err;
		while (item)	//liyuan,依次连接每个代理，直到通为止
		{
			jid = iks_find_attrib(item, "jid");
			name = iks_find_attrib(item, "name");
			printf("liyuan-debug;jid:%s;name:%s;send file.....\n", jid, name);
			if (0 == strcmp(name, "Socks 5 Bytestreams Proxy"))
			{
				break;
			}
			
			item = iks_next(item);
		}
		iks_insert_attrib(x, "to", jid);
		iks_insert_attrib(iks_insert(x, "query"), "xmlns", IKS_FILE_PROTOCOL_BYTESTREAMS);
	}
	
	iks_send(sess->prs, x);
err:
	iks_delete(x);
}

//SOCKS5 Bytestreams;step-4:初始方收到代理信息后将代理的信息发送给目标方
void it_file_send_target(xmpp_session *sess, ikspak *pak, char *id)
{
	iks *x = NULL;
	iks *y = NULL;
	tran_file *file_desc = NULL;

	char sid[ID_LEN] = {};
	strncpy(sid, id, (strlen(id)-1));
	strcat(sid, "1-sid");	//sid:xxxxxxxxxsi1-sid
	element e = get_tran_file(sess->tran_file_list, sid);
	if (e == NULL)
	{
		printf("liyuan-debug;error-%s-%d!!!!cant find sid %s from list!\n", __FUNCTION__, __LINE__, sid);
		return;
	}
	file_desc = (tran_file *)(e->data);
	
	iks *query = iks_find(pak->x, "query");
	iks *streamhost = iks_child(query);
	if (streamhost == NULL)
	{
		printf("liyuan-debug;error-%s-%d!!!!cant find node <streamhost>!\n", __FUNCTION__, __LINE__);
		return;
	}
	char *port = iks_find_attrib(streamhost, "port");
	char *jid = iks_find_attrib(streamhost, "jid");
	char *host = iks_find_attrib(streamhost, "host");
	
	x = iks_new("iq");
	iks_insert_attrib(x, "type", "set");

	memset(sess->req_id, 0, ID_LEN);
	strncpy(sess->req_id, id, (strlen(id)-1));
	strcat(sess->req_id, "4");	//step-4:xxxxxxsi4
	iks_insert_attrib(x, "id", sess->req_id);
	
	iks_insert_attrib(x, "to", file_desc->jid_from);
	iks_insert_attrib(x, "from", pak->from->full);
	
	y = iks_insert(x, "query");
	iks_insert_attrib(y, "xmlns", IKS_FILE_PROTOCOL_BYTESTREAMS);
	iks_insert_attrib(y, "mode", "tcp");
	iks_insert_attrib(y, "sid", file_desc->id);

	y = iks_insert(y, "streamhost");
	iks_insert_attrib(y, "port", port);
	iks_insert_attrib(y, "jid", jid);
	iks_insert_attrib(y, "host", host);
	
	iks_send(sess->prs, x);
	iks_delete(x);
}

void it_file_send_active(xmpp_session *sess, ikspak *pak)
{
	
}

//SOCKS5 Bytestreams;step-5:初始方开始与代理建立socket连接，连接成功后给代理发送请求，要求激活文件流
int it_file_send_establish_conn(xmpp_session *sess, ikspak *pak, char *id)
{
	char *from = iks_find_attrib(pak->x, "from");
	char *to = iks_find_attrib(pak->x, "to");
	char host_name_src[256] = {};	//sid+from+to
	tran_file *file_desc = NULL;
	char sid[ID_LEN] = {};
	iks *query = iks_find(pak->x, "query");
	iks *used = iks_child(query); 	//streamhost-used
	if (used == NULL)
	{
		printf("liyuan-debug;error-%s-%d!!!!cant find node <streamhost-used>!\n", __FUNCTION__, __LINE__);
		return;
	}
	char *proxy_jid = iks_find_attrib(used, "jid");
	
	strncpy(sid, id, (strlen(id)-1));
	strcat(sid, "1-sid");	//sid:xxxxxxxxxsi1-sid
	element e = get_tran_file(sess->tran_file_list, sid);
	if (e == NULL)
	{
		printf("liyuan-debug;error-%s-%d!!!!cant find sid %s from list!\n", __FUNCTION__, __LINE__, sid);
		return;
	}
	file_desc = (tran_file *)(e->data);

	sprintf(host_name_src, "%s%s%s", sid, to, from);
	SHA1_Digest host_name_sha1 = SHA1_get(host_name_src, strlen(host_name_src));
	char host_name[41] = {};  // two bytes per digit plus terminator
    SHA1_Digest_toStr(&host_name_sha1, host_name);

	int proxy_sock = socks5_conn(host_name, 7777, XMPP_DFT_DOMAIN);//liyuan-todo,7777需要在上一步保存?
	if (proxy_sock > 0)	//socks5建立连接成功
	{
		file_desc->sock = proxy_sock;
		iks *x = iks_new("iq");
		iks_insert_attrib(x, "type", "set");
		memset(sess->req_id, 0, ID_LEN);
		strncpy(sess->req_id, id, (strlen(id)-1));
		strcat(sess->req_id, "5");	//step-5:xxxxxxsi5
		iks_insert_attrib(x, "id", sess->req_id);
		iks_insert_attrib(x, "from", pak->from->full);
		iks_insert_attrib(x, "to", proxy_jid);

		iks *y = iks_insert(x, "query");
		iks_insert_attrib(y, "xmlns", IKS_FILE_PROTOCOL_BYTESTREAMS);
		iks_insert_attrib(y, "sid", file_desc->id);

		iks_insert_cdata(iks_insert(y, "activate"), file_desc->jid_from, 0);
		
		iks_send(sess->prs, x);
		iks_delete(x);
	}
	else
	{
		printf("liyuan-debug;error-%s-%d!!!!!proxy_sock failure.\n", __FUNCTION__, __LINE__);
	}
	return proxy_sock;
}

//SOCKS5 Bytestreams;step-6:代理回复激活成功信息后就开始发送二进制流
void it_file_send_data(xmpp_session *sess, ikspak *pak, char *id)
{
	char sid[ID_LEN] = {};
	tran_file *file_desc = NULL;
	pthread_t pid;

	strncpy(sid, id, (strlen(id)-1));
	strcat(sid, "1-sid");	//sid:xxxxxxxxxsi1-sid
	element e = get_tran_file(sess->tran_file_list, sid);
	if (e == NULL)
	{
		printf("liyuan-debug;error-%s-%d!!!!cant find sid %s from list!\n", __FUNCTION__, __LINE__, sid);
		return;
	}
	file_desc = (tran_file *)(e->data);

	if (file_desc->sock > 0)
	{
		tran_file_thread_arg_3 *arg = (tran_file_thread_arg_3 *)MALLOC(sizeof(tran_file_thread_arg_3));
		int ret = get_usb_device_mount_path(arg->filename);
		if (ret)
		{
			free_list_element(sess->tran_file_list, e);
			FREE(arg);
			return;
		}
		arg->sock = file_desc->sock;
		strcat(arg->filename, file_desc->name);

		
		if (0 != pthread_create(&pid, NULL, send_file, arg))
		{
			printf("pthread create send_file error\n");
		}
	}
	else	//liyuan-todo;删除列表，删除http获取的文件
	{
		
	}
	free_list_element(sess->tran_file_list, e);
}

// 文件发送协议交互(it_file_send_init发起)
void it_file_trans_send(xmpp_session *sess, ikspak *pak)
{
	iks *x = pak->x;
	iks *y = NULL;
	iks *z = NULL;
	char *id = iks_find_attrib(x, "id");
	char temp[0xFF];

	if (strstr(id, ID_KEY_FILE_SI1)) {
		// 发送传输初始报文
		//<iq id="xxxx" type="get"><query xmlns="http://jabber.org/protocol/disco#items" /></iq> 
		it_file_send_query(sess, pak, id, 2);
	} else if (strstr(id, ID_KEY_FILE_SI2)) {
		it_file_send_query(sess, pak, id, 3);
	} else if (strstr(id, ID_KEY_FILE_SI3)) {
		it_file_send_target(sess, pak, id);
	} else if (strstr(id, ID_KEY_FILE_SI4)) {
		it_file_send_establish_conn(sess, pak, id);
	} else if (strstr(id, ID_KEY_FILE_SI5)) {
		it_file_send_data(sess, pak, id);
	} 
#if 0
	else if (strstr(id, ID_KEY_FILE_OPEN)) {

		int len = 0;
		char buffer[4096];
		
		// 打开并发送文件内容
		sess->filetrans.fd =  fopen(sess->filetrans.fullpath, "rb");
		if (!sess->filetrans.fd) {
			// send filetrans error
			it_file_trans_error(sess, pak, "cancel", "item-not-found");
		} 

		// message send file
		while (!feof(sess->filetrans.fd)) {
			memset(buffer, 0, sizeof buffer);
			len = fread(buffer, 1, sizeof(buffer),sess->filetrans.fd);
			it_file_send_data(sess, pak, 1, buffer, len);
		}
		it_file_send_close(sess, pak);
		// message send file end
		
	} else if (strstr(id, ID_KEY_FILE_DATA)) {
		int len = 0;
		char buffer[4096];

		if (sess->filetrans.transFlag) {
			if (!sess->filetrans.fd) {
				// send filetrans error
				it_file_trans_error(sess, pak, "cancel", "item-not-found");
			} else {
				len = fread(buffer, 1, sizeof(buffer), sess->filetrans.fd);
				if (len > 0) {
					it_file_send_data(sess, pak, 0, buffer, len);
				} else {
					if (feof(sess->filetrans.fd)) {
						// send close
						it_file_send_close(sess, pak);
					}
				}
			}
		}
	} else if (strstr(id, ID_KEY_FILE_CLOSE)) {
		// 文件发送成功完成，通知客户端 在 it_file_send_close里面实现 
	}
#endif
}
