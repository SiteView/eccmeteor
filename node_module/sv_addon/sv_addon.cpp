


//#include "stdafx.h"

#include <node.h>
#include <v8.h>
//#include <objects.h>
using namespace v8;

#include "addonfunc.h"
#include "V8MapInMap.h"
#include "addonsv.h"
using namespace addon;


BOOL APIENTRY DllMain( HANDLE hModule, 
	DWORD  ul_reason_for_call, 
	LPVOID lpReserved
	)
{
	return TRUE;
}


//extern "C" void NODE_EXTERN init (Handle<Object> target)
//{
//	HandleScope scope;
//	target->Set(String::New("hello"), String::New("2012, the end of world"));
//}


void init(Handle<Object> target) {
	V8MapInMap::Init();
	addon::SetSvdbAddr();

	target->Set(String::NewSymbol("hello"),FunctionTemplate::New(SV_Hello)->GetFunction());
	target->Set(String::NewSymbol("test"),FunctionTemplate::New(SV_Test)->GetFunction());
	target->Set(String::NewSymbol("createObject"),FunctionTemplate::New(SV_CreateObject)->GetFunction());
	target->Set(String::NewSymbol("GetUnivData"),FunctionTemplate::New(SV_GetUnivData)->GetFunction());
	target->Set(String::NewSymbol("GetForestData"),FunctionTemplate::New(SV_GetForestData)->GetFunction());

}
NODE_MODULE(sv_addon, init)

