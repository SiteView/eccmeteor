#include "../client.h"
#include "../messagesessionhandler.h"
#include "../messageeventhandler.h"
#include "../messageeventfilter.h"
#include "../chatstatehandler.h"
#include "../chatstatefilter.h"
#include "../connectionlistener.h"
#include "../disco.h"
#include "../message.h"
#include "../gloox.h"
#include "../lastactivity.h"
#include "../loghandler.h"
#include "../logsink.h"
#include "../connectiontcpclient.h"
#include "../connectionsocks5proxy.h"
#include "../connectionhttpproxy.h"
#include "../messagehandler.h"
using namespace gloox;

#ifndef _WIN32
# include <unistd.h>
#endif

#include <stdio.h>
#include <string>

#include <cstdio> // [s]print[f]
#if defined( WIN32 ) || defined( _WIN32 )
# include <windows.h>
#endif

#include <iostream>
#include <qsv.h>
#include <json/json.h>
#include <algorithm> // sort
#include <stdio.h>

static void printValueTree(Json::Value &value, const std::string &path = ".")
{
	switch (value.type())
	{
	case Json::nullValue:
		printf("%s=null\n", path.c_str());
		break;
	case Json::intValue:
		printf("%s=%s\n", path.c_str(), Json::valueToString(value.asLargestInt()).c_str());
		break;
	case Json::uintValue:
		printf("%s=%s\n", path.c_str(), Json::valueToString(value.asLargestUInt()).c_str());
		break;
	case Json::realValue:
		printf("%s=%.16g\n", path.c_str(), value.asDouble());
		break;
	case Json::stringValue:
		printf("%s=\"%s\"\n", path.c_str(), value.asString().c_str());
		break;
	case Json::booleanValue:
		printf("%s=%s\n", path.c_str(), value.asBool() ? "true" : "false");
		break;
	case Json::arrayValue:
	{
		printf("%s=[]\n", path.c_str());
		int size = value.size();
		for (int index = 0; index < size; ++index)
		{
			static char buffer[16];
			sprintf(buffer, "[%d]", index);
			printValueTree(value[index], path + buffer);
		}
	}
		break;
	case Json::objectValue:
	{
		printf("%s={}\n", path.c_str());
		Json::Value::Members members(value.getMemberNames());
		std::sort(members.begin(), members.end());
		std::string suffix = *(path.end() - 1) == '.' ? "" : ".";
		for (Json::Value::Members::iterator it = members.begin(); it != members.end(); ++it)
		{
			const std::string &name = *it;
			printValueTree(value[name], path + suffix + name);
		}
	}
		break;
	default:
		break;
	}
}

static std::map<std::string, std::string> paserValue(Json::Value &value, std::string &func)
{
	std::map<std::string, std::string> ret;
	if (value.type() == Json::arrayValue)
	{
//		printf("value size:%d\n", value.size());
		if (value.size() >= 2)
		{
			if (value[0].type() == Json::stringValue)
			{
				func = value[0].asString();
				printf("  func:%s\n", func.c_str());
				if (value[1].type() == Json::objectValue)
				{
					Json::Value::Members members(value[1].getMemberNames());
					std::sort(members.begin(), members.end());
					std::string path = ".[1]";
//					std::string suffix = *(path.end() - 1) == '.' ? "" : ".";
					for (Json::Value::Members::iterator it = members.begin(); it != members.end(); ++it)
					{
						const std::string &name = *it;
//						printValueTree(value[1][name], path + suffix + name);
						if (value[1][name].type() == Json::stringValue)
						{
							std::string nv = value[1][name].asString();
							printf("    %s=%s\n", name.c_str(), nv.c_str());
							ret.insert(std::make_pair(name, nv));
						}
					}
				}
			}
		}
	}
	return ret;
}

static void makeValue(ForestMap fmap, bool isok, std::string &estr, Json::Value &root)
{

	for (ForestMap::iterator fit = fmap.begin(); fit != fmap.end(); ++fit)
	{
		Json::Value ndata;
		for (StrMap::iterator nit = fit->second.begin(); nit != fit->second.end(); ++nit)
		{
			Json::Value kv;
			ndata[nit->first] = nit->second;
		}
		root[fit->first] = ndata;
	}
	root["estr"] = estr;
	if (isok)
		root["isok"] = "true";
	else
		root["isok"] = "false";
}

class MessageTest: public MessageSessionHandler,
		ConnectionListener,
		LogHandler,
		MessageEventHandler,
		MessageHandler,
		ChatStateHandler
{
public:
	MessageTest() :
			m_session(0), m_messageEventFilter(0), m_chatStateFilter(0)
	{
	}

	virtual ~MessageTest()
	{
	}

	void start()
	{

//		JID jid( "hurkhurk@xmpp.siteview.com/remote-ctrl" );
//		j = new Client( jid, "hurkhurks" );

//JID jid( "000C29C02B4E@xmpp.siteview.com/remote-ctrl" );
//j = new Client( jid, "96f9bee43fc2e9f3dd95cb9f649a9fbe" );

		JID jid("chenjiant2@rkquery.de");
		j = new Client(jid, "cjt");

		j->registerConnectionListener(this);
		j->registerMessageSessionHandler(this, 0);
		j->disco()->setVersion("messageTest", GLOOX_VERSION, "Linux");
		j->disco()->setIdentity("client", "bot");
		j->disco()->addFeature(XMLNS_CHAT_STATES);
		StringList ca;
		ca.push_back("/path/to/cacert.crt");
		j->setCACerts(ca);

		j->logInstance().registerLogHandler(LogLevelDebug, LogAreaAll, this);

		//
		// this code connects to a jabber server through a SOCKS5 proxy
		//
		//       ConnectionSOCKS5Proxy* conn = new ConnectionSOCKS5Proxy( j,
		//                                   new ConnectionTCP( j->logInstance(),
		//                                                      "sockshost", 1080 ),
		//                                   j->logInstance(), "example.net" );
		//       conn->setProxyAuth( "socksuser", "sockspwd" );
		//       j->setConnectionImpl( conn );

		//
		// this code connects to a jabber server through a HTTP proxy through a SOCKS5 proxy
		//
		//       ConnectionTCP* conn0 = new ConnectionTCP( j->logInstance(), "old", 1080 );
		//       ConnectionSOCKS5Proxy* conn1 = new ConnectionSOCKS5Proxy( conn0, j->logInstance(), "old", 8080 );
		//       conn1->setProxyAuth( "socksuser", "sockspwd" );
		//       ConnectionHTTPProxy* conn2 = new ConnectionHTTPProxy( j, conn1, j->logInstance(), "jabber.cc" );
		//       conn2->setProxyAuth( "httpuser", "httppwd" );
		//       j->setConnectionImpl( conn2 );

		if (j->connect(false))
		{
			ConnectionError ce = ConnNoError;
			while (ce == ConnNoError)
			{
				ce = j->recv();
			}
			printf("--- ce: %d\n", ce);
		}

		delete (j);
	}

	virtual void onConnect()
	{
		printf("---onConnect, connected!!!\n");
	}

	virtual void onDisconnect(ConnectionError e)
	{
		printf("---onDisconnect, message_test: disconnected: %d\n", e);
		if (e == ConnAuthenticationFailed)
			printf("---onDisconnect,  auth failed. reason: %d\n", j->authError());
	}

	virtual bool onTLSConnect(const CertInfo& info)
	{
		time_t from(info.date_from);
		time_t to(info.date_to);

		printf(
				"\n---onTLSConnect, status: %d\nissuer: %s\npeer: %s\nprotocol: %s\nmac: %s\ncipher: %s\ncompression: %s\n"
						"from: %s\nto: %s\n", info.status, info.issuer.c_str(), info.server.c_str(),
				info.protocol.c_str(), info.mac.c_str(), info.cipher.c_str(), info.compression.c_str(), ctime(&from),
				ctime(&to));
		return true;
	}

	virtual void handleMessage(const Message& msg, MessageSession * /*session*/)
	{
		if (msg.body().empty())
			return;
		printf("---handleMessage receive: %s\n", msg.body().c_str());

		//printf( "---handleMessage, type: %d, subject: %s, message: %s, thread id: %s\n", msg.subtype(),
		//	msg.subject().c_str(), msg.body().c_str(), msg.thread().c_str() );

		//std::string re = "You said:\n> " + msg.body() + "\nI like that statement.";
		std::string re = "ok!";

		Json::Reader reader(Json::Features::strictMode());
		Json::Value jv;
		bool parsingSuccessful = reader.parse(msg.body(), jv);
		if (!parsingSuccessful)
		{
			std::string error = "json error:";
			error += reader.getFormattedErrorMessages().c_str();
			error += "  try this:  [\"GetUnivData\",{\"dowhat\":\"GetMonitorTemplet\",\"id\":\"5\"}]   \n";
			printf(error.c_str());
			re = error;
		}
		else
		{
			re = "json ok!\n";
//			printValueTree(jv);
			std::string func;
			std::map<std::string, std::string> ndata = paserValue(jv, func);
			if (func == "GetUnivData")
			{
				ForestMap fmap;
				std::string estr;
				bool isok = qt_GetUnivData(fmap, ndata, estr);

				Json::Value retjv;
				makeValue(fmap, isok, estr, retjv);
				re += retjv.toStyledString();

//				std::string ret = "GetMonitorTemplet, sv_id= " + GetValue(fmap, "property", "sv_id", isok);
//				ret += "\nsv_description= " + GetValue(fmap, "property", "sv_description", isok);
//				ret += "\nsv_dll= " + GetValue(fmap, "property", "sv_dll", isok);
//				re += ret;
			}
			else if (func == "GetForestData")
			{
				ForestMap fmap;
				std::string estr;
				ForestVector vmap;
				bool isok = qt_GetForestData(vmap, ndata, estr);

				int index(0);
				string oldindex= "";
				for(ForestVector::iterator fit=vmap.begin(); fit!=vmap.end(); ++fit)
				{
					++index;
					char sindex[32]={0};
					sprintf(sindex,"m%d",index);
					fmap.insert(std::make_pair(sindex, *fit));
				}

				Json::Value retjv;
				makeValue(fmap, isok, estr, retjv);
				re += retjv.toStyledString();
			}
//		   Json::Value::Members member = jv.getMemberNames();
//		   for(Json::Value::Members::iterator iter = member.begin(); iter != member.end(); ++iter)
//		   {
//		       //std::cout << (*iter) << std::endl;
//		   }
		}

		std::string sub;
		if (!msg.subject().empty())
			sub = "Re: " + msg.subject();

		m_messageEventFilter->raiseMessageEvent(MessageEventDisplayed);
#if defined( WIN32 ) || defined( _WIN32 )
		Sleep(1000);
#else
		sleep( 1 );
#endif
		m_messageEventFilter->raiseMessageEvent(MessageEventComposing);
		m_chatStateFilter->setChatState(ChatStateComposing);
#if defined( WIN32 ) || defined( _WIN32 )
		Sleep(2000);
#else
		sleep( 2 );
#endif
		printf("---handleMessage send back:%s\n", UTF8ToGB2312(re).c_str());
		m_session->send(re, sub);

		if (msg.body() == "quit")
			j->disconnect();
	}

	virtual void handleMessageEvent(const JID& from, MessageEventType event)
	{
		printf("---handleMessageEvent, received event: %d from: %s\n", event, from.full().c_str());
	}

	virtual void handleChatState(const JID& from, ChatStateType state)
	{
		printf("---handleChatState, received state: %d from: %s\n", state, from.full().c_str());
	}

	virtual void handleMessageSession(MessageSession *session)
	{
		//printf( "---handleMessageSession, got new session\n");
		// this example can handle only one session. so we get rid of the old session
		j->disposeMessageSession(m_session);
		m_session = session;
		m_session->registerMessageHandler(this);
		m_messageEventFilter = new MessageEventFilter(m_session);
		m_messageEventFilter->registerMessageEventHandler(this);
		m_chatStateFilter = new ChatStateFilter(m_session);
		m_chatStateFilter->registerChatStateHandler(this);
	}

	virtual void handleLog(LogLevel level, LogArea area, const std::string& message)
	{
//		printf("log: level: %d, area: %d, %s\n", level, area, message.c_str() );
//		printf("%s\n", message.c_str() );
	}

private:
	Client *j;
	MessageSession *m_session;
	MessageEventFilter *m_messageEventFilter;
	ChatStateFilter *m_chatStateFilter;
};

int main(int /*argc*/, char** /*argv*/)
{
	std::string str;
	str += getSVstr();
	//	str += testSubmitGroup();
	printf(UTF8ToGB2312(str).c_str());

	printf("\nxmpp\n");

	MessageTest *r = new MessageTest();
	r->start();
	delete (r);
	return 0;
}
