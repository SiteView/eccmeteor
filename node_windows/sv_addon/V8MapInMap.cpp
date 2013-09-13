
#include <node.h>
#include <v8.h>
using namespace v8;

#include "V8MapInMap.h"
#include "addonfunc.h"

V8MapInMap::V8MapInMap() {};
V8MapInMap::~V8MapInMap() {};
Persistent<Function> V8MapInMap::constructor;

void V8MapInMap::Init() {
	// Prepare constructor template
	Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
	tpl->SetClassName(String::NewSymbol("MMap"));
	tpl->InstanceTemplate()->SetInternalFieldCount(4);
	
	// Prototype
	tpl->PrototypeTemplate()->Set(String::NewSymbol("isok"),FunctionTemplate::New(GetIsok)->GetFunction());
	tpl->PrototypeTemplate()->Set(String::NewSymbol("fmap"),FunctionTemplate::New(GetFmap)->GetFunction());
	tpl->PrototypeTemplate()->Set(String::NewSymbol("estr"),FunctionTemplate::New(GetEstr)->GetFunction());
	tpl->PrototypeTemplate()->Set(String::NewSymbol("nextkey"),FunctionTemplate::New(FindFmapNextKey)->GetFunction());

	constructor = Persistent<Function>::New(tpl->GetFunction());
}

Handle<Value> V8MapInMap::New(const Arguments& args) {
	HandleScope scope;

	V8MapInMap* obj = new V8MapInMap();
	if(args.Length()==0)
	{
		obj->isok= true;
	}
	else if(args.Length()==1)
	{
		obj->isok = args[0]->IsUndefined() ? true : args[0]->BooleanValue();
	}
	else
	{
		obj->isok = args[0]->IsUndefined() ? true : args[0]->BooleanValue();
	}
	//printf("New(const Arguments& args), isok: %d\n", obj->isok);
	obj->Wrap(args.This());
	return args.This();
}

Local<Object> V8MapInMap::NewInstance() {
	Local<Object> instance = constructor->NewInstance();
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(instance);
	obj->isok= true;
	//puts("NewInstance()");
	return instance;
}

Handle<Value> V8MapInMap::NewInstance(const Arguments& args) {
	HandleScope scope;
	int len= args.Length();
	//printf("NewInstance(const Arguments& args), len : %d\n",len);

	if(len==0)
	{
		Local<Object> instance = constructor->NewInstance();
		V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(instance);
		obj->isok= true;
		return scope.Close(instance);
	}
	else if(len==1)
	{
		const unsigned argc = 1;
		Handle<Value> argv[argc] = { args[0] };
		Local<Object> instance = constructor->NewInstance(argc, argv);
		return scope.Close(instance);
	}
	else
	{
		const unsigned argc = 2;
		Handle<Value> argv[argc] = { args[0],args[1] };
		Local<Object> instance = constructor->NewInstance(argc, argv);
		return scope.Close(instance);
	}
}

int V8MapInMap::GetDebugArgument(const v8::Arguments& args)
{
	int debug= 0;
	if(args.Length()>0 && args[0]->IsInt32())
		debug= args[0]->Int32Value();
	return debug;
}

Handle<Value> V8MapInMap::GetIsok(const Arguments& args) {
	HandleScope scope;
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(args.This());
	int debug= GetDebugArgument(args);
	if(debug>0)
	{		
		if(obj->isok)
			printf("V8MapInMap::GetIsok, true\n");
		else
			printf("V8MapInMap::GetIsok, false\n");
	}
	return scope.Close(Boolean::New(obj->isok));
}

Handle<Value> V8MapInMap::GetEstr(const Arguments& args) {
	HandleScope scope;
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(args.This());
	int debug= GetDebugArgument(args);
	if(debug>0)
		printf("V8MapInMap::GetEstr, \"%s\"\n",obj->estr_gbk.c_str());
	return scope.Close(String::New(obj->estr.c_str()));
}

Handle<Value> V8MapInMap::GetFmap(const Arguments& args) {
	HandleScope scope;
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(args.This());
	Handle<Object> rmap= Object::New();
	int debug= GetDebugArgument(args);

	ForestMap::iterator fit;
	NodeData::iterator nit;
	int count=0;
	if(debug>0)
	{
		if(obj->isok)
			puts("-- V8MapInMap::GetFmap --");
		else
			printf("V8MapInMap::GetFmap, isok==false \n");
	}
	if(!obj->isok)
		return scope.Close(String::New(obj->estr.c_str()));

	for(fit=obj->fmap.begin(); fit!=obj->fmap.end();  ++fit)
	{
		Handle<Object> ndata= Object::New();
		for(nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			ndata->Set(String::New(nit->first.c_str()),String::New(nit->second.c_str()));
		rmap->Set(String::New(fit->first.c_str()),ndata);
	}
	if(debug>0)
	{
		if(obj->forest_keys.empty())
			addon::displayForestMap(obj->fmap_gbk);
		else
		{
			std::string fkey= "";
			int count(0);
			do{
				std::map<std::string,std::string>::iterator it= obj->forest_keys.find(fkey);
				if(it==obj->forest_keys.end())
					break;
				fkey= it->second;
				ForestMap::iterator fit= obj->fmap_gbk.find(fkey);
				if(fit!=obj->fmap_gbk.end())
				{
					printf("-- %s (NO:%d) -- \n",fit->first.c_str(),++count);
					for(NodeData::iterator nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
						printf("     %s = %s\n",nit->first.c_str(),nit->second.c_str());
				}
			}while(true);
		}
	}
	if(debug>0)
		puts("-- V8MapInMap::GetFmap end --");
	return scope.Close(rmap);
}


Handle<Value> V8MapInMap::FindFmapNextKey(const Arguments& args) {
	Handle<Boolean> bad= Boolean::New(false);

	HandleScope scope;
	if(args.Length()<1)
		return scope.Close(bad);

	bool first= false;
	char fkey[512]={0};
	if(args[0]->IsBoolean())
		first= args[0]->BooleanValue();
	else if(args[0]->IsString())
		args[0]->ToString()->WriteAscii(fkey,0,510);

	int debug= 0;
	if(args.Length()>1 && args[1]->IsInt32())
		debug= args[1]->Int32Value();
	if(debug>0)
	{
		if(first)
			printf("V8MapInMap::NextKey, argument first: true,\n");
		else
			printf("V8MapInMap::NextKey, argument key: %s,\n",fkey);
	}
	V8MapInMap* obj = node::ObjectWrap::Unwrap<V8MapInMap>(args.This());
	if(obj->fmap.empty())
	{
		if(debug>0)
			puts("V8MapInMap::NextKey, fmap is empty. Return false !");
		return scope.Close(bad);
	}

	std::map<std::string,std::string>::iterator it= obj->forest_keys.find(fkey);
	if(it==obj->forest_keys.end())
	{
		if(debug>0)
			puts("V8MapInMap::NextKey, reach end. Return false !");
		return scope.Close(bad);
	}
	else
	{
		std::string nkey= it->second;
		if(debug>0)
			printf("V8MapInMap::NextKey: %s \n",nkey.c_str());
		return scope.Close(String::New(nkey.c_str()));
	}
}

