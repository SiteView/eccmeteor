#include "qsvapi.h"
#include <addonapi.h>

using std::string;

string GetValue(const ForestMap & fmap, string section, string key, bool & isok )
{
	ForestMap::const_iterator mit= fmap.find(section);
	if(mit != fmap.end())
	{
		NodeData::const_iterator nit= mit->second.find(key);
		string value;
		if(nit!=mit->second.end() && !(value=nit->second).empty())
			return value;
	}
	isok = false;
	return "";
}

string GetValue(const StringMap & smap, string section, string key, bool & isok )
{
	NodeData::const_iterator nit= smap.find(key);
	if(nit!=smap.end())
		return nit->second;

	isok = false;
	return "";
}

std::string getMonitorTemplet()
{
	ForestMap fmap;
	StringMap ndata;
	string estr;

	ndata.insert(std::make_pair("dowhat","GetMonitorTemplet"));
	ndata.insert(std::make_pair("id","5"));
	if(!qt_GetUnivData(fmap,ndata,estr))
		return estr;
	else
	{
		string ret;
		bool isok;
		ret = "GetMonitorTemplet, sv_id= " + GetValue(fmap, "property","sv_id",isok);
		ret += "\nsv_description= " + GetValue(fmap, "property","sv_description",isok);
		ret += "\nsv_dll= " + GetValue(fmap, "property","sv_dll",isok);
		return ret;
	}
}

std::string GetTreeData()
{
	ForestVector vmap;
	StringMap ndata;
	string estr;

	ndata.insert(std::make_pair("dowhat","GetTreeData"));
	ndata.insert(std::make_pair("parentid","1"));
	ndata.insert(std::make_pair("onlySon", "true"));
	if(!qt_GetForestData(vmap,ndata,estr))
		return estr;
	else
	{
		string ret;
		bool isok;
		for(ForestVector::iterator fit=vmap.begin(); fit!=vmap.end();  ++fit)
		{
			ret = "GetTreeData, sv_id= " + GetValue(*fit, "property","sv_id",isok);
			ret += "\nsv_name= " + GetValue(*fit, "property","sv_name",isok);
			ret += "\nstatus= " + GetValue(*fit, "property","status",isok);
			return ret;
		}
	}
}

std::string SubmitGroup()
{
	ForestMap fmap;
	StringMap ndata;
	string estr;

	StringMap gdata;
	gdata.insert(std::make_pair("sv_name", "android_qt_测试"));
	gdata.insert(std::make_pair("sv_description", "android_qt_测试"));
	fmap.insert(std::make_pair("property", gdata));

	ndata.insert(std::make_pair("dowhat","SubmitGroup"));
	ndata.insert(std::make_pair("parentid","1"));
	if(!qt_SubmitUnivData(fmap,ndata,estr))
		return estr;
	else
	{
		string ret;
		bool isok;
		ret = "SubmitGroup, sv_name= " + GetValue(fmap, "property","sv_name",isok);
		return ret;
	}
}

std::string getSVstr()
{
	std::string ret;
	std::string fname("/mnt/sdcard/svapi.ini");
	SetSvdbAddrByFile(fname);
	bool isok = SetSvdbAddrByFile(fname);
	if (!isok)
		ret += "Failed to ";
	ret += "set svdb addr in: " + fname + "\n";
	ret += "svdb addr is:" + GetSvdbAddr() + "\n\n";
	ret += getMonitorTemplet() + "\n\n";
	ret += GetTreeData() + "\n\n";
	ret += SubmitGroup() + "\n\n";
	return ret;
}

