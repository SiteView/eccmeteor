
#include "windows.h"
#include "qsv.h"
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

void UnicodeToUTF8(char* pOut,wchar_t* pText)
{
	char* pchar = (char *)pText;
	pOut[0] = (0xE0 | ((pchar[1] & 0xF0) >> 4));
	pOut[1] = (0x80 | ((pchar[1] & 0x0F) << 2)) + ((pchar[0] & 0xC0) >> 6);
	pOut[2] = (0x80 | (pchar[0] & 0x3F));
}


string GB2312ToUTF8(string intext)
{
//	return intext;

	if(intext.empty())
		return "";

	int pLen= intext.size();
	int nLength = pLen* 3;  // exactly should be:  *3/2 +1

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

	char buf[4]={0};
	int i=0,j=0;
	for(; i<pLen; )
	{
		if( *(pText + i) >= 0)
			rst[j++] = pText[i++];
		else
		{
			wchar_t pbuffer;
			MultiByteToWideChar(CP_ACP,MB_PRECOMPOSED,pText+i,2,&pbuffer,1); //Gb2312ToUnicode
			UnicodeToUTF8(buf,&pbuffer);
			memmove(rst+j,buf,3);

			j += 3;
			i += 2;
		}
	}
	rst[j] = '\0';

	string str = rst;            
	delete []rst;  
	delete []pText; 

	return str;
}


void UTF8ToUnicode(wchar_t* pOut, char* pText)
{
	char* uchar = (char *)pOut;
	uchar[1] = ((pText[0] & 0x0F) << 4) + ((pText[1] >> 2) & 0x0F);
	uchar[0] = ((pText[1] & 0x03) << 6) + (pText[2] & 0x3F);
}


string UTF8ToGB2312(string intext)
{
//	return intext;

	if(intext.empty())
		return "";

	int pLen= intext.size();
	int nLength = pLen* 3; // exactly should be:  +1

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

	char buf[4]={0};
	int i=0,j=0;
	for(; i<pLen; )
	{
		if( *(pText + i) >= 0)
			rst[j++] = pText[i++];
		else
		{
			wchar_t pbuffer;
			UTF8ToUnicode(&pbuffer,pText+i);
			WideCharToMultiByte(CP_ACP,WC_COMPOSITECHECK,&pbuffer,1,buf,sizeof(WCHAR),NULL,NULL);//UnicodeToGb2312
			memmove(rst+j,buf,2);

			i += 3;
			j += 2;
		}
	}
	rst[j] = '\0';

	string str = rst;            
	delete []rst;  
	delete []pText; 

	return str;
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

void SetStringMapToGB2312(StrMap & outwhat, StrMap & inwhat)
{
	for(NodeData::iterator nit=inwhat.begin(); nit!=inwhat.end(); ++nit)
		PutValueInNodeData(outwhat,UTF8ToGB2312(nit->first),UTF8ToGB2312(nit->second));
}

bool qt_GetUnivData(ForestMap & fmap,  StrMap & inwhat, std::string & estr)
{
	ForestMap tfmap;
	StrMap tinwhat;
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

bool qt_SubmitUnivData(ForestMap    & fmap, StrMap & inwhat, std::string & estr)
{
	ForestMap tfmap;
	StrMap tinwhat;
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


bool qt_GetForestData(ForestVector & fvec, StrMap & inwhat, std::string & estr)
{
	ForestList flist;
	StrMap tinwhat;
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

