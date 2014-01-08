MoitorContentTree = function(){};

Object.defineProperty(MoitorContentTree,"initTree",{
	value:function(){
		MoitorContentTree.drawSvseSimpleTree("1");
		MoitorContentTree.drawSvseSettingTree();
	}
});
/*
*构建设置树
*/
Object.defineProperty(MoitorContentTree,"drawSvseSettingTree",{
	value:function(){
		var _self = this;
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
				_self.expandTreeNode(treeId,treeNode);
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
	if(!$.fn.zTree){
		return ;
	}
	var settingTreeNodes = NavigationSettingTree.getTreeData();
	var rememberNodes = SettingNodeRemenber.get();
	var expandNodes = _self.expandSimpleTreeNode(settingTreeNodes,rememberNodes);
	$.fn.zTree.init($("#setting_tree"), setting, expandNodes);
	}
});

/*
*构建设备树
*/
Object.defineProperty(MoitorContentTree,"drawSvseSimpleTree",{
	value:function(defaultSelectNodeId){
		var _self = this;
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
					var checkedTreeNode = _self.changeTreeNodeToCheckedNode(treeNode);
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
					_self.expandTreeNode(treeId,treeNode,treeNode.id);
					
				},
				onDblClick:function(event, treeId, treeNode){},
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

		var tree = $.fn.zTree.init($("#svse_tree"), setting,_self.expandSimpleTreeNode(data,TreeNodeRemenber.get()));
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
		var defaultCheckedNode = _self.changeTreeNodeToCheckedNode(defaultSelectNode);
		SessionManage.setCheckedTreeNode(defaultCheckedNode); //更换树中存储的节点数据
		//设置视图状态
		if(defaultCheckedNode.type !== "entity"){
			SwithcView.view(MONITORVIEW.GROUPANDENTITY); 
			SessionManage.clearMonitorRuntimeDate();//清空一些监视数据session
		}else{
			SwithcView.view(MODULEVIEW.ENTITYMODULE);
		}
	}
})

/**
展开某个节点
*/
Object.defineProperty(MoitorContentTree,"expandTreeNode",{
	value:function(treeId,treeNode,id){
		if(treeNode.open){
			return;
		}
		Session.set("ClickExpandTreeNodeId",id);
		return;
		//这样写有bug ，导致点击的节点不会展开，而上一次的节点展开，初步判断是函数作用域导致treeNode对象未保存
		//实际上造成代码在哪不明。暂时使用Deps.autorun完成
		var tree = $.fn.zTree.getZTreeObj(treeId);
		console.log(treeNode);
		if(id){
			treeNode = tree.getNodeByParam("id",id)
		}
		var result = tree.expandNode(treeNode,true, false, true,true);
		console.log(result);
	}
});
/*
*展开树
*/
Object.defineProperty(MoitorContentTree,"expandSimpleTreeNode",{
	value:function(zNodes,expandnodeids){
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
});
/**
树节点转存在Session中的节点
*/
Object.defineProperty(MoitorContentTree,"changeTreeNodeToCheckedNode",{
	value:function(treeNode){
		return {
			id:treeNode.id,
			type:treeNode.type,
			name:treeNode.name
		};
	}
});

Deps.autorun(function(){
	var id = Session.get("ClickExpandTreeNodeId")
	var tree = null
	if($.fn.zTree && id && (tree = $.fn.zTree.getZTreeObj("svse_tree"))){
		var node = tree.getNodeByParam("id",id);
		tree.expandNode(node,true, false, true,true);
	}
});

Deps.autorun(function(c){
	var language = Session.get("language");
	if(language){
		MoitorContentTree.drawSvseSettingTree();
	}
})