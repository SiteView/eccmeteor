#include "PagePool.h"

PagePool::PagePool(void)
{
	m_LastPage=NULL;
	m_Head.m_PageSize=0;
	m_Head.m_PageCount=0;
	m_Head.m_TotalCount=0;
	m_hd=NULL;

}
PagePool::PagePool(int pagesize,int pagecount)
{
	m_Head.m_PageSize=pagesize;
	m_Head.m_TotalCount=pagecount;
	m_LastPage=NULL;
	m_hd=NULL;
}

PagePool::~PagePool(void)
{
	{
		MutexLock lock(m_Mutex);
		MutexLock ilock(m_IOMutex);

		for(int i=0;i<m_PagePool.size();i++)
		{
			Page *pt=m_PagePool[i];
			if(pt!=NULL)
				delete pt;
		}

		//	if(m_hd)
		//		::CloseHandle(m_hd);

		for(int n=0;n<m_fhd.size();n++)
		{
			SubPool *psp=m_fhd[n];
			if(psp!=NULL)
				delete psp;
		}
	}


}

Page *PagePool::GetFreeEx(void)
{
	ost::MutexLock lock(m_Mutex);

	Page *page=GetFree();
	if(page!=NULL)
		return page;

	if(!AddNewPagesEx(1000))
		return NULL;
	return GetFree();

}

Page *PagePool::GetFree(void){

	ost::MutexLock lock(m_Mutex);
	if(m_FreePageList.size()>0)
	{
		Page *pt=m_FreePageList.front();
		m_FreePageList.pop_front();
	//	pt->swapin();
		pt->swapinex();
		if(pt->m_isuse)
			return NULL;
		pt->m_isuse=true;
		return pt;
	}
	return NULL;
}
bool PagePool::PutFree(Page *pt)
{
	ost::MutexLock lock(m_Mutex);
	PageHead *pph=pt->GetPageHead();
	if(pph==NULL)
		return false;
	pph->m_unused=1;
	pph->m_flag=0;
	F_SET(pph->m_flag,PAGEUNUSED);
	pph->m_lastrecordpos=-1;
//	pph->m_prerecordpage=-1;
	pph->m_currentdatalen=0;
	pph->m_currentdatapos=0;
	pph->m_nextrecordpage=-1;
	pph->m_prerecordpage=-1;
	pph->m_recordcount=0;

	pt->m_ischange=true;
	pt->m_isuse=false;

	pt->swapoutex(true);
	m_FreePageList.push_back(pt);
	return true;

}

bool PagePool::RemoveFromFreePages(int pos)
{
	ost::MutexLock lock(m_Mutex);
	std::list<Page *>::iterator it;
	for(it=m_FreePageList.begin();it!=m_FreePageList.end();it++)
	{
		if((*it)->m_pos==pos)
			m_FreePageList.erase(it);
		return true;
	}
	return false;

}

Page *PagePool::Get(int pos)
{
	if((pos<0)||(pos>=m_Head.m_TotalCount))
		return NULL;

	ost::MutexLock lock(m_Mutex);
	Page *pt=m_PagePool[pos];
	if(pt->m_isuse)
		return NULL;
	pt->m_isuse=true;
	if(pt->m_rawdata==NULL)
		pt->swapinex();
	//	pt->swapin();
	PageHead *phead = pt->GetPageHead();
	if(phead==NULL)
		return false;
	if(F_ISSET(phead->m_flag,PAGEUNUSED))
		RemoveFromFreePages(pos);
	return pt;

}

Page *PagePool::Get(int pos,bool readonly)
{
	if(!readonly)
		return Get(pos);
	if((pos<0)||(pos>=m_Head.m_TotalCount))
		return NULL;
	Page *pt=m_PagePool[pos];
	return pt;
}

bool PagePool::FlushBuffer()
{
	if(!m_hd)
		return false;
#ifdef WIN32
	return ::FlushFileBuffers(m_hd);
#else
	fsync(m_hd);
	return true;
#endif
}

bool PagePool::Put(Page *pt,bool isch,bool isdel)
{
	if(pt==NULL)
		return false;

	ost::MutexLock lock(m_Mutex);
	pt->m_isuse=false;
	if(!isch)
	{
		if(isdel)
		{
			if(pt->m_data!=NULL)
			{
				delete [] pt->m_rawdata;
				pt->m_data=NULL;
				pt->m_rawdata=NULL;
			}
		}
		return true;	
	}

	PageHead *phead = pt->GetPageHead();
	if(phead == NULL)
	{
		puts("put phead is NULL");
		return false;
	}

	pt->m_ischange=true;
	pt->m_isuse=false;
	phead->m_unused=0;
	F_CLR(phead->m_flag,PAGEUNUSED);
	return pt->swapoutex(isdel);
}
void PagePool::InitPool()
{
	if(m_Head.m_PageCount<=0)
		return;
	m_PagePool.resize(m_Head.m_PageCount);
	for(int i=0;i<m_Head.m_PageCount;i++)
		m_PagePool[i]=NULL;
}
bool PagePool::InitPoolEx()
{
	if(m_Head.m_TotalCount<=0)
		return false;
	m_PagePool.resize(m_Head.m_TotalCount);
	for(int i=0;i<m_Head.m_TotalCount;i++)
		m_PagePool[i]=NULL;
	return true;
}

bool PagePool::LoadPage(const char *filepath)
{
	ost::MutexLock lock(m_Mutex);

#ifdef WIN32
	DWORD dwcd=OPEN_EXISTING;
	HANDLE hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
	if(hd == INVALID_HANDLE_VALUE)
	{
		printf("Open file failed errorid:%d\n",::GetLastError());
		return false;
	}

	DWORD rlen=0;

	if(!::ReadFile(hd,&m_Head,sizeof(struct PagePoolHead),&rlen,NULL))
	{
		printf("Read head failed errorid:%d\n",::GetLastError());
		return false;
	}
#else
	int hd = ::open(filepath, O_RDWR, S_IRUSR | S_IWUSR);
	if(hd < 0)
	{
		printf("Open file failed \n");
		return false;
	}

	int io = ::read(hd,&m_Head,sizeof(struct PagePoolHead));
	if((size_t) io != sizeof(struct PagePoolHead))
	{
		printf("Read head failed.\n");
		return false;
	}
#endif

	if(m_Head.m_version!=1)
	{
		puts("file version error");
		return false;
	}
	if((m_Head.m_PageCount<=0)||(m_Head.m_PageSize<MINPAGESIZE))
	{
		puts("file data error");
		return false;

	}


	InitPool();
	char *buf = new char[m_Head.m_PageSize];

	memset(buf,0,m_Head.m_PageSize);

	for(long i=0;i<m_Head.m_PageCount;i++)
	{
#ifdef WIN32
		if(!::SetFilePointer(hd,i*m_Head.m_PageSize+sizeof(struct PagePoolHead),NULL,FILE_BEGIN))
		{
			printf("Load page -- move file pointer failed errorid:%d\n",::GetLastError());
			return false;
		}
		if(!::ReadFile(hd,buf,sizeof(PageHead),&rlen,NULL))
		{
			printf("Read file failed errorid:%d\n",::GetLastError());
			delete [] buf;
			return false;
		}
#else
		if(-1== lseek(hd,i*m_Head.m_PageSize+sizeof(struct PagePoolHead),SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
		int io = ::read(hd,buf,sizeof(PageHead));

		if((size_t) io != sizeof(PageHead))
		{
			printf("Read file failed.\n");
			delete [] buf;
			return false;
		}
#endif

		if(((PageHead*)buf)->m_pos!=i)
		{
			printf("Load page info failed\n");
			delete [] buf;
			return false;
		}

		Page * pg=new Page(this,i);
		//		memcpy(&(pg->m_Head),buf,sizeof(PageHead));
		if(pg)
		{
			pg->m_pos=i;
			if(((PageHead*)buf)->m_unused==1)
				m_FreePageList.push_back(pg);

			m_PagePool[i]=pg;
		}

	}

	delete [] buf;
	m_hd=hd;

	return true;

}
int PagePool::LoadPageEx(const char *filetitle)
{
	ost::MutexLock lock(m_Mutex);

	m_FileTitle=filetitle;

	char filepath[1024]={0};
	sprintf(filepath,"%s_00.db",filetitle);
	std::string tempf= filepath;
	//if( tempf.find("idc_data")==std::string::npos )
	//	printf("filepath:%s\n",filepath);


#ifdef WIN32
	DWORD dwcd=OPEN_EXISTING;
	HANDLE hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
	if(hd == INVALID_HANDLE_VALUE)
	{
		printf("Opening file errorid:%d\n   %s\n",::GetLastError(),filepath);
		return -1;
	}

	DWORD rlen=0;

	if(!::ReadFile(hd,&m_Head,sizeof(struct PagePoolHead),&rlen,NULL))
	{
		printf("Read head failed errorid:%d\n   %s\n",::GetLastError(),filepath);
		return false;
	}
#else
	int hd = ::open(filepath, O_RDWR, S_IRUSR | S_IWUSR);
	if(hd < 0)
	{
		printf("Open file failed in LoadPageEx  %s\n",filepath);
		return -1;
	}

	int io = ::read(hd,&m_Head,sizeof(struct PagePoolHead));
	if((size_t) io != sizeof(struct PagePoolHead))
	{
		printf("Read head failed    %s\n", filepath);
		return false;
	}
#endif

	if(m_Head.m_version!=1)
	{
		puts("file version error!");
		return false;
	}
	if((m_Head.m_TotalCount<=0)||(m_Head.m_PageSize<MINPAGESIZE))
	{
		puts("file data error!");
		return false;
	}
	InitPoolEx();

	int PCount=m_Head.m_PageCount;
	int bindex=m_Head.m_BasePageIndex;

	char *buf = new char[m_Head.m_PageSize];
	memset(buf,0,m_Head.m_PageSize);


	SubPool *sp=new SubPool();
	if(sp==NULL)
		return false;
	m_fhd.resize(1);
	m_fhd[0]=sp;
	sp->m_phead=m_Head;
	sp->m_hd=hd;
	m_hd=hd;

	for(int i=0;i<=m_Head.m_FileCount;i++)
	{
		if(i>0)
		{
			sprintf(filepath,"%s_%02d.db",filetitle,i);

#ifdef WIN32
			hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
			if(hd == INVALID_HANDLE_VALUE)
			{
				printf("Opening file errorid:%d\n   %s\n",::GetLastError(),filepath);
				return false;
			}

			if(!::ReadFile(hd,buf,sizeof(struct PagePoolHead),&rlen,NULL))
			{
				printf("Read head failed errorid:%d\n   %s\n",::GetLastError(),filepath);
				return false;
			}
#else
			hd = ::open(filepath, O_RDWR, S_IRUSR | S_IWUSR);
			if(hd < 0)
			{
				printf("Open %d file failed   %s\n",i,filepath);
				return false;
			}

			io = ::read(hd,buf,sizeof(struct PagePoolHead));
			if((size_t) io != sizeof(struct PagePoolHead))
			{
				printf("Read head failed    %s\n", filepath);
				return false;
			}
#endif

			if(((PagePoolHead *)buf)->m_version!=1)
			{
				puts("Version error");
				return false;
			}

			PCount=((PagePoolHead *)buf)->m_PageCount;
			bindex=((PagePoolHead *)buf)->m_BasePageIndex;

			SubPool *sp=new SubPool();
			if(sp==NULL)
				return false;
			m_fhd.resize(i+1);
			m_fhd[i]=sp;
			sp->m_hd=hd;
			sp->m_phead=*((PagePoolHead *)buf);
			m_hd=hd;

			
		}

		clock_t time1=clock(); 
		DWORD bsize= 262144;
		DWORD lowoffset= 0;

#ifdef WIN32
		PVOID pvFile= NULL;
		DWORD dwFileSize = GetFileSize(hd,NULL);
		cout<<" DB file: "<<filepath<<"\n  Pcount: "<<PCount<<"  fsize:"<<dwFileSize<<"  bsize:"<<bsize<<endl;
		HANDLE hFileMap = CreateFileMapping(hd,NULL,PAGE_READWRITE,0,dwFileSize,NULL);
		if(hFileMap == NULL)
		{
			cout<<" Faile to CreateFileMapping: "<<GetLastError()<<endl;
			CloseHandle(hd);
			return false;
		}
#else
		char * pvFile= NULL;
		long dwFileSize, pos = 0;
		if(-1 == lseek(hd, pos, SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
		pos = lseek(hd, 0l, SEEK_CUR);
		dwFileSize = lseek(hd, 0l, SEEK_END);
		cout<<" DB file: "<<filepath<<"\n  Pcount: "<<PCount<<"  fsize:"<<dwFileSize<<"  bsize:"<<bsize<<endl;
#endif

		for(long n=0;n<PCount;n++)
		{
			if(n%30000==0)
				cout<<" "<<(int)(100*n/PCount)<<"%";

			long tpos= n*m_Head.m_PageSize+sizeof(struct PagePoolHead);
			if(n==0 || (tpos+ sizeof(PageHead)) > (lowoffset+bsize) )
			{
				if(n!=0)
					lowoffset+= bsize;

#ifdef WIN32
				if(pvFile!=NULL)
					UnmapViewOfFile(pvFile);
				if( (lowoffset+bsize)>dwFileSize )
					pvFile = MapViewOfFile(hFileMap,FILE_MAP_WRITE,0,lowoffset,0);
				else
					pvFile = MapViewOfFile(hFileMap,FILE_MAP_WRITE,0,lowoffset,bsize);
			}

			if(pvFile == NULL)
			{
				cout<<" Failed to MapViewOfFile: "<<GetLastError()<<endl;
				cout<<"        n:"<<n<<"  lowoffset:"<<lowoffset<<"  tpos:"<<tpos<<"  mhp size:"<<m_Head.m_PageSize<<"  ppoolhead size:"<<sizeof(struct PagePoolHead)<<"  phead size:"<<sizeof(PageHead)<<endl;
				CloseHandle(hFileMap);
				CloseHandle(hd);
				return false;
			}
#else
				if(pvFile!=NULL)
					munmap(pvFile, bsize);
				if( (lowoffset+bsize)>dwFileSize )
					pvFile = (char *)mmap(NULL, (dwFileSize-lowoffset), PROT_READ | PROT_WRITE, MAP_SHARED, hd, lowoffset);
				else
					pvFile = (char *)mmap(NULL, bsize, PROT_READ | PROT_WRITE, MAP_SHARED, hd, lowoffset);
			}

			if(pvFile == NULL)
			{
				cout<<" Failed to mmap !" <<endl;
				cout<<"        n:"<<n<<"  lowoffset:"<<lowoffset<<"  tpos:"<<tpos<<"  mhp size:"<<m_Head.m_PageSize<<"  ppoolhead size:"<<sizeof(struct PagePoolHead)<<"  phead size:"<<sizeof(PageHead)<<endl;
				close(hd);
				return false;
			}
#endif

			char * tdata= (char *)pvFile + tpos - lowoffset;
			PageHead* thead= (PageHead*)tdata;
			if(thead->m_pos!=bindex+n)
			{
				printf("Load page info failed,  pos:%d,  bindex:%d,  n:%d,  PCount:%d\n",thead->m_pos,bindex,n,PCount);
#ifdef WIN32
				UnmapViewOfFile(pvFile);
				CloseHandle(hFileMap);
#else
				munmap(pvFile, bsize);
				close(hd);
#endif
				return false;
			}

			Page * pg=new Page(this,bindex+n);
			if(pg)
			{
				pg->m_pos=bindex+n;
				pg->m_mpos.m_fileindex=i;
				pg->m_mpos.m_pos=n;
				if(thead->m_unused==1)
					m_FreePageList.push_back(pg);

				m_PagePool[bindex+n]=pg;
			}
		}
#ifdef WIN32
		UnmapViewOfFile(pvFile);
		CloseHandle(hFileMap);
		cout<<" 100%  "<<(double)(clock()-time1)/CLK_TCK<<"s"<<endl;
#else
		munmap(pvFile, bsize);
		cout<<" 100%  "<<(double)(clock()-time1)/CLOCKS_PER_SEC<<"s"<<endl;
#endif

	}
	
	delete [] buf;
	m_hd=hd;

	return true;
}

bool PagePool::CreatePage(const char * filepath,bool overlay)
{
	ost::MutexLock lock(m_Mutex);
	InitPool();

#ifdef WIN32
	DWORD dwcd;
	if(overlay)
		dwcd=CREATE_ALWAYS;
	else
		dwcd=CREATE_NEW;

	HANDLE hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
	if(hd == INVALID_HANDLE_VALUE)
	{
		printf("Create file failed:%d  %s\n",::GetLastError(),filepath);
		return false;
	}
#else
	int hd = ::open(filepath, O_CREAT | O_RDWR | O_TRUNC, S_IRUSR | S_IWUSR);
	if(hd < 0)
	{
		printf("Create file failed   %s\n",filepath);
		return false;
	}
#endif

	long size= m_Head.m_PageSize;
	size= size * m_Head.m_PageCount+sizeof(PagePoolHead);
	if((size>MAXINT-2)||(size<1))
	{
		printf("Size too big");
		return false;
	}
  

#ifdef WIN32
	DWORD pos=::SetFilePointer(hd,size,NULL,FILE_BEGIN);
	if(pos==INVALID_SET_FILE_POINTER)
	{
		printf("Set file size failed,error:%d\n",::GetLastError());
		return false;
	}
	::SetEndOfFile(hd);

	::SetFilePointer(hd,0,0,FILE_BEGIN);

	DWORD dwlen=0;

	if(!::WriteFile(hd,&m_Head,sizeof(PagePoolHead),&dwlen,NULL))
	{
		printf("Write head failed errorid:%d\n",::GetLastError());
		return false;
	}
#else
	if(!SetFileSize(hd,size))
	{
		printf("failed to SetFileSize");
		return false;
	}
	long pos= lseek(hd,0,SEEK_SET);
	int io = ::write(hd,&m_Head,sizeof(PagePoolHead));
	if((size_t) io != sizeof(PagePoolHead))
	{
		printf("Write head failed.\n");
		return false;
	}
#endif

	char *buf = new char[m_Head.m_PageSize];

	memset(buf,0,m_Head.m_PageSize);

	for(int i=0;i<m_Head.m_PageCount;i++)
	{
		((PageHead *)buf)->m_pos=i;
		((PageHead *)buf)->m_unused=1;
		F_SET(((PageHead *)buf)->m_flag,PAGEUNUSED);
		((PageHead *)buf)->m_datasize=m_Head.m_PageSize-sizeof(struct PageHead);
		((PageHead *)buf)->m_pagesize=m_Head.m_PageSize;
		((PageHead *)buf)->m_lastrecordpos=-1;
		((PageHead *)buf)->m_prerecordpage=-1;
		((PageHead *)buf)->m_nextrecordpage=-1;

#ifdef WIN32
		if(!::WriteFile(hd,buf,m_Head.m_PageSize,&dwlen,NULL))
		{
			printf("Write file failed errorid:%d\n",::GetLastError());
			delete [] buf;
			::CloseHandle(hd);
			return false;
		}
#else
		io = ::write(hd,buf,m_Head.m_PageSize);
		if((size_t) io != m_Head.m_PageSize)
		{
			printf("Write file failed.\n");
			delete [] buf;
			close(hd);
			return false;
		}
#endif

		Page * pg=new Page(this,i);
		if(pg)
		{
//			memcpy(&(pg->m_Head),buf,sizeof(PageHead));
			pg->m_pos=i;
			m_FreePageList.push_back(pg);

			m_PagePool[i]=pg;
		}

	}

	delete [] buf;
#ifdef WIN32
	::SetFilePointer(hd,0,0,FILE_BEGIN);
#else
	if(-1== lseek(hd,0,SEEK_SET))
	{
		printf("failed to move file pointor\n");
		return false;
	}
#endif
	m_hd=hd;

	return true;


}

bool PagePool::CreatePageEx(const char * filetitle,int fileindex,int pagecount,int pageindex,bool overlay)
{
	ost::MutexLock lock(m_Mutex);

	m_FileTitle=filetitle;

	char filepath[1024]={0};
	sprintf(filepath,"%s_%02d.db",filetitle,fileindex);

#ifdef WIN32
	DWORD dwcd;
	if(overlay)
		dwcd=CREATE_ALWAYS;
	else
		dwcd=CREATE_NEW;

	HANDLE hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
	if(hd == INVALID_HANDLE_VALUE)
	{
		printf("Create file failed:%d  %s\n",::GetLastError(),filepath);
		return false;
	}
#else
	int hd = ::open(filepath, O_CREAT | O_RDWR | O_TRUNC, S_IRUSR | S_IWUSR);
	if(hd < 0)
	{
		printf("Create file failed   %s\n",filepath);
		return false;
	}
#endif

	int PCount=pagecount;

	long size= m_Head.m_PageSize;
	size= size * pagecount;
	if((size>MAXINT-2)||(size<1))
	{
		printf("Size too big");
		return false;
	}

	bool over=true;
	if(size>m_Head.m_PerFileSize)
	{
		if(size-m_Head.m_PerFileSize>m_Head.m_PageSize)
			over=false;
		size=m_Head.m_PerFileSize;
		PCount=size/m_Head.m_PageSize;
	}


	size+=sizeof(PagePoolHead);


#ifdef WIN32
	DWORD pos=::SetFilePointer(hd,size,NULL,FILE_BEGIN);
	if(pos==INVALID_SET_FILE_POINTER)
	{
		printf("Set file size failed,error:%d\n",::GetLastError());
		return false;
	}
	::SetEndOfFile(hd);

	::SetFilePointer(hd,0,0,FILE_BEGIN);
#else
	if(!SetFileSize(hd,size))
	{
		printf("failed to SetFileSize");
		return false;
	}
	long pos= lseek(hd,0,SEEK_SET);
#endif

   SubPool *sp = new SubPool();
   if(sp==NULL)
	   return false;

	if(fileindex==0)
	{
		m_Head.m_TotalCount=pagecount;
		m_Head.m_PageCount=PCount;
		m_Head.m_FileIndex=fileindex;
		m_Head.m_BasePageIndex=pageindex;
		sp->m_phead=m_Head;
	}else
	{
		sp->m_phead=m_Head;
		sp->m_phead.m_FileIndex=fileindex;
		sp->m_phead.m_PageCount=PCount;
		sp->m_phead.m_BasePageIndex=pageindex;
	}

	
#ifdef WIN32
	DWORD dwlen=0;
	if(!::WriteFile(hd,&sp->m_phead,sizeof(PagePoolHead),&dwlen,NULL))
	{
		printf("Write head failed errorid:%d\n",::GetLastError());
		return false;
	}
#else
	int io = ::write(hd,&sp->m_phead,sizeof(PagePoolHead));
	if((size_t) io != sizeof(PagePoolHead))
	{
		printf("Write head failed.\n");
		return false;
	}
#endif

	char *buf = new char[m_Head.m_PageSize];

	memset(buf,0,m_Head.m_PageSize);

	int i=0;

	for(i=pageindex;i<PCount+pageindex;i++)
	{
		((PageHead *)buf)->m_pos=i;
		((PageHead *)buf)->m_unused=1;
		F_SET(((PageHead *)buf)->m_flag,PAGEUNUSED);
		((PageHead *)buf)->m_datasize=m_Head.m_PageSize-sizeof(struct PageHead);
		((PageHead *)buf)->m_pagesize=m_Head.m_PageSize;
		((PageHead *)buf)->m_lastrecordpos=-1;
		((PageHead *)buf)->m_prerecordpage=-1;
		((PageHead *)buf)->m_nextrecordpage=-1;
		((PageHead *)buf)->m_fileindex=fileindex;
		((PageHead *)buf)->m_mpos=i-pageindex;

#ifdef WIN32
		if(!::WriteFile(hd,buf,m_Head.m_PageSize,&dwlen,NULL))
		{
			printf("Write file failed errorid:%d\n",::GetLastError());
			delete [] buf;
			::CloseHandle(hd);
			return false;
		}
#else
		io = ::write(hd,buf,m_Head.m_PageSize);
		if((size_t) io != m_Head.m_PageSize)
		{
			printf("Write file failed.\n");
			delete [] buf;
			close(hd);
			return false;
		}
#endif

		Page * pg=new Page(this,i);
		if(pg)
		{
//			memcpy(&(pg->m_Head),buf,sizeof(PageHead));
			pg->m_pos=i;
			pg->m_mpos.m_fileindex=fileindex;
			pg->m_mpos.m_pos=i-pageindex;
			m_FreePageList.push_back(pg);

			m_PagePool[i]=pg;
		}

	}

	delete [] buf;
#ifdef WIN32
	::SetFilePointer(hd,0,0,FILE_BEGIN);
#else
	if(-1 == lseek(hd,0,SEEK_SET))
	{
		printf("failed to move file pointor\n");
		return false;
	}
#endif

	m_fhd.resize(fileindex+1);
	sp->m_hd=hd;
	m_fhd[fileindex]=sp;
	m_hd=hd;
	m_Head.m_FileCount=fileindex;
	if(!over)
	{
		return CreatePageEx(filetitle,++fileindex,pagecount-PCount,i,overlay);
	}else
	{
#ifdef WIN32
		if(!::SetFilePointer(m_fhd[0]->m_hd,0,0,FILE_BEGIN))
			return false;
		if(!::WriteFile(m_fhd[0]->m_hd,&m_Head,sizeof(PagePoolHead),&dwlen,NULL))
		{
			printf("Write head failed errorid:%d\n",::GetLastError());
			return false;
		}
#else
		if( -1== lseek(m_fhd[0]->m_hd,0,SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
		int io = ::write(m_fhd[0]->m_hd,&m_Head,sizeof(PagePoolHead));

		if((size_t) io != sizeof(PagePoolHead))
		{
			printf("Write head failed\n");
			return false;
		}
#endif
	}


	return true;

}

bool PagePool::AddNewPages(int count)
{	
	ost::MutexLock lock(m_Mutex);

	if(count<1)
		return false;
	if(!m_hd)
		return false;
	long size=m_Head.m_PageSize;
	size= size * (m_Head.m_PageCount+count)+sizeof(PagePoolHead);
	if((size>MAXINT-2)||(size<1))
	{
		printf("Size too big");
		return false;
	}



	/*		m_PagePool.resize(m_Head.m_PageCount+count);
	for(int c=m_Head.m_PageCount;c<m_Head.m_PageCount+count;c++)
	m_PagePool[c]=NULL;
	*/
#ifdef WIN32
	DWORD oldend=::SetFilePointer(m_hd,0,NULL,FILE_END);
	if(oldend==INVALID_SET_FILE_POINTER)
	{
		printf("Seek file failed errid:%d\n",::GetLastError());
		return false;
	}

	size=m_Head.m_PageSize*count;

	DWORD newpos=::SetFilePointer(m_hd,size,NULL,FILE_CURRENT);
	if(newpos==INVALID_SET_FILE_POINTER)
	{
		printf("Seek file failed2 errid:%d\n",::GetLastError());
		return false;

	}
#else
	int oldend= lseek(m_hd,0,SEEK_END);
	if(-1==oldend)
	{
		printf("Seek file failed \n");
		return false;
	}

	size=m_Head.m_PageSize*count;

	int newpos= lseek(m_hd,size,SEEK_CUR);
	if(-1==newpos)
	{
		printf("Seek file failed2 \n");
		return false;
	}
#endif

	DWORD tpos= m_Head.m_PageSize;
	tpos= tpos * (m_Head.m_PageCount+count)+sizeof(PagePoolHead);
	if(newpos!=tpos)
	{
		printf("Create file sapce failed newpos:%d\n",newpos);

#ifdef WIN32
		newpos=::SetFilePointer(m_hd,oldend,NULL,FILE_BEGIN);
		::SetEndOfFile(m_hd);
		return false;
	}
	::SetEndOfFile(m_hd);
	newpos=::SetFilePointer(m_hd,oldend,NULL,FILE_BEGIN);
	if(newpos==INVALID_SET_FILE_POINTER)
	{
		printf("Seek file failed3 errid:%d\n",::GetLastError());
		return false;

	}
#else
		if(!SetFileSize(m_hd,oldend))
		{
			printf("failed to SetFileSize");
			return false;
		}
		return false;
	}
	if(!SetFileSize(m_hd,size))
	{
		printf("failed to SetFileSize");
		return false;
	}
	newpos= lseek(m_hd,oldend,SEEK_SET);
	if(newpos != oldend)
	{
		printf("Seek file failed3 \n");
		return false;
	}
#endif


	char *buf = new char[m_Head.m_PageSize];

	memset(buf,0,m_Head.m_PageSize);

	m_PagePool.resize(m_Head.m_PageCount+count);
	for(int i=m_Head.m_PageCount;i<m_Head.m_PageCount+count;i++)
		m_PagePool[i]=NULL;

	DWORD dwlen=0;

	for(int i=m_Head.m_PageCount;i<m_Head.m_PageCount+count;i++)
	{
		((PageHead *)buf)->m_pos=i;
		((PageHead *)buf)->m_unused=1;
		F_SET(((PageHead *)buf)->m_flag,PAGEUNUSED);
		((PageHead *)buf)->m_datasize=m_Head.m_PageSize-sizeof(struct PageHead);
		((PageHead *)buf)->m_pagesize=m_Head.m_PageSize;
		((PageHead *)buf)->m_lastrecordpos=-1;
		((PageHead *)buf)->m_prerecordpage=-1;
		((PageHead *)buf)->m_nextrecordpage=-1;


#ifdef WIN32
		if(!::WriteFile(m_hd,buf,m_Head.m_PageSize,&dwlen,NULL))
		{
			printf("Write file failed errorid:%d\n",::GetLastError());
			delete [] buf;
			::CloseHandle(m_hd);
			return false;
		}
#else
		int io = ::write(m_hd,buf,m_Head.m_PageSize);
		if((size_t) io != m_Head.m_PageSize)
		{
			printf("Write file failed.\n");
			delete [] buf;
			close(m_hd);
			return false;
		}
#endif

		Page * pg=new Page(this,i);
		if(pg)
		{
//			memcpy(&(pg->m_Head),buf,sizeof(PageHead));
			pg->m_pos=i;
			m_FreePageList.push_back(pg);

			m_PagePool[i]=pg;
		}


	}

	m_Head.m_PageCount+=count;
	delete [] buf;

#ifdef WIN32
	::SetFilePointer(m_hd,0,0,FILE_BEGIN);
	if(!::WriteFile(m_hd,&m_Head,sizeof(PagePoolHead),&dwlen,NULL))
	{
		printf("Write head failed errorid:%d\n",::GetLastError());
		return false;
	}

	::SetFilePointer(m_hd,0,0,FILE_BEGIN);
#else
	if(-1== lseek(m_hd,0,SEEK_SET) )
	{
		printf("failed to move file pointor\n");
		return false;
	}
	int io = ::write(m_hd,&m_Head,sizeof(PagePoolHead));
	if((size_t) io != sizeof(PagePoolHead))
	{
		printf("Write head failed.\n");
		return false;
	}
	if(-1== lseek(m_hd,0,SEEK_SET))
	{
		printf("failed to move file pointor\n");
		return false;
	}
#endif
	return true;
}
bool PagePool::AddNewPagesEx(int count)
{
	ost::MutexLock lock(m_Mutex);

	if(count<1)
		return false;
	if(m_fhd[m_Head.m_FileCount]==NULL)
		return false;

	long size= m_Head.m_PageSize ;
	size= size * (m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount+count)+sizeof(PagePoolHead);
	if((size>MAXINT-2)||(size<1))
	{
		printf("Size too big");
		return false;
	}
	size-=sizeof(PagePoolHead);

	if(size<=m_Head.m_PerFileSize)
	{
		ost::MutexLock ilock(m_IOMutex);
		m_hd=m_fhd[m_Head.m_FileCount]->m_hd;

#ifdef WIN32
		DWORD oldend=::SetFilePointer(m_hd,0,NULL,FILE_END);
		if(oldend==INVALID_SET_FILE_POINTER)
		{
			printf("Seek file failed errid:%d\n",::GetLastError());
			return false;
		}
		size=m_Head.m_PageSize*count;

		DWORD newpos=::SetFilePointer(m_hd,size,NULL,FILE_CURRENT);
		if(newpos==INVALID_SET_FILE_POINTER)
		{
			printf("Seek file failed2 errid:%d\n",::GetLastError());
			return false;

		}
#else
		int oldend= lseek(m_hd,0,SEEK_END);
		if(-1 == oldend)
		{
			printf("Seek end of file failed.\n");
			return false;
		}

		size=m_Head.m_PageSize*count;

		int newpos= lseek(m_hd, size, SEEK_CUR);
		if(-1 == newpos)
		{
			printf("Seek end of file failed2.\n");
			return false;
		}
#endif

		DWORD tpos= m_Head.m_PageSize;
		tpos= tpos * (m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount+count)+sizeof(PagePoolHead); 
		if(newpos!=tpos)
		{
			printf("Create file sapce failed newpos:%d, tpos:%d \n",newpos,tpos);

#ifdef WIN32
			newpos=::SetFilePointer(m_hd,oldend,NULL,FILE_BEGIN);
			::SetEndOfFile(m_hd);
			return false;
		}
		::SetEndOfFile(m_hd);
		newpos=::SetFilePointer(m_hd,oldend,NULL,FILE_BEGIN);
		if(newpos==INVALID_SET_FILE_POINTER)
		{
			printf("Seek file failed3 errid:%d\n",::GetLastError());
			return false;

		}
#else
			if(!SetFileSize(m_hd,oldend))
			{
				printf("failed to SetFileSize");
				return false;
			}
			return false;
		}
		if(!SetFileSize(m_hd,size))
		{
			printf("failed to SetFileSize");
			return false;
		}
		newpos= lseek(m_hd,oldend,SEEK_SET);
		if(newpos != oldend)
		{
			printf("Seek file failed3 \n");
			return false;
		}
#endif


		char *buf = new char[m_Head.m_PageSize];

		memset(buf,0,m_Head.m_PageSize);

		m_PagePool.resize(m_Head.m_TotalCount+count);
		for(int i=m_Head.m_TotalCount;i<m_Head.m_TotalCount+count;i++)
			m_PagePool[i]=NULL;

		DWORD dwlen=0;

		for(int i=m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount;i<m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount+count;i++)
		{
			((PageHead *)buf)->m_pos=i+m_fhd[m_Head.m_FileCount]->m_phead.m_BasePageIndex;
			((PageHead *)buf)->m_unused=1;
			F_SET(((PageHead *)buf)->m_flag,PAGEUNUSED);
			((PageHead *)buf)->m_datasize=m_Head.m_PageSize-sizeof(struct PageHead);
			((PageHead *)buf)->m_pagesize=m_Head.m_PageSize;
			((PageHead *)buf)->m_lastrecordpos=-1;
			((PageHead *)buf)->m_prerecordpage=-1;
			((PageHead *)buf)->m_nextrecordpage=-1;
			((PageHead *)buf)->m_mpos=i;
			((PageHead *)buf)->m_fileindex=m_fhd[m_Head.m_FileCount]->m_phead.m_FileIndex;


#ifdef WIN32
			if(!::WriteFile(m_hd,buf,m_Head.m_PageSize,&dwlen,NULL))
			{
				printf("Write file failed errorid:%d\n",::GetLastError());
				delete [] buf;
				::CloseHandle(m_hd);
				return false;
			}
#else
			int io = ::write(m_hd,buf,m_Head.m_PageSize);
			if((size_t) io != m_Head.m_PageSize)
			{
				printf("Write file failed.\n");
				delete [] buf;
				close(m_hd);
				return false;
			}
#endif

			Page * pg=new Page(this,i+m_fhd[m_Head.m_FileCount]->m_phead.m_BasePageIndex);
			if(pg)
			{
				//			memcpy(&(pg->m_Head),buf,sizeof(PageHead));
				pg->m_pos=i+m_fhd[m_Head.m_FileCount]->m_phead.m_BasePageIndex;
				pg->m_mpos.m_fileindex=m_fhd[m_Head.m_FileCount]->m_phead.m_FileIndex;
				pg->m_mpos.m_pos=i;
				m_FreePageList.push_back(pg);

				m_PagePool[i+m_fhd[m_Head.m_FileCount]->m_phead.m_BasePageIndex]=pg;
			}
		}

		m_Head.m_TotalCount+=count;
		m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount+=count;
		if(m_Head.m_FileCount==0)
			m_Head.m_PageCount+=count;
		delete [] buf;

#ifdef WIN32
		::SetFilePointer(m_hd,0,0,FILE_BEGIN);
		if(!::WriteFile(m_hd,&m_fhd[m_Head.m_FileCount]->m_phead,sizeof(PagePoolHead),&dwlen,NULL))
		{
			printf("Write head failed errorid:%d\n",::GetLastError());
			return false;
		}

		::SetFilePointer(m_hd,0,0,FILE_BEGIN);
	#else
		if(-1== lseek(m_hd,0,SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
		int io = ::write(m_hd,&m_fhd[m_Head.m_FileCount]->m_phead,sizeof(PagePoolHead));
		if((size_t) io != sizeof(PagePoolHead))
		{
			printf("Write head failed.\n");
			return false;
		}
		if(-1==lseek(m_hd,0,SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
#endif

		FlushFileHead(0);

	}else
	{
		long tlen= m_Head.m_PageSize;
		tlen= tlen * m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount;
		int dlen=m_Head.m_PerFileSize - tlen;
		int pcount=dlen/m_Head.m_PageSize;
        
		if(pcount>0)
		{
			if(!AddNewPagesEx(pcount))
				return false;
		}
		int freecount=count - pcount;
		char filepath[1024]={0};
		sprintf(filepath,"%s_%02d.db",m_FileTitle.c_str(),m_Head.m_FileCount+1);

#ifdef WIN32
		DWORD dwcd;
		dwcd=CREATE_ALWAYS;

		HANDLE hd=::CreateFile(filepath,GENERIC_WRITE|GENERIC_READ,FILE_SHARE_READ|FILE_SHARE_WRITE,NULL,dwcd,FILE_ATTRIBUTE_NORMAL,NULL);
		if(hd == INVALID_HANDLE_VALUE)
		{
			printf("Create file failed:%d\n",::GetLastError());
			return false;
		}
#else
		int hd = ::open(filepath, O_CREAT | O_RDWR | O_TRUNC, S_IRUSR | S_IWUSR);
		if(hd < 0)
		{
			printf("Create file failed   %s\n",filepath);
			return false;
		}
#endif

		SubPool *sp = new SubPool();
		if(sp==NULL)
			return false;

		sp->m_phead=m_Head;
		sp->m_phead.m_FileIndex=m_Head.m_FileCount+1;
		sp->m_phead.m_PageCount=0;
		sp->m_phead.m_BasePageIndex=m_fhd[m_Head.m_FileCount]->m_phead.m_BasePageIndex+m_fhd[m_Head.m_FileCount]->m_phead.m_PageCount;

#ifdef WIN32
		DWORD dwlen=0;
		if(!::WriteFile(hd,&sp->m_phead,sizeof(PagePoolHead),&dwlen,NULL))
		{
			printf("Write head failed-2 errorid:%d\n",::GetLastError());
			return false;
		}

		::SetFilePointer(m_hd,0,0,FILE_BEGIN);
#else
		int io = ::write(hd,&sp->m_phead,sizeof(PagePoolHead));
		if((size_t) io != sizeof(PagePoolHead))
		{
			printf("Write head failed-2.\n");
			return false;
		}
		if(-1==lseek(m_hd,0,SEEK_SET))
		{
			printf("failed to move file pointor\n");
			return false;
		}
#endif


		m_Head.m_FileCount++;

		m_fhd.resize(m_Head.m_FileCount+1);
		sp->m_hd=hd;
		m_fhd[m_Head.m_FileCount]=sp;

		FlushFileHead(0);

		return 	AddNewPagesEx(freecount);
        		
	}

	return true;
}

void PagePool::PutPageSize(int PageCount,int PageSize)
{
	if((PageSize<MINPAGESIZE)||(PageCount<=0))
		return;
	m_Head.m_TotalCount=PageCount;
	m_Head.m_PageSize=PageSize;
}
void PagePool::GetPageSize(int &PageCount,int &PageSize)
{
	PageCount=m_Head.m_TotalCount;
	PageSize=m_Head.m_PageSize;
}

PagePool::PagePoolHead & PagePool::GetPagePoolHead()
{
	return m_Head;
}

void PagePool::FlushFileHead(int number)
{
	if(number<0||number>m_fhd.size())
		return ;
	ost::MutexLock lock(m_Mutex);

	ost::MutexLock ilock(m_IOMutex);

#ifdef WIN32
	HANDLE hd= m_fhd[number]->m_hd;
	DWORD dwlen=0;
	::SetFilePointer(hd,0,0,FILE_BEGIN);
	if(number==0)
	{
		if(!::WriteFile(hd,&m_Head,sizeof(PagePoolHead),&dwlen,NULL))
		{
			printf("Write head failed errorid-3:%d\n",::GetLastError());
			return ;
		}

	}else
	{
		if(!::WriteFile(hd,&m_fhd[number]->m_phead,sizeof(PagePoolHead),&dwlen,NULL))
		{
			printf("Write head failed errorid-4:%d\n",::GetLastError());
			return ;
		}

	}

	::SetFilePointer(hd,0,0,FILE_BEGIN);
#else
	int hd= m_fhd[number]->m_hd;
	if(-1==lseek(hd,0,SEEK_SET))
	{
		printf("failed to move file pointor\n");
		return;
	}
	if(number==0)
	{
		int io = ::write(hd,&m_Head,sizeof(PagePoolHead));
		if((size_t) io != sizeof(PagePoolHead))
		{
			printf("Write head failed-3.\n");
			return ;
		}
	}else
	{
		int io = ::write(hd,&m_fhd[number]->m_phead,sizeof(PagePoolHead));
		if((size_t) io != sizeof(PagePoolHead))
		{
			printf("Write head failed errorid-4\n");
			return ;
		}
	}
	if(-1==lseek(hd,0,SEEK_SET))
	{
		printf("failed to move file pointor\n");
		return;
	}
#endif

}
void PagePool::FlushAllFileHead(void)
{
	for(int i=0;i<m_fhd.size();i++)
		FlushFileHead(i);
}
