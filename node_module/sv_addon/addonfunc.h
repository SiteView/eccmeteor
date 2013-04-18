
#ifndef ADDON_FUNC_H
#define ADDON_FUNC_H


#include <string>
#include <map>
#include <list>
#include <vector>
#include "addonapi.h"

namespace addon{

	void displayForestMap(ForestMap & fmap,int max=99999999);
	void SetSvdbAddr();
	std::string GetSvdbAddr();

	bool GetUnivData(ForestMap & fmap_gbk,  ForestMap & fmap,  const NodeData & inwhat, std::string & estr_gbk, string & estr);
	bool SubmitUnivData(ForestMap & fmap_gbk, ForestMap & fmap, ForestMap & in_fmap_gbk, const ForestMap & in_fmap, const NodeData & inwhat, std::string & estr_gbk, std::string & estr);
	bool GetForestData(std::map<std::string,std::string> &forest_keys, ForestMap & fmap_gbk,  ForestMap & fmap,  const NodeData & inwhat, std::string & estr_gbk, string & estr);
}

#endif