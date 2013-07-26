Template.showGroupAdd.events ={
	"click #showGroupAddFormSaveBtn":function(){
		var arr = $("#showGroupAddForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var parentid = Session.get("checkedTreeNode")["id"];
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

Template.showGroupAdd.rendered = function(){
    $("#showGroupAdddiv").modal('hide');
}

Template.showGroupEdit.getGroup = function(){
	var id = Session.get("checkedTreeNode")["id"];
	return SvseDao.getGroup(id);
}

Template.showGroupEdit.events({
	"click #showGroupEditFormSaveBtn":function(){
		var arr = $("#showGroupEditForm").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var selfId = Session.get("checkedTreeNode")["id"];
		var group = {'property':property,'return':{'id':selfId}};
		SvseDao.editGroup(group,selfId,function(result){
			if(result.status){
				SystemLogger(result.msg);
			}else{
				Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY); //设置视图状态
			}
		});
	},
	"click #showGroupEditFormCancelBtn":function(){
	    $("#showGroupEditdiv").modal('hide');
	}
});

Template.showGroupEdit.rendered = function(){
    $("#showGroupEditdiv").modal('hide');
}
