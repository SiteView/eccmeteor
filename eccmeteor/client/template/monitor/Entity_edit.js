Template.EditEntity.getItemsAndDefaultValue=function(){
	var id = Session.get("showGroupAndEntityEditEntityId");
	if(!id) return;
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvId(id);
}
Template.EditEntity.getItemsAndDefaultValueBySvIdAndDevicetype = function(){
	var id = Session.get("showGroupAndEntityEditEntityId");
	if(!id) return;
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);//根据SvseTree中的sv_id获取获取设备类型（即SvseEntityTempalate中的return.id）;
	return SvseEntityTemplateDao.getItemsAndDefaultValueBySvIdAndDevicetype(id,devicetype);
}

Template.EditEntity.events = {
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