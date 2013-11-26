var PagerGroup = new Pagination("subgrouplist");
var PagerEntity = new Pagination("subentitylist");
//子组分页
Template.showGroupAndEntity.groupPager = function(){
    var id = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,"subgroup");
    var status = SessionManage.getEntityListFilter();
    status = status === "bad" ? "error" : status ; //监视器时，为bad，设备或组时为error
    return PagerGroup.create(SvseTreeDao.getNodeCountsByIds(childrenIds,status));
}
//设备分页
Template.showGroupAndEntity.entityPager = function(){
    var id = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,"subentity");
    var status = SessionManage.getEntityListFilter();
    status = status === "bad" ? "error" : status ; //监视器时，为bad，设备或组时为error
    return PagerGroup.create(SvseTreeDao.getNodeCountsByIds(childrenIds,status));
}

Template.showGroupAndEntity.getEntityTemplateNameByType = function(type){
    return SvseEntityTemplateDao.getEntityPropertyById(type,"sv_name");
}

Template.showGroupAndEntity.subgroup = function(){
    var id = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,"subgroup");
    var status = SessionManage.getEntityListFilter();  //监视器时，为bad，设备或组时为error
    status = status === "bad" ? "error" : status ;
    var perPage = Session.get("PERPAGE");
    return SvseTreeDao.getNodesByIds(childrenIds,status,PagerGroup.skip({perPage:perPage}));
}

Template.showGroupAndEntity.subentity = function(){
    var id = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,"subentity");
    var status = SessionManage.getEntityListFilter();
    status = status === "bad" ? "error" : status ;//监视器时，为bad，设备或组时为error
    var perPage = Session.get("PERPAGE");
    return SvseTreeDao.getNodesByIds(childrenIds,status,PagerEntity.skip({perPage:perPage}));
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
        var context = {Group:SvseDao.getGroup(id),id:id};
        RenderTemplate.showParents("#EditGroupModal","GroupEdit",context);
    },
    "click #showGroupAndEntityTableEntityList button[name='trash']":function(e){
		var id = e.currentTarget.id;
        LoadingModal.loading();
        SvseDao.deletEquipment(id,function(result){
            LoadingModal.loaded();
            if(!result.status){
                Message.error(result.msg);
            }else{
                Message.success("删除成功！",{time:1});
            }
        });
    },
    "click #showGroupAndEntityTableEntityList button[name='edit']":function(e){
        var id = e.currentTarget.id;
        var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);//根据SvseTree中的sv_id获取获取设备类型（即SvseEntityTempalate中的return.id）;
        var DynamicEntityItems = SvseEntityTemplateDao.getDynamicEntityItems(id,devicetype);
        var StaticEnitityItems = SvseEntityTemplateDao.getStaticEntityItems(id);
        var context = {DynamicEntityItems:DynamicEntityItems,entityId:id,StaticEnitityItems:StaticEnitityItems};
        Log4js.info(StaticEnitityItems);
        RenderTemplate.showParents("#EditEntityModal","EditEntity",context);
    },
    "click tbody tr td a":function(e){ //dblclick tbody tr, 
        e.stopPropagation();
        var id = e.currentTarget.id;
        var node = SvseTreeDao.getNodeById(id);
        var checkedTreeNode = {
            id:id,
            type:node.type,
            name:node.sv_name
        }
        SwithcView.layout(LAYOUTVIEW.EquipmentsLayout);
        //记录点击的节点。根据该节点获取 编辑增加设备时的基本信息; 
        SessionManage.setCheckedTreeNode(checkedTreeNode);
        if(node.type === "group"){
            SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
        }else{
            Log4js.info("****ENTITYMODULE****");
            SwithcView.view(MODULEVIEW.ENTITYMODULE);
        }
    },
    "mouseenter #showGroupAndEntityTableGroupList img":function(e){
        $(e.currentTarget).popover('show');
    },
    "mouseleave #showGroupAndEntityTableGroupList img":function(e){
        $(e.currentTarget).popover('hide');
    },
    "mouseenter #showGroupAndEntityTableEntityList img":function(e){
        $(e.currentTarget).popover('show');
    },
    "mouseleave #showGroupAndEntityTableEntityList img":function(e){
        $(e.currentTarget).popover('hide');
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