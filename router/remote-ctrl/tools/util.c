#include "util.h"
#include <netdb.h>
#include <arpa/nameser.h>
#include <resolv.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/sysinfo.h>
#include <time.h>
#include <net/if.h>
#include <errno.h>
#include <ctype.h>
#include "xmpp.h"


int g_debug = 0;

static const struct defaultFileTypeMapEntry defaultFileTypeMap[] = {
    {"xml",  "text/xml"  },
    {"htm",  "text/html" },
    {"html", "text/html" },
    {"c",    "text/plain"},
    {"h",    "text/plain"},
    {"txt",  "text/plain"},
    {"css",  "text/css"  },
    {"gif",  "image/gif" },
    {"thm",  "image/jpeg"},
    {"png",  "image/png"},
    {"tif",  "image/tiff"},
    {"tiff", "image/tiff"},
    {"jpg",  "image/jpeg"},
    {"jpeg", "image/jpeg"},
    {"jpe",  "image/jpeg"},
    {"jp2",  "image/jp2" },
    {"png",  "image/png" },
    {"bmp",  "image/bmp" },
    {"aif",  "audio/x-aiff"},
    {"aifc", "audio/x-aiff"},
    {"aiff", "audio/x-aiff"},
    {"mpa",  "audio/mpeg"},
    {"mp2",  "audio/mpeg"},
    {"mp3",  "audio/mpeg"},
    {"m4a",  "audio/mp4"},
    {"wma",  "audio/x-ms-wma"},
    {"wav",  "audio/x-wav"},
    {"mpeg", "video/mpeg"},
    {"mpg",  "video/mpeg"},
    {"mp4",  "video/mp4"},
    {"m4v",  "video/mp4"},
    {"ts",   "video/MP2T"}, // RFC 3555
    {"mov",  "video/quicktime"},
    {"wmv",  "video/x-ms-wmv"},
    {"asf",  "video/x-ms-asf"},
    {"avi",  "video/x-msvideo"},
    {"divx", "video/x-msvideo"},
    {"xvid", "video/x-msvideo"},
    {"doc",  "application/msword"},
    {"js",   "application/javascript"},
    {"m3u8", "application/x-mpegURL"},
    {"pdf",  "application/pdf"},
    {"ps",   "application/postscript"},
    {"eps",  "application/postscript"},
    {"zip",  "application/zip"}
};

const char* tRChar(const char* pfPath, const char cDim);



static struct hostent *gethostbyaddr_wrapper(const char *address)
{
	struct in_addr addr;

	addr.s_addr = tIpstr2ip(address);
	return gethostbyaddr((char *) &addr, 4, AF_INET);	/* IPv4 only for now */
}

struct hostent * host_get(const char *server)
{
	struct hostent *host;

	res_init();
	if (tStrIsIpaddr(server)) {
		host = gethostbyaddr_wrapper(server);
	} else {
		host = gethostbyname(server);
	}

	if (NULL==host) {
		ERROR("%s->%s\n", server, hstrerror(h_errno));
	}//herror(RED"host_get"NONE);

	return host;
}

char *ip_get(const char* server)
{
	struct hostent *host;
	struct in_addr ina;
	if (NULL==(host=host_get(server))) return NULL;
	memcpy(&ina, host->h_addr, sizeof(struct in_addr));
	
	return inet_ntoa(ina);
}

char *strMod(int mod)
{
	if (Mod_jabber==mod) return "JAB";
	else if (Mod_control==mod) return "CTRL";
	else if (Mod_comm == mod) return "COM";
	else if (Mod_gsoap == mod) return "SOAP";
	else if (Mod_socket==mod) return "SOCK";
	else if (Mod_tool==mod)return "TOOL";
	else if (Mod_pcap == mod) return "pcap";
	else if (Mod_none==mod) return "NONE";
	else return "OTHER";
}

const char * tErr2Str(eErrCode errCode)
{
    const char **pStr = NULL;
    
    static const char *en_errStr[] =
    {
        "OK",
        "resource-error",
        "key-error",
        "lack-attribute",
        "vpn-set-not-exist",
        "vpn-set-expire",
        "file-not-found",
        "vpnip-not-found",
        "data-duplicate",
        "vpn-set-exist-and-not-match",
        "System-buffer-not-enough",
        "File-transfer-error",
        "Redirector-is-shutdown",
        "VPN-Server-is-all-shutdown",
        "Data-format-error",
        "System-busy",
        "System-error",
        "RPC-call-error",
        "Socket-recv-data-error",
        "Socket-send-data-error",
        "Have-exist",
        "Can't-resolve-DNS",
        "vpn-not-enable",
        "Function-input-parameter-invalid",
        "Function-not-support",
        "XMPP-server-not-available",
        "VPN-idle-timeout",
        "Server-port-invalid",
        "End-Of-File",
        "netmask-error",
        "gateway-error",
        "Destination-error",
        "Don't-need-do-operation",
        "vpn-not-connected",
        "vpn-server-not-found",
		"http-uname-passwd-error",

        "Error-code-error",

    };

    pStr = en_errStr; //(iLanguage == 0)? en_errStr : cn_errStr;
    
    if (errCode < 0 || errCode > errMax) {
        return pStr[errMax];
    } else {
        return pStr[errCode];
    }
}

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

int tGetDevInfo(char* ifname, eInfoType infoType, char *buffer, int buflen)//char* mac_str, int str_len)
{
	int fd;
	struct ifreq ifr; 
	char devInfo[100];

	dbg_printf(Mod_tool,"ifname=%s\n"NONE, ifname);
	if((fd = socket(AF_INET, SOCK_RAW, IPPROTO_RAW)) == -1) {
		RET_ERR(errSysError);
	}

	memset(&ifr, 0, sizeof(struct ifreq));
	ifr.ifr_addr.sa_family = AF_INET;
	strcpy(ifr.ifr_name, ifname);

	if (ioctl(fd, (int)infoType, &ifr) < 0) {
		close(fd);
		return (errSysError);
	}

	memset(devInfo, 0, sizeof(devInfo));
	if (eIT_MACADDR == infoType) {
		unsigned char *ptr;
		ptr = (unsigned char *)&(ifr.ifr_hwaddr);
		sprintf(devInfo, "%02X%02X%02X%02X%02X%02X", *(ptr+2), *(ptr+3),*(ptr+4),*(ptr+5),*(ptr+6),*(ptr+7));
	} else if (eIT_IFADDR == infoType)  {
		struct sockaddr_in *sin;
		sin = (struct sockaddr_in *) &ifr.ifr_addr;
		strcpy(devInfo, inet_ntoa(sin->sin_addr)); 
	} else if (eIT_IFNETMASK == infoType) {
		struct sockaddr_in *sin;
		sin = (struct sockaddr_in *) &ifr.ifr_netmask;
		strcpy(devInfo, inet_ntoa(sin->sin_addr)); 
	} else if (eIT_IFIDX == infoType) {
		sprintf(devInfo, "%d", ifr.ifr_ifindex); 
	} else {
		close(fd);
		RET_ERR(errNotSupport);
	}

	close(fd);
	CHK_EXP_ERR_RET(strlen(devInfo) > buflen, errBuffer);
	
	strcpy(buffer, devInfo);
	return errOK;
}

/* 获取从开机到现在的时间，单位:秒 */
long getUptime(void)
{
	int error = 0;
	struct sysinfo s_info = {0};
	
	error = sysinfo(&s_info);
	
	if (error !=0)
	{
		return 0;
	}
	return s_info.uptime;
}

long tTimeDiff(long start)
{
	long now = getUptime();
	return (now - start); 
}

int tTimeout(long *start, long cycle)
{
	if (tTimeDiff(*start) < cycle) {
		return 0;
	}
	*start = getUptime();
	return 1;
}

int tcp_connect_timeout(int sockfd, struct sockaddr * sin, int sinlen, int timeout)
{
	struct timeval tv_timeout;
	fd_set readfds;
	int opt = 1;

	//set non-blocking
	if (ioctl(sockfd, FIONBIO, &opt) < 0) {
		return 0;
	}

	if (connect(sockfd, sin, sinlen) == -1) 
	{
		if (errno == EINPROGRESS) 
		{
			int error;
			int len = sizeof(int);
			
			tv_timeout.tv_sec  = timeout; 
			tv_timeout.tv_usec = 0;
			FD_ZERO(&readfds);
			FD_SET(sockfd, &readfds);
			if(select(sockfd + 1, NULL, &readfds, NULL, &tv_timeout) > 0) 
			{
				getsockopt(sockfd, SOL_SOCKET, SO_ERROR, &error, (socklen_t *)&len);
				if(error != 0) 
				{
					return 0;
				}
			} 
			else 
			{ //timeout or select error
				return 0;
			}
		} else {
			return 0;
		}
	}

	opt = 0;
	ioctl(sockfd, FIONBIO, &opt);
	return 1;
}

int tcp_connect_test_timeout(char *server, int port, int timeout)
{
	struct in_addr host;
	struct sockaddr_in s_addr;
	struct timeval tv_timeout;
	struct hostent * he = NULL;
	fd_set readfds;
	int opt = 1;
	int sockfd = 0;
	int ret = 0;

	// 为了适应非域名的普通ip地址
	if (tStrIsIpaddr(server)) {
		inet_aton(server, &host);
	} else {
		if ((he = host_get(server)) == NULL) {
			ERROR("can't get server \"%s\" ipaddr\n", server);
			return 0;
		}
		memcpy(&host, he->h_addr, sizeof host);
	}

	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (-1 == sockfd) {
		ERROR("create socket error!!!!\n");
		return 0;
	}

	//set non-blocking
	if (ioctl(sockfd, FIONBIO, &opt) < 0) {
		close(sockfd);
		ERROR("set socket non-blocking error!!!!\n");
		return 0;
	}

	memset(&s_addr, 0, sizeof(struct sockaddr_in));
	s_addr.sin_family = AF_INET;
	s_addr.sin_port = htons(port);
	s_addr.sin_addr = host;

	ret = tcp_connect_timeout(sockfd, (struct sockaddr *) &s_addr, sizeof(struct sockaddr), timeout);
	close(sockfd);

	return ret;
}

char *
xml_unescape (char *src, size_t len)
{
	int i,j;
	char *ret;

	if (!src) return NULL;
	//if (!strchr (src, '&')) return src;
	if (len == -1) len = strlen (src);

	ret = (char *)malloc(len + 1);
	if (!ret) return NULL;

	for (i=j=0; i<len; i++) {
		if (src[i] == '&') {
			i++;
			if (strncmp (&src[i], "amp;", 4) == 0) {
				ret[j] = '&';
				i += 3;
			} else if (strncmp (&src[i], "quot;", 5) == 0) {
				ret[j] = '"';
				i += 4;
			} else if (strncmp (&src[i], "apos;", 5) == 0) {
				ret[j] = '\'';
				i += 4;
			} else if (strncmp (&src[i], "lt;", 3) == 0) {
				ret[j] = '<';
				i += 2;
			} else if (strncmp (&src[i], "gt;", 3) == 0) {
				ret[j] = '>';
				i += 2;
			} else {
				ret[j] = src[--i];
			}
		} else {
			ret[j] = src[i];
		}
		j++;
	}
	ret[j] = '\0';

	return ret;
}

// 获取指定长度的随机字符串，最长64个字符
// 使用者自己释放内存
void tGetRandStr(unsigned int number, char *buffer)
{
	char str[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
	int i;
	char ss[2];
	char result[65];

	if (number > 64)
		number = 64;

	memset(result, 0, sizeof(result));
	//srand((unsigned int)time((time_t *)NULL));
	for(i=1;i<=number;i++)
	{
		sprintf(ss,"%c",str[(rand()%strlen(str))+1]);
		strcat(result,ss);
	}

	strcpy(buffer, result);

	return;
}

void str_tolower(char *des, char *src)
{
	int i;

	for (i = 0; i < strlen(src); i++)
	{
		des[i] = tolower(src[i]);
	}
}

/* 获取文件大小*/
int tGetFileSize(const char *pcFile)
{
	FILE *fp = NULL;
	int len = 0;

	CHK_PTR_ERR_RET(pcFile, errSysError);
	fp = fopen(pcFile, "r");
	CHK_PTR_ERR_RET(fp, errSysError);

	fseek(fp, 0, SEEK_END);
	len = ftell(fp);
	CLOSE_FILE(fp);

	if(len < 0) 
	{
		RET_ERR (errSysError);
	}

	return len;
}

const char *tGetMimeType(const char *filename)
{
	int i;
	//char suffix_lower[32] = {};
	char *suffix = tRChar(filename, '.');
	//str_tolower(suffix_lower, suffix);
	
	for (i=0; i<ARRAY_SIZE(defaultFileTypeMap); i++) {
		if (0 == strcasecmp(defaultFileTypeMap[i].extension, suffix)) {
		    return defaultFileTypeMap[i].mime_type;
		}
	}

	return NULL;
}
