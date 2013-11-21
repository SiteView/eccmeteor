#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sys/stat.h>


#include "remotedlna.h"
#include "pqhttp.h"
#include "util.h"

list mes_from_xmpp = NULL;
list mes_from_dlna = NULL;


void
recv_file (void *lparam)
{
	char buf[2048];
	int ret = -1;
	FILE* file;
	char name[128] = {};
	tran_file_thread_arg *data = lparam;
	char *mes_data = data->mes_data;
	int len = *(int *)(mes_data+sizeof(int));
	
	memcpy(name, mes_data+(2*sizeof(int)), len);
	
	char cmd[128] = {};
	sprintf(cmd, "rm -rf %s", name);
	system(cmd);

	if((file = fopen(name, "ab+")) == NULL)
	{
		printf("cannot open file %s!\n", name);
		FREE(mes_data);
		FREE(data);
		return;
	}

	//liyuan-todo,远端传一半取消的情况
	while (1)
	{
		ret = recv(data->recv_sock, buf, sizeof(buf), 0);
		if (ret > 0)
		{
			if (file)  
		    {  
				fwrite(buf, sizeof(unsigned char), ret, file);
		    }  
		}
		else if (ret <0)	//liyuan-doubt
		{
			sleep(1);
			printf("liyuan-debug,ret <0\n");
		}
		else
		{
			break;
		}
	}
	printf("recv %s success!\n", name);
	fclose(file);
	close(data->recv_sock);
	printf("close file !\n");

	char req_id[ID_LEN] = {};
	t_new_id(req_id, "PlayLocal");
	send_mes(mes_from_xmpp, MES_REQ_PLAY_LOCAL, mes_data, data->mes_data_len, req_id, data->jid);
	FREE(mes_data);
	FREE(data);
}

int http_event(unsigned int total_bytes, unsigned int already_bytes, unsigned int per_bytes)
{
	//printf("Downloading... (total:%u, already:%u, per:%u)\n", total_bytes, already_bytes, per_bytes);
	return 1;
}

void download_by_http(void *lparam)
{
	tran_file_thread_arg_2 *arg = (tran_file_thread_arg_2 *)lparam;
	int ret;
	PQ_Http *http = pqhttp_create();
	char path[128] = {};

	if ( !http ) {
		printf("create http failed!\n");
		goto end;
	}
	
	if ( (ret = pqhttp_load_url(http, arg->url)) != PQH_OK ) {
		printf("load url failed! errno=%#x\n", ret);
		goto end;	
	}

	
	if (get_usb_device_mount_path(path))
	{
		//free_list_element(sess->tran_file_list, e);
		goto end;
	}
	
	ret = pqhttp_download(http, path, http->remote_file, http_event);
	if ( ret == PQH_OK ) {	
		printf("download finish! ok.\n");
		if (errOK != it_file_send_init(arg->sess, arg->jid_from, arg->req_id, path, http->remote_file, arg->uuid))
		{
			goto end;
		}
	} else {
		printf("download error! errno=%#x\n", ret);
	}

end:
	pqhttp_free(http);
	FREE(lparam);
}

void
send_file (void *lparam)
{
	char buf[2048];
	int ret = -1;
	FILE* file;
	char cmd[128] = {};
	tran_file_thread_arg_3 *arg = (tran_file_thread_arg_3 *)lparam;

	
	if((file = fopen(arg->filename, "rb")) == NULL)
	{
		printf("cannot open file %s!\n", arg->filename);
		FREE(arg);		//liyuan-todo,释放节点放在主循环中，这里只给状态，根据状态可以给手机回复结果
		return;
	}

	while (1)
	{
		//liyuan-todo ;ferror(file)
		if (feof(file))
		{
			printf("liyuan-debug;send file %s success!\n", arg->filename);
			break;
		}
		else
		{
			ret = fread(buf, sizeof(unsigned char), sizeof(buf), file);
			if (ret > 0)
			{
				send(arg->sock, buf, sizeof(buf), 0);
			}
		}
		memset(buf, 0, sizeof(buf));
	}

	fclose(file);
	close(arg->sock);
	
	sprintf(cmd, "rm -rf %s", arg->filename);
	system(cmd);

	FREE(arg);
}


void free_tran_file(void *data)
{
	tran_file *file = data;
	FREE_PTR(file->name);
	FREE_PTR(file->id);
	FREE_PTR(file->jid_from);
	FREE_PTR(file->rd_uuid);
	FREE_PTR(file->req_id);
	FREE(file);
}

tran_file * add_tran_file(list l, const char *name, const char *id, const char *from, const char *rd_uuid, const char *req_id, int size)
{
	tran_file *file = (tran_file *)MALLOC(sizeof(tran_file));
	file->name = (char *)MALLOC(strlen(name)+1);
	strcpy(file->name, name);
	file->id = (char *)MALLOC(strlen(id)+1);
	strcpy(file->id, id);
	file->jid_from = (char *)MALLOC(strlen(from)+1);
	strcpy(file->jid_from, from);
	file->rd_uuid = (char *)MALLOC(strlen(rd_uuid)+1);
	strcpy(file->rd_uuid, rd_uuid);
	file->req_id = (char *)MALLOC(strlen(req_id)+1);
	strcpy(file->req_id, req_id);
	file->size = size;
	list_add(l, file);
	return file;
}

element get_tran_file(list l, char *id)
{
	element e;
	tran_file *file;

	for (e = LIST_HEAD(l); e; ELEMENT_NEXT(e)) {
		file = (tran_file *)(ELEMENT_DATA(e));
		if (0 == strcmp(file->id, id)) {
			
			return e;
		}
	}
	return NULL;
}


/* read one byte from fd and return it */
int
read_byte(int fd)
{
	unsigned char c;

	if(recv(fd, &c, 1, 0) != -1)
		return c;

	return -1;
}


/*
 * connect to address:port; this function is used by the
 * protocol-specific connect_to functions to connect to
 * the proxy server
 */
int
establish_connection(unsigned char address[4], unsigned short port)
{
	int fd;
	struct sockaddr_in sin;

	fd = socket(AF_INET, SOCK_STREAM, 0);
	if(fd == -1)
		return -1;

	sin.sin_family = AF_INET;
	sin.sin_port = htons(port);
	memcpy(&sin.sin_addr, address, 4);

	if(connect(fd, (struct sockaddr *)&sin, sizeof(sin)) == -1) {
		close(fd);
		return -1;
	}

	return fd;
}


static int
socks5_negotiate(int fd, char *hostname, unsigned short port,
                 char *username, char *password)
{
	int i;
	char buf[515];
	unsigned char len;
	unsigned char atyp;

	buf[0] = 0x05;
	buf[1] = 0x01;
	if(username && password)
		buf[2] = 0x02;
	else
		buf[2] = 0x00;
	send(fd, buf, 3, 0);
	if(read_byte(fd) != 0x05 || read_byte(fd) != buf[2]) {
		fprintf(stderr, "Error: Bad response from SOCKS5 server(%d)\n", __LINE__);
		close(fd);
		return -1;
	}

	if(username && password) {
		unsigned char tmplen;

		buf[0] = 0x01;
		len = (strlen(username) > 255) ? 255 : strlen(username);
		buf[1] = len;
		memcpy(buf + 2, username, len);

		tmplen = (strlen(password) > 255) ? 255 : strlen(password);
		buf[2 + len] = tmplen;
		memcpy(buf + 3 + len, password, tmplen);

		send(fd, buf, (3 + len + tmplen), 0);

		if(read_byte(fd) != 0x01 || read_byte(fd) != 0x00) {
			fprintf(stderr, "Error: SOCKS5 authentication failed\n");
			close(fd);
			return -1;
		}
	}
	
	buf[0] = 0x05;
	buf[1] = 0x01;
	buf[2] = 0x00;
	buf[3] = 0x03;
	len = (strlen(hostname) > 255) ? 255 : strlen(hostname);
	buf[4] = (len & 0xff);
	memcpy(buf + 5, hostname, len);
	buf[5 + len] = 0x00;
	buf[6 + len] = 0x00;
	send(fd, buf, (7 + len), 0);
	if(read_byte(fd) != 0x05 || read_byte(fd) != 0x00) {
		fprintf(stderr, "Error: Bad response from SOCKS5 server(%d)\n", __LINE__);
		close(fd);
		return -1;
	}
	
	read_byte(fd);
	atyp = read_byte(fd);
	if(atyp == 0x01) {
		for(i = 0; i < 4; i++)
			read_byte(fd);
	} else if(atyp == 0x03) {
		len = read_byte(fd);
		for(i = 0; i < len; i++)
			read_byte(fd);
	} else {
		fprintf(stderr, "Error: Bad response from SOCKS5 server(%d)\n", __LINE__);
		close(fd);
		return -1;
	}
	for(i = 0; i < 2; i++)
		read_byte(fd);
	
	return 0;
}


/* connect to hostname:port via a socks5 proxy; returns file descriptor */
static int
socks5_connect_to(char *hostname, unsigned short port,
                  char *username, char *password, int server_timeout,
                  char *proxyhost)
{
	int fd;
	struct hostent *host;

	if(!proxyhost)
		return -1;

	host = gethostbyname(proxyhost);
	if(!host) {
		fprintf(stderr, "Error: Unable to resolve hostname %s\n", proxyhost);
		return -1;
	}

	printf("line:%d;port:%d\n", __LINE__, port);
	fd = establish_connection(host->h_addr, port);
	if(fd == -1) {
		fprintf(stderr, "Error: Unable to connect to SOCKS5 server %s:%u\n", proxyhost, port);
		return -1;
	}

	/* set remote server socket timeout if necessary */
	if(server_timeout) {
		struct timeval timeout_val;

		timeout_val.tv_sec = server_timeout;
		timeout_val.tv_usec = 0;
		setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, (void *)&timeout_val, sizeof(timeout_val));
	}

	fprintf(stderr, "Connected to SOCKS5 server %s:%u\n", proxyhost, port);

	if(socks5_negotiate(fd, hostname, port, username, password) == -1)
		return -1;

	return fd;
}

int socks5_conn(char *remotehost, int remoteport, char *proxyhost)
{
	int server_timeout = 0;
	printf("debug:%d;port:%d\n", __LINE__, remoteport);
	int remotefd = socks5_connect_to(remotehost, remoteport, NULL, NULL, server_timeout, proxyhost);
	if(remotefd == -1) {
		fprintf(stderr, "Error: Unable to connect to remote host %s (port %u)\n", remotehost, remoteport);
		close(remotefd);
	}

	return remotefd;
}

void free_message(void *data)
{
	message_t *mes = data;
	if (mes->type == MES_RES_DEV_LISTS)
	{
		int *cnt = (int *)(mes->data);
		int i;
		device_dlna *dev = (device_dlna *)(mes->data + sizeof(int));
		for (i=0; i<*cnt; i++)
		{
			FREE_PTR(dev->friendly_name);
			//FREE_PTR(dev->uuid);
			dev++;
		}
	}
	
	FREE_PTR(mes->data);
	FREE(mes);
}

void init_message_list(void)
{
	mes_from_xmpp = alloc_list(free_message, NULL);
	mes_from_dlna = alloc_list(free_message, NULL);
	MUTEX_CREATE(mes_from_xmpp->mutex);
	MUTEX_CREATE(mes_from_dlna->mutex);
}

void free_message_list(void)
{
	MUTEX_DESTROY(mes_from_xmpp->mutex);
	MUTEX_DESTROY(mes_from_dlna->mutex);
	free_list(mes_from_xmpp);
	free_list(mes_from_dlna);
}

void send_mes(list l, enum mes_type t, void *data, int data_size, char *id, char *jid)
{
	message_t *mes = (message_t *)MALLOC(sizeof(message_t));
	strcpy(mes->id, id);
	strcpy(mes->jid, jid);
	if (data_size)
	{
		mes->data = (char *)MALLOC(data_size);
		memcpy(mes->data, data, data_size);
		mes->data_len = data_size;
	}
	mes->type = t;
	list_add_with_mutex(l, mes);
}

element recv_mes(list l, enum mes_type t)
{
	element e;
	message_t *mes;

	for (e = LIST_HEAD(l); e; ELEMENT_NEXT(e)) {
		mes = (message_t *)(ELEMENT_DATA(e));
		if (mes->type == t) {
			
			return e;
		}
	}
	return NULL;
}

void mes_ele_parser(tlv *tlvs, void *data, int data_len)
{
	int type = 0;
	int len = 0;
	while (data_len)
	{
		//t
		type = *(int *)data;
		if (type < 0 || type > MES_ELE_LAST)
		{
			printf("unknow mes_elment type %d\n", type);
			return;
		}
		data += sizeof(int);
		data_len -= sizeof(int);

		//l
		len = *(int *)(data);
		data += sizeof(int);
		data_len -= sizeof(int);

		//v
		(tlvs+type)->type = type;
		(tlvs+type)->len = len;
		(tlvs+type)->value = data;
		data += len;
		data_len -= len;
	}
}

int make_mes_data(char **data, tlv *tlvs)
{
	char *mes_data = NULL;
	int len = 0;
	int i = 0;
	
	for (i = 0; i < MES_ELE_LAST; i++)
	{
		if ((tlvs+i)->type == 0 || (tlvs+i)->value == NULL)
			continue;
		len += sizeof(int) + sizeof(int) + (tlvs+i)->len + 1;
	}

	*data = (char *)MALLOC(len);
	mes_data = *data;
	
	for (i = 0; i < MES_ELE_LAST; i++)
	{
		if ((tlvs+i)->type == 0 || (tlvs+i)->value == NULL)
			continue;

		*(int *)(mes_data) = (tlvs+i)->type;
		mes_data += sizeof(int);
		*(int *)(mes_data) = (tlvs+i)->len + 1;
		mes_data += sizeof(int);
		memcpy(mes_data, (tlvs+i)->value, (tlvs+i)->len);
		mes_data += (tlvs+i)->len + 1;
	}
	
	return len;
}

void get_dev_list(iks *x, const char *id, const char *jid)
{
	
	if (x == NULL || id == NULL || jid == NULL)
		return;
	
	send_mes(mes_from_xmpp, MES_REQ_DEV_LISTS, NULL, 0, id, jid);
}


//6300v2
/* 挂载u盘后系统会自动将u盘的挂载目录连接到/tmp/shares下
** usb2.0链接至/tmp/shares/USB_Storage下
** usb3.0链接至/tmp/shares/T_Drive下 **/
int get_usb_device_mount_path(char *path)
{
#if defined(R6300v2)
	struct stat buf;
	char cmd[128] = {};

	if (0 == access(NO_USB_DEVICE, 0))
	{
		printf("error!!! NO USB DEVICE!!!\n");
		return 1;
	}
	if (0 == access(FILE_SAVE_PATH_1, 0))
	{
		if (lstat(FILE_SAVE_PATH_1, &buf) < 0)
		{
			perror("lstat");
			return 1;
		}
		if (S_ISLNK(buf.st_mode))	//判断是否是链接，是链接说明u盘已经挂载
		{
			strcpy(path, FILE_SAVE_PATH_1"/.tmp_DLNA/");
			if (0 != access(path, 0))
			{
				sprintf(cmd, "mkdir %s", path);
				system(cmd);
			}
			return 0;
		}
	}
	else if(0 == access(FILE_SAVE_PATH_2, 0))
	{
		strcpy(path, FILE_SAVE_PATH_2"/.tmp_DLNA/");
		if (0 != access(path, 0))
		{
			sprintf(cmd, "mkdir %s", path);
			system(cmd);
		}
		return 0;
	}
#endif	
	printf("error!!! NO USB DEVICE!!!\n");
	return 1;
}

void get_obj_list(iks *x, const char *id, const char *jid)
{
	if (x == NULL || id == NULL || jid == NULL)
		return;
	
	tlv tlvs[MES_ELE_LAST] = {};
	int len = 0;
	char *mes_data = NULL;
	char *uuid = iks_find_attrib(x, "uuid");
	char *objid = iks_find_attrib(x, "objid");
	char *start = iks_find_attrib(x, "start");
	char *count = iks_find_attrib(x, "count");
	
	tlvs[MES_ELE_RD_UUID].type = MES_ELE_RD_UUID;
	tlvs[MES_ELE_RD_UUID].len = strlen(uuid);
	tlvs[MES_ELE_RD_UUID].value = uuid;
	
	tlvs[MES_ELE_OBJ_ID].type = MES_ELE_OBJ_ID;
	tlvs[MES_ELE_OBJ_ID].len = strlen(objid);
	tlvs[MES_ELE_OBJ_ID].value = objid;

	tlvs[MES_ELE_OBJ_START].type = MES_ELE_OBJ_START;
	tlvs[MES_ELE_OBJ_START].len = strlen(start);
	tlvs[MES_ELE_OBJ_START].value = start;

	tlvs[MES_ELE_OBJ_COUNT].type = MES_ELE_OBJ_COUNT;
	tlvs[MES_ELE_OBJ_COUNT].len = strlen(count);
	tlvs[MES_ELE_OBJ_COUNT].value = count;

	len = make_mes_data(&mes_data, tlvs);
	
	send_mes(mes_from_xmpp, MES_REQ_OBJ_LISTS, mes_data, len, id, jid);
	FREE(mes_data);
}

void set_play_local(iks *x, const char *id, const char *jid)
{
	if (x == NULL || id == NULL || jid == NULL)
		return;

	tlv tlvs[MES_ELE_LAST] = {};
	char *mes_data = NULL;
	int len = 0;
	int ret = 0;
	char *rd_uuid = iks_find_attrib(x, "rdUuid");
#ifdef _LIYUAN_DEBUG_
	char *filename = iks_find_attrib(x, "filename");
	char *filesize = iks_find_attrib(x, "filesize");
	char path[128] = {};
	ret = get_usb_device_mount_path(path);
	if (ret)
	{
		return;
	}
	strcat(path, filename);
#endif
	tlvs[MES_ELE_RD_UUID].type = MES_ELE_RD_UUID;
	tlvs[MES_ELE_RD_UUID].len = strlen(rd_uuid);
	tlvs[MES_ELE_RD_UUID].value = rd_uuid;

	tlvs[MES_ELE_FILE_NAME].type = MES_ELE_FILE_NAME;
	tlvs[MES_ELE_FILE_NAME].len = strlen(path);
	tlvs[MES_ELE_FILE_NAME].value = path;

	len = make_mes_data(&mes_data, tlvs);
	send_mes(mes_from_xmpp, MES_REQ_PLAY_LOCAL, mes_data, len, id, jid);
	FREE(mes_data);

}

void set_download(xmpp_session *sess, iks *x, const char *id, const char *jid)
{
	char *uuid = iks_find_attrib(x, "rdUuid");
	char *url = iks_find_attrib(x, "url");
	pthread_t pid;
	tran_file_thread_arg_2 *arg = (tran_file_thread_arg_2 *)MALLOC(sizeof(tran_file_thread_arg_2));
	arg->sess = sess;
	strcpy(arg->url, url);
	strcpy(arg->uuid, uuid);
	strcpy(arg->jid_from, jid);
	strcpy(arg->req_id, id);
	
	if (0 != pthread_create(&pid, NULL, download_by_http, arg))
	{
		printf("pthread create recv_file error\n");
	}
}

void set_play_remote(iks *x, const char *id, const char *jid)
{
	char *rd_uuid = iks_find_attrib(x, "rdUuid");
	tlv tlvs[MES_ELE_LAST] = {};
	int len = 0;
	char *mes_data = NULL;
#ifdef _LIYUAN_DEBUG_
	char *srv_uuid = iks_find_attrib(x, "srvUuid");
	char *objid = iks_find_attrib(x, "objId");
	char *parentid = iks_find_attrib(x, "parentId");
#endif
	tlvs[MES_ELE_RD_UUID].type = MES_ELE_RD_UUID;
	tlvs[MES_ELE_RD_UUID].len = strlen(rd_uuid);
	tlvs[MES_ELE_RD_UUID].value = rd_uuid;

	tlvs[MES_ELE_SRV_UUID].type = MES_ELE_SRV_UUID;
	tlvs[MES_ELE_SRV_UUID].len = strlen(srv_uuid);
	tlvs[MES_ELE_SRV_UUID].value = srv_uuid;

	tlvs[MES_ELE_OBJ_ID].type = MES_ELE_OBJ_ID;
	tlvs[MES_ELE_OBJ_ID].len = strlen(objid);
	tlvs[MES_ELE_OBJ_ID].value = objid;
	
	tlvs[MES_ELE_PARENT_ID].type = MES_ELE_PARENT_ID;
	tlvs[MES_ELE_PARENT_ID].len = strlen(parentid);
	tlvs[MES_ELE_PARENT_ID].value = parentid;
	len = make_mes_data(&mes_data, tlvs);
	send_mes(mes_from_xmpp, MES_REQ_PLAY_REMOTE, mes_data, len, id, jid);
	FREE(mes_data);
}

void send_dlna_dev_list(xmpp_session *sess, char *to, char *id, char *code, device_dlna *dev_list, int cnt)
{
	iks *x;
	iks *y;
	iks *z;
	iks *msg;
	int i = 0;
	char *xml;

	
	//extend
	x = iks_new ("extend");
	iks_insert_attrib(x, "version", EXTEND_MES_VER);
	iks_insert_attrib(x, "type", "dlna");

	//dlna
	y = iks_insert(x, "dlna");
	iks_insert_attrib(y, "name", "dlna-devlist:result");
	iks_insert_attrib(y, "code", "0200");	//liyuan-doubt
	device_dlna *dev_item = dev_list;

	//value
	for (i = 0; i < cnt; i++)
	{
		z = iks_insert(y, "item");
		iks_insert_attrib(z, "friendlyname", dev_item->friendly_name);
		iks_insert_attrib(z, "uuid", dev_item->uuid);
		if (dev_item->type == DLNA_SERVER)
		{
			iks_insert_attrib(z, "type", "server");
		}
		else if (dev_item->type == DLNA_RENDER)
		{
			iks_insert_attrib(z, "type", "render");
		}
		else
		{
			iks_insert_attrib(z, "type", "unknow");
		}
		//iks_insert_attrib(z, "type", IKS_FILE_PROTOCOL_BYTESTREAMS);
		dev_item++;
	}

	//获取转义后的xml
	xml = iks_string (iks_stack (x), x);
	msg = iks_make_msg(IKS_TYPE_CHAT, to, xml);
	iks_insert_attrib(msg, "id", id);
		
	iks_send(sess->prs, msg);
	iks_delete(x);
	iks_delete(msg);
}

void send_dlna_obj_list(xmpp_session *sess, char *to, char *id, char *code, char *obj_sets, int cnt)
{
	iks *x;
	iks *y;
	iks *z;
	iks *msg;
	int i = 0;
	char *xml;
	char size[24];

	
	//extend
	x = iks_new ("extend");
	iks_insert_attrib(x, "version", EXTEND_MES_VER);
	iks_insert_attrib(x, "type", "dlna");
	
	//dlna
	y = iks_insert(x, "dlna");
	iks_insert_attrib(y, "name", "dlna-objlist:result");
	iks_insert_attrib(y, "code", code);	//liyuan-doubt

	int *total = (int *)(obj_sets);
	int *start = (int *)(obj_sets+sizeof(int));
	int *end = (int *)(obj_sets+(sizeof(int)*2));
	char str_total[8] = {};
	char str_start[8] = {};
	char str_end[8] = {};
	sprintf(str_total, "%d", *total);
	sprintf(str_start, "%d", *start);
	sprintf(str_end, "%d", *end);

	printf("liyuan-debug;total:%d;start:%d;end:%d\n", *total, *start, *end);
	iks_insert_attrib(y, "total", str_total);
	iks_insert_attrib(y, "start", str_start);
	iks_insert_attrib(y, "end", str_end);
	dlna_obj *obj_item = (dlna_obj *)(obj_sets+(sizeof(int)*3));

	//value
	for (i = 0; i < cnt; i++)
	{
		z = iks_insert(y, "item");
		iks_insert_attrib(z, "objid", obj_item->objectId);
		iks_insert_attrib(z, "parentId", obj_item->parentId);
		iks_insert_attrib(z, "title", obj_item->title);
		iks_insert_attrib(z, "upnpClass", obj_item->upnpClass);
		iks_insert_attrib(z, "upnpClassName", obj_item->upnpClassName);
		iks_insert_attrib(z, "url", obj_item->url);
		memset(size, 0, sizeof(size));
		sprintf(size, "%lld", obj_item->resourceSize);
		iks_insert_attrib(z, "resourceSize", size);
		obj_item++;
	}

	
	//获取转义后的xml
	xml = iks_string (iks_stack (x), x);
	msg = iks_make_msg(IKS_TYPE_CHAT, to, xml);
	iks_insert_attrib(msg, "id", id);
		
	iks_send(sess->prs, msg);
	iks_delete(x);
	iks_delete(msg);
}

void send_dlna_action_result(xmpp_session *sess, message_t *mes)
{
	iks *x;
	iks *y;
	iks *msg;
	char *xml;

	
	//extend
	x = iks_new ("extend");
	iks_insert_attrib(x, "version", EXTEND_MES_VER);
	iks_insert_attrib(x, "type", "dlna");

	//dlna
	y = iks_insert(x, "dlna");

	switch (mes->type)
    {
    case MES_RES_PLAY_REMOTE:
		{
			iks_insert_attrib(y, "name", "play-remote:result");
		}
		break;
	case MES_RES_PLAY_LOCAL:
		{
			iks_insert_attrib(y, "name", "play-local:result");
		}
		break;
	
	default:
		break;
	}

	
	iks_insert_attrib(y, "code", mes->code);
	//获取转义后的xml
	xml = iks_string (iks_stack (x), x);
	msg = iks_make_msg(IKS_TYPE_CHAT, mes->jid, xml);
	iks_insert_attrib(msg, "id", mes->id);
		
	iks_send(sess->prs, msg);
	iks_delete(x);
	iks_delete(msg);
}

void handle_message_from_dlna(xmpp_session *sess)
{
	MUTEX_LOCK(mes_from_dlna->mutex);
	if (mes_from_dlna == NULL || mes_from_dlna->head == NULL)
	{
		MUTEX_UNLOCK(mes_from_dlna->mutex);
		return;
	}
	
	message_t *mes_dlna = mes_from_dlna->head->data;
	
    switch (mes_dlna->type)
    {
	case MES_RES_DEV_LISTS:
		{
			int *cnt = (int *)(mes_dlna->data);
			device_dlna *dev_list = (device_dlna *)(mes_dlna->data+sizeof(int));
			
			send_dlna_dev_list(sess, mes_dlna->jid, mes_dlna->id, mes_dlna->code, dev_list, *cnt);
		}
		break;
	case MES_RES_OBJ_LISTS:
		{
			int *cnt = (int *)(mes_dlna->data);
			char *obj_sets = (char *)(mes_dlna->data+sizeof(int));
			send_dlna_obj_list(sess, mes_dlna->jid, mes_dlna->id, mes_dlna->code, obj_sets, *cnt);
		}
		break;
	case MES_RES_PLAY_REMOTE:
	case MES_RES_PLAY_LOCAL:
		{
			send_dlna_action_result(sess, mes_dlna);
		}
		break;
	default:
		printf("unknow message from dlna!type:%d\n", mes_dlna->type);
		break;
    }
	free_list_element(mes_from_dlna, mes_from_dlna->head);
	MUTEX_UNLOCK(mes_from_dlna->mutex);
}

