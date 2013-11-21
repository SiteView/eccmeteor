/*****************************************************************************
Copyright (c) 2001 - 2009, SiteView.
All rights reserved.

*****************************************************************************/

#ifndef _DLNADELEGATION_HEAD_
#define _DLNADELEGATION_HEAD_

#include "DLNACore.h"

using namespace deejay;

class DLNADelegation : 
	public deejay::DLNACoreDelegate,
	public deejay::DLNAProgressiveBrowseOp::ResultCallback,
	public deejay::DLNACoreOp::FinishCallback
{
public:
    static DLNADelegation *  GetInstance();

	enum DLNAMediaObjType
	{
		DLNAMediaObjTypeVideo = 0,
		DLNAMediaObjTypeAudio,
		DLNAMediaObjTypeImage
	};

	enum DLNAMediaPlayBackState
	{
		DLNAMediaPlayBackStateStop = 0,
		DLNAMediaPlayBackStatePlaying,
		DLNAMediaPlayBackStatePause,
		DLNAMediaPlayBackStateErr,
		DLNAMediaPlayBackStateNone
	};

public:
    void importPhotos();
    void waitForImportPhotos();
    void finishImportPhotos();
    
    deejay::DLNACore * getCore() const;
    deejay::DeviceDescList getMediaRenderList() const;
    deejay::DeviceDescList getMediaServerList() const;
    deejay::UUID getCurrentServerUUID() const;
    deejay::UUID getCurrentRenderUUID() const;
    deejay::DeviceDesc* getCurrentServer() const;
    deejay::DeviceDesc* getCurrentRender() const;
    void traverseRenderList();
    
    const deejay::UUID& getServerUuidOfSelf();
    const deejay::UUID& getRenderUuidOfSelf();
    bool currentRenderIsSelf();
    
    void restartUPNP();
    void refreshMediaSource();
    void startUPNPServer();
    void startUPNPRender();
    void startUPNPControlPoint();
    void stopUPNPServer();
    void stopUPNPRender();
    void stopUPNPControlpoint();
    
    void setProperty(const NPT_String& name, const NPT_String& value);
	void importFileSystemToMediaServer(const NPT_List<NPT_String>& dirs, const NPT_List<NPT_String>& names, deejay::ShareType eType);
    
    deejay::ServiceDesc *findServiceByType(const NPT_String& serviceType) const;
    deejay::ServiceDesc *findServiceById(const NPT_String& serviceType) const;
    NPT_Result queryStateVariables(const NPT_String& serviceId, const NPT_List<NPT_String>& nameList, NPT_List<NPT_String>& valueList); 
	void * handle_message_from_xmpp();
    
public:
    void getMediaObjType(const deejay::DLNAObject* media, DLNAMediaObjType & eType);
    void browse(const int nUUID, const NPT_String& serverOrDirTitle, const NPT_String& containerId);
    void refreshDevices(DLNACore::FlushMode mode);
    void openMediaObj(const deejay::DLNAItem* mediaItem);
    void openMediaObj(const deejay::DLNAItem* mediaItem, unsigned int timeout);
    void setActiveServer(deejay::DeviceDesc& device);
    void setActiveRender(deejay::DeviceDesc& device);
    
    //control point
    void queryTrackInfo();
    int onQueryMediaPositionFinished();
    void stop();
    void pause();
    void play();
	NPT_Result play(const UUID& mediaRendererUuid, const DLNAItem *mediaItem);
    void setVolume(int volume);
    void setProgress(int progress);
    void setMute(bool mute);
    
    //render
    void renderReportPlayBackState(DLNAMediaPlayBackState state);
    void renderReportProgress(long long playbackSeconds, long long durationSeconds);

private:
	static DLNADelegation * m_pThis;
	deejay::DLNACore * m_core;

	deejay::UUID            m_dmsCurrentUUID;
	deejay::UUID            m_dmrCurrentUUID;
	deejay::DeviceDesc      * m_currentServer;
	deejay::DeviceDesc      * m_currentRender;
	NPT_String              m_defaultRenderUUID;

	deejay::DLNAQueryPositionInfoOp         *m_trackOp;
	unsigned int                            m_trackCount;
	bool m_bPhotosImpor;

private:
	DLNADelegation();
	~DLNADelegation();

	bool wait(deejay::DLNACoreOp* op);
	void loadConfig();
	void writeConfig();
	void WriteDLNAUserConfig();
	void setCurrentServer(deejay::DeviceDesc* dms);
	void setCurrentRender(deejay::DeviceDesc* dmr);
	void setThumbImg(NPT_String& url, DLNAMediaObjType mediaType);//2012.2.9//播放界面的缩略图 

protected:
	// call back
    virtual void onMediaServerListChanged();
	virtual void onMediaRendererListChanged();
	virtual void onMediaServerStateVariablesChanged(deejay::DeviceDesc *deviceDesc, deejay::ServiceDesc *serviceDesc, const NPT_List<NPT_String>& nameList, const NPT_List<NPT_String>& valueList);
	virtual void onMediaRendererStateVariablesChanged(deejay::DeviceDesc *deviceDesc, deejay::ServiceDesc *serviceDesc, const NPT_List<NPT_String>& nameList, const NPT_List<NPT_String>& valueList);
    
    virtual void dmrOpen(const NPT_String& url, const NPT_String& mimeType, const NPT_String& metaData);
	virtual void dmrPlay();
	virtual void dmrPause();
	virtual void dmrStop();
	virtual void dmrSeekTo(NPT_Int64 timeInMillis);
	virtual void dmrSetMute(bool mute);
	virtual void dmrSetVolume(int volume);
    
	virtual void onDLNACoreOpFinished(deejay::DLNACoreOp *op);
#ifdef _REMOTE_DLNA_
	virtual void onDLNAProgressiveBrowseOpResult(deejay::DLNAProgressiveBrowseOp *op, NPT_UInt32 startingIndex, NPT_UInt32 numberReturned, NPT_UInt32 totalMatches, const deejay::DLNAObjectList& ls, const NPT_String& requestFrom);
#endif
    virtual void onDLNAProgressiveBrowseOpResult(deejay::DLNAProgressiveBrowseOp *op, NPT_UInt32 startingIndex, NPT_UInt32 numberReturned, NPT_UInt32 totalMatches, const deejay::DLNAObjectList& ls);
};
#endif
