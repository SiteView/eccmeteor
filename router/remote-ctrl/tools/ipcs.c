#include "ipcs.h"

#include <stdio.h>
#include <stdlib.h>

#include <sys/ipc.h>
#include <sys/shm.h>

uint32_t CreateShm(uint8_t *uchPathName, uint32_t ulIndex, uint32_t ulSize)
{
	key_t		ulShmkey;
	uint32_t	ulShmid;

	if ((ulShmkey = ftok(uchPathName, ulIndex)) == -1)
	{
		printf("ftok error!\n");
		return -1;
	}
	
	if ((ulShmid = shmget(ulShmkey,ulSize,IPC_CREAT)) == -1)
	{
		printf("shmget call error!\n");
		return -1;
	}

	return ulShmid;
}

uint8_t *GetShmPoint(uint32_t ulIndex, uint32_t ulShmSize, uint8_t *pPathName)
{
	uint8_t *pShmAddr = NULL;
	uint32_t ulShmid;
	
	ulShmid = CreateShm(pPathName, ulIndex, ulShmSize);
		
	if ((pShmAddr = shmat(ulShmid, NULL, 0)) == (void *)-1)
	{
		printf("shmat error\n");
		return 0;
	}

	return pShmAddr;		
}

uint32_t LibShmdt(void *pShmAddr)
{
	return shmdt(pShmAddr);
}

