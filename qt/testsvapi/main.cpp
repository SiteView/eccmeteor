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
    cout<<"��ȡsvdb�а����Ĺ��ʻ������У�"<<endl;
	PAIRLIST retlist1;
	if( !GetAllResourceInfo(retlist1) )
	{
		cout<<"���� svdb ʧ��"<<endl;
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
		cout<<"\n\n\n���� Enter ��������һ�Σ����� q �� Enter �˳�"<<endl;
		getline(cin,temp);
	}
	return 0;	
}
