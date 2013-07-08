#include "MyTCPStream.h"

MyTCPStream::MyTCPStream(void):ost::SimpleTCPStream()
{
}
MyTCPStream::MyTCPStream(const IPV4Host &host,tpport_t port,size_t size):ost::SimpleTCPStream(host,port,size)
{
	;
}

MyTCPStream::~MyTCPStream(void)
{
}
