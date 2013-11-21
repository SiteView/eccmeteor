#pragma once
#include "svdbtype.h"
#include <string>
#include <map>

#ifdef	WIN32
#include <windows.h>
#endif

using namespace std;

#ifdef	WIN32
class CShareMemFile
{
public:
	CShareMemFile(bool bAutoDelete);
	~CShareMemFile(void);

public:
	bool CreateMem (string filename, DWORD flProtected, DWORD dwSize, LPVOID lpVoid);
	LPVOID MapMem (string filename, DWORD &dwSize);
private:
	HANDLE m_hMem;
	LPVOID m_pViewOfFile;
	bool   m_bAutoDelete;
	static map<string, DWORD>	m_LanguageMap;
};
#endif
