Template.showGroupAdd.events ={
	"click #saveBtn":function(){
		var arr = $("#showGroupAdd").serializeArray();
		var property = ClientUtils.formArrayToObject(arr);
		if(!property["sv_dependson"])
			property["sv_dependson"] = "";
		var parentid = Session.get("checkedTreeNode")["id"];
		var group = {'property':property};
		SvseDao.addNode(group,parentid,function(err){
			if(err){
				SystemLogger(err);
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