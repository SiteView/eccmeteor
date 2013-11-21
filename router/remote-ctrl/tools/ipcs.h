#ifndef _IPCS_H_
#define _IPCS_H_
#include <sys/types.h>

#define REMOTE_CTRL_PATH "/usr/sbin/remote-ctrl"


typedef u_int32_t uint32_t;
typedef u_int16_t uint16_t;
typedef u_int8_t uint8_t;


typedef enum shmIndex_t
{
	REMOTE_CTRL_SHM_INDEX 		= 1,
}shmIndex_t;

extern uint8_t *GetShmPoint(uint32_t ulIndex, uint32_t ulShmSize, uint8_t *pPathName);
extern uint32_t LibShmdt(void *pShmAddr);

#endif
