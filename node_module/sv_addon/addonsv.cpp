#include "addonsv.h"
using namespace v8;

#include "addonfunc.h"
#include "V8MapInMap.h"
using namespace addon;

Handle<Value> SV_Init(const Arguments& args) {
	HandleScope scope;
	V8MapInMap::Init();
	addon::SetSvdbAddr();
	return scope.Close(String::New("Inited, siteview."));
}

Handle<Value> SV_Hello(const Arguments& args) {
	HandleScope scope;
	return scope.Close(String::New("2012, the end of world, siteview. 2013"));
}

Handle<Value> SV_Test(const Arguments& args) {
	HandleScope scope;
	string ret= addon::GetSvdbAddr();
	//printf("test of sv_addon runing, SvdbAddr is %s \n",ret.c_str());
	return scope.Close(String::New(ret.c_str()));
}

Handle<Value> SV_GetData(const Arguments& args,bool isForest) {
	HandleScope scope;
	if(args.Length()<1)
		return scope.Close(String::New("bad arguments input"));

	int debug= 0;
	if(args.Length()>1 && args[1]->IsInt32())
		debug= args[1]->Int32Value();
	else
		return scope.Close(String::New("bad arguments input, 2nd argument must be int. "));
	if(debug>0)
		printf("debug mode(2nd argument): %d \n",debug);

	Handle<v8::Object> v8Obj = args[0]->ToObject();
	Handle<Array> keys = v8Obj->GetOwnPropertyNames();
	int len = keys->Length();
	if(len==0)
	{
		if(debug>0)
			puts("bad arguments of GetData ");
		return scope.Close(String::New("bad arguments of GetData "));
	}

	NodeData ndata;
	if(debug>0)
		printf("key-value count of GetData: %d\n--------\n", len);
	for (int i = 0; i < len; ++i) {
		Local<v8::Value> key = keys->Get(i);
		Local<v8::Value> value = v8Obj->Get(key);
		char text[512]={0};
		char text2[512]={0};
		key->ToString()->WriteAscii(text,0,510);
		value->ToString()->WriteAscii(text2,0,510);
		ndata.insert(std::make_pair(text,text2));

		if(debug>0)
			printf("%s : %s\n",text,text2);
	}
	if(debug>0)
		puts("--------");
	ForestMap fmap,fmap_gbk;
	string estr,estr_gbk;
	std::map<std::string,std::string> forest_keys;
	bool retok= false;
	if(isForest)
		retok= addon::GetForestData(forest_keys,fmap_gbk,fmap,ndata,estr_gbk,estr);
	else
		retok= addon::GetUnivData(fmap_gbk,fmap,ndata,estr_gbk,estr);

	if(debug>1)
		addon::displayForestMap(fmap_gbk);
	if(debug>0)
	{
		puts("--");
		if(retok)
		{
			if(isForest)
				puts("GetForestData: true");
			else
				puts("GetUnivData: true");
		}
		else
		{
			if(isForest)
				puts("GetForestData: false");
			else
				puts("GetUnivData: false");
		}
		if(debug>0)
			printf("estr: %s\n--\n\n",estr_gbk.c_str());
	}
	Local<Object> instance = V8MapInMap::NewInstance();
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(instance);
	obj->SetIsok(retok);
	obj->SetEstr(estr,estr_gbk);
	obj->SetFmap(fmap,fmap_gbk);
	obj->SetFroestKeys(forest_keys);

	return scope.Close(instance);
}

Handle<Value> SV_GetUnivData(const Arguments& args) {
	return SV_GetData(args,false);
}

Handle<Value> SV_GetForestData(const Arguments& args) {
	return SV_GetData(args,true);
}

Handle<Value> SV_CreateObject(const Arguments& args) {
	HandleScope scope;
	return scope.Close(V8MapInMap::NewInstance(args));
}

ForestMap ExtractFmap(const Arguments& args) {
	ForestMap fmap;

	Handle<v8::Object> v8Obj = args[0]->ToObject();
	Handle<Array> fkeys = v8Obj->GetOwnPropertyNames();
	int flen = fkeys->Length();
	//printf("flen:%d\n",flen);
	if(flen==0)
	{
		return fmap;
	}

	for (int n = 0; n < flen; ++n) {
		Local<v8::Value> fkey = fkeys->Get(n);
		char ftext[2048]={0};
		fkey->ToString()->WriteUtf8(ftext,510);
		//printf("fkey:%d,%s\n",n,ftext);

		Handle<v8::Object> nobj = v8Obj->Get(fkey)->ToObject();
		Handle<Array> nkeys = nobj->GetOwnPropertyNames();
		int len = nkeys->Length();

		NodeData ndata;
		if(len>0)
		{
			for (int i = 0; i < len; ++i) {
				Local<v8::Value> key = nkeys->Get(i);
				Local<v8::Value> value = nobj->Get(key);
				char text[2048]={0};
				char text2[2048]={0};
				key->ToString()->WriteUtf8(text,510);
				value->ToString()->WriteUtf8(text2,510);
				ndata.insert(std::make_pair(text,text2));
			}
		}
		fmap.insert(std::make_pair(ftext,ndata));
	}
	return fmap;
}

Handle<Value> SV_SubmitUnivData(const Arguments& args) {
	HandleScope scope;
	if(args.Length()<2)
		return scope.Close(String::New("bad arguments input."));

	int debug= 0;
	if(args.Length()>2 && args[2]->IsInt32())
		debug= args[2]->Int32Value();
	else
		return scope.Close(String::New("bad arguments input, 3th argument must be int. "));
	if(debug>0)
		printf("debug mode(3th argument): %d \n",debug);

	Handle<v8::Object> v8Obj = args[1]->ToObject();
	Handle<Array> keys = v8Obj->GetOwnPropertyNames();
	int len = keys->Length();
	if(len==0)
	{
		if(debug>0)
			puts("bad arguments of SubmitUnivData ");
		return scope.Close(String::New("bad arguments of SubmitUnivData "));
	}

	NodeData ndata;
	if(debug>0)
		printf("key-value count of SubmitUnivData: %d\n--------\n", len);
	for (int i = 0; i < len; ++i) {
		Local<v8::Value> key = keys->Get(i);
		Local<v8::Value> value = v8Obj->Get(key);
		char text[512]={0};
		char text2[512]={0};
		key->ToString()->WriteAscii(text,0,510);
		value->ToString()->WriteAscii(text2,0,510);
		ndata.insert(std::make_pair(text,text2));

		if(debug>0)
			printf("%s : %s\n",text,text2);
	}
	ForestMap in_fmap= ExtractFmap(args);
	ForestMap fmap,fmap_gbk,in_fmap_gbk;
	string estr,estr_gbk;
	bool retok= false;
	retok= addon::SubmitUnivData(fmap_gbk,fmap,in_fmap_gbk,in_fmap,ndata,estr_gbk,estr);

	if(debug>1)
	{
		puts("-----  submit fmap ---");
		addon::displayForestMap(in_fmap_gbk);
		puts("-----  end of submit fmap ---\n");
	}
	if(debug>0)
		puts("--------");
	if(debug>1)
		addon::displayForestMap(fmap_gbk);
	if(debug>0)
	{
		puts("--");
		if(retok)
			puts("SubmitUnivData: true");
		else
			puts("SubmitUnivData: false");

		if(debug>0)
			printf("estr: %s\n--\n\n",estr_gbk.c_str());
	}
	Local<Object> instance = V8MapInMap::NewInstance();
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(instance);
	obj->SetIsok(retok);
	obj->SetEstr(estr,estr_gbk);
	obj->SetFmap(fmap,fmap_gbk);

	return scope.Close(instance);
}

