Template.ChooseeMonitorTemplateModal.events({
	"click tr a":function(e,t){
		var data = this;//this为上下文环境
		if(!data){
			return;
		}	
		var monitorTemplateId = data.return.id;
		var entityId = SessionManage.getCheckedTreeNode("id");
		RenderTemplate.hideParents(t);
		LoadingModal.loading();
		SvseMonitorTemplateDao.getAddMonitorInfoAsync(monitorTemplateId,entityId,function(result){
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
        			context["ActionType"] = "添加";//添加或编辑。用于标题栏
        			RenderTemplate.showParents("#AddMoniorFormModal","AddMoniorFormModal",context);
        		}
        	}
		});
	},
	"click .modal-header button.close":function(e,t){
		RenderTemplate.hideParents(t);
	}
});