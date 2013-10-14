Template.GroupAdd.events ={
	"click #showGroupAddFormSaveBtn":function(){
		var arr = $("#showGroupAddForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
	//	var parentid = Session.get("checkedTreeNode")["id"];
		var parentid = SessionManage.getCheckedTreeNode("id");
		var group = {'property':property};
		SvseDao.addGroup(group,parentid,function(result){
			if(!result.status){
				SystemLogger(result.msg);
				$("#showGroupAdddiv").modal('hide');
			}
		});
	},
	"click #showGroupAddFormCancelBtn":function(){
	    $("#showGroupAdddiv").modal('hide');
	}
}

Template.GroupAdd.rendered = function(){
    $("#showGroupAdddiv").modal('hide');
}