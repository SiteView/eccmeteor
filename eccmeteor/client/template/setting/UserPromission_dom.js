UserPromissionAction = function(){};

Object.defineProperty(UserPromissionAction,"userPromissionSave",{
	value:function(e,template,context){
		var uid = template.find("input:hidden#promissionUserId").value;
		//save the lastest action
		UserPromissionAction.saveNodeAtLastActionChecked();

		var  nodeControlData  = Session.get("userPromissionSettingGroupControlData");
	//	console.log(nodeControlData);
		var nodeDisplayData = UserPromissionAction.getChoosedTreeNodes();
	//	console.log("勾选节点是：");
	//	console.log(nodeDisplayData);
		//RenderTemplate.hideParents(t);
		var settingControlData  = Session.get("userPromissionSettingOperationControlData");
		var settingNodeDisplayData = UserPromissionAction.getChoosedSettingTreeNodes();
		console.log("勾选节点是：");
		console.log(settingNodeDisplayData);
		console.log(settingControlData);
		//RenderTemplate.hideParents(t
		//save diplay nodes  include svse node and setting node
	//	UserPromissionAction.saveDisplayNodesToDataBase(uid,nodeDisplayData,settingNodeDisplayData);
	}
});

Object.defineProperty(UserPromissionAction,"userPromissionCancel",{
	value:function(e,t,context){
		this.clearUserPromissionSettingGroupControlData();//清空Session中的临时数据
		RenderTemplate.hideParents(t);
	}
});

Object.defineProperty(UserPromissionAction,"chooseUserPromissionViewType",{
	value:function(type,template){
		var templateName = "";
		switch(type){
			case "entity" : templateName = "UserPromissionTypeOfEntity";
				break;
			case "group" : templateName  = "UserPromissionTypeOfGroup";
				break;
			case "AlertRule" : templateName  = "UserPromissionTypeOfAlertRule";
				break;
			case "AlertLog" : templateName = "UserPromissionTypeOfAlertLog";
				break;
			case "AlertPlan" :templateName = "UserPromissionTypeOfAlertStrategy";
				break;
			case "contrast" : templateName = "UserPromissionTypeOfStatisticsReport";
				break;
		}
		if(templateName !== ""){
			RenderTemplate.renderIn(UserPromissionAction._selector,templateName);
		}
	}
});


//清除临时数据
Object.defineProperty(UserPromissionAction,"clearUserPromissionSettingGroupControlData",{
	value:function(){
		Session.set("userPromissionSettingGroupControlData",null);//清空Session中的临时数据
		Session.set("userPromissionSettingGroupControlNodeId",null);
		Session.set("userPromissionSettingGroupControlType",null);
		Session.set("userPromissionSettingOperationControlData",null);
		Session.set("userPromissionSettingOperationControlAction",null);
		Session.set("userpromissViewType",null);
	}
});

Object.defineProperty(UserPromissionAction,"initTree",{
	value:function(template){
		this.initTreeSimple(template);
		this.initSettingTree(template);
	}
});

Object.defineProperty(UserPromissionAction,"initTreeSimple",{
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

Object.defineProperty(UserPromissionAction,"saveNodeAtLastActionChecked",{
	value:function(){
		var lastCheckedNodes = UserPromissionAction.getCheckedbox();
		var type = Session.get("userPromissionLastNodeType");
		if(type === "svse"){
			var id = Session.get("userPromissionSettingGroupControlNodeId");
			id = UserPromissionAction.coverIdToSaveId(id);
			UserPromissionAction.saveTemporaryNodeData(id,lastCheckedNodes);
		}else if(type === "setting"){
			var action = Session.get("userPromissionSettingOperationControlAction");
			UserPromissionAction.saveTemporarySettingNodeData(action,lastCheckedNodes);
		}
	}
})

Object.defineProperty(UserPromissionAction,"_selector",{
	value:"#userPromissionViewType"
});

Object.defineProperty(UserPromissionAction,"getCheckedbox",{
	value:function(selector){
		if(typeof selector === "undefined"){
			selector = UserPromissionAction._selector;
		}
		var beforeCheckbox = $(selector).find(":checkbox[checked]");
		var obj = {};
		if(!beforeCheckbox.length){
			return obj;
		}
		beforeCheckbox.each(function(){
			var d = this;
			obj[d.name] = true;
		});
		return obj;
	}
});

Object.defineProperty(UserPromissionAction,"setCheckedbox",{
	value:function(data,selector){
		if(typeof selector === "undefined"){
			selector =  UserPromissionAction._selector;
		}
		//如果当前节点不存在授权
		if(!data){
			return;
		}
		
		//勾选相应的权限选项
		for(promission in data){
			var box = $(selector).find(":checkbox[name="+promission+"]")[0];
			if(!box){
				continue;
			}
			box.checked =  data[promission];
		}	
	}
});

Object.defineProperty(UserPromissionAction,"coverIdToSaveId",{
	value:function(id){
		if(id){
			return id.replace(/\./g,"-");
		}
	}
});

Object.defineProperty(UserPromissionAction,"compareSettingAndSvse",{
	value:function(current){
		var before = Session.get("userPromissionLastNodeType");
		if(before === current){

		}
	}
});

Object.defineProperty(UserPromissionAction,"saveTemporaryNodeData",{
	value:function(nid,data){
		var  controlData  = Session.get("userPromissionSettingGroupControlData");
		if(typeof controlData === "undefined" || controlData == null){
			controlData = {};
		}
		if(!nid || typeof nid !== "string"){
			return;
		}
		controlData[nid] = data;
		Session.set("userPromissionSettingGroupControlData",controlData);
	}
});

Object.defineProperty(UserPromissionAction,"saveTemporarySettingNodeData",{
	value:function(nid,data){
		var  controlData  = Session.get("userPromissionSettingOperationControlData");	
				if(typeof controlData === "undefined" || controlData == null){
			controlData = {};
		}
		if(!nid || typeof nid !== "string"){
			return;
		}
		controlData[nid] = data;
		Session.set("userPromissionSettingOperationControlData",controlData);
	}
});


Object.defineProperty(UserPromissionAction,"treeSimpleNodeClickAction",{
	value:function(treeId, treeNode){
		//1  获取当前操作节点 
		var currend_id= treeNode.id;	//当前节点的ID
		currend_id = UserPromissionAction.coverIdToSaveId(currend_id);
		var current_type = treeNode.type === "entity" ? "entity" : "group" ;//当前节点类型

		//2 获取并存储上一个节点的信息
		var beforeCheckbox = UserPromissionAction.getCheckedbox();
		var beforeNodeId = Session.get("userPromissionSettingGroupControlNodeId");
		UserPromissionAction.saveTemporaryNodeData(beforeNodeId,beforeCheckbox);

		//3 改变节点赋予视图
		UserPromissionAction.chooseUserPromissionViewType(current_type);

		//4 存储当前节点信息
		Session.set("userPromissionSettingGroupControlNodeId",currend_id); //存储临时信息
		Session.set("userPromissionSettingGroupControlType",current_type); //改变模板状态	
		Session.set("userPromissionLastNodeType","svse");
		//5  从内存中读取当前节点的操作权限，在界面上选中相关节点
		var  data  = Session.get("userPromissionSettingGroupControlData");
		if(!data){
			return;
		}
		var promissionCheckboxs = data[currend_id];
		UserPromissionAction.setCheckedbox(promissionCheckboxs);	
	}
});


Object.defineProperty(UserPromissionAction,"treeSettingNodeClickAction",{
	value:function(treeNode){
		//第一步  获取当前操作节点
		var currend_action = treeNode.action;
		console.log("current action is " + currend_action);
		//2 获取并存储上一个节点的信息
		var beforeCheckbox = UserPromissionAction.getCheckedbox();
		var beforeAction = Session.get("userPromissionSettingOperationControlAction");
		UserPromissionAction.saveTemporarySettingNodeData(beforeAction,beforeCheckbox);

		//3 改变节点赋予视图
		UserPromissionAction.chooseUserPromissionViewType(currend_action);
		

		//4 存储当前节点信息
		Session.set("userPromissionLastNodeType","setting");


		//5  从内存中读取当前节点的操作权限，在界面上选中相关节点
		var  data  = Session.get("userPromissionSettingOperationControlData");
		if(!data){
			return;
		}
		var promissionCheckboxs = data[currend_action];
		UserPromissionAction.setCheckedbox(promissionCheckboxs);				
	}
});

Object.defineProperty(UserPromissionAction,"initSettingTree",{
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
					UserPromissionAction.treeSettingNodeClickAction(treeNode);
				}
			}
		}
		$.fn.zTree.init($(template.find("#svse_other_promission_check")), othersetting, settingdata);
	}
});

Object.defineProperty(UserPromissionAction,"initPromissionData",{
	value:function(template){
		var uid = template.find("input:hidden#promissionUserId").value;
		var entityPermissionData = SvseUserDao.getNodeOpratePermissionByUserId(uid); //初始化当前用户的授权信息到临时数据
		Session.set("userPromissionSettingGroupControlData",entityPermissionData);//存储设备节点的操作信息到临时数据里面
		var operationData = SvseUserDao.getSettingOperatePermissionByUserId(uid);
		Session.set("userPromissionSettingOperationControlData",operationData);//存储其他 节点的操作信息
	}
});

Object.defineProperty(UserPromissionAction,"initChooseTreeNode",{
	value:function(template){
		var uid = template.find("input:hidden#promissionUserId").value;
		//左上 树的勾选
		var displayNodes = SvseUserDao.getDisplayNodesByUserId(uid);//获取设备树的展示状态
		if(displayNodes && displayNodes.length){
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_promission_check");
			//节点勾选
			for(var index  = 0; index < displayNodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === displayNodes[index];
				},true),true);
			}
		}
		//左下 树的勾选
		var displaySettingNodes = SvseUserDao.getDisplaySettingNodesByUserId(uid);//获取设置树的展示状态
		if(displaySettingNodes && displaySettingNodes.length){
			var treeObj2 = $.fn.zTree.getZTreeObj("svse_other_promission_check");
			//节点勾选
			for(var index2  = 0; index2 < displaySettingNodes.length ; index2++){
				treeObj2.checkNode(treeObj2.getNodesByFilter(function(node){
					return  node.action  === displaySettingNodes[index2];
				}, true),true);
			}
		}
	}
});

Object.defineProperty(UserPromissionAction,"getChoosedTreeNodes",{
	value:function(){
		var svsenodearr = $.fn.zTree.getZTreeObj("svse_tree_promission_check").getNodesByFilter(function(node){return node.checked});
		var svsenodes = [];
		for(index in svsenodearr){
			svsenodes.push(svsenodearr[index].id);
		}
		return svsenodes;
	}
});

Object.defineProperty(UserPromissionAction,"getChoosedSettingTreeNodes",{
	value:function(){
		var svseOperateNodeArr = $.fn.zTree.getZTreeObj("svse_other_promission_check").getNodesByFilter(function(node){return node.checked});
		var svseOperateNodes = [];
		for(svseOperateNodeArrIndex in svseOperateNodeArr){
			svseOperateNodes.push(svseOperateNodeArr[svseOperateNodeArrIndex].action);
		}
		return svseOperateNodes;
	}
});

Object.defineProperty(UserPromissionAction,"saveDisplayNodesToDataBase",{
	value:function(uid,svsenodes,svseOperateNodes){
		//存储可见节点数据
		SvseUserDao.setDisplayPermission(uid,svsenodes,svseOperateNodes,function(result){
			console.log(result);
		});
	}
});