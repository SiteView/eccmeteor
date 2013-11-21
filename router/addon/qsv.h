
#include <string>
#include <map>
#include <list>
#include <vector>
using std::string;
using std::vector;
using std::map;

typedef std::map<string,string> StringMap;
typedef std::vector< StringMap >	ForestVector;
typedef std::map< string, StringMap > ForestMap;

bool qt_GetForestData   (ForestVector & fvec, StringMap & inwhat, std::string & estr);
bool qt_GetUnivData     (ForestMap    & fmap, StringMap & inwhat, std::string & estr);
bool qt_SubmitUnivData  (ForestMap    & fmap, StringMap & inwhat, std::string & estr);


std::string testGetMonitorTemplet();
std::string testGetTreeData();
std::string testSubmitGroup();
std::string getSVstr();

