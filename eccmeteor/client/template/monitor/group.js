Template.showGroupAdd.events ={
	"click #saveBtn":function(){
		var arr = $("#showGroupAdd").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var parentid = Session.get("checkedTreeNode")["id"];
		var group = {'property':property};
		SvseDao.addGroup(group,parentid,function(result){
			if(result.status){
				SystemLogger(result.msg);
			}else{
				Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY); //设置视图状态
			}
		});
	}
}
Template.showGroupEdit.getGroup = function(){
	var id = Session.get("checkedTreeNode")["id"];
	return SvseDao.getGroup(id);
}

Template.showGroupEdit.events({
	"click #saveBtn":function(){
		var arr = $("#showGroupEdit").serializeArray();
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
	}
});