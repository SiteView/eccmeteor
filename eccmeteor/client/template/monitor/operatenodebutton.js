Template.operateNode.sv_name = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("name") :false;
}

Template.operateNode.type = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("type") :"";
}

Template.operateNode.sv_id = function(){
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("id") :"";
}

Template.operateNode.statisticalData = function(){
	var data  = {
		entity:0,
		monitor:0,
		ok:0,
		error:0,
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
		$("#showGroupAdddiv").modal('show');
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
	"click a#forbidEquipments":function(){//禁用组和设备
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
		var equipmentIds = groupsIds.concat(entityIds);
		if(!equipmentIds.length){
			Message.warn("请选择需要禁用的设备或组",{align:"center",time:1});
			return;
		}
		$("#ForbidEquipmentsDiv").find(":hidden[name=equipmetType]").val("equipments").attr("data-value",equipmentIds.join());
		var startPicker = $("#ForbidEquipmentsStartDate").data('datetimepicker');
		var endPicker = $("#ForbidEquipmentsEndDate").data('datetimepicker');
		var endDate = new Date();
		var startDate = new Date();
		endDate.setTime(endDate.getTime() + 1000*60*60*2);
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
		$("#ForbidEquipmentsDiv").modal("show");
	},
	"click .btn#addEntity":function(){
		$("#entitiesGroupByTypeDiv").modal('show');
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
		/*
		SvseDao.removeNodesByIds(ids,parentid,function(result) {
			if(result.status){
				console.log("删除成功");
			}else{
				console.log("删除失败");
			}
		});*/
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
		$("#chooseMonitorTemplateDiv").modal('show');

	},
	"click .btn#editMonitor" : function(){//编辑监视，应该先获取 监视器添加时的模板，然后填充数据
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		var monitorid = Session.get("checkedMonitorId")["id"];
		var templateMonitoryId = SvseTreeDao.getMonitorTypeById(monitorid); //获取需编辑监视器的模板id
		Session.set("monityTemplateId",templateMonitoryId);//设置模板id
		SwithcView.view(MONITORVIEW.MONITOREDIT);
	},
	"click a#deleteMonitor" : function(){
		var monitorIds =  ClientUtils.tableGetSelectedAll("showMonitorList");
		var parentid = SessionManage.getCheckedTreeNode("id");
		console.log("delete monitorids:");
		console.log(monitorIds);
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
		$("#ForbidEquipmentsDiv").find(":hidden[name=equipmetType]").val("monitors").attr("data-value",monitorIds.join());
		var startPicker = $("#ForbidEquipmentsStartDate").data('datetimepicker');
		var endPicker = $("#ForbidEquipmentsEndDate").data('datetimepicker');
		var endDate = new Date();
		var startDate = new Date();
		endDate.setTime(endDate.getTime() + 1000*60*60*2);
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
		$("#ForbidEquipmentsDiv").modal("show");
		
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
		if(MONITORVIEW.GROUPANDENTITY !== "group")
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
	}
}