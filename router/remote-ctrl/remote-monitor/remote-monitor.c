#include <time.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>
#include "ipcs.h"

//#include <qsv.h>


#define CHECK_REMOTE_MONITOR_INTERVAL		5	//10s



int main(int argc, char **argv)
{
//	printf(getSVstr().c_str());

	uint32_t ulCheck = 0;
	
	uint8_t *pShmAddrRemoteCtrl = NULL;
	uint32_t ulCheckRemoteCtrl = 0;
	uint32_t ulRemoteCtrlCount = 0;
	uint32_t ulRemoteCtrlCountOld = 0;
	uint32_t ulRemoteCtrlCountFail = 0;
	

    pShmAddrRemoteCtrl = GetShmPoint(REMOTE_CTRL_SHM_INDEX, sizeof(uint32_t), REMOTE_CTRL_PATH);	
	
	if ((pShmAddrRemoteCtrl != NULL)&&(pShmAddrRemoteCtrl != (void *)-1))
	{
		memset(pShmAddrRemoteCtrl, 0, sizeof(uint32_t));
	}
  
	while (1)
	{
 		sleep(2);

		if (ulCheck % CHECK_REMOTE_MONITOR_INTERVAL == 0)
		{
			ulCheckRemoteCtrl = 1;//10s
		}
		
		if (ulCheckRemoteCtrl)
		{
			ulCheckRemoteCtrl = 0;
    
			//DaemonEnsure("remote-ctrl", TRUE);
			if ((pShmAddrRemoteCtrl != NULL)&&(pShmAddrRemoteCtrl != (void *)-1))
        	{
        		memcpy((void *)&ulRemoteCtrlCount, pShmAddrRemoteCtrl, sizeof(uint32_t));	
            
                if (ulRemoteCtrlCount == ulRemoteCtrlCountOld)
                {
                    ulRemoteCtrlCountFail++;
                    if (ulRemoteCtrlCountFail >= 5)
                    {
                        ulRemoteCtrlCountFail = 0;
						printf("remote-ctrl not run ok! so restart!\n");
                        system("killall -9 remote-ctrl");
						sleep(2);
                        system("remote-ctrl &");
                   }
                }
                else
                {
                    ulRemoteCtrlCountOld = ulRemoteCtrlCount;
                    ulRemoteCtrlCountFail = 0;
                }
            }
            else
            {
            	pShmAddrRemoteCtrl = GetShmPoint(REMOTE_CTRL_SHM_INDEX, sizeof(uint32_t), REMOTE_CTRL_PATH);
				if ((pShmAddrRemoteCtrl != NULL)&&(pShmAddrRemoteCtrl != (void *)-1))
				{
					memset(pShmAddrRemoteCtrl, 0, sizeof(uint32_t));
				}
				
                ulRemoteCtrlCountFail = 0;
            }
		}
		
 		
		ulCheck ++;
	}
	
	return 0;
}	
