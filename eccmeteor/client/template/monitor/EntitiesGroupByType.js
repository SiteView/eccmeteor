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
		var id = e.currentTarget.id;//模板类型id
		//Session.set(SessionManage.MAP.CHECKEDENTITYTEMPLATEID,id);
		RenderTemplate.hideParents(t);
		var EntityItems = SvseEntityTemplateDao.getEntityItemsById(id);
		console.log("Items:");
		console.log(EntityItems);
		RenderTemplate.showParents("#AddEntityModal","AddEntity",{EntityItems:EntityItems,id:id});
	}
})

Template.EntitiesGroupByType.rendered = function(){
	//ModalDrag.draggable("#entitiesGroupByTypeDiv");
	ModalDrag.draggable($(this.find(".modal")));
}