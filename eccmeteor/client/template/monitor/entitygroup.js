Template.showEntityGroup.entityGroup = function(){
	return SvseEntityTemplateDao.getEntityGroup();
}

Template.showEntityGroup.events = {
	"click tr":function(e){
		var id = e.currentTarget.id;
		if(!id)return;
		Session.set("showEntityId",id);
		Session.set("viewstatus",MONITORVIEW.ENTITYITEM);//设置视图状态
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
	"click #addEntity":function(){
		var checkedTreeNode =  Session.get("checkedTreeNode");//该node为父节点
		var arr = $("#entityInfo").serializeArray();
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
		SvseEntityTemplateDao.addEntity(entity,parentid,function(err){
			if(err){
				SystemLogger("SvseEntityTemplateDao.addEntity 捕捉到错误");
				SystemLogger(err);
				return;
			}
			Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY);			
		});
	},
	"click #cancel":function(){
		Session.set("viewstatus",MONITORVIEW.ENTITYGROUP);
	}
};

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

Template.showEditEntity.events = {
	"click #saveEntity":function(){
		var checkedTreeNode =  Session.get("checkedTreeNode");//该node为设备节点本身
		var arr = $("#entityEditInfo").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		
		if(!property["sv_dependson"]){
			property["sv_dependson"] = "";
		}
		property["sv_devicetype"] = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(Session.get("checkedTreeNode").id);
		var entityid =checkedTreeNode.id;
		var entity ={"property":property,"return":{id:entityid}};
		SystemLogger(entity);
		SvseEntityTemplateDao.editEntity(entity,function(err){
			if(err){
				SystemLogger(err);
				SystemLogger("editEntity 捕捉到错误");
				return;
			}
			Session.set("viewstatus",MONITORVIEW.MONTIOTR);
		});
	},
	"click #cancel":function(){
		Session.set("viewstatus",MONITORVIEW.MONTIOTR);
	}
}