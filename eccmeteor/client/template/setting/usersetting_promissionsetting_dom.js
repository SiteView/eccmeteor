UserSettingPromissionAction = function(){};

Object.defineProperty(UserSettingPromissionAction,"userPromissionRender",{
	value:function(template){

		this.initTree(template);
		return;
		console.log("render Master");
		var uid = template.find("input:hidden#promissionUserId");
		var data = SvseUserDao.getNodeOpratePermissionByUserId(uid); //初始化当前用户的授权信息到临时数据
		Session.set("userPromissionSettingGroupControlData",data);//存储设备节点的操作信息到临时数据里面
		var operationData = SvseUserDao.getSettingOperatePermissionByUserId(uid);
		Session.set("userPromissionSettingOperationControlData",operationData);//存储其他 节点的操作信息
		//左上 树的勾选
		var displayNodes = SvseUserDao.getDisplayNodesByUserId(uid);//获取设备树的展示状态
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_promission_check");
		console.log(typeof treeObj);
		treeObj.checkAllNodes(false);//清空上一个用户状态
		//节点勾选
		for(var index  = 0; index < displayNodes.length ; index++){
			treeObj.checkNode(treeObj.getNodesByFilter(function(node){
				return  node.id  === displayNodes[index];
			}, true), true);
		}
		//左下 树的勾选
		var displaySettingNodes = SvseUserDao.getDisplaySettingNodesByUserId(user._id);//获取设置树的展示状态
		var treeObj2 = $.fn.zTree.getZTreeObj("svse_other_promission_check");
		treeObj2.checkAllNodes(false);//清空上一个用户状态
		//节点勾选
		for(var index2  = 0; index2 < displaySettingNodes.length ; index2++){
			treeObj2.checkNode(treeObj2.getNodesByFilter(function(node){
				return  node.action  === displaySettingNodes[index2];
			}, true), true);
		}
	}
});

Object.defineProperty(UserSettingPromissionAction,"userPromissionSave",{
	value:function(e,t,context){
		var  data  = Session.get("userPromissionSettingGroupControlData");
		var operationData =  Session.get("userPromissionSettingOperationControlData");
		if(!data){
			RenderTemplate.hideParents(t);
			return;
		}
		console.log("权限是");
		console.log(data);
		
		var svsenodes = [];
		//获取可见节点授权
		var svsenodearr = $.fn.zTree.getZTreeObj("svse_tree_promission_check").getNodesByFilter(function(node){return node.checked});
		for(index in svsenodearr){
			svsenodes.push(svsenodearr[index].id);
		}
		console.log("勾选节点是：");
		console.log(svsenodes);
		var uid = $("#userPromissionSettingDiv #promissionUserId").val();
		
		var svseOperateNodeArr = $.fn.zTree.getZTreeObj("svse_other_promission_check").getNodesByFilter(function(node){return node.checked});
		var svseOperateNodes = [];
		for(svseOperateNodeArrIndex in svseOperateNodeArr){
			svseOperateNodes.push(svseOperateNodeArr[svseOperateNodeArrIndex].action);
		}
		//存储可见节点数据
		SvseUserDao.setDisplayPermission(uid,svsenodes,svseOperateNodes,function(result){
			console.log(result);
		});
		console.log("uid setNodeOpratePermission " +uid);
		//存储节点操作权限
		SvseUserDao.setNodeOpratePermission(uid,ClientUtils.changePointAndLine(data),function(result){
			console.log(result);
		});
		console.log("uid setSettingOperatePermission " +uid);
		//存储设置节点操作权限
		SvseUserDao.setSettingOperatePermission(uid,operationData,function(result){
			console.log(result);
		});
		//清空Session中的临时数据
		this.clearUserPromissionSettingGroupControlData();
		RenderTemplate.hideParents(t);
	}
});

Object.defineProperty(UserSettingPromissionAction,"userPromissionCancel",{
	value:function(e,t,context){
		console.log("userPromissionSettingCloseBtn close");
		this.clearUserPromissionSettingGroupControlData();//清空Session中的临时数据
		RenderTemplate.hideParents(t);
	}
});

//清除临时数据
Object.defineProperty(UserSettingPromissionAction,"clearUserPromissionSettingGroupControlData",{
	value:function(){
		Session.set("userPromissionSettingGroupControlData",null);//清空Session中的临时数据
		Session.set("userPromissionSettingGroupControlNodeId",null);
		Session.set("userPromissionSettingGroupControlType",null);
		Session.set("userPromissionSettingOperationControlData",null);
		Session.set("userPromissionSettingOperationControlAction",null);
		Session.set("userpromissViewType",null);
	}
});

Object.defineProperty(UserSettingPromissionAction,"initTree",{
	value:function(template){
		console.log("render Children");
		this.initTreeSimple(template);
		this.initSettingTree(template);
	}
});

Object.defineProperty(UserSettingPromissionAction,"initTreeSimple",{
	value:function(template){
		var action = this.treeSimpleNodeClickAction;
		var data = SvseDao.getTreeSimple();
		var svsesetting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
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
					action(treeId, treeNode);
				}
			}
		};
		$.fn.zTree.init($(template.find("#svse_tree_promission_check")), svsesetting, data);
	}
});

Object.defineProperty(UserSettingPromissionAction,"treeSimpleNodeClickAction",{
	value:function(treeId, treeNode){
		Session.set("userpromissViewType","svse")
		//第一步  获取当前操作节点 
		var currend_id= treeNode.id;	//当前节点的ID
		var current_type = treeNode.type === "entity" ? "entity" : "group" ;//当前节点类型
		console.log("当前节点ID是" + currend_id  +"  节点类型是 " + current_type);
		//第二步  从内存中读取当前节点的操作权限，在界面上选中相关节点
		var  data  = Session.get("userPromissionSettingGroupControlData");
		//绘制当前节点的权限的checkbox选中情况 //当且仅当连续连两次点击的节点类型相同时进行重绘
		if(Session.get("userPromissionSettingGroupControlType") !== current_type){
			//存储当前节点信息
			Session.set("userPromissionSettingGroupControlNodeId",currend_id); //存储临时信息
			Session.set("userPromissionSettingGroupControlType",current_type); //改变模板状态	
			return;
		}
		if(!data){
			return;
		}
		var promissionCheckboxs = data[currend_id];
		console.log("promissionCheckboxs:  ");
		console.log(promissionCheckboxs);
		//改变权限checkbox的状态为未选中
		$("#userPromissionSettingGroupControlForm :checkbox").each(function(){
			this.checked = false;
		});//清空选项
		//如果当前节点不存在授权
		if(!promissionCheckboxs)
			return;
		//勾选相应的权限选项
		for(promission in promissionCheckboxs){
			if(!$("#userPromissionSettingGroupControlForm :checkbox[name="+promission+"]")[0]){
				console.log(promission);
				continue;
			}
			try{
				$("#userPromissionSettingGroupControlForm :checkbox[name="+promission+"]")[0].checked = promissionCheckboxs[promission];
			}catch(e){
				console.log(e);
			}
		}	
		Session.set("userPromissionSettingGroupControlNodeId",currend_id); //存储临时信息
		Session.set("userPromissionSettingGroupControlType",current_type); //改变模板状态			
	}
});

Object.defineProperty(UserSettingPromissionAction,"initSettingTree",{
	value:function(template){
		//其他设置的树
		var settingdata = NavigationSettingTree.getTreeData();
		var othersetting ={
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
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
					//第一步  获取当前操作节点
					var currend_viewType = treeNode.type;
					var currend_action = treeNode.action;
					Session.set("userpromissViewType",currend_viewType);
					Session.set("userPromissionSettingOperationControlAction",currend_action); //改变模板状态					
				}
			}
		}
		$.fn.zTree.init($(template.find("#svse_other_promission_check")), othersetting, settingdata);
	}
});

