Template.EntitiesGroupByType.entityGroup = function(){
	return SvseEntityTemplateDao.getEntityGroup();
}

Template.EntitiesGroupByType.getEntityPropertyById = function(id){
	return SvseEntityTemplateDao.getEntityPropertyById(id);
}

Template.EntitiesGroupByType.events({
	"click tr":function(e){
		var id = e.currentTarget.id;
		if(!id)return;
		Session.set("_showEntityId",id);
		//Session.set("viewstatus",MONITORVIEW.ENTITYITEM);//设置视图状态
		$("#entitiesGroupByTypeDiv").modal('hide');
		$("#showAddEntityDiv").modal("show");
	}
})