#ifndef _SOAP_H
#define _SOAP_H


#define MAX_DATA_BUF    (8*1024)
#define SOAP_HEADER_LEN		(1024)
#define SOAP_PORT	(5000)
#define ROUTER_LAN_IP "lan_ipaddr"

typedef struct soap_session_s {
        int sock;
		int soap_port;
		char soap_ip[4];
}soap_session;

extern int get_soap_header(char *head_mode, char *soap_action, int len);
extern int init_soap_sock(char *hostip, int port);
extern int delete_soap_sock(int sock);
extern char* get_soap_web(int sd, char *header, char *content);
extern int get_soap_response_code(char *data);

#endif // _SOAP_H
