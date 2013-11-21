#include "DLNADelegation.h"
#include "DLNAObjectImpl.h"

#include <sys/utsname.h>

extern "C"
{
#include "remotedlna.h"
#include <unistd.h>
}

#define TRACK_TIMEOUT_COUNT 3

using namespace deejay;

DLNADelegation * DLNADelegation::m_pThis = NULL;

DLNADelegation::DLNADelegation()
{
	m_core = new deejay::DLNACore(this);
    m_bPhotosImpor = false;

    const char *dmrProtocolInfo =
    "http-get:*:image/png:*,"
    "http-get:*:image/jpeg:*,"
    "http-get:*:image/bmp:*,"
    "http-get:*:image/gif:*,"
    "http-get:*:audio/mpeg:*,"
    "http-get:*:audio/3gpp:*,"
    "http-get:*:audio/mp4:*,"
    "http-get:*:audio/x-ms-wma:*,"
    "http-get:*:audio/wav:*,"
    "http-get:*:video/mp4:*,"
    "http-get:*:video/mpeg:*,"
    "http-get:*:video/x-ms-wmv:*,"
    "http-get:*:video/x-ms-asf:*,"
    "http-get:*:video/3gpp:*,"
    "http-get:*:video/avi:*,"
    "http-get:*:video/quicktime:*";

	struct utsname uts;
	uname(&uts);
	setProperty("PlatformName", uts.sysname);
	setProperty("OSVersion", uts.release);
	setProperty("DMRProtocolInfo", dmrProtocolInfo);
	setProperty("FriendlyName", uts.nodename);

	m_core->start();
}

DLNADelegation::~DLNADelegation()
{
    if (m_currentServer)
    {
        m_currentServer->release();
        m_currentServer = NULL;
    }
    if (m_currentRender)
    {
        m_currentRender->release();
        m_currentRender = NULL;
    }
    if (m_trackOp) 
    {
		m_trackOp->release();
		m_trackOp = NULL;
	}

    delete m_core;
}

DLNADelegation* DLNADelegation::GetInstance()
{
	if (NULL == m_pThis)
	{
		m_pThis = new DLNADelegation();
	}
	return m_pThis;
}


//////////////////////////////////////////////////////////////////////////
// Callback
void DLNADelegation::onMediaRendererListChanged()
{
}


void DLNADelegation::onMediaServerListChanged()
{
	DeviceDescList ls = m_core->snapshotMediaServerList();
}


void DLNADelegation::onMediaServerStateVariablesChanged(deejay::DeviceDesc *deviceDesc, deejay::ServiceDesc *serviceDesc, const NPT_List<NPT_String>& nameList, const NPT_List<NPT_String>& valueList)
{
}

void DLNADelegation::onMediaRendererStateVariablesChanged(deejay::DeviceDesc *deviceDesc, deejay::ServiceDesc *serviceDesc, const NPT_List<NPT_String>& nameList, const NPT_List<NPT_String>& valueList)
{
}


void DLNADelegation::dmrOpen(const NPT_String& url, const NPT_String& mimeType, const NPT_String& metaData)
{
}
void DLNADelegation::dmrPlay()
{
	printf("liyuan-debug;call back play!\n");
}
void DLNADelegation::dmrPause()
{
}
void DLNADelegation::dmrStop()
{
}
void DLNADelegation::dmrSeekTo(NPT_Int64 timeInMillis)
{
}
void DLNADelegation::dmrSetMute(bool mute)
{
}
void DLNADelegation::dmrSetVolume(int volume)
{
}

// DLNA browse callback 
void DLNADelegation::onDLNACoreOpFinished(deejay::DLNACoreOp *op)
{
	printf("browse fineshed\n");
}

#ifdef _REMOTE_DLNA_
void DLNADelegation::onDLNAProgressiveBrowseOpResult(deejay::DLNAProgressiveBrowseOp *op, NPT_UInt32 startingIndex, NPT_UInt32 numberReturned, NPT_UInt32 totalMatches, const deejay::DLNAObjectList& ls, const NPT_String& requestFrom)
{
	if (requestFrom.GetLength() < 0)
	{
		return;
	}

	//requestFrom for MES_REQ_OBJ_LISTS : mes_type&&xmpp_id&&jid&&startIndex&&requestCnt
	NPT_List<NPT_String> tmp_list = requestFrom.Split("&&");
	NPT_Int32 type = 0;
	(*tmp_list.GetItem(0)).ToInteger32(type);	//mes_type
	
	printf("start index:%d browse fileNumber:%d\n", startingIndex, numberReturned);
	printf("liyuan-debug;requestFrom:%s\n", (char *)requestFrom);
	if (type == MES_REQ_OBJ_LISTS)
	{
		int cnt = numberReturned;
		message_t *mes_dlna = (message_t *)MALLOC(sizeof(message_t));

		NPT_String tmp_id = *tmp_list.GetItem(1);	//xmpp_id
		NPT_String tmp_jid = *tmp_list.GetItem(2);	//jid
		strcpy(mes_dlna->id, tmp_id.GetChars());
		strcpy(mes_dlna->jid, tmp_jid.GetChars());
		/*++++++++++++++++++++++++++++++++++++++++++++++
		** |cnt | total | start | end | dlna_obj(1) | dlna_obj(2) |......| dlna_obj(N)
		**++++++++++++++++++++++++++++++++++++++++++++++*/
		mes_dlna->data_len = sizeof(dlna_obj)*cnt + (sizeof(int)*4);
		mes_dlna->data = (char *)MALLOC(mes_dlna->data_len);
		memcpy(mes_dlna->data, &cnt, sizeof(cnt));
		memcpy(mes_dlna->data + sizeof(int), &totalMatches, sizeof(int));
		int end = startingIndex + numberReturned;
		memcpy(mes_dlna->data + (sizeof(int)*2), &startingIndex, sizeof(int));
		memcpy(mes_dlna->data + (sizeof(int)*3), &end, sizeof(int));
		mes_dlna->type = MES_RES_OBJ_LISTS;
		strcpy(mes_dlna->code, "0200");
		dlna_obj *obj_item = (dlna_obj *)((char *)(mes_dlna->data) + sizeof(int)*4);
		
		for (NPT_Ordinal i = 0; i < numberReturned; i++)
		{
			DLNAObject * obj = ls.itemAt(i);

			DLNAResource *bestResource = NULL;
			
			if (obj->d_ptr()->m_resList.GetItemCount() > 0) {
				bestResource = *obj->d_ptr()->m_resList.GetFirstItem();
			}
	
			if (bestResource) {
				strcpy(obj_item->url, bestResource->d_ptr()->m_url);
			}

			strcpy(obj_item->objectId, obj->objectId());
			strcpy(obj_item->parentId, obj->parentId());
			strcpy(obj_item->title, obj->title());
			strcpy(obj_item->upnpClass, obj->upnpClass());
			strcpy(obj_item->upnpClassName, obj->upnpClassName());
			obj_item->resourceSize = obj->resourceSize();
			obj_item++;
		}
		list_add_with_mutex(mes_from_dlna, mes_dlna);
	}
	if (type == MES_REQ_PLAY_REMOTE)
	{
		//requestFrom for MES_REQ_PLAY_REMOTE : mes_type&&xmpp_id&&jid&&obj_id&&rd_uuid
		message_t *mes_dlna = (message_t *)MALLOC(sizeof(message_t));
		mes_dlna->type = MES_RES_PLAY_REMOTE;
		strcpy(mes_dlna->id, (*tmp_list.GetItem(1)).GetChars());	//xmpp_id
		strcpy(mes_dlna->jid, (*tmp_list.GetItem(2)).GetChars());	//jid
		DLNAObject * obj;
		deejay::UUID rd_uid = 
				deejay::UUID::fromString(*tmp_list.GetItem(4));		//rd_uuid
				
		if (0 == numberReturned)
		{
			strcpy(mes_dlna->code, "1201");
			list_add_with_mutex(mes_from_dlna, mes_dlna);
			return;
		}
		
		for (NPT_Ordinal i = 0; i < numberReturned; i++)
		{
			obj = ls.itemAt(i);
			
			if (0 == strcmp(obj->objectId(), (*tmp_list.GetItem(3)).GetChars()))	//obj_id
			{
				if (NPT_SUCCEEDED(play(rd_uid, obj->asItem())))
				{
					strcpy(mes_dlna->code, "0200");
				}
				else
				{
					strcpy(mes_dlna->code, "1201");
				}
				list_add_with_mutex(mes_from_dlna, mes_dlna);
				break;
			}
		}
		
		
	}
	
}

#endif

void DLNADelegation::onDLNAProgressiveBrowseOpResult(deejay::DLNAProgressiveBrowseOp *op, NPT_UInt32 startingIndex, NPT_UInt32 numberReturned, NPT_UInt32 totalMatches, const deejay::DLNAObjectList& ls)
{
	
}



bool DLNADelegation::wait(deejay::DLNACoreOp* op)
{
    if (NPT_SUCCEEDED(op->wait(500)))
    {
        return true;
    }
    //WaitPopup  waitPopup;
    //if (op->checkFinishedIfNotSetCallback(&waitPopup))
    //{
    //    return true;
    //}
    //else
    //{
    //    waitPopup.showWaitDialog();
    //    UnLockMode mode = lockUI();
    //    op->resetCallback();
    //    if (UnLockModeManual == mode)
    //    {
    //        op->abort();
    //        return false;
    //    }
    //    return true;
    //}
	return true;
}

void DLNADelegation::importPhotos()
{    
	if (m_bPhotosImpor)
    {
        return;
    }
    deejay::DLNACoreOp* op;
    if (NPT_SUCCEEDED(m_core->importPhotos("", &op)))
    {
        waitForImportPhotos();
        op->checkFinishedIfNotSetCallback(this);
        op->release();
        m_bPhotosImpor = true;
    }
}

void DLNADelegation::waitForImportPhotos()
{

}

void DLNADelegation::finishImportPhotos()
{

}

deejay::DLNACore* DLNADelegation::getCore()  const
{
    return m_core;
}

deejay::DeviceDescList DLNADelegation::getMediaRenderList() const
{
    return m_core->snapshotMediaRendererList();
}

deejay::DeviceDescList DLNADelegation::getMediaServerList() const
{
    return m_core->snapshotMediaServerList();
}

void DLNADelegation::setCurrentServer(deejay::DeviceDesc* mds)
{
    if (m_currentServer)
    {
        m_currentServer->release();
        m_currentServer = NULL;
    }
    m_currentServer = mds;
    m_currentServer->addRef();
    m_dmsCurrentUUID = mds->uuid();
}

void DLNADelegation::setCurrentRender(deejay::DeviceDesc* mdr)
{
    if (m_currentRender)
    {
        m_currentRender->release();
        m_currentRender = NULL;
        m_dmrCurrentUUID = deejay::UUID::null();
    }
    if (!mdr)
    {
        return;
    }
    m_currentRender = mdr;
    m_currentRender->addRef();
    m_dmrCurrentUUID = mdr->uuid();
    m_defaultRenderUUID = m_dmrCurrentUUID.toString();
}

deejay::UUID DLNADelegation::getCurrentServerUUID() const
{
    return m_dmsCurrentUUID;
}

deejay::UUID DLNADelegation::getCurrentRenderUUID() const
{
    return m_dmrCurrentUUID;
}

deejay::DeviceDesc* DLNADelegation::getCurrentServer() const
{
    return m_currentServer;
}

deejay::DeviceDesc* DLNADelegation::getCurrentRender() const
{
    return m_currentRender;
}

void DLNADelegation::traverseRenderList()
{
    const deejay::DeviceDescList& dmrList = getMediaRenderList();
    deejay::UUID defaultRenderUUID = deejay::UUID::fromString(m_defaultRenderUUID);
    deejay::DeviceDesc * defaultRender = dmrList.find(defaultRenderUUID);
    //setActiveRender(*defaultRender);
}

const deejay::UUID& DLNADelegation::getServerUuidOfSelf()
{
    return m_core->getMediaServerUuid();
}
const deejay::UUID& DLNADelegation::getRenderUuidOfSelf()
{
    return m_core->getMediaRendererUuid();
}

bool DLNADelegation::currentRenderIsSelf()
{
    if(m_defaultRenderUUID == getRenderUuidOfSelf().toString())
    {
        return true;
    }
    else
    {
        return false;
    }
}

void DLNADelegation::getMediaObjType(const deejay::DLNAObject* media, DLNAMediaObjType & eType)
{
    if (media)
    {
        const NPT_String contentType = media->upnpClass().Left(21);
        if (contentType == "object.item.imageItem" ) 
        {
            eType = DLNAMediaObjTypeImage;
        } 
        else if (contentType == "object.item.videoItem") 
        {
            eType = DLNAMediaObjTypeVideo;
        } 
        else if (contentType == "object.item.audioItem")
        {
            eType = DLNAMediaObjTypeAudio;
        }
    }
}

/////////////////////
void DLNADelegation::restartUPNP()
{
        m_core->start();
}

void DLNADelegation::refreshMediaSource()
{
    m_core->clearMediaServerContent();
    m_core->mediaStore()->importIOSPhotos("");
}

void DLNADelegation::startUPNPRender()
{
    m_core->enableFunction(DLNACore::Function_MediaRenderer, true);
}

void DLNADelegation::startUPNPServer()
{
    m_core->enableFunction(DLNACore::Function_MediaServer, true);
}

void DLNADelegation::startUPNPControlPoint()
{
    m_core->enableFunction(DLNACore::Function_ControlPoint, true);
}

void DLNADelegation::stopUPNPRender()
{
    m_core->enableFunction(DLNACore::Function_MediaRenderer, false);
}

void DLNADelegation::stopUPNPServer()
{
    m_core->enableFunction(DLNACore::Function_MediaServer, false);
}

void DLNADelegation::stopUPNPControlpoint()
{
    m_core->enableFunction(DLNACore::Function_ControlPoint, false);
}

void DLNADelegation::setProperty(const NPT_String& name, const NPT_String& value)
{
    m_core->setProperty(name,value);
}

void DLNADelegation::importFileSystemToMediaServer(const NPT_List<NPT_String>& dirs, const NPT_List<NPT_String>& names, deejay::ShareType eType)
{
	m_core->clearMediaServerContent();
	m_core->importFileSystemToMediaServer(dirs, names, false, eType);
}

deejay::ServiceDesc* DLNADelegation::findServiceByType(const NPT_String& serviceType) const
{
    return m_currentRender->findServiceByType(serviceType);
}

deejay::ServiceDesc* DLNADelegation::findServiceById(const NPT_String& serviceType) const
{
    return m_currentRender->findServiceById(serviceType);
}

NPT_Result DLNADelegation::queryStateVariables(const NPT_String& serviceId, const NPT_List<NPT_String>& nameList, NPT_List<NPT_String>& valueList)
{
    return m_core->queryStateVariables(m_dmrCurrentUUID, serviceId, nameList, valueList);
}

///////////////////UPNP
void DLNADelegation::browse(const int nUUID, const NPT_String& serverOrDirTitle, const NPT_String& containerId)
{
	DLNAProgressiveBrowseOp * op;
	DeviceDescList devlist = m_core->snapshotMediaServerList();
	UUID uid = devlist.itemAt(nUUID)->uuid();
	m_core->browseMediaServerEx(uid, containerId, 100, this, &op);
	op->checkFinishedIfNotSetCallback(this);
	printf("browse....\n");

	//deejay::DLNABrowseOp *op;
	//if (NPT_SUCCEEDED(m_core->browseMediaServer(m_dmsCurrentUUID, containerId, false, &op))) 
/*	if (NPT_SUCCEEDED(m_core->browseMediaServerEx(uid, containerId, 100, this, &op)))
    {
        if (wait(op))
        {
            if (op->succeeded()) 
            {
                printf("borwse op  successed\n");
            }
            else
            {
                printf("borwse op un successed\n");
            }
        }
		else
        {
            printf("wait wrong-->click cancle btn\n");
        }
		op->release();
	}	*/
}

void DLNADelegation::refreshDevices(DLNACore::FlushMode mode)
{
//	m_core->flushDeviceList(flushMode);
	m_core->searchDevices(15);
}


void DLNADelegation::setThumbImg(NPT_String& url, DLNAMediaObjType mediaType)//2012.2.9
{

}

void DLNADelegation::openMediaObj(const deejay::DLNAItem* mediaItem)
{
	DeviceDescList devlist = m_core->snapshotMediaServerList();
	UUID renderUuid = devlist.itemAt(0)->uuid();

	DLNAObjectList objList;
	DLNAObject * obj = objList.itemAt(0);
	DLNAItem * item = obj->asItem();

   // deejay::UUID renderUuid = getCurrentRenderUUID();
	if (!renderUuid.isNull()) 
    {
        DLNAMediaObjType type;
		getMediaObjType(mediaItem, type);
		
        NPT_String iconUrl;
        if (((deejay::DLNAObject*)mediaItem)->findThumbnailURL(200, 200, NULL, iconUrl))
        {
            //setThumbImg(iconUrl, type);
        }
        
		deejay::DLNACoreOp *op;
		if (NPT_SUCCEEDED(m_core->playMedia(renderUuid, mediaItem, &op))) 
        {
            if (wait(op))
            {
                if (op->succeeded()) 
                {
                    //[m_delegate showControlPointPageWithMediaType:type];
                }
                else
                {
                    printf("play op un successed");
                    printf("\n");
                }
            }
			else
            {
                printf("wait wrong-->click cancle btn");
                printf("\n");
            }
			op->release();
		}
        else
        {
            //NSLog(@"create Op error");
        }
	}
    else
    {
        //[m_delegate shouldSelectRenderForMedia:mediaItem];
    }
}

void DLNADelegation::openMediaObj(const deejay::DLNAItem* mediaItem, unsigned int timeout)
{
    deejay::UUID renderUuid = getCurrentRenderUUID();
	if (!renderUuid.isNull()) 
    {
        DLNAMediaObjType type;
		getMediaObjType(mediaItem, type);
        NPT_String iconUrl;
        if (((deejay::DLNAObject*)mediaItem)->findThumbnailURL(200, 200, NULL, iconUrl))
        {
            setThumbImg(iconUrl, type);
        }
        
		deejay::DLNACoreOp *op;
		if (NPT_SUCCEEDED(m_core->playMedia(renderUuid, mediaItem, &op))) 
        {
            /*if (NPT_SUCCEEDED(op->wait(timeout*1000)) && op->succeeded())
             {
             [m_delegate showControlPointPageWithMediaType:type];
             
             }
             /*/
            if (wait(op))
            {
                if (op->succeeded())
                {
                    //[m_delegate showControlPointPageWithMediaType:type];
                }
            }
            //*/
			else
            {
                //[m_delegate autoPlaybackTimeOut];
            }
			op->release();
		}
        else
        {
            
        }
	}
    else
    {
        //[m_delegate shouldSelectRenderForMedia:mediaItem];
    }
}

void DLNADelegation::setActiveServer(deejay::DeviceDesc& device)
{
    setCurrentServer(&device);
}

void DLNADelegation::setActiveRender(deejay::DeviceDesc& device)
{
    setCurrentRender(&device);
    //[m_delegate reloadMeidaRenderList:getMediaRenderList() withCurrentRenderID:m_defaultRenderUUID];
}



void DLNADelegation::queryTrackInfo()
{
/*	if (m_trackCount>TRACK_TIMEOUT_COUNT)
    {
        m_trackOp->release();
		m_trackOp = NULL;
    }

    if (!m_trackOp)
    {
		if (NPT_SUCCEEDED(m_core->queryMediaPositionInfo(m_dmrCurrentUUID, &m_trackOp))) 
        {
			m_trackOp->checkFinishedIfNotSetCallback(this);
		}
	}
    else
    {
        printf("-------------track no return\n");
        m_trackCount++;
    }	*/
}

int DLNADelegation::onQueryMediaPositionFinished()
{
    int track = 0;
	if (m_trackOp) 
    {
		if (m_trackOp->succeeded()) 
        {
			track = m_trackOp->trackTime();
		}

        printf("-------------%d\n",track);
		m_trackOp->release();
		m_trackOp = NULL;
	}
    m_trackCount = 0;//if track successed  reset  count
    return track;
}

void DLNADelegation::stop()
{
    if (m_dmrCurrentUUID.isNull())
    {
        //[delegate() notAviableRender];
        return;
    }
    
	deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->stopMedia(m_dmrCurrentUUID, &op)))
    {
        op->release();
    }
}

void DLNADelegation::pause()
{
    if (m_dmrCurrentUUID.isNull())
    {
        //[delegate() notAviableRender];
        return;
    }
    
	deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->pauseMedia(m_dmrCurrentUUID, &op)))
    {
        op->release();
    }
}

void DLNADelegation::play()
{
    if (m_dmrCurrentUUID.isNull())
    {
        //[delegate() notAviableRender];
        return;
    }
    
	deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->playMedia(m_dmrCurrentUUID, NULL, &op)))
    {
        op->release();
    }
}

NPT_Result DLNADelegation::play(const UUID& mediaRendererUuid, const DLNAItem *mediaItem)
{
	deejay::DLNACoreOp *op;
	NPT_Result ret = m_core->playMedia(mediaRendererUuid, mediaItem, &op);
    if (NPT_SUCCEEDED(ret))
    {
		printf("play successed\n");
		op->release();
	}
	else
	{
		printf("play unsuccessed\n");
	}
	return ret;
}

void DLNADelegation::setVolume(int volume)
{
    if (m_dmrCurrentUUID.isNull()) 
    {
        //[delegate() notAviableRender];
		return;
	}
	
	deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->changeMediaVolume(m_dmrCurrentUUID, volume, &op)))
    {
        op->release();
    }
}

void DLNADelegation::setProgress(int progress)
{
    if (m_dmrCurrentUUID.isNull())
    {
        //[delegate() notAviableRender];
        return;
    }
    
	deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->seekMedia(m_dmrCurrentUUID, progress, &op)))
    {
        op->release();
    }
}


void DLNADelegation::setMute(bool mute)
{
    if (m_dmrCurrentUUID.isNull())
    {
        //[delegate() notAviableRender];
        return;
    }

    deejay::DLNACoreOp *op;
    if (NPT_SUCCEEDED(m_core->muteMedia(m_dmrCurrentUUID, mute, &op)))
    {
        op->release();
    }
}

void DLNADelegation::renderReportPlayBackState(DLNAMediaPlayBackState state)
{
    if (m_core)
    {
		switch (state) 
        {
            case DLNAMediaPlayBackStatePlaying:
                m_core->dmrReportState(deejay::DLNACore::DMRState_Playing);
                break;
            case DLNAMediaPlayBackStatePause:
                m_core->dmrReportState(deejay::DLNACore::DMRState_Paused);
                break;
            case DLNAMediaPlayBackStateStop:
                m_core->dmrReportState(deejay::DLNACore::DMRState_Stopped);
                break;
            case DLNAMediaPlayBackStateErr:
                m_core->dmrReportErrorStatus(true);
                break;
		}
	}
}

void DLNADelegation::renderReportProgress(long long playbackSeconds, long long durationSeconds)
{
    if (m_core) 
    {
		m_core->dmrReportProgress(playbackSeconds*1000, durationSeconds*1000);
	}
}

void * DLNADelegation::handle_message_from_xmpp()
{
	if (mes_from_xmpp == NULL || mes_from_xmpp->head == NULL)
	{
		printf("message list is NULL, but message cnt is %d\n", mes_from_xmpp->count);
		return NULL;
	}

	message_t *mes_xmpp = (message_t *)(mes_from_xmpp->head->data);
	message_t *mes_dlna = NULL;
	tlv tlvs[MES_ELE_LAST] = {};

	mes_ele_parser(tlvs, mes_xmpp->data, mes_xmpp->data_len);

    switch (mes_xmpp->type)
    {
	case MES_REQ_DEV_LISTS:
		{
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
			DeviceDescList dmsls = getMediaServerList();
			DeviceDescList dmrls = getMediaRenderList();
			int cnt = dmsls.count() + dmrls.count();

			/*++++++++++++++++++++++++++++++++++++++++++++++
			** int | device_dlna(1) | device_dlna(2) |......| device_dlna(N)
			**++++++++++++++++++++++++++++++++++++++++++++++*/
			mes_dlna->data_len = sizeof(device_dlna) * cnt + sizeof(int);
			mes_dlna->data = (char *)MALLOC(mes_dlna->data_len);
			memcpy(mes_dlna->data, &cnt, sizeof(cnt));
			mes_dlna->type = MES_RES_DEV_LISTS;
			device_dlna *dev_item = (device_dlna *)((char *)(mes_dlna->data) + sizeof(int));
			for (NPT_Ordinal i = 0; i < dmsls.count(); i++)
			{
				DeviceDesc * sdesc = dmsls.itemAt(i);
				
				//friendly_name
				dev_item->friendly_name = (char *)MALLOC(sdesc->friendlyName().GetLength()+1);
				strcpy(dev_item->friendly_name, sdesc->friendlyName());

				//uuid
				strcpy(dev_item->uuid, sdesc->uuid().toString());

				//type
				dev_item->type = DLNA_SERVER;
				dev_item++;
				printf("type:%s;name:%s;len:%d\n", (char *)sdesc->deviceType(), (char *)sdesc->friendlyName(), sdesc->friendlyName().GetLength());
			}
			for (NPT_Ordinal j = 0; j < dmrls.count(); j++)
			{
				DeviceDesc * rdesc = dmrls.itemAt(j);

				//friendly_name
				dev_item->friendly_name = (char *)MALLOC(rdesc->friendlyName().GetLength()+1);
				strcpy(dev_item->friendly_name, rdesc->friendlyName());

				//uuid
				strcpy(dev_item->uuid, rdesc->uuid().toString());

				//type
				dev_item->type = DLNA_RENDER;
				dev_item++;
				printf("type:%s;name:%s;uuid:%s\n", (char *)rdesc->deviceType(), (char *)rdesc->friendlyName(), (char *)rdesc->uuid().toString());
			}
			/*
			MUTEX_LOCK(mes_dlna_mutex);
			list_add(mes_from_dlna, mes_dlna);
			MUTEX_UNLOCK(mes_dlna_mutex);
			*/
		}
		break;
	case MES_REQ_PLAY_REMOTE:
		{
			//deejay::UUID rd_uid = 
			//	deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			deejay::UUID srv_uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_SRV_UUID].value));
			NPT_String containerId = NPT_String(tlvs[MES_ELE_PARENT_ID].value);
			//NPT_String objId = NPT_String(tlvs[MES_ELE_OBJ_ID].value);
			DLNAProgressiveBrowseOp * op;
			DLNAObject * obj;
			char strtype[4] = {};
			sprintf(strtype, "%d", mes_xmpp->type);
			NPT_String requestFrom;

			//requestFrom for MES_REQ_PLAY_REMOTE : mes_type&&xmpp_id&&jid&&obj_id&&rd_uuid
			requestFrom.Append(strtype);
			requestFrom.Append("&&");
			requestFrom.Append(mes_xmpp->id);
			requestFrom.Append("&&");
			requestFrom.Append(mes_xmpp->jid);
			requestFrom.Append("&&");
			requestFrom.Append(tlvs[MES_ELE_OBJ_ID].value);
			requestFrom.Append("&&");
			requestFrom.Append(tlvs[MES_ELE_RD_UUID].value);
			
			if (NPT_SUCCEEDED(m_core->browseMediaServerEx(requestFrom, srv_uid, containerId, 100, this, &op)))
			{
				op->checkFinishedIfNotSetCallback(this);
				printf("playing...\n");
				op->release();
			}
			else
			{
				mes_dlna = (message_t *)MALLOC(sizeof(message_t));
				strcpy(mes_dlna->id, mes_xmpp->id);
				strcpy(mes_dlna->jid, mes_xmpp->jid);
				mes_dlna->type = MES_RES_PLAY_REMOTE;
				strcpy(mes_dlna->code, "1203");
				printf("play failure!\n");
			}
		}
		break;
	case MES_REQ_PLAY_LOCAL:
		{
			deejay::UUID rd_uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			NPT_String filepath = NPT_String(tlvs[MES_ELE_FILE_NAME].value);
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			mes_dlna->type = MES_RES_PLAY_LOCAL;

			if (NPT_SUCCEEDED(m_core->playFile(rd_uid, filepath, &op)))
			{
				strcpy(mes_dlna->code, "0200");
				printf("play successed\n");
				op->release();
			}
			else
			{
				strcpy(mes_dlna->code, "1201");
				printf("play unsuccessed\n");
			}
			//list_add(mes_from_dlna, mes_dlna);
		}
		break;
	case MES_REQ_OBJ_LISTS:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			NPT_String containerId = 
				NPT_String(tlvs[MES_ELE_OBJ_ID].value);
			DLNAProgressiveBrowseOp * op;
			char strtype[4] = {};
			sprintf(strtype, "%d", mes_xmpp->type);
			NPT_String requestFrom;

			//requestFrom for MES_REQ_OBJ_LISTS : mes_type&&xmpp_id&&jid&&startIndex&&requestCnt
			requestFrom.Append(strtype);
			requestFrom.Append("&&");
			requestFrom.Append(mes_xmpp->id);
			requestFrom.Append("&&");
			requestFrom.Append(mes_xmpp->jid);
			requestFrom.Append("&&");
			requestFrom.Append(tlvs[MES_ELE_OBJ_START].value);
			requestFrom.Append("&&");
			requestFrom.Append(tlvs[MES_ELE_OBJ_COUNT].value);

			printf("liyuan-debug;uuid:%s; objid:%s\n", tlvs[MES_ELE_RD_UUID].value, tlvs[MES_ELE_OBJ_ID].value);
			if (NPT_SUCCEEDED(m_core->browseMediaServerEx(requestFrom, uid, containerId, 50, this, &op)))
			{
				op->checkFinishedIfNotSetCallback(this);
				printf("browse....\n");
			}
			else
			{
				mes_dlna = (message_t *)MALLOC(sizeof(message_t));
				strcpy(mes_dlna->id, mes_xmpp->id);
				strcpy(mes_dlna->jid, mes_xmpp->jid);
				mes_dlna->type = MES_RES_OBJ_LISTS;
				strcpy(mes_dlna->code, "1202");
				mes_dlna->data_len = sizeof(int)*4;
				mes_dlna->data = (char *)MALLOC(mes_dlna->data_len);
				printf("browse failure!....\n");
			}
		}
		break;
	case MES_REQ_STOP:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			
			mes_dlna->type = MES_RES_STOP;
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
		    if (NPT_SUCCEEDED(m_core->stopMedia(uid, &op)))
		    {
		        op->release();
				//mes_dlna->code = 0;
		    }
			else
			{
				//mes_dlna->code = 1;
			}
			
			//list_add(mes_from_dlna, mes_dlna);
			printf("stop....\n");
		}
		break;
	case MES_REQ_PAUSE:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			
			mes_dlna->type = MES_RES_PAUSE;
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
		    if (NPT_SUCCEEDED(m_core->pauseMedia(uid, &op)))
		    {
		        op->release();
				//mes_dlna->code = 0;
		    }
			else
			{
				//mes_dlna->code = 1;
			}
			
			//list_add(mes_from_dlna, mes_dlna);
			printf("pause....\n");
		}
		break;
	case MES_REQ_SET_VOLUME:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			int volume = atoi(tlvs[MES_ELE_VOLUME].value);
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			
			mes_dlna->type = MES_RES_VOLUME;
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
		    if (NPT_SUCCEEDED(m_core->changeMediaVolume(uid, volume, &op)))
		    {
		        op->release();
				//mes_dlna->code = 0;
		    }
			else
			{
				//mes_dlna->code = 1;
			}
			
			//list_add(mes_from_dlna, mes_dlna);
			printf("set volume....\n");
		}
		break;
	case MES_REQ_SET_PROGRESS:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			int progress = atoi(tlvs[MES_ELE_PROGRESS].value);
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			
			mes_dlna->type = MES_RES_PROGRESS;
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
		    if (NPT_SUCCEEDED(m_core->seekMedia(uid, progress, &op)))
		    {
		        op->release();
				//mes_dlna->code = 0;
		    }
			else
			{
				//mes_dlna->code = 1;
			}
			
			//list_add(mes_from_dlna, mes_dlna);
			printf("set progress....\n");
		}
		break;
	case MES_REQ_SET_MUTE:
		{
			deejay::UUID uid = 
				deejay::UUID::fromString(NPT_String(tlvs[MES_ELE_RD_UUID].value));
			int mute = atoi(tlvs[MES_ELE_MUTE].value);
			deejay::DLNACoreOp *op;
			mes_dlna = (message_t *)MALLOC(sizeof(message_t));
			
			mes_dlna->type = MES_RES_MUTE;
			strcpy(mes_dlna->id, mes_xmpp->id);
			strcpy(mes_dlna->jid, mes_xmpp->jid);
			
		    if (NPT_SUCCEEDED(m_core->muteMedia(uid, mute, &op)))
		    {
		        op->release();
				//mes_dlna->code = 0;
		    }
			else
			{
				//mes_dlna->code = 1;
			}
			
			//list_add(mes_from_dlna, mes_dlna);
			printf("set mute....\n");
		}
		break;
	default:
		{
			printf("unknow message from xmpp!type:%d\n", mes_xmpp->type);
		}
		break;
    }
	free_list_element(mes_from_xmpp, mes_from_xmpp->head);
	return mes_dlna;
}
