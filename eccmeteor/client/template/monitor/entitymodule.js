var PagerMonitor = new Pagination("subentitylist");

Template.MonitorList.pagerMonitor = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
	return PagerMonitor.create(SvseTreeDao.getNodeCountsByIds(childrenIds));
}

Template.MonitorList.Monitors = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
    var perPage = Session.get("PERPAGE");
    return SvseTreeDao.getNodesByIds(childrenIds,false,PagerMonitor.skip({perPage:perPage}));
}

Template.MonitorList.events={
	"click tbody tr":function(e,t){
		EntityMouduleDomAction.drawReportLine(e,t,this);
	},
    "click #showMonitorList button[name='trash']":function(e){
		var id = this.sv_id;
		console.log("删除监视器id:"+id);
		var parentid  = SessionManage.getCheckedTreeNode("id");
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			Log4js.info(result);
		});
    },
 	"click #showMonitorList button[name='edit']":function(e){
      //  var id = e.currentTarget.id;
      	var monitorId = this.sv_id;
      	var entityId = SessionManage.getCheckedTreeNode("id");
      	LoadingModal.loading();
        SvseMonitorTemplateDao.getEditMonitorInfoAsync(monitorId,entityId,function(result){
        	LoadingModal.loaded();
        	if(!result.status){
        		Message.error("服务器错误");
        	}else{
        		var context = result.context;
        		if(context == null){
        			Message.warn("监视器已被删除");
        		}else{
        			var devicename = SessionManage.getCheckedTreeNode("name");
        			context["devicename"] = devicename;
        			context["ActionType"] = "编辑";//添加或编辑。用于标题栏
        			RenderTemplate.showParents("#EditMoniorFormModal","EditMoniorFormModal",context);
        		}
        	}
        });
    },
    "mouseenter #showMonitorList img":function(e){
    	$(e.currentTarget).popover('show');
    },
    "mouseleave #showMonitorList img":function(e){
    	$(e.currentTarget).popover('hide');
    }
}

Template.MonitorList.rendered = function(){
	EntityMouduleDomAction.MonitorListRendered(this);
}

Template.MonitorStatisticalSimpleData.recordsData = function(){
	return SessionManage.getMonitorRuntimeTableData();
}

Template.svg.events({
	"click .btn#monitoryDetailBtn" :  function(){		
		var monitorId = SessionManage.getCheckedMonitorId();
		RenderTemplate.showParents("#MonitorDetailSvgModal","showMonitorDetailSvg",{monitorId:monitorId});
	}
})

Template.MonitorStatisticalDetailData.monitorStatisticalDetailTableData = function(){
	return SessionManage.getMonitorStatisticalDetailTableData();
}