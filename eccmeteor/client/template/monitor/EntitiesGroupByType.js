Template.EntitiesGroupByType.events({
	"click tr":function(e,t){
		var id = this.sv_id;
		//异步
		if(SvseEntityTemplateDao.isEmpty()){
			LoadingModal.loading();
			SvseEntityTemplateDao.getEntityItemsByIdAsync(function(EntityItems){
				LoadingModal.loaded();
				RenderTemplate.showParents("#AddEntityModal","AddEntity",{EntityItems:EntityItems,id:id});
			});
		}else{
			RenderTemplate.hideParents(t);
			var EntityItems = SvseEntityTemplateDao.getEntityItemsByIdSync(id);
			RenderTemplate.showParents("#AddEntityModal","AddEntity",{EntityItems:EntityItems,id:id});
		}		
	}
})

Template.EntitiesGroupByType.rendered = function(){
	ModalDrag.draggable($(this.find(".modal")));
}