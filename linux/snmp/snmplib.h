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
const int SNMP_VERSION_C1 = 1;    //SNMP�汾1
const int SNMP_VERSION_C2 = 2;    //SNMP�汾2
const int SNMP_VERSION_C3 = 3;    //SNMP�汾3
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
    int         GetRequest(MonitorResult &ResultList);          // Get����
    int         GetNextRequest(MonitorResult &ResultList);      // Get Next����
    int         GetBulkRequest(MonitorResult &ResultList);      // Get Bulk����

    int         InitSNMP();                                     // ��ʼ��SNMP
    void        SetAuthProtocol(const char * pcszAuthProtocol); // ���÷���������ܷ�ʽ
    void        SetCommunity(const char * pcszCommunity);       // ���ù�ͬ������
    void        SetIPAddress(const char * pcszAddress);         // ����IP��ַ
    void        SetNetworkPort(int nPort);                      // ���������豸�Ķ˿�

    void        SetPrivProtocol(const char * pcszPrivProtocol); // ����˽�з���������ܷ�ʽ
    void        SetPrivatePwd(const char * pcszPassword);       // ����˽�з�������
    void        SetPwd(const char * pcszPassword);              // ���÷�������
    void        SetSecurityMode(int nSecurityMode);             // ���÷������ȼ�
    void        SetSecurityLevel(int nSecurityLevel);           // ���÷������ȼ�
    void        SetTimeout(int nTimeout);                       // ���ó�ʱʱ��
    void        SetUser(const char * pcszUserName);             // ���÷����û�
    void        SetVersion(int nVersion);                       // ���ð汾

    const char* GetErrorMsg(int nErrCode);                      // ����������ʱ��ͨ���˺����õ���������
protected:
    void        SetOID(const char * pcszOID);                   // ����OID
private:
    Snmp            *   m_pSnmp;                                // SNMP++ SNMPClass
    snmp_version        version;                                // SNMP�İ汾
	UdpAddress          address;                                // NetworkSet IP Address
	Oid                 oid;                                    //OID
	CTarget             m_Ctarget;
	UTarget             m_Utarget;
	OctetStr            m_szCommunity;                          // ��ͬ��
    OctetStr            m_szPrivPassword;                       // ˽�з�������
    OctetStr            m_szAuthPassword;                       // �û���������
    OctetStr            m_szSecurityName;                       // �����û�
    OctetStr            m_szContextName;
    OctetStr            m_szContextEngineID;

    int                 m_nCount ;
	int                 m_nOIDValue;
    int                 m_nRetries;
    int                 m_nTimeout;                             // ��ʱʱ��
	long                m_lSecurityLevel;                       // �������ȼ���,������V3
	long                m_lSecurityModel;                       // ���ʰ�ȫģʽ,������V3
	long                m_lAuthProtocol;                        // = SNMPv3_usmNoAuthProtocol;
	long                m_lPrivProtocol;                        // = SNMPv3_usmNoPrivProtocol;
    u_short             m_nPort;                                // �����豸�Ķ˿�


    string              m_szErrorMsg;                           // ������Ϣ
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

    void            SetOIDValue (const char *pcszOIDValue);     // ����OID����
    void            SetOIDIndex(const char *pcszIndex);         // ��������
    void            SetOIDType(int nType);                      // ��������
    void            SetSelName(const char *pszSelName);
private:
	string          m_szOIDIndex;                               // ������������ֻ��OID�Ǳ�������������	
	string          m_szOID;                                    // OID
	string          m_szSelName;
	int             m_nType;                                    // ���������� 0 �򵥱��� 1 ������
    bool            m_bSum;

    UInt64         	m_szSumValue;								// ���ܷ�����ת��Ŀǰ�޽⣡
    int             m_szIndexCount;
    UInt64   		m_ulMax;
    UInt64   		m_ulMin;
    UInt64         	m_avgValue;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
namespace SV_ECC_SNMP_LIB
{
	void                InitLib();                              //��ʼ��
	void                ReleaseLib();                           //�ͷ�
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
#endif
