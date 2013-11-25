
#include <string>
#include <map>
#include <list>
#include <vector>
using std::string;
using std::vector;
using std::map;

typedef std::map<string,string> StrMap;
typedef std::vector< StrMap >	ForestVector;
typedef std::map< string, StrMap > ForestMap;

bool qt_GetForestData   (ForestVector & fvec, StrMap & inwhat, std::string & estr);
bool qt_GetUnivData     (ForestMap    & fmap, StrMap & inwhat, std::string & estr);
bool qt_SubmitUnivData  (ForestMap    & fmap, StrMap & inwhat, std::string & estr);


string GB2312ToUTF8(string intext);
string UTF8ToGB2312(string intext);

string GetValue(const ForestMap & fmap, string section, string key, bool & isok );
string GetValue(const StrMap & smap, string section, string key, bool & isok );

std::string testGetMonitorTemplet();
std::string testGetTreeData();
std::string testSubmitGroup();
std::string getSVstr();

