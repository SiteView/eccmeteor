//树的渲染
Template.moitorContentTree.rendered = function(){
	Session.set("MoitorContentTreeRendered",true);
}
/*
*构建设置树
*/
var drawSvseSettingTree = function(){
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		callback:{
			onClick:function(event, treeId, treeNode){
			    //设置布局
			    SwithcView.layout(LAYOUTVIEW.SettingLayout);
			    //引用 navsetting.js中的函数
				NavigationSettingTree.execute(treeNode.action);
				SessionManage.clear();//清空一些Session值
				//点击父节点展开
				var treeObj = $.fn.zTree.getZTreeObj("setting_tree");
				treeObj.expandNode(treeNode,!treeNode.open, false, true,true);
			},
			/*
			*节点展开事件
			*/
			onExpand:function(event, treeId, treeNode){
				SettingNodeRemenber.remenber(treeNode.id); //记住展开节点	
			},
			/*
			*节点折叠事件
			*/
			onCollapse:function(event, treeId, treeNode){
				SettingNodeRemenber.forget(treeNode.id); //删除展开节点
			}
		},
	};
	if($.fn.zTree)
		$.fn.zTree.init($("#setting_tree"), setting, expandSimpleTreeNode(NavigationSettingTree.getTreeData(),SettingNodeRemenber.get()));
}

/*
*展开树
*/
var expandSimpleTreeNode = function(zNodes,expandnodeids){
	var branch = [];
	if(!expandnodeids.length) 
		return zNodes;
	for(index in expandnodeids){
		for(jndex in zNodes){
			if(expandnodeids[index] == zNodes[jndex].id){
				zNodes[jndex].open = true;
				break;
			}
		}
	}
	return zNodes;
}

/*
*构建设备树
*/
var drawSvseSimpleTree = function(){
	var data = SvseDao.getTreeSimple();
	var setting = {
		data: {
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: "0",
			}
		},
		callback:{
			onClick:function(event, treeId, treeNode){
			    //设置布局
				SwithcView.layout(LAYOUTVIEW.EquipmentsLayout);
				var id= treeNode.id;
				var type = treeNode.type;
				var checkedTreeNode = {};
				checkedTreeNode.id = id;
				checkedTreeNode.type=type;
				checkedTreeNode.name = treeNode.name;
				//记录点击的节点。根据该节点获取 编辑增加设备时的基本信息;
				SessionManage.setCheckedTreeNode(checkedTreeNode);
				if(type !== "entity"){
				    //设置视图状态
					SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
				//	SessionManage.setSvseId(id);
					SessionManage.clearMonitorRuntimeDate();//清空一些监视数据session
				}else{
					SwithcView.view(MODULEVIEW.ENTITYMODULE);
				}
			//	SessionManage.setEntityId(id);
				//点击父节点展开
				var treeObj = $.fn.zTree.getZTreeObj("svse_tree");
				treeObj.expandNode(treeNode, !treeNode.open, false, true,true);
			},
			/*
			*节点展开事件
			*/
			onExpand:function(event, treeId, treeNode){
				TreeNodeRemenber.remenber(treeNode.id); //记住展开节点
			},
			/*
			*节点折叠事件
			*/
			onCollapse:function(event, treeId, treeNode){	
				TreeNodeRemenber.forget(treeNode.id); //删除展开节点
			}
		}
	}
	if($.fn.zTree)
		$.fn.zTree.init($("#svse_tree"), setting,expandSimpleTreeNode(data,TreeNodeRemenber.get()));
}

/**
*构建树
**/
Deps.autorun(function(c){
	if(SessionManage.isCollectionCompleted(CONLLECTIONMAP.SVSE)&&Session.get("MoitorContentTreeRendered")){
		drawSvseSimpleTree();
		drawSvseSettingTree();
	}
});

Deps.autorun(function(c){
	var language = Session.get("language");
	if(language){
		drawSvseSettingTree();
	}
})