
#include "iconv.h"
#include "qsvapi.h"
#include <addonapi.h>


using namespace sca_svapi;

void outputForestMap(ForestMap & fmap)
{
	ForestMap::iterator fit;
	NodeData::iterator nit;
	int count(0);
	for(fit=fmap.begin(); fit!=fmap.end();  ++fit)
	{
		cout<<"\nnode:  "<<fit->first.c_str()<<", NO: "<<++count<<endl;
		for(nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			cout<<nit->first.c_str()<<" = "<<nit->second.c_str()<<endl;
	}
	cout<<"\nnode total: "<<fmap.size()<<"\n\n\n\n"<<endl;
}

int code_convert(char *from_charset, char *to_charset, char *inbuf, int inlen,char *outbuf, int outlen)
{
	iconv_t cd;
	int rc;
	char **pin = &inbuf;
	char **pout = &outbuf;

	cd = iconv_open(to_charset, from_charset);
	if (cd == 0)
		return -1;
	memset(outbuf, 0, outlen);
	if (iconv(cd, pin, (size_t* __restrict__)(&inlen), pout, (size_t* __restrict__)(&outlen)) == -1)
		return -1;
	iconv_close(cd);
	return 0;
}

string str_code(string intext, char *from_charset, char *to_charset)
{
	if(intext.empty())
		return "";

	int pLen= intext.size();
	int nLength = pLen* 3;
	// GB2312ToUTF8 exactly should be:  *3/2 +1
	// UTF8ToGB2312 exactly should be: +1

	char *pText=new char[nLength];
	if(pText==NULL)
		return "";
	memset(pText,0,nLength);
	strcpy(pText,intext.c_str());

	char* rst = new char[nLength];
	if(rst==NULL)
	{
		delete []pText;
		return "";
	}
	memset(rst,0,nLength);

	code_convert(from_charset, to_charset, pText, nLength, rst, nLength);

	string str = rst;
	delete []rst;
	delete []pText;

	return str;
}

string GB2312ToUTF8(string intext)
{
	return str_code(intext, "gb2312", "utf-8");
}

string UTF8ToGB2312(string intext)
{
	return str_code(intext, "utf-8", "gb2312");
}

void SetForestMapToUTF8(ForestMap & outfmap, ForestMap & infmap)
{
	for(ForestMap::iterator fit=infmap.begin(); fit!=infmap.end();  ++fit)
		for(NodeData::iterator nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			PutReturnForestMap(outfmap,GB2312ToUTF8(fit->first),GB2312ToUTF8(nit->first),GB2312ToUTF8(nit->second));
}

void SetForestMapToGB2312(ForestMap & outfmap, ForestMap & infmap)
{
	for(ForestMap::iterator fit=infmap.begin(); fit!=infmap.end();  ++fit)
		for(NodeData::iterator nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			PutReturnForestMap(outfmap,UTF8ToGB2312(fit->first),UTF8ToGB2312(nit->first),UTF8ToGB2312(nit->second));
}

void SetStringMapToGB2312(StringMap & outwhat, StringMap & inwhat)
{
	for(NodeData::iterator nit=inwhat.begin(); nit!=inwhat.end(); ++nit)
		PutValueInNodeData(outwhat,UTF8ToGB2312(nit->first),UTF8ToGB2312(nit->second));
}

bool qt_GetUnivData(ForestMap & fmap,  StringMap & inwhat, std::string & estr)
{
	ForestMap tfmap;
	StringMap tinwhat;
	string str;
	bool ret;
	try{
		SetStringMapToGB2312(tinwhat,inwhat);
		ret= sca_svapi::ScaGetUnivData(tfmap,  tinwhat, str);
		SetForestMapToUTF8(fmap,tfmap);
		estr= GB2312ToUTF8(str);
	}
	catch(...)
	{
		str+="  Exception in c++ qt_GetUnivData() ;   ";
	}
	return ret;
}

bool qt_SubmitUnivData(ForestMap    & fmap, StringMap & inwhat, std::string & estr)
{
	ForestMap tfmap;
	StringMap tinwhat;
	string str;
	bool ret;
	try{
		SetStringMapToGB2312(tinwhat,inwhat);
		SetForestMapToGB2312(tfmap,fmap);
		ret= sca_svapi::ScaSubmitUnivData(tfmap,  tinwhat, str);
		fmap.clear();
		SetForestMapToUTF8(fmap,tfmap);
		estr= GB2312ToUTF8(str);
	}
	catch(...)
	{
		str+="  Exception in c++ qt_SubmitUnivData() ;   ";
	}
	return ret;
}


bool qt_GetForestData(ForestVector & fvec, StringMap & inwhat, std::string & estr)
{
	ForestList flist;
	StringMap tinwhat;
	string str;
	bool ret;
	try{
		SetStringMapToGB2312(tinwhat,inwhat);
		ret= sca_svapi::ScaGetForestData(flist,  tinwhat, str);
		for(ForestList::iterator fit=flist.begin(); fit!=flist.end(); ++fit)
		{
			NodeData ndata;
			for(NodeData::iterator nit=fit->begin(); nit!=fit->end(); ++nit)
				PutValueInNodeData(ndata,GB2312ToUTF8(nit->first),GB2312ToUTF8(nit->second));
			fvec.push_back(ndata);
		}
		estr= GB2312ToUTF8(str);
	}
	catch(...)
	{
		str+="  Exception in c++ qt_GetForestData() ;   ";
	}
	return ret;
}

