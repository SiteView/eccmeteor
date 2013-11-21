#ifndef __COMMON_H__
#define __COMMON_H__

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>


#ifdef _WIN32

    #include <winsock2.h>
    #pragma warning( disable : 4996 ) // ¹Ø±Õ4996±àÒë¸æ¾¯
#else
	#include <unistd.h>
	#include <sys/types.h>
	#include <sys/socket.h>
	#include <sys/ioctl.h>
	#include <netinet/in.h>
	#include <arpa/inet.h>
	#include <netdb.h>
	#include <errno.h>
	#include <fcntl.h>
#endif


#endif
