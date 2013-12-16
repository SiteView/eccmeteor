// svdb.cpp : 定义控制台应用程序的入口点。
//

#include <iostream>
#include <tchar.h>

#include "Services.h"
#include "SvdbMain.h"

unsigned short g_port=8600;

std::string g_dbPName="";
SvdbMain *psm=NULL;

char *g_account=NULL;
char *g_password=NULL;

#include "QueryData.h"

int _tmain(int argc, _TCHAR* argv[])
{
	g_dbPName = argv[0];

	char buf[100];
	memset(buf, 0, sizeof(buf));

	while (gets(buf) != NULL)
	{
		if(strcmp(buf, "-install")==0)
		{
			InstallService();
		}
		else if(strcmp(buf, "-uninstall")==0)
		{
			UnInstall();
		}
		else if(strcmp(buf, "-service")==0)
		{
			RunSvdbServices();
		}
		else if(strcmp(buf, "-stop")==0)
		{
		}
		else if(strcmp(buf, "-run")==0)
		{
			psm = new SvdbMain();
			if (psm->Init() && psm->Start())
			{
				printf("SVDB start sucess!\n");
			}
		}
		else if(strcmp(buf, "q")==0 || strcmp(buf, "Q")==0)
		{
			puts("quit.....");
			break;
		}
		else
		{
			printf(".....\n");
		}
	}

	return 0;
}