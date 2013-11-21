#ifndef _XMPP_H_
#define _XMPP_H_
#include "common.h"
#include "iksemel.h"
#include "soap.h"
#include "list.h"
#include "remote_ctrl.h"

#if defined(R6300v2)
#define NO_USB_DEVICE "/tmp/shares/No_Shares_Available"
#define FILE_SAVE_PATH_1 "/tmp/shares/USB_Storage"
#define FILE_SAVE_PATH_2 "/tmp/shares/T_Drive"
#endif


#define EXTEND_MES_VER "1.0"
#define XMPP_DFT_DOMAIN "xmpp.siteview.com"
#define XMPP_DFT_PROXY_DOMAIN "proxy.xmpp.siteview.com"
#define IKS_JABBER_TLS_PORT 5223
#define XMPP_RESOURCE_REMOTEMANAGEMENT "remote-manager"
#define XMPP_RESOURCE_REMOTEDLNA "remote-dlna"
#define XMPP_RESOURCE_REMOTECTRL "remote-ctrl"



#define IKS_NS_XDATA 	"jabber:x:data"
#define IKS_NS_XMPP_DISCO_INFO "http://jabber.org/protocol/disco#info"
#define IKS_NS_XMPP_DISCO_ITEMS	"http://jabber.org/protocol/disco#items"
#define IKS_NS_XMPP_SI "http://jabber.org/protocol/si"
#define IKS_NS_XMPP_SI_FILE "http://jabber.org/protocol/si/profile/file-transfer"
#define IKS_NS_XMPP_SI_FILE_FEATURE "http://jabber.org/protocol/feature-neg"
#define IKS_NS_XMPP_PING "urn:xmpp:ping"

#define IKS_FILE_PROTOCOL_IBB "http://jabber.org/protocol/ibb"
#define IKS_FILE_PROTOCOL_BYTESTREAMS "http://jabber.org/protocol/bytestreams"


#define ID_KEY_ADDROSTER "addroster"
#define ID_KEY_DELROSTER "delroster"
#define ID_KEY_GETROSTER "getroster"
#define ID_KEY_REG1 "reg1"
#define ID_KEY_REG2 "reg2"
#define ID_KEY_AUTH "auth"
#define ID_KEY_FILE_SI "si"
#define ID_KEY_FILE_SI1 "si1"
#define ID_KEY_FILE_SI2 "si2"
#define ID_KEY_FILE_SI3 "si3"
#define ID_KEY_FILE_SI4 "si4"
#define ID_KEY_FILE_SI5 "si5"
#define ID_KEY_FILE_OPEN "open"
#define ID_KEY_FILE_DATA "data"
#define ID_KEY_FILE_CLOSE "close"

#define BIND_CODE_OK 					0
#define BIND_CODE_ERR_NO_ATTACH 		1
#define BIND_CODE_ERR_NO_AUTH 			2
#define BIND_CODE_ERR_NO_BIND 			3
#define BIND_CODE_OK_ALREADY_FRIEND 	9

#define JABREADY (g_config.xmpp_sess.jabReady)
#define ARRAY_SIZE(_a) (sizeof(_a)/sizeof((_a)[0]))


typedef struct xmpp_user_s {
	char jid[JID_LEN];
	int status;
}xmpp_user;

struct defaultFileTypeMapEntry {
    const char* extension;
    const char* mime_type;
};

extern void it_present(xmpp_session *sess, char* jid);
extern int it_roster(xmpp_session *sess, ikspak *pak, char* jid);
extern int p_iq_send(xmpp_session *sess, enum iksubtype eSub, char *xmlns);
extern void p_ready(xmpp_session *sess);
extern int get_user_status(list roster, char *jid);
extern void set_user_status(list roster, char *jid, int status);
extern void free_user(void *data);
extern int msg_online(xmpp_session *sess, long cycle);
extern void it_iq_result(xmpp_session *sess, char *id, char *to);
#endif
