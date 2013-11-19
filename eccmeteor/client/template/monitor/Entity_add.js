/*
Template.AddEntity.getEntityItemsById = function(id){
	if(!id)
		return [];
	return SvseEntityTemplateDao.getEntityItemsById(id);
}

Template.AddEntity.showEntityId = function(){
	//return Session.get("_showEntityId");
	return Session.get(SessionManage.MAP.CHECKEDENTITYTEMPLATEID);
}
*/
Template.AddEntity.events = {
	"click #showEntityFormSaveBtn":function(e,t){
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
	//	property["sv_devicetype"] = Session.get("_showEntityId");
	//	property["sv_devicetype"] = Session.get(SessionManage.MAP.CHECKEDENTITYTEMPLATEID);
		property["sv_devicetype"] =  t.find("input:hidden").value;
		var parentid =checkedTreeNode.id;
		var entity ={"property":property};
		SystemLogger(entity);
		LoadingModal.loading();
		SvseEntityTemplateDao.addEntity(entity,parentid,function(result){
			LoadingModal.loaded();
			RenderTemplate.hideParents(t);
			if(!result.status){
				Log4js.error("SvseEntityTemplateDao.addEntity 捕捉到错误");
				Log4js.error(result);
				return;
			}
			var entityid = result.option['id'];
			SessionManage.setAddedEntityId(entityid);//临时数据管理
		//	Session.set("viewstatus",MONITORVIEW.QUICKLYADDMONITY);	//跳到快速添加页面
			$("#showQuickMonityTemplatediv").modal("show");
		});
	},
	"click #showEntityFormCancelBtn":function(){
		//$("#showAddEntityDiv").modal("hide");
		RenderTemplate.hideParents(t);
	},
	"click #showEntityTemplateAgainBtn":function(e,t){
		//$("#showAddEntityDiv").modal("hide");
		RenderTemplate.hideParents(t);
	//	$("#entitiesGroupByTypeDiv").modal('show');
		var group = SvseEntityTemplateDao.getEntityGroup();
		RenderTemplate.showParents("#ChooseEntityTemplateForAddEntity","EntitiesGroupByType",{entityGroup:group});
	}
};