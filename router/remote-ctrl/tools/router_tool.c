#include "router_tool.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "util.h"
#include "soap.h"
#include "list.h"

int tPopenLine(char *cmd, char *buffer, int buflen)
{
	FILE *fp = NULL;
	char buf[1024] = {};

	/*调用popen函数执行相应的命令*/
	memset(buf, 0, sizeof(buf));
	if((fp=popen(cmd,"r"))==NULL) {
	   perror("popen");
	   return errSysError;
	}

	// 只读一行
	if (NULL==fgets(buf,sizeof(buf),fp)) {
		pclose(fp);
		return errSysError;
	}
	CHK_EXP_ERR_RET(strlen(buf)>buflen, errBuffer);
	buf[strlen(buf)-1] = '\0';
	strcpy(buffer, buf);
	
	if(fp) pclose(fp);
	return errOK;
}

static int param_get_file(const char *strParam, char* buffer, int buflen)
{
	char temp[256] = {};
#if defined(R6300v2)
	sprintf(temp, "nvram get %s", strParam);
#else if defined(3700v4)
	sprintf(temp, "config get %s", strParam);
#endif
	return tPopenLine(temp, buffer, buflen);
}

int router_config_get_str(const char *strParam, void* value, int len)
{
	int ret = 0;
	char cmd[256] = {};

	
#if defined(R6300v2)
	sprintf(cmd, "nvram get %s", strParam);
#else if defined(3700v4)
	sprintf(cmd, "config get %s", strParam);
#endif
	ret = tPopenLine(cmd, value, len);
	CHK_RET_ERR(ret);
	dbg_printf(Mod_control, "%s : %s\n", cmd, value);
	
	return ret;
}

//static int param_get(const char *strParam, eValType eType, void* value)
//{
//	int ret = 0;
//	char buf[256] = {};
//
//	ret = param_get_file(strParam, buf, sizeof buf);
//	CHK_RET_ERR(ret);
//	dbg_printf(Mod_control, "%s : %s\n", strParam, buf);
//	if (eType == eInt) {
//		*(int*)value = atoi(buf);
//	} else {
//		memcpy((char*)value, buf, strlen(buf));
//	}
//
//	return ret;
//}



int chk_router_http_uname_passwd(char *uname, char *passwd)
{
	int ret = 0;
	char str_uname[0xFF] = {};
	char str_passwd[0xFF] = {};

	ret = router_config_get_str(ROUTER_HTTP_UNAME, str_uname, sizeof(str_uname));
	ret = router_config_get_str(ROUTER_HTTP_PASSWD, str_passwd, sizeof(str_passwd));

	if (strcmp(uname, str_uname) || strcmp(passwd, str_passwd))
	{
		return errHttpUnamePasswd;
	}

	return errOK;
}

/*eg
**3@1;192.168.5.4;&lt;unknown&gt;;60:21:C0:7C:9D:70;wireless;67;47
**@2;192.168.5.2;FAN;00:13:20:49:9C:6E;wired;;100@3;192.168.5.5;JERRY-PC;00:11:11:38:41:F8;wired;;100
*/
int parse_xml_to_dev_list(attach_device *dev_list, char *src)
{
	char c;
	char *pos = NULL;
	char *start = NULL;
	int i;
	int j = 0;
	char str_cnt[8] = {};
	int cnt;

	if (src == NULL) return 0;

	pos = strchr(src, '@');
	if (pos == NULL) return 0;
	
	strncpy(str_cnt, src, (pos - src));
	cnt = atoi(str_cnt);
	printf("liyuan-debug;cnt %d\n", cnt);

	//*dev_list = (attach_device *)MALLOC(cnt * sizeof(attach_device));
	
	int len = strlen(pos);
	for (i = 0; i < cnt; i++) {
		start = pos;
		sprintf(str_cnt, "@%d;", (i+1));
		pos = strstr(start, str_cnt);
		if (pos == NULL)
		{
			printf("error! cant find %s\n", str_cnt);
			return 0;
		}

		start = pos;
		//ip
		start += strlen(str_cnt);
		pos = strchr(start, ';');
		if (pos == NULL)
		{
			printf("error! cant find ip in %s\n", start);
			return 0;
		}
		strncpy((dev_list+i)->ip, start, (pos-start));
		printf("liyuan-debug;ip %s\n", (dev_list+i)->ip);

		//name
		start = pos + 1;
		pos = strchr(start, ';');
		if (pos == NULL)
		{
			printf("error! cant find name in %s\n", start);
			return 0;
		}
		strncpy((dev_list+i)->dev_name, start, (pos-start));
		printf("liyuan-debug;name %s\n", (dev_list+i)->dev_name);

		//mac
		start = pos + 1;
		pos = strchr(start, ';');
		if (pos == NULL)
		{
			printf("error! cant find mac in %s\n", start);
			return 0;
		}
		strncpy((dev_list+i)->mac, start, 17);
		//printf("liyuan-debug;mac %s\n", ((*dev_list)+i)->mac);
	}
	return cnt;
}

/* 返回关联设备的个数 */
int get_attach_device_by_soap(attach_device *dev_list, char *soap_ip, int soap_port)
{
	int cnt = 0;
	char header[SOAP_HEADER_LEN] = {};
	int sock = init_soap_sock(soap_ip, soap_port);
	//char *xml_dev_list = NULL;
	char *unescape = NULL;
	char *recv = NULL;
	
	if (sock > 0)
	{
	 char *soap_body=
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>"
            "<SOAP-ENV:Envelope xmlns:SOAPSDK1=\"http://www.w3.org/2001/XMLSchema\" "
                "xmlns:SOAPSDK2=\"http://www.w3.org/2001/XMLSchema-instance\" "
                "xmlns:SOAPSDK3=\"http://schemas.xmlsoap.org/soap/encoding/\" "
                "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                    "<SOAP-ENV:Header>"
                        "<SessionID>58DEE6006A88A967E89A</SessionID>"
                    "</SOAP-ENV:Header>"
                    "<SOAP-ENV:Body>"
                        "<M1:GetAttachDevice xmlns:M1=\"urn:NETGEAR-ROUTER:service:service:DeviceInfo:1\">"
                        "</M1:GetAttachDevice>"
                    "</SOAP-ENV:Body>"
            "</SOAP-ENV:Envelope>";
		get_soap_header(header, "urn:NETGEAR-ROUTER:service:DeviceInfo:1#GetAttachDevice", strlen(soap_body));
		recv = get_soap_web(sock, header, soap_body);

		if (recv == NULL) goto end;
		
		char *start = strstr(recv, "<NewAttachDevice>");
		char *end = strstr(recv, "</NewAttachDevice>");
		if (start == NULL || end == NULL)
			goto end;
		
		start += strlen("<NewAttachDevice>");
		int len = end - start;
		//xml_dev_list = (char *)malloc(len + 1);
		//memset(xml_dev_list, 0, sizeof(xml_dev_list));
		//strncpy(xml_dev_list, start, len);
		//printf("liyuan-debug;xml %s\n", xml_dev_list);

		unescape = xml_unescape(start, len);
		
		cnt = parse_xml_to_dev_list(dev_list, unescape);
	}
end:
	//if (xml_dev_list) free(xml_dev_list);
	if (unescape) FREE(unescape);
	if (recv) FREE(recv);
	close(sock);
	return cnt;
}

void get_router_type(char *router_type, int len)
{
	int ret = -1;
#if defined(R6300v2)
	ret = tPopenLine("nvram get system_name", router_type, len);
#endif
	if (errOK != ret)
	{
		strcpy(router_type, "unknow");
	}
}

void get_router_fireware_version(char *fw_version, int len)
{
	//int ret = -1;
#if defined(R6300v2)
	//ret = tPopenLine("nvram get system_name", router_type, len);
	strcpy(fw_version, "V1.0.0.8_1.0.4PRRU");
#endif
/*
	if (errOK != ret)
	{
		strcpy(router_type, "unknow");
	}
*/
}

