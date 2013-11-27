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
				//点击父节点展开 //已经展开则不做什么改变
				if(treeNode.open){
					return;
				}
				var treeObj = $.fn.zTree.getZTreeObj("setting_tree");
				treeObj.expandNode(treeNode,true, false, true,true);
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
/**
树节点转存在Session中的节点
*/
var changeTreeNodeToCheckedNode = function(treeNode){
	return {
		id:treeNode.id,
		type:treeNode.type,
		name:treeNode.name
	};
}

/*
*构建设备树
*/
var drawSvseSimpleTree = function(defaultSelectNodeId){
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
				var type = treeNode.type;
				var checkedTreeNode = changeTreeNodeToCheckedNode(treeNode);
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
				//点击父节点展开 //已经展开则不做
				if(treeNode.open){
					return;
				}
				var treeObj = $.fn.zTree.getZTreeObj("svse_tree");
				treeObj.expandNode(treeNode,true, false, true,true);
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
	if(!$.fn.zTree){
		return ;
	}

	var tree = $.fn.zTree.init($("#svse_tree"), setting,expandSimpleTreeNode(data,TreeNodeRemenber.get()));
	//1 . 判断Session中是否存在选中节点
	if(!defaultSelectNodeId){
		return;
	}
	//2.Session中存的节点是否还在数据库中
	//选中节点存在数据库中  //在树上选中该节点既可
	if(SvseTreeDao.getNodeById(defaultSelectNodeId)){
		var defaultSelectNode = tree.getNodeByParam("id",defaultSelectNodeId);
		tree.selectNode(defaultSelectNode);
		return;
	}
	//选中节点不存在数据库中 多客户端可能删除当前选择节点
	//获取该节点的父节点
	defaultSelectNodeId = defaultSelectNodeId.substr(0,defaultSelectNodeId.lastIndexOf("\.")); 
	//如果这个节点的父节点也不存在则选择根节点 
	if(!SvseTreeDao.getNodeById(defaultSelectNodeId)){ 
		defaultSelectNodeId = "1";
	}
	var defaultSelectNode = tree.getNodeByParam("id",defaultSelectNodeId);
	tree.selectNode(defaultSelectNode); //在树上选中该节点
	var defaultCheckedNode = changeTreeNodeToCheckedNode(defaultSelectNode);
	SessionManage.setCheckedTreeNode(defaultCheckedNode); //更换树中存储的节点数据
	//设置视图状态
	if(defaultCheckedNode.type !== "entity"){
		SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
		SessionManage.clearMonitorRuntimeDate();//清空一些监视数据session
	}else{
		SwithcView.view(MODULEVIEW.ENTITYMODULE);
	}
}

/**
*构建树
**/
Deps.autorun(function(c){
	if(SessionManage.isCollectionCompleted(CONLLECTIONMAP.SVSE)&&Session.get("MoitorContentTreeRendered")){
		drawSvseSimpleTree(SessionManage.getCheckedTreeNode("id"));
		drawSvseSettingTree();
	}
});

Deps.autorun(function(c){
	var language = Session.get("language");
	if(language){
		drawSvseSettingTree();
	}
})