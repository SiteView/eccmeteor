#ifndef _SV_ECC_MSPING_MONITOR_H_
#define _SV_ECC_MSPING_MONITOR_H_

#ifdef WIN32
#include <afxsock.h>
#endif

#ifdef	WIN32
#define DLL extern "C" __declspec(dllexport)
#else
#define DLL extern "C"
#endif

#ifndef TRUE
#define	TRUE true
#endif

#ifndef FALSE
#define	FALSE false
#endif

#ifndef DWORD
typedef unsigned long  DWORD;
#endif

#ifndef NULL
#define NULL  0
#endif

typedef struct
{
	unsigned char Ttl;                         // Time To Live
	unsigned char Tos;                         // Type Of Service
	unsigned char Flags;                       // IP header flags
	unsigned char OptionsSize;                 // Size in bytes of options data
	unsigned char *OptionsData;                // Pointer to options data
} IP_OPTION_INFORMATION, *PIP_OPTION_INFORMATION;

typedef struct
{
	DWORD Address;                             // Replying address
	unsigned long Status;                     // Reply status
	unsigned long RoundTripTime;              // RTT in milliseconds
	unsigned short DataSize;                   // Echo data size
	unsigned short Reserved;                   // Reserved for system use
	void *Data;                                // Pointer to the echo data
	IP_OPTION_INFORMATION Options;             // Reply options
} IP_ECHO_REPLY, *PIP_ECHO_REPLY;

int PING_MONITOR(const char *server, long msec, int bytesize, int nSendNums, char *szReturn, int& nSize);

#define	PACKET_COUNT		6

#define		__MACHINENAME__					"_MachineName"
#define		__TIMEOUT__						"_TimeOut"
#define		__SENDBYTES__					"_SendBytes"
#define		__CUSTOMERPATH__				"_CustomerPath"
#define		__SENDNUMS__					"_SendNums"
#define		__PINGHOST__					"_PingHost"

#endif

