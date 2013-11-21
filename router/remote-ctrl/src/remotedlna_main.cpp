// MyDLNA.cpp : 定义控制台应用程序的入口点。
//

#include "DLNADelegation.h"
#include <pthread.h>

extern "C"
{
#include "remotedlna.h"
#include <unistd.h>
}


using namespace deejay;

extern "C"
{


void* remotedlna_main(void *lparam)
{
	*(int*)lparam = getpid();

	DLNADelegation * pDlna = DLNADelegation::GetInstance();
	
	init_message_list();


	//pDlna->startUPNPServer();
	//pDlna->startUPNPRender();
	pDlna->startUPNPControlPoint();
	printf("UPNP start!\n");


	while (1)
	{
		MUTEX_LOCK(mes_from_xmpp->mutex);
		if (mes_from_xmpp->count)
		{
			message_t *mes_dlna = (message_t *)(pDlna->handle_message_from_xmpp());
			MUTEX_UNLOCK(mes_from_xmpp->mutex);
			
			if (mes_dlna)
			{
				list_add_with_mutex(mes_from_dlna, mes_dlna);
			}
			
		}
		else
		{
			MUTEX_UNLOCK(mes_from_xmpp->mutex);
			usleep(50000);
		}
	}

	//pDlna->stopUPNPServer();
	//pDlna->stopUPNPRender();
	pDlna->stopUPNPControlpoint();
	free_message_list();
	printf("stop UPNP!\n");
	return 0;
}



}	//extern "C"