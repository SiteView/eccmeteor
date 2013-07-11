#ifdef WIN32
#undef UNICODE
#endif

#include <string>
#include <addon.h>
using namespace std;

void test1(string temp)
{
	cout<<"DeleteGroup:"<<DeleteGroup("1.34")<<endl;
}

void test2(string temp)
{
    cout<<"读取svdb中包含的国际化语言有："<<endl;
	PAIRLIST retlist1;
	if( !GetAllResourceInfo(retlist1) )
	{
		cout<<"连接 svdb 失败"<<endl;
		return;
	}
	for(PAIRLIST::iterator it =retlist1.begin();it!=retlist1.end();it++)
	{
		cout<<it->name<<endl;
	}
}

int main(int argc, char* argv[])
{
	string temp;
	SetSvdbAddrByFile("svapi.ini");
	while( temp!="q" )
	{

		try{
			test1(temp);
		}
		catch(...)
		{
			cout<<"exception"<<endl;
		}
		cout<<"\n\n\n按下 Enter 键重运行一次，按下 q ＋ Enter 退出"<<endl;
		getline(cin,temp);
	}
	return 0;	
}
