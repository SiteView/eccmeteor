#ifndef V8_MAP_IN_MAP_H
#define V8_MAP_IN_MAP_H

#include <node.h>

#include <string>
#include "addon.h"

class V8MapInMap : public node::ObjectWrap {
public:
	static void Init();
	static v8::Local<v8::Object> NewInstance();
	static v8::Handle<v8::Value> NewInstance(const v8::Arguments& args);

	bool Isok() const { return isok; }
	ForestMap Fmap() const { return fmap; }
	std::string Estr() const { return estr; }	

	void SetIsok(const bool is_ok){ isok= is_ok; }
	void SetFmap(const ForestMap f_map,const ForestMap f_map_gbk){ fmap= f_map; fmap_gbk= f_map_gbk;}
	void SetEstr(const std::string e_str,const std::string e_str_gbk){ estr= e_str; estr_gbk= e_str_gbk;}
	void SetFroestKeys(const std::map<std::string,std::string> f_keys){ forest_keys= f_keys; }

private:
	V8MapInMap();
	~V8MapInMap();

	static v8::Persistent<v8::Function> constructor;
	static v8::Handle<v8::Value> New(const v8::Arguments& args);
	static int GetDebugArgument(const v8::Arguments& args);

	static v8::Handle<v8::Value> GetIsok(const v8::Arguments& args);
	static v8::Handle<v8::Value> GetFmap(const v8::Arguments& args);
	static v8::Handle<v8::Value> GetEstr(const v8::Arguments& args);

	static v8::Handle<v8::Value> FindFmapNextKey(const v8::Arguments& args);

	bool isok;	//default true
	ForestMap fmap;
	ForestMap fmap_gbk;
	std::map<std::string,std::string> forest_keys;
	std::string estr;
	std::string estr_gbk;

};

#endif