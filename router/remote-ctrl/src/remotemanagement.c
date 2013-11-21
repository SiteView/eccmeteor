#include <string.h>
#include <stdlib.h>

#include "remotemanagement.h"
#include "router_tool.h"
#include "remote_ctrl.h"

char *get_soap_content(char *data)
{
	char *sp = strstr(data, "<?xml version=");
		
	return sp;
}

int chk_if_attached(char *mac)
{
	attach_device dev_list[64] = {};//liyuan-todo
	int find = 0;
	int i;
	int cnt = get_attach_device_by_soap(dev_list, g_config.soap_sess.soap_ip, g_config.soap_sess.soap_port);

	if (cnt == 0)
		return 0;
	printf("liyuan-debug;func:%s,line:%d\n", __FUNCTION__, __LINE__);
	for (i = 0; i < cnt; i++)
	{
		if (0 == iks_strcasecmp(mac, dev_list[i].mac))
		{
			find = 1;
			break;
		}
	}
	printf("liyuan-debug;func:%s,line:%d\n", __FUNCTION__, __LINE__);
	//if (dev_list)
	//	FREE(dev_list);
	return find;
}



