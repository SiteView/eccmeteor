
#ifndef ADDON_SV_H
#define ADDON_SV_H


#include <node.h>
#include <v8.h>
//#include <objects.h>
using namespace v8;


Handle<Value> SV_Init(const Arguments& args);
Handle<Value> SV_Hello(const Arguments& args);
Handle<Value> SV_Test(const Arguments& args);
Handle<Value> SV_GetUnivData(const Arguments& args);
Handle<Value> SV_GetForestData(const Arguments& args);
Handle<Value> SV_SubmitUnivData(const Arguments& args);
Handle<Value> SV_CreateObject(const Arguments& args);


#endif
