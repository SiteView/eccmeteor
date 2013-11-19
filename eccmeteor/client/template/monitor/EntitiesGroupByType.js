/*
Template.EntitiesGroupByType.entityGroup = function(){
	return SvseEntityTemplateDao.getEntityGroup();
}
*/
Template.EntitiesGroupByType.getEntityPropertyById = function(id){
	return SvseEntityTemplateDao.getEntityPropertyById(id);
}

Template.EntitiesGroupByType.events({
	"click tr":function(e,t){
		var id = e.currentTarget.id;
		if(!id)return;
		//Session.set("_showEntityId",id);
		Session.set(SessionManage.MAP.CHECKEDENTITYTEMPLATEID,id);
		//Session.set("viewstatus",MONITORVIEW.ENTITYITEM);//设置视图状态
		//$("#entitiesGroupByTypeDiv").modal('hide');
		RenderTemplate.hideParents(t);
	//	$("#showAddEntityDiv").modal("show");

		var EntityItems = SvseEntityTemplateDao.getEntityItemsById(id);
		RenderTemplate.showParents("#AddEntityModal","AddEntity",{EntityItems:EntityItems,id:id});
	}
})

Template.EntitiesGroupByType.rendered = function(){
	//ModalDrag.draggable("#entitiesGroupByTypeDiv");
	ModalDrag.draggable($(this.find(".modal")));
}