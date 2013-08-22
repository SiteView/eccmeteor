#ifndef _SV_ECC_SNMPMONITOR_H_
#define _SV_ECC_SNMPMONITOR_H_

#include <string>
#include <iostream>
#include <list>
#include <map>

using namespace std;

class clsOID;

typedef std::list<string> StringList;
/////////////////////////////////////////////////////////////////////////////
// CSnmpMonitorApp
// See SnmpMonitor.cpp for the implementation of this class
//
//typedef list<string *> CStringList;

class CSnmpMonitorApp
{
public:
	CSnmpMonitorApp();

	virtual bool InitInstance();
};

#ifdef	WIN32
#define SNMP_MONITOR_DLL extern "C" __declspec(dllexport)
#else
#define SNMP_MONITOR_DLL extern "C"
#endif

SNMP_MONITOR_DLL  int SNMPList(const char * strParas, char * szReturn, int& nSize);

void MakeLabel(StringList &lsTemp, StringList &lsLable, char* strFixLable ,int nSelSub = 0, int nSubSize = 0);

SNMP_MONITOR_DLL  int SNMPDone(const char * strParas, char * szReturn, int& nSize);

SNMP_MONITOR_DLL  int NetworkSetTest(const char *inFileName,const char *outFileName);


#define		__COMMUNITY__					"_Community="
#define		__SERVERPORT__					"_ServerPort="
#define		__INTERFACEINDEX__				"_InterfaceIndex="
#define     __SELVALUE__					"_SelValue="
#define		__GROUPID__						"_GroupID="  
#define		__MONITORID__					"_MonitorID="
#define		__TPLID__						"_TemplateID="
//#define     __TPLID__                       "_templateid="
#define		__MATCHCONT__					"_matchcont="
//#define		__MACHINENAME__					"_ServerPort="
#define		__NETSETTYPE__					"_netsettype="
#define		__INDEX__						"_index="
#define     __DISKINDEX__                   "_DiskIndex="
#define     __MACHINENAME__                 "_MachineName="
#define     __PORT__                        "_Port="
#define		__REQUIREID__					"_RequireID="
#define		__SETVALUE__					"_SetValue="
#define		__DISKINTERFACEINDEX__			"_DiskIndex="
#define		__DOWNTIME__					"_downtime="
#define		TIME_SPAN						5*60

//////////////////////////////////////////////////////////////////////////////////
// Base

// TPL ID
const char SV_TPLID [] = "_TemplateID" ;
// SE ID
const char SV_SEID [] = "_SEID=" ;
// Entity ID
const char SV_EntityID [] = "_EntityID=" ;
// Group ID
const char SV_GroupID [] = "_GroupID=" ;
// Monitor ID
const char SV_MonitorID [] = "_MonitorID" ;
// Entity Type
const char SV_EntityType [] = "_EntityType" ;

//Domain Name
const char SV_DomainName [] ="_DomName";
const char SV_MatchIP [] ="_MatchIP";
const char SV_DSN [] = "_DSN=";
// Host Name
const char SV_Host [] = "_MachineName" ;
// User Name
const char SV_User [] = "_UserAccount" ;
// Password
const char SV_Pwd [] = "_PassWord" ;
// OS Type
const char SV_OSType [] = "_OsType" ;
//
const char SV_RuleFile[] = "_RuleFile";
// Port
const char SV_Port [] = "_Port" ;
// Login prompt
const char SV_LoginPrompt [] = "_LoginPrompt" ;
// Password prompt
const char SV_PwdPrompt [] = "_PWPrompt" ;
// Success prompt
const char SV_Prompt [] = "_Prompt" ;
// Login Protocol Type (Telnet/SSH)
const char SV_ProtocolType [] = "_ProtocolType" ;
// Use Private key file login UNIX
const char SV_UerKeyFile [] = "_UseKeyFile" ;
// Private Key File
const char SV_KeyFile [] = "_PrivateKey" ;
// Customer Path
const char SV_CustomerPath [] = "_CustomerPath" ;

//////////////////////////////////////////////////////////////////////////////////
// SNMP
// Community
const char SV_SNMPVersion [] = "Version" ;
// Community
const char SV_Community [] = "_Community" ;
// Version
const char SV_SNMPVer [] = "_SNMPVer" ;
// Interface Index
const char SV_InterfaceIndex [] = "_InterfaceIndex" ;
// SNMP Disk Interface Index
const char SV_SNMPDisk [] = "_DiskIndex" ;
// Select Value
const char SV_SNMPSelvalue [] = "_SelValue" ;
// Set Value
const char SV_SNMPSetValue [] = "_SetValue" ;
// Net Set Type
const char SV_SNMPNetSetType [] = "_netsettype" ;
//
const char SV_SNMPMatchCont [] = "_matchcont" ;

const char SV_SNMPIndex [] = "_index" ;

const char SV_SNMPRequireID [] = "_RequireID" ;

const char SV_SNMPDowntime [] = "_downtime" ;

//////////////////////////////////////////////////////////////////////////////////
//
// Disk
const char SV_Disk [] = "_Disk=" ;
// File path
const char SV_FilePath [] = "_FilePath=" ;
// Folder
const char SV_Folder [] = "_Folder=" ;
// Service
const char SV_Service [] = "_Service=" ;
// Connect Port
const char SV_ConnPort [] = "_ConnPort=" ;
// Log File
const char SV_LogFile [] = "_LogFilePathname=" ;
// Process
const char SV_Process [] = "_ProcessName=" ;
// Window Event Log Name
const char SV_WinEventName [] = "_logName=" ;
// Window Event Log Type
const char SV_WinEventType [] = "_eventType=" ;
// Window Event Log Key
const char SV_WinEventKey [] = "_eventKey=" ;
// Window Event Log Match
const char SV_WinEventMatch [] = "_eventMachine=" ;
// Window Event Log EventCode Filter List
const char SV_WinEventCode [] = "_CodeList=" ;
// Window Event Log Source Filter List
const char SV_WinEventSource [] = "_SourceList=" ;
//
const char SV_WinEventPosMatch [] = "_positiveMatch=" ;
//
const char SV_WinEventNegMatch [] = "_negativeMatch=" ;
//
const char SV_WinEventMachine [] = "_eventMachine=" ;
// Domain Host Name
const char SV_DomainHost [] = "_DomainMachine=" ;
// Domain User Name
const char SV_DomainUser [] = "_DomainUserAccount=" ;
// Domain User's Password
const char SV_DomainPwd [] = "_DomainPassword=" ;
// Unix Script
const char SV_UnixScript [] = "_Script=" ;
// Unix Total Memory
const char SV_UnixTotalMemory [] = "_totalMemory=" ;
// Unix Command
const char SV_UnixCommand [] = "_UnixCommand=" ;
//////////////////////////////////////////////////////////////////////////////////
// Proxy Server

// Proxy Server & Port
const char SV_ProxyServer [] = "_ProxyServerPort=" ;
// Proxy Server User
const char SV_ProxyUser [] = "_ProxyUser=" ;
// Proxy Server Password
const char SV_ProxyPwd [] = "_ProxyPass=" ;
// Proxy Type
const char SV_ProxyType [] = "_ProxyType=";
// Passive Mode
const char SV_PassiveMode [] = "_PassiveMode=";
/////////////////////////////////////////////////////////////////////////////////
//
const char SV_FileName [] = "_FileName";
const char SV_AppendMethod[] = "_AppendMethod";
// Match String
const char SV_MatchStr [] = "_MatchStr" ;
// Send String
const char SV_SendStr [] = "_SendStr=" ;

//////////////////////////////////////////////////////////////////////////////////
// URL

// URL
const char SV_Url [] = "_URL=" ;
// Post Data
const char SV_UrlPost [] = "_PostData=" ;

//////////////////////////////////////////////////////////////////////////////////
// Time Out

// Time out
const char SV_TimeOut [] = "_Timeout" ;
// Connect Timeout
const char SV_ConnTimeout [] = "_ConnTimeout=" ;
// Execute Query Timeout
const char SV_QueryTimeout [] = "_QueryTimeout=" ;

//////////////////////////////////////////////////////////////////////////////////
// FTP
// User Name
const char SV_FtpUserName [] = "_FTPUserAccount=" ;
// User's password
const char SV_FtpPassword [] = "_FTPPassWord=" ;
// Server Port
const char SV_FtpServerPort [] = "_ServerPort=" ;
// Test Download
const char SV_FtpDownlad [] = "_DownLoadFile=" ;

//////////////////////////////////////////////////////////////////////////////////
//
const char SV_MailType[] = "_MailType";
// SMTP Server && Port
const char SV_SMTPServerPort[] = "_SmtpServPort";
// Rcpt Server && Port
const char SV_RcptServerPort[] = "_RcptServPort";
// Receive Mail Protocol
const char SV_MailProtocol[] = "_MailProtocolType";
// Email From
const char SV_SendAddress[] = "_SendAddress";
// Receive Mail Address(Mail To)
const char SV_RcptAddress[]  = "_RcptAddress";
//
const char SV_Attachment[] = "_Attachment";
const char SV_CheckDelay[] = "_CheckDelay";
const char SV_VerifyUsername[] = "_VerifyUsername";
const char SV_VerifyPassword[] = "_VerifyPassword";
const char SV_SMTPAuth[] = "_IsSMTPAu";
const char SV_SMTPSPA[] = "_IsSMTPSPA";
const char SV_RcptSPA[] = "_IsRCPTSPA";
const char SV_HoldCopy[] = "_HoldCopy";
// Function Define
//////////////////////////////////////////////////////////////////////////////////


#endif
