#ifndef _UTIL_H_
#define _UTIL_H_

#include <sys/ioctl.h>
#include <sys/socket.h>

extern int g_debug;
#define DBG(x) (g_debug & x)
#define IFNAME "eth0"

#if 1
#define NONE ""
#define RED ""
#define GREEN ""
#define BLUE ""
#define PURPLE ""
#define LIGHT_CYAN ""
#else
#define NONE         	"\033[0m" 
#define RED          	"\033[0;32;31m" 
#define LIGHT_RED    	"\033[1;31m" 
#define GREEN        	"\033[0;32;32m" 
#define LIGHT_GREEN "\033[1;32m" 
#define BLUE         	"\033[0;32;34m" 
#define LIGHT_BLUE   "\033[1;34m" 
#define DARY_GRAY    "\033[1;30m" 
#define CYAN         	"\033[0;36m" 
#define LIGHT_CYAN   "\033[1;36m" 
#define PURPLE       	"\033[0;35m" 
#define LIGHT_PURPLE "\033[1;35m" 
#define BROWN        	"\033[0;33m" 
#define YELLOW       	"\033[1;33m" 
#define LIGHT_GRAY   "\033[0;37m" 
#define WHITE        	"\033[1;37m"
#endif

#define out(format,  arg...) fprintf(stderr,format, ##arg);
/*
#ifdef __MONITOR__
	#define out(format,  arg...) fprintf(stderr,format, ##arg);
#else
	#define out(format,  arg...) tLog(format, ##arg); //fprintf(stderr,format, ##arg);
#endif
*/

//#define STR_IDX(x) (~((x)-1))
#define ERRSTR(ret) {if (ret != errOK) out(BLUE"%s:" RED"%d->%s"NONE"\n", tRChar(__FILE__, '/'), __LINE__, tErr2Str((eErrCode)ret));}
#define RET_ERR(ret) {ERRSTR(ret); return ret;}
#define RET_VOID(ret) {ERRSTR(ret); return;}
#define CHK_RET_ERR(ret) if (errOK!=ret) {RET_ERR(ret);}
#define CHK_RET_VOID(ret) if (errOK!=ret) {RET_VOID(ret);}
#define CHK_PTR_ERR_RET(ptr, ret) if (NULL==ptr) {out(RED"PTR(%s) is NULL"NONE"\n", #ptr);RET_ERR(ret);}
#define CHK_PTR_ERR_VOID(ptr, ret) if (NULL==ptr) {out(RED"PTR(%s) is NULL"NONE"\n", #ptr);RET_VOID(ret);}
#define CHK_EXP_ERR_RET(exp, ret) if (exp) {out(RED"(%s) is true"NONE"\n", #exp);RET_ERR(ret);}
#define CHK_EXP_ERR_VOID(exp, ret) if (exp) {out(RED"(%s) is true"NONE"\n", #exp);RET_VOID(ret);}
#define FUN_ERR(fun) { int __ret = errOK;  __ret = fun; CHK_RET_ERR(__ret); }
#define FUN_ERR_VOID(fun) { int __ret = errOK;  __ret = fun; CHK_RET_VOID(__ret); }
#define GOTO_ERR(ret, GOTO) {ERRSTR(ret); iRet = ret; goto GOTO;}

#define CLR_ARR(x) {memset(x, 0, sizeof(x));}
#define CLR_STRUCT(x) {memset(x, 0, sizeof(*(x)));}

#define CLOSE_FILE(x) {if (NULL!=x) {fclose(x); x=NULL;}}


#define dbg_trace_head() \
{ \
	struct timeval curr; \
	gettimeofday (&curr , NULL); \
	out("[%.6dS-%.6dMS]%s-%s-%d:",  \
		(int)curr.tv_sec, (int)(curr.tv_usec/1000), \
		tRChar(__FILE__, '/'), __FUNCTION__,  __LINE__); \
}
#define dbg_trace() if (DBG(Mod_all)){out(PURPLE"[TRACE]"NONE);dbg_trace_head();out("\n"); }
#define ERROR(format,  arg...) { \
	dbg_trace_head(); \
	out(BLUE"%s,%d"NONE"->"RED format NONE , tRChar(__FILE__, '/'), __LINE__, ##arg); \
}

#define INFO(format,  arg...) { \
	dbg_trace_head(); \
	out(GREEN"%s,%d->" format NONE , tRChar(__FILE__, '/'), __LINE__, ##arg); \
}

#define dbg_mod_trace(mod) {out(PURPLE"[%s]"NONE, strMod(mod));dbg_trace_head();}
#define dbg_printf(mod, format,  arg...) if (DBG(mod)){dbg_mod_trace(mod); out(format, ##arg);}


typedef enum 
{
	errOK,
	errResource,
	errKey,
	errAttribute,
	errVpnSetNotExist,
	errVpnSetExpire,
	errFileNotFound,
	errVpnIpNotFound,
	errDataDuplicate,
	errVpnSetNotMatch,
	errBuffer, 		//  10
	errFileTransfer,
	errRedirectorShutDown,
	errNoVpnServer,
	errDataFormat,
	errSysBusy,
	errSysError,
	errRpcCall,
	errSocketRcv,
	errSocketSnd,
	errExist,     //   20
	errDNS,
	errVpnNotEnable,
	errFuncParam,
	errNotSupport,
	errXMPPServer,
	errVPNIdle,
	errServPort,
	errFileEOF,
	errNetMask,
	errGateWay,    //    30
	errDestination,
	errDontNeed,    //    32
	errVpnNotConnected,
	errVpnServNotFound,
	errHttpUnamePasswd,

	errMax,
}eErrCode;

typedef enum _mod_idx {
	Mod_jabber 		= 0x0001,
	Mod_control		= 0x0002,
	Mod_comm		= 0x0004,
	Mod_gsoap		= 0x0008,
	Mod_socket 		= 0x0010,
	Mod_tool 		= 0x0020,
	Mod_pcap 		= 0x0040,
	Mod_none 		= 0x8000,
	Mod_all 		= 0xFFFF,
}MOD;

typedef enum {
	eIT_MACADDR = SIOCGIFHWADDR,
	eIT_IFADDR = SIOCGIFADDR,
	eIT_IFNETMASK = SIOCGIFNETMASK,
	eIT_IFIDX = SIOCGIFINDEX,
}eInfoType;


extern char *ip_get(const char* server);
extern int tGetDevInfo(char* ifname, eInfoType infoType, char *buffer, int buflen);
extern long getUptime(void);
extern int tTimeout(long *start, long cycle);
extern int tcp_connect_timeout(int sockfd, struct sockaddr *sin, int sinlen, int timeout);
extern int tcp_connect_test_timeout(char *server, int port, int timeout);
extern char *xml_unescape (char *src, size_t len);
extern void tGetRandStr(unsigned int number, char *buffer);
#endif
