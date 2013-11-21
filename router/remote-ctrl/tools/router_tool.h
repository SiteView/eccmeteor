#ifndef _ROUTER_TOOL_H_
#define _ROUTER_TOOL_H_



#define ROUTER_HTTP_UNAME		"http_username"
#define ROUTER_HTTP_PASSWD		"http_passwd"

typedef struct attach_device_s
{
	char ip[16];
	char mac[18];
	char conn_type[16];
	char dev_name[64];
}attach_device;

extern int get_attach_device(attach_device *dev_list);
extern int chk_router_http_uname_passwd(char *uname, char *passwd);


#endif
