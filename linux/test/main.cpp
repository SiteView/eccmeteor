#ifdef WIN32
#undef UNICODE
#endif

#include <string>
#include <addon.h>
#include <svdbapi.h>
#include <svdbtype.h>
using namespace std;

void test1(string temp)
{
	cout << "DeleteGroup:" << DeleteGroup("1.34") << endl;
}

void test2(string temp)
{
	cout << "language in svdb: " << endl;
	PAIRLIST retlist1;
	if (!GetAllResourceInfo(retlist1))
	{
		cout << "failed to connect svdb" << endl;
		return;
	}
	for (PAIRLIST::iterator it = retlist1.begin(); it != retlist1.end(); it++)
	{
		cout << it->name << endl;
	}
}

void test3(string temp)
{
	string ret = GetIniFileString("configxml", "value", "", "nnmscanconfig.ini");
	bool isok = ret!="";
	cout << "GetIniFileString:" << isok << endl;
}

int main(int argc, char* argv[])
{
	string temp;
	SetSvdbAddrByFile("svapi.ini");
	cout<<"!! svdb addr: "<<GetSvdbAddr()<<" !!\n\n"<<endl;
	while (temp != "q")
	{
		clock_t time1 = clock();
		try
		{

			test2(temp);
			test3(temp);
			//	Sleep(5000);

		} catch (...)
		{
			cout << "exception" << endl;
		}
		DisplayDebugTime("", time1);
		cout << "\n\n\n press: \"Enter\" to run again, press: \"q + Enter\" to quit" << endl;
		getline(cin, temp);
	}
	return 0;
}
