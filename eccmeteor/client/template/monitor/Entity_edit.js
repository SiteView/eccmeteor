Template.EditEntity.events = {
	"click #showEditEntityFormSaveBtn":function(e,t){
		var arr = $(t.find("form")).serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"]){
			property["sv_dependson"] = "";
		}
		var entityid = t.find("input:hidden").value;
		property["sv_devicetype"] = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(entityid);
		var entity ={"property":property,"return":{id:entityid}};
		LoadingModal.loading();
		SvseEntityTemplateDao.editEntity(entity,entityid,function(result){
			RenderTemplate.hideParents(t);
			LoadingModal.loaded();
			if(!result.status){
				Log4js.error(err);
				Message.error("editEntity 捕捉到错误");
				return;
			}
			Message.success("修改成功",{time:1});
		});
	},
	"click #showEditEntityFormCancelBtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click .close":function(e,t){
		RenderTemplate.hideParents(t);
	}
}