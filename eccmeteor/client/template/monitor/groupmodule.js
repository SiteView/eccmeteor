Template.showGroupAndEntity.svid = function () {
//	return Session.get("svid");
    return SessionManage.getSvseId();
}

Template.showGroupAndEntity.events({
     "click #showGroupAndEntityTableGroupList button[name='trash']":function(e){
		var id = e.target.id;
		console.log("删除组id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
    "click #showGroupAndEntityTableGroupList button[name='edit']":function(e){
        var id = e.target.id;
        Session.set("showGroupAndEntityEditGroupId",id);
        console.log("编辑组id:"+id);
        $("#showGroupEditdiv").modal('show');
    },
    "click #showGroupAndEntityTableEntityList button[name='trash']":function(e){
		var id = e.target.id;
		console.log("删除设备id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
    "click #showGroupAndEntityTableEntityList button[name='edit']":function(e){
        var id = e.target.id;
        console.log("编辑设备id:"+id);
        Session.set("showGroupAndEntityEditEntityId",id);
        $("#showEditEntityDiv").modal('show');
    },
});


Template.showGroupAndEntity.rendered = function(){
    $(function(){
        //隐藏所有操作按钮
        ClientUtils.hideOperateBtnInTd("showGroupAndEntityTableGroupList");
        //初始化 checkbox事件
        ClientUtils.tableSelectAll("showGroupAndEntityTableGroupSelectAll");
        //初始化tr点击变色效果
        ClientUtils.trOfTableClickedChangeColor("showGroupAndEntityTableGroupList");
        //tr 鼠标悬停显示操作按钮效果
        ClientUtils.showOperateBtnInTd("showGroupAndEntityTableGroupList");
        // -------------------------------------------------------------
        //隐藏所有操作按钮
        ClientUtils.hideOperateBtnInTd("showGroupAndEntityTableEntityList");
        //初始化 checkbox事件
        ClientUtils.tableSelectAll("showGroupAndEntityTableEntitySelectAll");
        //初始化tr点击变色效果
        ClientUtils.trOfTableClickedChangeColor("showGroupAndEntityTableEntityList");
        //tr 鼠标悬停显示操作按钮效果
        ClientUtils.showOperateBtnInTd("showGroupAndEntityTableEntityList");
    });
}