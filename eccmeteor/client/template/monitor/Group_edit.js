Template.GroupEdit.events({
	"click #showGroupEditFormSaveBtn":function(e,t){
		var arr = $("#showGroupEditForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var selfId = t.find("input:hidden").value;
		var group = {'property':property,'return':{'id':selfId}};
		SvseDao.editGroup(group,selfId,function(result){
			if(!result.status){
				SystemLogger(result.msg);
			}else{
			   RenderTemplate.hideParents(t);
			}
		});
	},
	"click #showGroupEditFormCancelBtn":function(e,t){
	    RenderTemplate.hideParents(t);
	},
	"click .close":function(e,t){
		RenderTemplate.hideParents(t);
	}
});