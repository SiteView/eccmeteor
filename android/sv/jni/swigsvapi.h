
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

struct myString
{
  std::string str;
};

struct myBool
{
  bool b;
  myBool()
  {
	  b= true;
  }
};

bool swig_FNextKey(ForestMap & fmap,myString & key,myBool & first);
bool swig_SNextKey(StringMap & inwhat,myString & key, myBool & first);
bool swig_GetForestData   (ForestVector & fvec, StringMap & inwhat, myString & estr);
bool swig_GetUnivData     (ForestMap    & fmap, StringMap & inwhat, myString & estr);
bool swig_SubmitUnivData  (ForestMap    & fmap, StringMap & inwhat, myString & estr);



