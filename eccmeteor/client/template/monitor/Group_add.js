Template.GroupAdd.events ={
	"click #showGroupAddFormSaveBtn":function(e,t){
		var arr = $("#showGroupAddForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var parentid = SessionManage.getCheckedTreeNode("id");
		var group = {'property':property};
		SvseDao.addGroup(group,parentid,function(result){
			if(!result.status){
				Log4js.error(result.msg);
			}
			RenderTemplate.hideParents(t);
		});
	},
	"click #showGroupAddFormCancelBtn":function(t){
		RenderTemplate.hideParents(t);
	}
}
