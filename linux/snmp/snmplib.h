#ifndef _SV_ECC_V70_SNMP_LIB_H_
#define _SV_ECC_V70_SNMP_LIB_H_

#pragma once

#include <iostream>
#include <string>
#include <map>

using namespace std;


#ifdef	WIN32
#include "windows.h"
//#define  strdup  _strdup
#ifndef TRUE
#define	TRUE true
#endif

#ifndef FALSE
#define	FALSE false
#endif

#else
#undef __WORDSIZE
#define __WORDSIZE 64
#include <unistd.h>
#include <sys/time.h>
#include <time.h>
#include <netinet/in.h>
#include <stdint.h>
#endif

#ifndef	NULL
#define	NULL	0
#endif

#ifndef DWORD
typedef	unsigned long DWORD;
#endif

#ifndef S_UINT
typedef	unsigned int S_UINT;
#endif

#ifndef BOOL
typedef	int BOOL;
#endif

#ifdef WIN32
typedef __int64 Int64;
typedef unsigned __int64 UInt64;
#else
typedef int64_t __int64;
typedef int64_t Int64;
typedef uint64_t UInt64;
#define _atoi64(val)     strtoll(val, NULL, 10)
#endif

#ifndef SVMP_VERSION
#define SVMP_VERSION
const int SNMP_VERSION_C1 = 1;    //SNMP版本1
const int SNMP_VERSION_C2 = 2;    //SNMP版本2
const int SNMP_VERSION_C3 = 3;    //SNMP版本3
const int MAX_BUFF_LEN    = 1024;
#endif

//void WriteLog(const char* str);
UInt64 strToUI64(const char * c0, int & error);

#include <snmp_pp/snmp_pp.h>
//E:\New_Snmp\snmp++v3.2.23\snmp++\include\snmp_pp
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
struct SNMP_Monitor_Result
{
public:
    SNMP_Monitor_Result():
      m_szIndex("0"),
      m_szOID(""),
      m_szValue("0")
    { }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    SNMP_Monitor_Result(const SNMP_Monitor_Result &result):
      m_szIndex(result.m_szIndex),
      m_szOID(result.m_szOID),
      m_szValue(result.m_szValue)
    { }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const SNMP_Monitor_Result &operator=(const SNMP_Monitor_Result &result)
    {
        m_szIndex = result.m_szIndex;
        m_szOID   = result.m_szOID;
        m_szValue = result.m_szValue;
        return *this;
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    string      m_szIndex;
    string      m_szOID;
    string      m_szValue;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
typedef map<int, SNMP_Monitor_Result, less<int> > MonitorResult;
typedef MonitorResult::iterator resultItem;
typedef MonitorResult::const_iterator resultConstItem;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
class CSVBaseSNMP
{
public:
    CSVBaseSNMP();
    ~CSVBaseSNMP();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
public:
    int         GetRequest(MonitorResult &ResultList);          // Get请求
    int         GetNextRequest(MonitorResult &ResultList);      // Get Next请求
    int         GetBulkRequest(MonitorResult &ResultList);      // Get Bulk请求

    int         InitSNMP();                                     // 初始化SNMP
    void        SetAuthProtocol(const char * pcszAuthProtocol); // 设置访问密码加密方式
    void        SetCommunity(const char * pcszCommunity);       // 设置共同体名称
    void        SetIPAddress(const char * pcszAddress);         // 设置IP地址
    void        SetNetworkPort(int nPort);                      // 设置网络设备的端口

    void        SetPrivProtocol(const char * pcszPrivProtocol); // 设置私有访问密码加密方式
    void        SetPrivatePwd(const char * pcszPassword);       // 设置私有访问密码
    void        SetPwd(const char * pcszPassword);              // 设置访问密码
    void        SetSecurityMode(int nSecurityMode);             // 设置访问优先级
    void        SetSecurityLevel(int nSecurityLevel);           // 设置访问优先级
    void        SetTimeout(int nTimeout);                       // 设置超时时间
    void        SetUser(const char * pcszUserName);             // 设置访问用户
    void        SetVersion(int nVersion);                       // 设置版本

    const char* GetErrorMsg(int nErrCode);                      // 当发生错误时候，通过此函数得到错误描述
protected:
    void        SetOID(const char * pcszOID);                   // 设置OID
private:
    Snmp            *   m_pSnmp;                                // SNMP++ SNMPClass
    snmp_version        version;                                // SNMP的版本
	UdpAddress          address;                                // NetworkSet IP Address
	Oid                 oid;                                    //OID
	CTarget             m_Ctarget;
	UTarget             m_Utarget;
	OctetStr            m_szCommunity;                          // 共同体
    OctetStr            m_szPrivPassword;                       // 私有访问密码
    OctetStr            m_szAuthPassword;                       // 用户访问密码
    OctetStr            m_szSecurityName;                       // 访问用户
    OctetStr            m_szContextName;
    OctetStr            m_szContextEngineID;

    int                 m_nCount ;
	int                 m_nOIDValue;
    int                 m_nRetries;
    int                 m_nTimeout;                             // 超时时间
	long                m_lSecurityLevel;                       // 访问优先级别,仅限于V3
	long                m_lSecurityModel;                       // 访问安全模式,仅限于V3
	long                m_lAuthProtocol;                        // = SNMPv3_usmNoAuthProtocol;
	long                m_lPrivProtocol;                        // = SNMPv3_usmNoPrivProtocol;
    u_short             m_nPort;                                // 网络设备的端口


    string              m_szErrorMsg;                           // 错误信息
    string              m_szStartID;
// private Functions
private:
    int                 InitUTarget();
    int                 InitSNMPV3();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
class CSVSnmpOID : public CSVBaseSNMP
{
public:
    CSVSnmpOID();
    ~CSVSnmpOID();
// public member function
public:
    UInt64   		AvgValue(const MonitorResult &ResultList);
    UInt64   		MaxValue(const MonitorResult &ResultList);
    UInt64   		MinValue(const MonitorResult &ResultList);
    UInt64         	SumValue(const MonitorResult &ResultList);
    
    int             GetResult(MonitorResult &ResultList);
    int             IndexCount(const MonitorResult &ResultList);

    void            SetOIDValue (const char *pcszOIDValue);     // 设置OID名称
    void            SetOIDIndex(const char *pcszIndex);         // 设置索引
    void            SetOIDType(int nType);                      // 设置类型
    void            SetSelName(const char *pszSelName);
private:
	string          m_szOIDIndex;                               // 变量的索引，只有OID是表格变量才有作用	
	string          m_szOID;                                    // OID
	string          m_szSelName;
	int             m_nType;                                    // 变量的类型 0 简单变量 1 表格变量
    bool            m_bSum;

    UInt64         	m_szSumValue;								// 可能发生翻转，目前无解！
    int             m_szIndexCount;
    UInt64   		m_ulMax;
    UInt64   		m_ulMin;
    UInt64         	m_avgValue;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace SV_ECC_SNMP_LIB
{
	void                InitLib();                              //初始化
	void                ReleaseLib();                           //释放
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
#endif
