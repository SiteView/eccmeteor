#ifndef		SVDB_SVDBTYPE_H_
#define		SVDB_SVDBTYPE_H_


#ifdef	WIN32
//#include "windows.h"
//#define  strdup  _strdup
#ifndef TRUE
#define	TRUE true
#endif

#ifndef FALSE
#define	FALSE false
#endif

#else
#include <unistd.h>
#include <sys/time.h>
#include <time.h>
#include <netinet/in.h>
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

#define UNITLEN		12
#define	NAMELEN		50
#define LABELLEN	100

#define MAXINT		2147483647
#define UMAXINT		4294967295

#include <strkey.h>

#include <list>

using namespace svutil;

typedef std::list<svutil::word>	WORDLIST;

#define	IDSEPARATOR		'.'


#include "SVDBError.h"

#include <cc++/file.h>
#include <string>
#include <set>
#include <map>
using std::string;

clock_t DisplayDebugTime(string tag= "time", clock_t time1 = clock());

class IdcUser
{
public:
	static std::set<std::string> Users;
	static bool EnableConfigDB;
	static bool EnableIdc;
	static bool AutoResolveIDS;
	static bool BoolToExit;
	static std::string RootPath;
	static std::string svdbHostAddr;
	static std::string cgiVersion;
	static int SocketTreadPlusCount;
	static int PipeTreadPlusCount;
	static void *m_pResource;
	static void *m_pLanguage;
	static S_UINT initial_time;
	static std::string ProcessID;
	
	static bool DisableEntityCombine;
	static bool nnmEntityParentOk;
	static bool PreCreateNnmEntityParent;
	static std::map<string,string> nnmEntityParentId;
	static std::map<string,string> nnmEntityParentValue;
	static std::string nnmEntityParentKey;

	static std::string StrDisable;
	static std::string StrTempDisable;
	
	std::string CreatChineseIDS(const std::string key, const std::string value, void *m_pLanguage);

	static std::set<int> set_InitLoadSEId;
	static std::string CenterAdress;
	static bool SELocked;
	static std::string CacheQueueName;
	static int msBackup;
	static bool RecordsAutoBackup;
	static bool ConfigAutoBackup;
	static bool AcceptConfigIncoming;
	static bool FullTeleBackup;
	static bool WillTeleBackup(const std::string id);
	static bool SetTeleBackupId(std::set<std::string> newid);

	static void PutLocalSEId(std::string str);
	static std::set<int> GetLocalSEId();
	static std::string GetLocalSEIdStr();
	static std::string GetFirstSEId();
	static bool IsAnLocalSEId(int index);
	static bool IsAnLocalSEId(std::string str);

	bool CreatDir(std::string fname)		
	{
		ost::MutexLock lock(m_UpdateLockCreatDir);
		bool ret;
		try{
			ret= ost::Dir::create(fname.c_str());
		}
		catch(...)
		{
			printf("Exception to creat directory:%s\n",fname.c_str());
		}
		return ret;
	}

	static bool CreatDirNonThreadSafe(std::string fname) 		
	{
		bool ret;
		try{
			ret= ost::Dir::create(fname.c_str());
		}
		catch(...)
		{
			printf("Exception to creat directory:%s\n",fname.c_str());
		}
		return ret;
	}

private:
	ost::Mutex	m_UpdateLockCreatDir;
	static std::set<int> set_LocalSEId;

	static std::set<std::string> set_backupId;
	static ost::Mutex	m_LockBackupId;

};


#endif
