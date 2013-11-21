#include "soap.h"
#include "util.h"
#include <stdio.h>
#include <unistd.h>
#include <sys/ioctl.h>
//#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
//#include <arpa/inet.h>
#include <string.h>
#include <errno.h>
//#include <sys/time.h>
#include <sys/select.h>
//#include <sys/stat.h>
#include <stdlib.h>
//#include <netinet/in.h>
//#include <arpa/inet.h>
//#include <net/if.h>
//#include <netinet/ip_icmp.h>
//#include <time.h>
//#include <fcntl.h>
//#include <signal.h>
//#include <arpa/nameser.h>
//#include <resolv.h>
//#include <netdb.h>


unsigned int tIpstr2ip(const char *addr)
{
	unsigned int split[4];
	unsigned int ip;

	sscanf(addr, "%d.%d.%d.%d",
		   &split[0], &split[1], &split[2], &split[3]);

	/* assuming sscanf worked */
	ip = (split[0] << 24) |
		(split[1] << 16) | (split[2] << 8) | (split[3]);

	return htonl(ip);
}

char * tIp2ipstr(unsigned int ip)
{
    struct in_addr ina;
    ina.s_addr = ip;
    
    return inet_ntoa(ina);
}

int tStrIsIpaddr(const char *s)
{
	while (*s) {
		if ((isdigit(*s)) || (*s == '.')) {
			s++;
			continue;
		}
		return 0;
	}
	return 1;
}

void get_soap_ip(char *ip, int len)
{
	int ret = -1;
#if defined(R6300v2)
	ret = tPopenLine("nvram get "ROUTER_LAN_IP, ip, len);
#endif
	if (errOK != ret)
	{
		strcpy(ip, "127.0.0.1");
	}
}

int init_soap_sock(char *hostip, int port)
{
	int sd = -1;
	struct sockaddr_in pin;
	char ip[16] = {};

	bzero(&pin, sizeof(pin));  
	pin.sin_family = AF_INET;  
	//pin.sin_addr.s_addr = htonl(INADDR_ANY);
	//memcpy(&pin.sin_addr, hostip, 4);
	get_soap_ip(ip, sizeof(ip));
	pin.sin_addr.s_addr = tIpstr2ip(ip);  
	pin.sin_port = htons(SOAP_PORT);  
	
	if ((sd = socket(AF_INET, SOCK_STREAM, 0)) == -1)  
	{  
		perror("Error opening socket!!!");  
		return -1;
	}  
  
	if (!tcp_connect_timeout(sd, (void *)&pin, sizeof(pin), 10))
	{
		close(sd);
		printf("error connect to socket\n");  
		return -1;
	}
	return sd;
}

int delete_soap_sock(int sock)
{
	if (sock > 0)
	{
		close(sock);
	}
	return 0;
}

int get_soap_header(char *head_mode, char *soap_action, int len)
{
	if (head_mode == NULL || soap_action == NULL || len == 0)
		return 1;
	
	sprintf(head_mode, "POST /soap/server_sa/ HTTP/1.0\r\n"
            "SOAPAction: %s\r\n"
            "content-type: text/xml;charset=utf-8\r\n"
            "HOST: www.routerlogin.com\r\n"
            "User-Agent: SOAP Toolkit 3.0\r\n"
            "connection: keep-Alive\r\n"
            "Cache-Control: no-cache\r\n"
            "Pragma: no-cache\r\n"
            "content-length: %d\r\n\r\n",
            soap_action, len);
	return 0;
}

char* get_soap_web(int sd, char *header, char *content)  
{  
	int len = 0;  
	char *buf;  

	if (NULL == header)
	{
		printf("parameter\r\n");
		return NULL;
	}
	
	///together the request info that will be sent to web server   
	///Note: the blank and enter key byte is necessary,please remember!!!   
	buf = (char*)malloc(MAX_DATA_BUF);
	if (NULL == buf) {
		printf("malloc failed\n");
		return NULL;
	}

	memset(buf, 0, MAX_DATA_BUF);
	if (NULL != content)
	{
		if (strlen(header)+strlen(content) >= MAX_DATA_BUF)
		{
			printf("buffer not enough!\n");
			goto end;
		}
		sprintf(buf, "%s%s\r\n", header, content);
	}
	printf("liyuan-debug;send package:%s\n", buf);
	printf("-----------------------------------------\n");
	if (send(sd, buf, strlen(buf), 0) == -1)  
	{  
		printf("error in send %s\n", strerror(errno)); 
		goto end;  
	}  

	///send the message and wait the response!!!   
	memset(buf, 0, MAX_DATA_BUF);
/*
	int rs = 1;
	while(rs)
	{
		len = recv(sd, buf, MAX_DATA_BUF, 0);  //liyuan-todo,一次没接受完
		if(len < 0)
		{
		    // 由于是非阻塞的模式,所以当errno为EAGAIN时,表示当前缓冲区已无数据可读
		    // 在这里就当作是该次事件已处理处.
		    if(errno == EAGAIN)
		     break;
		    else
		     return NULL;
		}
		else if(len == 0)
		{
			printf("liyuan-debug,remote socket closed!!!!!!!!!!!!!!!!!\n");
		 	// 这里表示对端的socket已正常关闭.
		}
	   if(len == sizeof(buf))
	     rs = 1;   // 需要再次读取
	   else
	     rs = 0;
	}
	*/
	len = recv(sd, buf, MAX_DATA_BUF, 0);  //liyuan-todo

	
	printf("liyuan-debug,size:%d;recv-len:%d\n", sizeof(buf), len);
	printf("liyuan-debug recv:%s\n", buf);
	if (len > 0) return buf;
	else 
	{	
		printf("error in recv %s\n", strerror(errno));
	}

end:
	if (NULL!=buf)
	{
		free(buf);
		buf = NULL;
	}
	return NULL;
}  


void send_start(char *host, int port)
{
    char *cDatas=
            "POST /soap/server_sa/ HTTP/1.0\r\n"
            "SOAPAction: urn:NETGEAR-ROUTER:service:DeviceConfig:1#ConfigurationStarted\r\n"
            "content-type: text/xml;charset=utf-8\r\n"
            "HOST: www.routerlogin.com\r\n"
            "User-Agent: SOAP Toolkit 3.0\r\n"
            "connection: keep-Alive\r\n"
            "Cache-Control: no-cache\r\n"
            "Pragma: no-cache\r\n"
            "content-length: 504\r\n"
            "\r\n"
            "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAPSDK1=\"http://www.w3.org/2001/XMLSchema\" xmlns:SOAPSDK2=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAPSDK3=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Body><M1:ConfigurationStarted xmlns:M1=\"urn:NETGEAR-ROUTER:service:DeviceConfig:1\"><NewSessionID>58DEE6006A88A967E89A</NewSessionID></M1:ConfigurationStarted></SOAP-ENV:Body></SOAP-ENV:Envelope>"
            ;
    //SVT_Http http(mExitFlag);
    //http.rawRequest(host,cDatas,port);
}

void send_finish(char *host, int port)
{
    char *cDatas="POST /soap/server_sa/ HTTP/1.0\r\n"
    "SOAPAction: urn:NETGEAR-ROUTER:service:DeviceConfig:1#ConfigurationFinished\r\n"
            "content-type: text/xml;charset=utf-8\r\n"
    "HOST: www.routerlogin.com\r\n"
    "User-Agent: SOAP Toolkit 3.0\r\n"
    "connection: keep-Alive\r\n"
    "Cache-Control: no-cache\r\n"
    "Pragma: no-cache\r\n"
    "content-length: 572\r\n"
            "\r\n"
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><SOAP-ENV:Envelope xmlns:SOAPSDK1=\"http://www.w3.org/2001/XMLSchema\" xmlns:SOAPSDK2=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAPSDK3=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header><SessionID>58DEE6006A88A967E89A</SessionID></SOAP-ENV:Header><SOAP-ENV:Body><M1:ConfigurationFinished xmlns:M1=\"urn:NETGEAR-ROUTER:service:DeviceConfig:1\"><NewStatus>ChangesApplied</NewStatus></M1:ConfigurationFinished></SOAP-ENV:Body></SOAP-ENV:Envelope>"
	;

    //SVT_Http http(mExitFlag);
    //http.rawRequest(host,cDatas,port);

}

int get_soap_response_code(char *data)
{
	char *sp = strstr(data, "HTTP/");
	char *sp1 = NULL;
	char *sp2 = NULL;
	int cnt = 0;
	char code[8] = {};
	
	if (sp == NULL)
		return 0;

	
	while(*sp != '\0') 
	{
		if (*sp == ' ')
		{
			if (cnt == 0)
			{
				sp1 = sp + 1;
				cnt = 1;
			}
			else if (cnt == 1)
			{
				sp2 = sp;
				break;
			}
			else
			{}
		}
		++sp; 
	} 

	
	cnt = sp2 - sp1;
	if (cnt > 7)
		return 0;
	
	strncpy(code, sp1, cnt);

	return atoi(code);
}
