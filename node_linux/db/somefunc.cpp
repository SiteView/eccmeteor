#include "somefunc.h"
#include <cc++/file.h>

//在 StrMap 中查找值
string GetValueInStrMap(const StrMap & inwhat, string key)
{
	try
	{
		StrMap::const_iterator nit = inwhat.find(key);
		if (nit != inwhat.end())
			return nit->second;
	} catch (...)
	{
		return "";
	}
	return "";
}

//设置 StrMap ,会覆盖已有的 key == value
void PutValueInStrMap(StrMap & inwhat, string key, string value)
{
	StrMap::iterator nit = inwhat.find(key);
	if (nit == inwhat.end())
		inwhat.insert(std::make_pair(key, value));
	else
		nit->second = value;
}

//在 MapStrMap 中查找值
string GetValueInMapStrMap(const MapStrMap & fmap, string section, string key)
{
	MapStrMap::const_iterator mit = fmap.find(section);
	if (mit != fmap.end())
	{
		StrMap::const_iterator nit = mit->second.find(key);
		if (nit != mit->second.end())
			return nit->second;
	}
	return "";
}

//设置返回的 MapStrMap, 会覆盖已有的 key == value
void PutReturnMapStrMap(MapStrMap & fmap, string section, string key, string value)
{
	MapStrMap::iterator mit = fmap.find(section);
	if (mit == fmap.end())
	{
		StrMap ndata;
		fmap.insert(std::make_pair(section, ndata));
		mit = fmap.find(section);
	}
	StrMap::iterator nit = mit->second.find(key);
	if (nit == mit->second.end())
		mit->second.insert(std::make_pair(key, value));
	else
		nit->second = value;
}

//返回 MapStrMap 中的 StrMap
StrMap & GetStrMap(MapStrMap & fmap, string section)
{
	MapStrMap::iterator mit = fmap.find(section);
	if (mit == fmap.end())
	{
		StrMap ndata;
		fmap.insert(std::make_pair(section, ndata));
		mit = fmap.find(section);
	}
	return mit->second;
}

bool SVCopyFile(string file1, string file2)
{
#ifdef WIN32
	return CopyFile(file1.c_str(),file2.c_str(),false);
#else
	int hd1 = ::open(file1.c_str(), O_RDWR, S_IRUSR | S_IWUSR);
	if (hd1 < 0)
	{
		printf("Open file failed   %s\n", file1.c_str());
		return false;
	}
	int hd2 = ::open(file2.c_str(), O_CREAT | O_RDWR | O_TRUNC, S_IRUSR | S_IWUSR);
	if (hd2 < 0)
	{
		printf("Create file failed   %s\n", file2.c_str());
		return false;
	}
	int size;
	char buf[210] = { 0 };
	while ((size = read(hd1, buf, 200)) != 0)
	{
		if (write(hd2, buf, size) != size)
		{
			printf("SVCopyFile error!\n");
			return false;
		}
	}

	close(hd1);
	close(hd2);
	return true;
#endif
}

bool CheckFileSize(string fname, int flen)
{
#ifdef WIN32
	return true;
#else
	int hd = ::open(fname.c_str(), O_RDWR, S_IRUSR | S_IWUSR);
	if (hd < 0)
	{
		printf("Failed to open file: %s ,in CheckFileSize.\n", fname.c_str());
		return false;
	}
	int fsize = lseek(hd, 0l, SEEK_END);
	if (-1 == fsize)
	{
		printf("Failed to get size of file: %s ,in CheckFileSize.\n", fname.c_str());
		close(hd);
		return false;
	}
	if (fsize >= flen)
	{
		close(hd);
		return true;
	}
	int pos = lseek(hd, flen - 1, SEEK_SET);
	if (-1 == pos)
	{
		printf("Failed to movie pointor of file: %s ,in CheckFileSize.\n", fname.c_str());
		close(hd);
		return false;
	}
	char hdata[1] = { 0 };
	int io = ::write(hd, hdata, 1l);
	if (1 != io)
	{
		printf("Failed to writing of file: %s ,in CheckFileSize.\n", fname.c_str());
		close(hd);
		return false;
	}
	close(hd);
	return true;
#endif
}

bool SetFileSize(int hd, int flen)
{
#ifdef WIN32
	return true;
#else
	if (hd < 0)
	{
		printf("Invalid file handle,in setFileSize.\n");
		return false;
	}
	int fsize = lseek(hd, 0l, SEEK_END);
	if (-1 == fsize)
	{
		printf("Failed to get file size,in setFileSize.\n");
		return false;
	}
	if (fsize >= flen)
	{
		return true;
	}
	int pos = lseek(hd, flen - 1, SEEK_SET);
	if (-1 == pos)
	{
		printf("Failed to movie pointor ,in setFileSize.\n");
		return false;
	}
	char hdata[1] = { 0 };
	int io = ::write(hd, hdata, 1l);
	if (1 != io)
	{
		printf("Failed to write,in setFileSize.\n");
		return false;
	}
	return true;
#endif
}

