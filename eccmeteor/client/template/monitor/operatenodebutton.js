Template.operateNode.sv_name = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("name") :false;
}

Template.operateNode.type = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("type") :"";
}

Template.operateNode.sv_id = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("id") :"";
}

Template.operateNode.PERPAGE = function(){
	return +Session.get("PERPAGE");
}

Template.operateNode.statisticalData = function(){
	var data  = {
		entity:0,
		monitor:0,
		ok:0,
		bad:0,
		warning:0,
		disable:0
	}
	var checkedNode = SessionManage.getCheckedTreeNode();
	if(!checkedNode)
		return data;
	var id = checkedNode.id;
	return SvseDao.getChildrenStatusById(id)
}
//增删改操作Template
Template.operateNode.events ={
	"click .btn#addGroup":function(){
		//$("#showGroupAdddiv").modal('show');
		RenderTemplate.showParents("#AddGroupModal","GroupAdd");
	},
	"click a#enabledEquipments":function(){  //启用组和设备
		console.log("启用");
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
		var equipmentIds = groupsIds.concat(entityIds);
		if(!equipmentIds.length){
			Message.warn("请选择需要启用的设备或组",{align:"center",time:1});
			return;
		}
		LoadingModal.loading();
		var fid = SessionManage.getCheckedTreeNode("id");
		SvseDao.enabledEquipments(fid,equipmentIds,function(result){
			LoadingModal.loaded();
			if(!result.status)
				Message.error(result.msg);
		});

	},
	"click a#forbidEquipments":function(e,t){//禁用组和设备
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
		var equipmentIds = groupsIds.concat(entityIds);
		if(!equipmentIds.length){
			Message.warn("请选择需要禁用的设备或组",{align:"center",time:1});
			return;
		}
		var context = {
			equipmetType:"equipments",
			equipmentIds:equipmentIds.join()
		}
		RenderTemplate.showParents("#ForbidEquipmentsModal","ForbidEquipments",context);
	},
	"click .btn#addEntity":function(){
		if(SvseEntityTemplateDao.isEmpty()){
			LoadingModal.loading();
			SvseEntityTemplateDao.getEntityGroupAsync(function(group){
				LoadingModal.loaded();
				RenderTemplate.showParents("#ChooseEntityTemplateForAddEntity","EntitiesGroupByType",{entityGroup:group});
			});
		}else{
			var group = SvseEntityTemplateDao.getEntityGroupSync();
			RenderTemplate.showParents("#ChooseEntityTemplateForAddEntity","EntitiesGroupByType",{entityGroup:group});
		}
	},
	"click a#removeEquipments":function(){ //删除多个组和设备
		//删除子节点
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
	//	var parentid  = Session.get("checkedTreeNode").id;
		var parentid  = SessionManage.getCheckedTreeNode("id");
		var ids = entityIds.concat(groupsIds);
		if (!ids.length){
			Message.warn("请选择需要删除的设备或者组",{align:"center",time:1});
			return;
		}
		LoadingModal.loading();
		SvseDao.deletEquipmentsMul(parentid,ids,function(result){
			LoadingModal.loaded();
			if(!result.status){
				Message.error(result.msg);
			}else{
				Message.success("删除成功！");
			}
		});
		
	},
	"click .btn#addMonitor":function(){
		//设置视图状态 监视器模板选择
		//$("#chooseMonitorTemplateDiv").modal('show');
		var id = SessionManage.getCheckedTreeNode("id");
		var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
		
		if(SvseMonitorTemplateDao.isEmpty()){
			LoadingModal.loading();
			SvseMonitorTemplateDao.getEntityMonitorByDevicetypeAsync(devicetype,false,function(monitors){
				LoadingModal.loaded();
				RenderTemplate.showParents("#ChooseeMonitorTemplateModal","ChooseeMonitorTemplateModal",{monities:monitors});
			});
		}else{
			var monitorTemplates = SvseMonitorTemplateDao.getEntityMonitorByDevicetypeSync(devicetype,false);
			RenderTemplate.showParents("#ChooseeMonitorTemplateModal","ChooseeMonitorTemplateModal",{monities:monitorTemplates});
		}
	},
	"click a#deleteMonitor" : function(){
		var monitorIds =  ClientUtils.tableGetSelectedAll("showMonitorList");
		var parentid = SessionManage.getCheckedTreeNode("id");
		if(!monitorIds.length){
			Message.warn("请选择需要删除的监视器",{align:"center",time:1});
			return;
		}
		SvseMonitorDao.deleteMultMonitors(monitorIds,parentid,function(result){
			if(result.status){
				console.log("删除成功");
			}else{
				console.log("删除失败");
			}
		})
	},
	"click a#forbidMonitor" : function(e){
		var monitorIds = ClientUtils.tableGetSelectedAll("showMonitorList");
		if(!monitorIds.length){
			Message.warn("请选择需要禁用监视器",{align:"center",time:1});
			return;
		}
		var context = {
			equipmetType:"monitors",
			equipmentIds:monitorIds.join()
		}
		RenderTemplate.showParents("#ForbidEquipmentsModal","ForbidEquipments",context);
		
	},
	"click a#allowMonitor":function(){
		var montitorsids = ClientUtils.tableGetSelectedAll("showMonitorList");
	    if(!montitorsids.length){
	    	Message.warn("请选择需要启用的监视器",{align:"center",time:1});
	    	return;
	    }
	    var parentid = SessionManage.getCheckedTreeNode("id");
	    SvseDao.enabledMonitors(parentid,montitorsids,function(result){
			if(!result.status){
				console.log(result.msg)
			}
		});
	},
	"click .btn#refresh" : function(){
		SvseDao.refreshTreeData();
	},
	//上一层
	"click .btn#backLayer" : function(){
		//获取当前节点信息
		var currentId = SessionManage.getCheckedTreeNode("id");
		if(currentId.indexOf("\.") == -1) //根节点
			return;
		var upLayoutId = currentId.substr(0,currentId.lastIndexOf("\.")) 
		var upLayoutNode = SvseTreeDao.getNodeById(upLayoutId);
		var checkedTreeNode = {
			id:upLayoutId,
			type:upLayoutNode["type"],
			name:upLayoutNode["sv_name"]
		}
		SessionManage.setCheckedTreeNode(checkedTreeNode);
		SwithcView.view(MONITORVIEW.GROUPANDENTITY);
	},
	"click .unstyled.inline a":function(e){
		/**样式操作*/
		$(e.currentTarget).parents('ul').find("a.monitor_status_filter").removeClass("monitor_status_filter");
		var status = $(e.currentTarget).addClass("monitor_status_filter").attr("title");
		console.log(status + ":"+ typeof status);
		if(status == "false"){
			SessionManage.setEntityListFilter(false);
			return;
		}
		SessionManage.setEntityListFilter(status);
	},
	"change select":function(e,t){
		Session.set("PERPAGE",+e.currentTarget.value);//设置每页的数量 //默认定义在main.js里
	}
}