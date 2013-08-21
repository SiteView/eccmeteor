Template.showEntityGroup.entityGroup = function(){
	return SvseEntityTemplateDao.getEntityGroup();
}

Template.showEntityGroup.events = {
	"click tr":function(e){
		var id = e.currentTarget.id;
		if(!id)return;
		Session.set("showEntityId",id);
		//Session.set("viewstatus",MONITORVIEW.ENTITYITEM);//设置视图状态
		$("#showEntityDiv").modal("show");
	},
	"click #showEntityGroupBackBtn":function(){
		SwithcView.render(MONITORVIEW.GROUPANDENTITY,LAYOUTVIEW.NODE);
	}
}

Template.showEntityGroup.getEntityPropertyById = function(id){
	return SvseEntityTemplateDao.getEntityPropertyById(id);
}

Template.showEntity.getEntityItemsById = function(id){
	return SvseEntityTemplateDao.getEntityItemsById(id);
}

Template.showEntity.showEntityId = function(){
	return Session.get("showEntityId");
}

Template.showEntity.events = {
	"click #showEntityFormSaveBtn":function(){
	//	var checkedTreeNode =  Session.get("checkedTreeNode");//该node为父节点
		var checkedTreeNode = SessionManage.getCheckedTreeNode();
		var arr = $("#showEntityForm").serializeArray();
		var property = {};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		if(!property["sv_dependson"]){
			property["sv_dependson"] = "";
		}
		property["sv_devicetype"] = Session.get("showEntityId");
		var parentid =checkedTreeNode.id;
		var entity ={"property":property};
		SystemLogger(entity);
		SvseEntityTemplateDao.addEntity(entity,parentid,function(result){
			if(!result.status){
				SystemLogger("SvseEntityTemplateDao.addEntity 捕捉到错误");
				SystemLogger(result);
				$("#showEntityDiv").modal("hide");
				return;
			}
			$("#showEntityDiv").modal("hide");
			var entityid = result.option['id'];
			console.log("添加的设备ID是 "+entityid);
			SessionManage.setAddedEntityId(entityid);//临时数据管理
		//	Session.set("viewstatus",MONITORVIEW.QUICKLYADDMONITY);	//跳到快速添加页面
			$("#showQuickMonityTemplatediv").modal("show");	
		});
	},
	"click #showEntityFormCancelBtn":function(){
		$("#showEntityDiv").modal("hide");
	}
};
/*
Template.showEditEntity.entityId = function(){
	return Session.get("checkedTreeNode").id;
}

Template.showEditEntity.property=function(id){
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvId(id);
}

Template.showEditEntity.getItemsAndDefaultValueBySvIdAndDevicetype = function(sv_id){
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(sv_id);//根据SvseTree中的sv_id获取获取设备类型（即SvseEntityTempalate中的return.id）;
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvIdAndDevicetype(sv_id,devicetype);
}
*/
Template.showEditEntity.getItemsAndDefaultValue=function(){
	var id = Session.get("showGroupAndEntityEditEntityId");
	if(!id) return;
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvId(id);
}
Template.showEditEntity.getItemsAndDefaultValueBySvIdAndDevicetype = function(){
	var id = Session.get("showGroupAndEntityEditEntityId");
	if(!id) return;
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);//根据SvseTree中的sv_id获取获取设备类型（即SvseEntityTempalate中的return.id）;
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvIdAndDevicetype(id,devicetype);
}

Template.showEditEntity.events = {
	"click #showEditEntityFormSaveBtn":function(){
	//	var checkedTreeNode =  Session.get("checkedTreeNode");//该node为设备节点本身
		var checkedTreeNode =SessionManage.getCheckedTreeNode();
		var arr = $("#showEditEntityForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		
		if(!property["sv_dependson"]){
			property["sv_dependson"] = "";
		}
		
		//property["sv_devicetype"] = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(Session.get("checkedTreeNode").id);
		//var entityid =checkedTreeNode.id;
		var entityid = Session.get("showGroupAndEntityEditEntityId"); 
		property["sv_devicetype"] = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(entityid);
		
		var entity ={"property":property,"return":{id:entityid}};
		SystemLogger(entity);
		SvseEntityTemplateDao.editEntity(entity,entityid,function(result){
			if(!result.status){
				SystemLogger(err);
				SystemLogger("editEntity 捕捉到错误");
				return;
			}
		//	Session.set("viewstatus",MONITORVIEW.MONTIOTR);
			$("#showEditEntityDiv").modal('hide');
		});
	},
	"click #showEditEntityFormCancelBtn":function(){
		//Session.set("viewstatus",MONITORVIEW.MONTIOTR);
		$("#showEditEntityDiv").modal('hide');
	}
}