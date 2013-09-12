#ifndef	DRAGONFLOW_MYDEF
#define	DRAGONFLOW_MYDEF
#include <string.h>
#include <iostream>
#include "TString.h"
#include <svtime.h>
#include <list>

#include <hashtable.h>


using namespace std;
using namespace ost;
using namespace svutil;

typedef svutil::hashtable<svutil::word,svutil::word>	STRINGMAP;

typedef	std::list<string> CStringList;
typedef TString CString;
typedef TTime   CTime;
typedef TTimeSpan CTimeSpan;




#ifndef  WIN32

#define	_strdup	strdup
#define	_stricmp	stricmp

//typedef strdup	_strdup;
typedef unsigned int  UINT;
typedef int BOOL;

#ifndef DWORD
typedef unsigned long  DWORD;
#endif

typedef const char* LPCSTR;
typedef const char* LPCTSTR;

#ifndef TRUE
#define TRUE 1
#endif

#ifndef FALSE
#define FALSE 0
#endif

#endif


#endif
