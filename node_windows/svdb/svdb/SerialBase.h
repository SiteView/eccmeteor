//////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////

#ifndef	__SVDB_SERIALBASE_H__
#define	__SVDB_SERIALBASE_H__

#include "svdbtype.h"

class SerialBase
{
public:
	virtual S_UINT	GetRawDataSize(void)=0;
	virtual char*	GetRawData(char *lpbuf,S_UINT bufsize)=0;
	virtual bool	CreateObjectByRawData(const char *lpbuf,S_UINT bufsize)=0;
};


class SerialBase2
{
public:
	virtual S_UINT	GetRawDataSize(bool onlyLocked= false)=0;
	virtual char*	GetRawData(char *lpbuf,S_UINT bufsize, bool onlyLocked= false)=0;
	virtual bool	CreateObjectByRawData(const char *lpbuf,S_UINT bufsize)=0;
};

#endif	// __SVDB_SERIALBASE_H__
