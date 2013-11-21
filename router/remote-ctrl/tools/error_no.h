/**********************************************************************************
**	定义xmpp扩展协议的错误码
**	错误码，占四位“0000”，第一位为0表示成功，第一位为1表示
**	发生错误；第二位用于表示功能模块；三四位表示错误类型.
**
**	0:系统
**	1:xmpp模块
**	2:dlna模块
**	3:远程管理模块
**
**
*********************************************************/


#ifndef _ERROR_NO_H_
#define _ERROR_NO_H_


/* system error define */
#define SYSOK			"0000"
#define SYSERR			"10"



/* xmpp error define */
#define XMPPOK			"0100"
#define XMPPERR			"11"



/* remote dlna error define */
#define DLNAOK			"0200"
#define DLNAERR			"12"



/* remote management error define */
#define MANAGEOK		"0300"
#define MANAGEERR		"13"

#endif
