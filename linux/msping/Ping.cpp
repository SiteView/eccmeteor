#include "Ping.h"
#include <iostream>

using namespace std;

extern int PrintLog(const char * strInfo);
extern bool MakeCharByString(char *pOut, int &nOutSize, std::string strInput);

#ifdef WIN32
int PING_MONITOR(const char *server, long msec, int bytesize, int nSendNums, char *szReturn,int& nSize)
{
	char strTemp[1024]=
	{	0};

	// Load the ICMP.DLL
	HINSTANCE hIcmp = LoadLibrary("ICMP.DLL");
	if (hIcmp == 0)
	{
		PrintLog("装载ICMP.dll失败！");
		sprintf(szReturn,"error=%s",FuncGetStringFromIDS("SV_BASIC",
						"BASIC_LOAD_DLL_FAILED"));
		PrintLog(szReturn);
		return FALSE;
	}

	// Look up an IP address for the given host name
	struct hostent* phe;
	if ((phe = gethostbyname(server)) == 0)
	{
		PrintLog("获取主机信息");

		sprintf(szReturn,"error=%s",FuncGetStringFromIDS("SV_BASIC",
						"BASIC_PARSER_SERVER_FAILED"));
		PrintLog(szReturn);

		return FALSE;
	}

	// Get handles to the functions inside ICMP.DLL that we'll need
	typedef HANDLE (WINAPI* pfnHV)(VOID);
	typedef BOOL (WINAPI* pfnBH)(HANDLE);
	typedef DWORD (WINAPI* pfnDHDPWPipPDD)(HANDLE, DWORD, LPVOID, WORD,
			PIP_OPTION_INFORMATION, LPVOID, DWORD, DWORD);// evil, no?
	pfnHV pIcmpCreateFile;
	pfnBH pIcmpCloseHandle;
	pfnDHDPWPipPDD pIcmpSendEcho;
	pIcmpCreateFile = (pfnHV)GetProcAddress(hIcmp,
			"IcmpCreateFile");
	pIcmpCloseHandle = (pfnBH)GetProcAddress(hIcmp,
			"IcmpCloseHandle");
	pIcmpSendEcho = (pfnDHDPWPipPDD)GetProcAddress(hIcmp,
			"IcmpSendEcho");
	if ((pIcmpCreateFile == 0) || (pIcmpCloseHandle == 0) ||
			(pIcmpSendEcho == 0))
	{

		sprintf(szReturn,"error=%s",FuncGetStringFromIDS("SV_BASIC",
						"BASIC_GET_PROC_ADDRESS_FAILED"));
		PrintLog(szReturn);

		return 4;
	}

	// Open the ping service
	HANDLE hIP = pIcmpCreateFile();
	if (hIP == INVALID_HANDLE_VALUE)
	{
		sprintf(szReturn,"error=%s",FuncGetStringFromIDS("SV_PING",
						"PING_CREATE_ICMP_FILE_FAILED"));
		PrintLog(szReturn);
		return FALSE;
	}

	// Build ping packet
//    char acPingBuffer[64];
	char * acPingBuffer = new char[bytesize];
	memset(acPingBuffer, 'A', bytesize);//sizeof(acPingBuffer)); //\xAA
	PIP_ECHO_REPLY pIpe = (PIP_ECHO_REPLY)GlobalAlloc(
			GMEM_FIXED | GMEM_ZEROINIT,
			sizeof(IP_ECHO_REPLY) + bytesize);//sizeof(acPingBuffer));
	if (pIpe == 0)
	{
		sprintf(szReturn,"error=%s",FuncGetStringFromIDS("SV_BASIC",
						"BASIC_GOLBAL_ALLOC_FAILED"));

		::CloseHandle(hIP);
		PrintLog(szReturn);
		delete [] acPingBuffer;
		return FALSE;
	}
	pIpe->Data = acPingBuffer;
	pIpe->DataSize = bytesize; //sizeof(acPingBuffer);

	// Send the ping packet
	//CTime a=CTime::GetCurrentTime();
	//printf("%d:%d",a.GetMinute(),a.GetSecond());

	int nRTT=0;
	int nSuc =0;

	if(nSendNums<=0)
	nSendNums = 1;

	for(int i=0;i<nSendNums;i++)
	{

		DWORD dwStatus = pIcmpSendEcho(hIP, *((DWORD*)phe->h_addr_list[0]),
				acPingBuffer, bytesize, NULL, pIpe,	//sizeof(acPingBuffer), NULL, pIpe,
				sizeof(IP_ECHO_REPLY) + bytesize,msec);//1000);//sizeof(acPingBuffer), 1000);
		cout<<"bytesize="<<bytesize<<endl;

		if (pIpe->Status == 0)
		{
			nSuc++;
			nRTT+= pIpe->RoundTripTime;
		}
	}

//	char strTemp[1024]={0};
//	sprintf(strTemp,"nSuc=%d",nSuc);
//	PrintLog(strTemp);

	if(nSuc == 0)
	sprintf(szReturn, "status=%d$roundTripTime=%.0f$packetsGoodPercent=%.2f$", 300,0,0);
	else
	sprintf(szReturn, "status=%d$roundTripTime=%.2f$packetsGoodPercent=%.2f$",
			200, (float)nRTT / (float)nSendNums, (float)nSuc / nSendNums * 100);

	CString strInput;
	strInput =szReturn;
	MakeCharByString(szReturn,nSize,strInput);

	// Shut down...
	::CloseHandle(hIP);
	GlobalFree(pIpe);
	FreeLibrary(hIcmp);

	delete [] acPingBuffer;
	return TRUE;
}
#else

#include <oping.h>
#include <sys/time.h>
#include <time.h>
#include <iostream>
#include <stdio.h>
#include <string.h>

#ifndef NI_MAXHOST
# define NI_MAXHOST 1025
#endif

#if defined(OPING_VERSION) && (OPING_VERSION >= 1003000)
# define HAVE_OPING_1_3
#endif

/*
 * Private data types
 */
struct hostlist_s
{
	char *host;

	unsigned int pkg_sent;
	unsigned int pkg_recv;
	unsigned int pkg_missed;

	double latency_total;
	double latency_squared;

	struct hostlist_s *next;
};
typedef struct hostlist_s hostlist_t;

/*
 * Private variables
 */
hostlist_t *hostlist_head = NULL;

int ping_dispatch_all(pingobj_t *pingobj) /* {{{ */
{
	pingobj_iter_t *iter;
	hostlist_t *hl;
	int status;

	for (iter = ping_iterator_get(pingobj); iter != NULL; iter = ping_iterator_next(iter))
	{ /* {{{ */
		char userhost[NI_MAXHOST];
		double latency;
		size_t param_size;

		param_size = sizeof(userhost);
		status = ping_iterator_get_info(iter,
#ifdef PING_INFO_USERNAME
				PING_INFO_USERNAME,
#else
				PING_INFO_HOSTNAME,
#endif
				userhost, &param_size);
		if (status != 0)
		{
			printf("libmsping: ping_iterator_get_info failed: %s\n", ping_get_error(pingobj));
			continue;
		}

		for (hl = hostlist_head; hl != NULL; hl = hl->next)
			if (hl && strcmp(userhost, hl->host) == 0)
				break;
		if (hl == NULL)
		{
			printf("libmsping: Cannot find host %s.\n", userhost);
			continue;
		}

		param_size = sizeof(latency);
		status = ping_iterator_get_info(iter, PING_INFO_LATENCY, (void *) &latency, &param_size);
		if (status != 0)
		{
			printf("libmsping: ping_iterator_get_info failed: %s\n", ping_get_error(pingobj));
			continue;
		}

		hl->pkg_sent++;
		if (latency >= 0.0)
		{
			hl->pkg_recv++;
			hl->latency_total += latency;
			hl->latency_squared += (latency * latency);

			/* reset missed packages counter */
			hl->pkg_missed = 0;
		}
		else
			hl->pkg_missed++;

	} /* }}} for (iter) */

	return (0);
}

int ping_config(const char *key, const char *value) /* {{{ */
{
	if (strcasecmp(key, "Host") == 0)
	{
		hostlist_t *hl;
		char *host;

		hl = (hostlist_t *) malloc(sizeof(hostlist_t));
		if (hl == NULL)
		{
			printf("libmsping: malloc failed\n");
			return (1);
		}

		host = strdup(value);
		if (host == NULL)
		{
			free(hl);
			printf("libmsping: strdup failed\n");
			return (1);
		}

		hl->host = host;
		hl->pkg_sent = 0;
		hl->pkg_recv = 0;
		hl->pkg_missed = 0;
		hl->latency_total = 0.0;
		hl->latency_squared = 0.0;
		hl->next = hostlist_head;
		hostlist_head = hl;
	}
	return (0);
}

int ping_shutdown(pingobj_t *pingobj)
{
	hostlist_t *hl = hostlist_head;
	hostlist_head = NULL;
	while (hl != NULL)
	{
		hostlist_t *hl_next;
		hl_next = hl->next;

		if (hl->host)
		{
			free(hl->host);
			hl->host = NULL;
		}
		free(hl);

		hl = hl_next;
	}
	ping_destroy(pingobj);
	return (0);
}

int PING_MONITOR(const char *server, long msec, int bytesize, int nSendNums, char *szReturn, int& nSize)
{
	if (msec > 8000)
		msec = 8000;

	int ping_ttl = PING_DEF_TTL;
	double ping_timeout = 0.9;
	ping_timeout = msec / 1000;
	if (nSendNums > 10)
		nSendNums = 10;
	printf("-------- to libmsping, sendNums: %d, timeout(s): %.1f, destination: %s ... \n", nSendNums, ping_timeout,
			server);

	if (ping_config("Host", server))
	{
		printf("libmsping: ping_config failed\n");
		nSize = sprintf(szReturn, "error=ping_config failed");
		return 0;
	}
	struct timeval tv_begin;
	struct timeval tv_end;

	pingobj_t *pingobj = ping_construct();
	if (pingobj == NULL)
	{
		printf("libmsping: ping_construct failed.\n");
		nSize = sprintf(szReturn, "error=ping_construct failed.");
		return 0;
	}

	ping_setopt(pingobj, PING_OPT_TIMEOUT, (void *) &ping_timeout);
	ping_setopt(pingobj, PING_OPT_TTL, (void *) &ping_ttl);

	int tmp_status;
	tmp_status = ping_host_add(pingobj, server);
	if (tmp_status != 0)
	{
		printf("libmsping: ping_host_add (%s) failed: %s\n", server, ping_get_error(pingobj));
		nSize = sprintf(szReturn, "error=ping_host_add (%s) failed: %s", server, ping_get_error(pingobj));
		return 0;
	}

	if (gettimeofday(&tv_begin, NULL) < 0)
		printf("libmsping: gettimeofday failed \n");

	for (int sindex = 1; sindex <= nSendNums; sindex++)
	{
		int status = ping_send(pingobj);
		if (status < 0)
		{
			printf("libmsping: ping_send failed: %s\n", ping_get_error(pingobj));
			nSize = sprintf(szReturn, "error=ping_send failed: %s", ping_get_error(pingobj));
			return 0;
		}
		(void) ping_dispatch_all(pingobj);
	}

	int pkg_sent = 0;
	int pkg_recv = 0;
	for (hostlist_t *hl = hostlist_head; hl != NULL; hl = hl->next)
	{
		if (hl == NULL)
		{
			printf("libmsping: Cannot find host %s.\n", server);
		}
		else if (strcmp(server, hl->host) == 0)
		{
			pkg_sent = hl->pkg_sent;
			pkg_recv = hl->pkg_recv;
		}
	}

	if (gettimeofday(&tv_end, NULL) < 0)
		printf("libmsping: gettimeofday failed \n");

	float send_time = 1000 * (tv_end.tv_sec - tv_begin.tv_sec) + (tv_end.tv_usec - tv_begin.tv_usec) / 1000;
	send_time -= (pkg_sent - pkg_recv) * msec;
	printf("-------- libmsping, pkg_sent: %d,  pkg_recv: %d, send_time: %.2f, destination: %s --------\n", pkg_sent, pkg_recv, send_time, server);
	if (pkg_sent)
		send_time /= pkg_sent;
	if (send_time < 0)
		send_time = 0;

	float goodpercent = 0;
	if (pkg_recv && pkg_sent)
		goodpercent = (pkg_recv * 100 / pkg_sent);
	if (goodpercent < 0)
		goodpercent = 0;

	char result[512] = { 0 };
	if (pkg_recv == 0)
		sprintf(result, "status=300$roundTripTime=0.00$packetsGoodPercent=0.00$");
	else
		sprintf(result, "status=%d$roundTripTime=%.2f$packetsGoodPercent=%.2f$", 200, send_time, goodpercent);
	MakeCharByString(szReturn, nSize, result);

	ping_shutdown(pingobj);
	return 1;
}

#endif
