
#ifdef	WIN32
#include "windows.h"
#else
#include <iconv.h>
#endif
#include "addonfunc.h"

using namespace sca_svapi;

#ifdef	WIN32
void UnicodeToUTF8(char* pOut,wchar_t* pText)
{
	char* pchar = (char *)pText;
	pOut[0] = (0xE0 | ((pchar[1] & 0xF0) >> 4));
	pOut[1] = (0x80 | ((pchar[1] & 0x0F) << 2)) + ((pchar[0] & 0xC0) >> 6);
	pOut[2] = (0x80 | (pchar[0] & 0x3F));
}


string GB2312ToUTF8(string intext)
{
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
#else
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
#endif

void SetForestMapToUTF8(ForestMap & outfmap, const ForestMap & infmap)
{
	for(ForestMap::const_iterator fit=infmap.begin(); fit!=infmap.end();  ++fit)
		for(NodeData::const_iterator nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			sca_svapi::PutReturnForestMap(outfmap,GB2312ToUTF8(fit->first),GB2312ToUTF8(nit->first),GB2312ToUTF8(nit->second));
}

void SetForestMapToGB2312(ForestMap & outfmap, const ForestMap & infmap)
{
	for(ForestMap::const_iterator fit=infmap.begin(); fit!=infmap.end();  ++fit)
		for(NodeData::const_iterator nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
			sca_svapi::PutReturnForestMap(outfmap,UTF8ToGB2312(fit->first),UTF8ToGB2312(nit->first),UTF8ToGB2312(nit->second));
}

void SetStringMapToGB2312(NodeData & outwhat, const NodeData & inwhat)
{
	for(NodeData::const_iterator nit=inwhat.begin(); nit!=inwhat.end(); ++nit)
		sca_svapi::PutValueInNodeData(outwhat,UTF8ToGB2312(nit->first),UTF8ToGB2312(nit->second));
}


namespace addon{

	void displayForestMap(ForestMap & fmap,int max)
	{
		ForestMap::iterator fit;
		NodeData::iterator nit;
		int count(0);
		for(fit=fmap.begin(); fit!=fmap.end();  ++fit)
		{
			if(count>max)
				break;
			printf("-- %s (NO:%d) -- \n",fit->first.c_str(),++count);
			for(nit=fit->second.begin(); nit!=fit->second.end(); ++nit)
				printf("     %s = %s\n",nit->first.c_str(),nit->second.c_str());
		}
	}

	void SetSvdbAddr()
	{
		ForestMap fmap;
		NodeData ndata;
		string estr;

		ndata.insert(std::make_pair("dowhat","SetSvdbAddrByFile"));
		ndata.insert(std::make_pair("filename","svapi.ini"));
		sca_svapi::ScaGetUnivData(fmap,ndata,estr);
		if(!estr.empty())
			cout<<"error string: "<<estr.c_str();

		cout<<" ++++  set svdb addr to: "<<GetSvdbAddr().c_str()<<"  ++++ "<<endl;
	}

	std::string GetSvdbAddr()
	{
		string ret;

		ForestMap fmap;
		NodeData ndata;
		string estr;

		ndata.insert(std::make_pair("dowhat","GetSvdbAddr"));
		if(!sca_svapi::ScaGetUnivData(fmap,ndata,estr))
			ret= estr;
		else
			ret= sca_svapi::GetValueInForestMap(fmap, "return","return", estr );

		return ret;
	}


	bool GetUnivData(ForestMap & fmap_gbk,  ForestMap & fmap, const NodeData & inwhat, std::string & estr_gbk, std::string & estr)
	{
		NodeData tinwhat;
		bool ret;
		try{
			SetStringMapToGB2312(tinwhat,inwhat);
			ret= sca_svapi::ScaGetUnivData(fmap_gbk, tinwhat, estr_gbk);
			SetForestMapToUTF8(fmap,fmap_gbk);
			estr= GB2312ToUTF8(estr_gbk);
		}
		catch(...)
		{
			estr+="  Exception in c++ GetUnivData() ;   ";
			estr_gbk+="  Exception in c++ GetUnivData() ;   ";
		}
		return ret;
	}


	bool SubmitUnivData(ForestMap & fmap_gbk, ForestMap & fmap, ForestMap & in_fmap_gbk,const ForestMap & in_fmap, const NodeData & inwhat, std::string & estr_gbk, std::string & estr)
	{
		NodeData tinwhat;
		bool ret;
		try{
			SetForestMapToGB2312(in_fmap_gbk,in_fmap);

			SetStringMapToGB2312(tinwhat,inwhat);
			SetForestMapToGB2312(fmap_gbk,in_fmap);
			ret= sca_svapi::ScaSubmitUnivData(fmap_gbk,  tinwhat, estr_gbk);
			fmap.clear();
			SetForestMapToUTF8(fmap,fmap_gbk);
			estr= GB2312ToUTF8(estr_gbk);
		}
		catch(...)
		{
			estr_gbk+="  Exception in c++ SubmitUnivData() ;   ";
			estr+="  Exception in c++ SubmitUnivData() ;   ";
		}
		return ret;
	}


	bool GetForestData(std::map<std::string,std::string> &forest_keys, ForestMap & fmap_gbk,  ForestMap & fmap, const NodeData & inwhat, std::string & estr_gbk, std::string & estr)
	{
		ForestList flist;
		NodeData tinwhat;
		bool ret;
		try{
			SetStringMapToGB2312(tinwhat,inwhat);
			ret= sca_svapi::ScaGetForestData(flist, tinwhat, estr_gbk);
			estr= GB2312ToUTF8(estr_gbk);
			int index(0);
			string oldindex= "";
			for(ForestList::iterator fit=flist.begin(); fit!=flist.end(); ++fit)
			{
				++index;
				char sindex[32]={0};
				sprintf(sindex,"m%d",index);
				fmap_gbk.insert(std::make_pair(sindex, *fit));
				forest_keys.insert(std::make_pair(oldindex, sindex));
				oldindex= sindex;
			}
			SetForestMapToUTF8(fmap,fmap_gbk);
		}
		catch(...)
		{
			estr_gbk+="  Exception in c++ GetForestData() ;   ";
			estr+="  Exception in c++ GetForestData() ;   ";
		}
		return ret;
	}


}
