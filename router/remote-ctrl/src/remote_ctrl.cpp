#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <signal.h>
#include <pthread.h>

#include "remote_ctrl.h"
#include "util.h"
#include "ipcs.h"

#include "string.h"
#include <sys/time.h>
#include <unistd.h>
#include <qsv.h>
#include "xmpp_main.h"

//extern void * xmpp_main(void *lparam);
//extern void * remotedlna_main(void *lparam);
extern "C" void * xmpp_main(void *lparam);
extern "C" void * remotedlna_main(void *lparam);

const char* tRChar(const char* pfPath, const char cDim)
{
    int len = strlen(pfPath);
    int loop = 0;

    for (loop = len; loop > 0; loop--)
    {
        if (pfPath[loop] == cDim)
        {
            return &(pfPath[loop+1]);
        }
    }

    return pfPath;
}

#if 0
#define OPTSTR "d:"
static int param_daemon=-1;

stSrvConfig g_config;
enum {
	thread_logd,
	thread_jabber,
	thread_gsoap,
	thread_pcap,
	thread_ctrl,
	thread_max,
};

//pthread_t g_thread_main[thread_max] = {0xFF};

void * logd_main(void *lparam);
void* jabber_main(void *lparam);
void* gsoap_main(void *lparam);
void* pcap_main(void *lparam);
void* route_ctrl_main(void *lparam);
void* vpnserv_ctrl_main(void *lparam);
//void* srv_timer(void *lparam)
typedef void*(*start_rtn)(void*);

struct _thread_list {
	int idx;
	pthread_t thread_id;
	int prosessid;
	start_rtn pthread_main;
	const char *info;
};
struct _thread_list pthread_list [] = {
	{thread_logd, 	0xFF, 		0, 	logd_main, 			"log server"},
	{thread_jabber, 	0xFF, 		0, 	jabber_main, 		"jabber client"},
	{thread_gsoap, 	0xFF, 		0, 	gsoap_main, 		"gsoap server"},
#ifdef _VPN_SERVER_
	{thread_ctrl, 		0xFF, 		0, 	vpnserv_ctrl_main, 	"vpn server"},
#else
	{thread_pcap, 	0xFF, 		0, 	pcap_main, 			"pcap loop"},
	{thread_ctrl, 		0xFF, 		0, 	route_ctrl_main, 		"vpn client"},
#endif
};


void usage(char *appname)
{
	printf("usage : %s [%s]\n"
		, appname, OPTSTR);
}

int main(int argc, char *argv[])
{
	int ch;
	int opid = 0;
	int loop = 0;

	while ((ch = getopt(argc, argv, OPTSTR)) != EOF) {
		
		switch(ch) {
			case 'd':
				param_daemon=atoi(optarg);
				break;
			case '?':
			default:
				usage(argv[0]);
				exit(1);
		}
	}

	opid = tSrvIsRun(tRChar(argv[0], '/'));
	if (opid > 0) {
		ERROR("server %s is running pid = %d, self pid = %d ... exit(0)\n",tRChar(argv[0], '/'), opid, getpid());
		exit(0);
	}

	INFO("system starting ... self pid = %d\n", getpid());
	
	memset(&g_config, 0 , sizeof(g_config));
	if (param_daemon >= 0) {
		if (daemon(0, param_daemon) < 0) {
			perror("daemon");
			ERROR("can't daemon !!!!!!!!!!!!!!!\n");
			exit(1);
		}
	}
#ifndef _VPN_SERVER_
	param_def();
	param_update(5);
#endif

	for (loop = 0; loop < SIZE(pthread_list); loop++) {
		INFO("create pthread %s, starting ...\n", pthread_list[loop].info);
		if (0 != pthread_create(&(pthread_list[loop].thread_id), NULL, pthread_list[loop].pthread_main, (void*)&pthread_list[loop].prosessid))
		{
			ERROR("%s pthread create error\n", pthread_list[loop].info);
			return (errSysError);
		}
		INFO("pthread %s, thread_id = %d, processid = %d\n", pthread_list[loop].info, pthread_list[loop].thread_id, pthread_list[loop].prosessid);
	}

	// Ïß³ÌÎ¬»¤
	while (1) {
		sleep(1);

		for (loop = 1; loop < thread_max; loop++) {
			sleep(1);
		}
	}

}
#endif

config_setting g_config;

int main()
{
	std::string str= getSVstr();
//	str += testSubmitGroup();
	printf(str.c_str());

	printf("\nxmpp\n");

	pthread_t xmpp;
//	pthread_t dlna;
	int ret_xmpp;
//	int ret_dlna;
//	char *pShmAddrRemoteCtrl = NULL;
	uint32_t ul_timer = 0;

	memset(&g_config, 0, sizeof(g_config));
	
	if (0 != pthread_create(&xmpp, NULL, xmpp_main, (void*)&ret_xmpp))
	{
		ERROR("xmpp pthread create error\n");
		return (errSysError);
	}
	
	while(1)
	{
		sleep(10);
	}

//	if (0 != pthread_create(&dlna, NULL, remotedlna_main, (void*)&ret_dlna))
//	{
//		ERROR("dlna pthread create error\n");
//		return (errSysError);
//	}
//
//	pShmAddrRemoteCtrl = GetShmPoint(REMOTE_CTRL_SHM_INDEX, sizeof(uint32_t), REMOTE_CTRL_PATH);
//	if ((pShmAddrRemoteCtrl != NULL)&&(pShmAddrRemoteCtrl != (void *)-1))
//	{
//		memset(pShmAddrRemoteCtrl, 0, sizeof(uint32_t));
//	}
//
//	while(1)
//	{
//		sleep(1);
//		ul_timer++;
//
//		if (ul_timer % 10 == 0)
//		{
//			if ((pShmAddrRemoteCtrl != NULL)&&(pShmAddrRemoteCtrl != (void *)-1))
//			{
//				memcpy(pShmAddrRemoteCtrl, (void *)(&ul_timer), sizeof(uint32_t));
//			}
//			else
//			{
//				pShmAddrRemoteCtrl = GetShmPoint(REMOTE_CTRL_SHM_INDEX, sizeof(uint32_t), REMOTE_CTRL_PATH);
//			}
//		}
//	}
}


