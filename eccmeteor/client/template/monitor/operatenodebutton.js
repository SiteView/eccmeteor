Template.operateNode.sv_name = function(){
	//if(Session.get("checkedTreeNode"))return Session.get("checkedTreeNode").name;
	//return false;
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("name") :false;
}

Template.operateNode.type = function(){
//	return Session.get("checkedTreeNode") ? Session.get("checkedTreeNode")["type"] : "";
	return SessionManage.getCheckedTreeNode() ? SessionManage.getCheckedTreeNode("type") :"";
}

//增删改操作Template
Template.operateNode.events ={
	"click .btn#addGroup":function(){
	//	if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
	//	SwithcView.view(MONITORVIEW.GROUPADD);//设置视图状态
	    $("#showGroupAdddiv").modal('show');
	},
	"click .btn#editGroup":function(){
	    /*
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.GROUPEDIT);//设置视图状态
		return;
		var id = Session.get("checkedTreeNode")["id"];
		var group= {'property':{'sv_name':'测试pc设备组','sv_description':'测试pc设备组'},'return':{'id':id}};
		SvseDao.editNode(group);
		*/
		// $("#showGroupEditdiv").modal('show');
	},
	"click a#forbidGroup" : function(e){
		/*
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "group") return;
		var id  = Session.get("checkedTreeNode")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SvseDao.forbidNodeForever([id],function(result){});
		//console.log("forbidGroup");
		*/
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
	    if(!groupsIds.length)
	        return;
	    console.log("禁用的组是：");
	    console.log(groupsIds);
	    SvseDao.forbidNodeForever(groupsIds,function(result){});
	},
	"click a#allowGroup":function(e){
	    var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
	    if(!groupsIds.length)
	        return;
	    console.log("启用的组是：");
	    console.log(groupsIds);
	    SvseDao.enableNode(groupsIds,function(err){});
	},
	"click .btn#addEntity":function(){
	//	if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] === "entity") return;
		SwithcView.view(MONITORVIEW.ENTITYGROUP);//设置视图状态
	//	$("#showEntityGroupDiv").modal('show');
		SwithcView.render(MONITORVIEW.ENTITYGROUP,LAYOUTVIEW.NOTOPERATION);
	},
	"click .btn#editEntity":function(){
	//	if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
	//	SystemLogger(Session.get("checkedTreeNode"));
		if(!SessionManage.getCheckedTreeNode() || SessionManage.getCheckedTreeNode("type") !== "entity")
			return;
		SwithcView.view(MONITORVIEW.ENTITYEDIT);//设置视图状态
	},
	"click a#forbidEntity" : function(e){
	/*
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		var id  = Session.get("checkedTreeNode")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SystemLogger("启用设备"+id)
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SystemLogger("禁用设备"+id)
		SvseDao.forbidNodeForever([id],function(result){});
		*/
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
	    if(!entityIds.length)
	        return;
	    console.log("禁用的设备是：");
	    console.log(entityIds);
	    return;
	    SvseDao.forbidNodeForever(entityIds,function(result){
			if(!result.status){
				console.log(result.msg)
			}
		});
	},
	"click a#allowEntity":function(){
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
	    if(!entityIds.length)
	        return;
	    console.log("启用的设备是：");
	    console.log(entityIds);
	    return;
	    SvseDao.enableNode(entityIds,function(result){
			if(!result.status){
				console.log(result.msg)
			}
		});
	},
	"click a#removeNodes":function(){ 
		//删除子节点
		var entityIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableEntityList");
		var groupsIds = ClientUtils.tableGetSelectedAll("showGroupAndEntityTableGroupList");
	//	var parentid  = Session.get("checkedTreeNode").id;
		var parentid  = SessionManage.getCheckedTreeNode("id");
		var ids = entityIds.concat(groupsIds);
		if (!ids.length)
			return;
		SvseDao.removeNodesByIds(ids,parentid,function(result) {
			if(result.status){
				console.log("删除成功");
			}else{
				console.log("删除失败");
			}
		});
		
	},
	"click .btn#addMonitor":function(){
	//	if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
	//	SwithcView.view(MONITORVIEW.MONITORTEMPLATES);//设置视图状态 监视器模板选择
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
		/*
		if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		var monitorid = Session.get("checkedMonitorId")["id"];
		var parentid  = Session.get("checkedTreeNode")["id"];
		SystemLogger(monitorid+"::"+parentid);
		SvseMonitorDao.deleteMonitor(monitorid,parentid,function(result){
			SystemLogger("a#deleteMonitor");
			SystemLogger(result);
		});
		*/
		var monitorIds =  ClientUtils.tableGetSelectedAll("showMonitorList");
	//	var parentid  = Session.get("checkedTreeNode")["id"];
		var parentid = SessionManage.getCheckedTreeNode("id");
		console.log("delete monitorids:");
		console.log(monitorIds);
		SvseMonitorDao.deleteMultMonitors(monitorIds,parentid,function(result){
			if(result.status){
				console.log("删除成功");
			}else{
				console.log("删除失败");
			}
		})
	},
	"click a#forbidMonitor" : function(e){
		
		//if(!Session.get("checkedMonitorId")||Session.get("checkedMonitorId")["type"] !== "monitor") return;
		/*
			1.判断当前选中的树节点是否为 设备，不是则不做任何事情
			2.根据存在Sesion中的监视器id来禁用启用监视器
		
		if(!Session.get("checkedTreeNode")||Session.get("checkedTreeNode")["type"] !== "entity") return;
		var id = Session.get("checkedMonitorId")["id"];
		var status = e.target.name;
		if(status === "enable"){
			SvseDao.enableNode([id],function(err){});
			return;
		}
		SvseDao.forbidNode([id],function(err){});
		*/
		
		var montitorsids = ClientUtils.tableGetSelectedAll("showMonitorList");
	    if(!montitorsids.length)
	        return;
	    console.log("禁用的监视器是：");
	    console.log(montitorsids);
	    SvseDao.forbidNodeForever(montitorsids,function(result){
			if(!result.status){
				console.log(result.msg)
			}
		});
	},
	"click a#allowMonitor":function(){
		var montitorsids = ClientUtils.tableGetSelectedAll("showMonitorList");
	    if(!montitorsids.length)
	        return;
	    console.log("启用的监视器是：");
	    console.log(montitorsids);
	    return;
	    SvseDao.enableNode(montitorsids,function(result){
			if(!result.status){
				console.log(result.msg)
			}
		});
	},
	"click .btn#refresh" : function(){
		SvseDao.refreshTreeData();
	}
}