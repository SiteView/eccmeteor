Template.showGroupAndEntity.svid = function () {
//	return Session.get("svid");
    return SessionManage.getSvseId();
}

Template.showGroupAndEntity.getEntityTemplateNameByType = function(type){
    return SvseEntityTemplateDao.getEntityPropertyById(type,"sv_name");
}

Template.showGroupAndEntity.events({
     "click #showGroupAndEntityTableGroupList button[name='trash']":function(e){
		var id = e.currentTarget.id;
		console.log("删除组id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
    "click #showGroupAndEntityTableGroupList button[name='edit']":function(e){
        var id = e.currentTarget.id;
        Session.set("showGroupAndEntityEditGroupId",id);
        console.log("编辑组id:"+id);
        $("#showGroupEditdiv").modal('show');
    },
    "click #showGroupAndEntityTableEntityList button[name='trash']":function(e){
		var id = e.currentTarget.id;
		console.log("删除设备id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
    "click #showGroupAndEntityTableEntityList button[name='edit']":function(e){
        var id = e.currentTarget.id;
        console.log("编辑设备id:"+id);
        Session.set("showGroupAndEntityEditEntityId",id);
        $("#showEditEntityDiv").modal('show');
    },
    "dblclick tbody tr":function(e){
        e.stopPropagation();
        var id = e.currentTarget.id;
        console.log(id);
        var node = SvseTreeDao.getNodeById(id);
        var checkedTreeNode = {
            id:id,
            type:node.type,
            name:node.sv_name
        }
        console.log(checkedTreeNode);
        SwithcView.layout(LAYOUTVIEW.NODE);
        //记录点击的节点。根据该节点获取 编辑增加设备时的基本信息; 
        SessionManage.setCheckedTreeNode(checkedTreeNode);
        if(node.type === "group"){
            SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
            SessionManage.setSvseId(id);
        }else{
            SwithcView.view(MODULEVIEW.ENTITYMODULE);
            SessionManage.setEntityId(id);
        }
    },
    "mouseenter #showGroupAndEntityTableGroupList img":function(e){
        $(e.target).popover('show');
    },
    "mouseleave #showGroupAndEntityTableGroupList img":function(e){
        $(e.target).popover('hide');
    },
    "mouseenter #showGroupAndEntityTableEntityList img":function(e){
        $(e.target).popover('show');
    },
    "mouseleave #showGroupAndEntityTableEntityList img":function(e){
        $(e.target).popover('hide');
    }
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
        //避免双击选中文字，影响UI
        $("td,tr").attr('unselectable','on').bind('selectstart', function(){ return false; });
    });
}