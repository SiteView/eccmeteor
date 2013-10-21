//清除临时数据
var clearUserPromissionSettingGroupControlData = function(){
	Session.set("userPromissionSettingGroupControlData",undefined);//清空Session中的临时数据
	Session.set("userPromissionSettingGroupControlNodeId",undefined);
	Session.set("userPromissionSettingGroupControlType",undefined);
	Session.set("userPromissionSettingOperationControlData",undefined);
	Session.set("userPromissionSettingOperationControlAction",undefined);
	Session.set("userpromissViewType",undefined);
}

/*
	第一步  获取当前操作节点 
		在 Template.userPromissionSettingTree.rendered 的callback onClick实现
	第二步  从内存中读取当前节点的操作权限，在界面上选中相关节点 .实现的地方 同上
		ps: 内存中的权限数据在 Template.usersettingListTable.events 中初始化
		ps：分为 重绘和非重绘处理，非重绘情况在 同上 实现，重绘则在Template.userPromissionSettingGroupControl.rendered中
	第三步  存储当前节点权限信息 实现 Template.userPromissionSettingGroupControl.events
	第四步  在 Template.userPromissionSetting.events 中实现
		点击关闭按钮  清空临时数据	
		确认按钮时
			存储最后一个设置的权限设置节点
			存储数据进入数据库
			清空临时数据
*/

// 弹窗中用户授权的事件管理
Template.userPromissionSetting.events({
	"click #userPromissionSettingSetNodesBtn":function(){
		var  data  = Session.get("userPromissionSettingGroupControlData");
		var operationData =  Session.get("userPromissionSettingOperationControlData");
		if(!data){
			$("#userPromissionSettingDiv").modal('toggle');
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
		clearUserPromissionSettingGroupControlData();
		$("#userPromissionSettingDiv").modal('toggle');
	},
	"click #userPromissionSettingCloseBtn":function(){ //关闭权限控制弹窗
		clearUserPromissionSettingGroupControlData();//清空Session中的临时数据
		$("#userPromissionSettingDiv").modal('toggle');
	}
});
//授权树当前节点类型
Template.userPromissionSettingGroupControl.type = function(){
	return Session.get("userPromissionSettingGroupControlType");
}

//在模板中进行节点勾选 而不在树点击事件时处理是有由于 
//点击事件后 当节点类型不相同时 该模板将进行重绘，重绘未完成时jquery相关操作已完成。这样讲导致Jquery无法获取相关Dom元素
Template.userPromissionSettingGroupControl.rendered = function(){
	console.log("重绘");
	var data = Session.get("userPromissionSettingGroupControlData");
	var currendOperationUserId = $("#userPromissionSettingDiv #promissionUserId").val();//当前被操作的用户id
	if(!currendOperationUserId){
		console.log("重绘过程中用户ID消失");
		return;
	}
	var currend_id = Session.get("userPromissionSettingGroupControlNodeId");
	var promissionCheckboxs = data[currend_id];
	console.log("promissionCheckboxs:  ");
	console.log(promissionCheckboxs);
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
}

Template.userPromissionSettingGroupControl.events({
	"click #userPromissionSettingGroupControlForm :checkbox":function(e){
		var name = e.target.name;
		var checked = e.target.checked;
		console.log("选中节点的name是"+name +"======="+checked);
		var  data  = Session.get("userPromissionSettingGroupControlData");
		var currend_id  =  Session.get("userPromissionSettingGroupControlNodeId");
		if(!data[currend_id]){
			data[currend_id] = {};
		}
		data[currend_id][name] = checked;
		Session.set("userPromissionSettingGroupControlData",data);
	}
});



//两棵树的渲染 及 点击等事件处理
Template.userPromissionSettingTree.rendered = function(){
	$(function(){
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
					Session.set("userpromissViewType","svse")
					//第一步  获取当前操作节点 
					var currend_id= treeNode.id;	//当前节点的ID
					var current_type = treeNode.type === "entity" ? "entity" : "group" ;//当前节点类型
					console.log("当前节点ID是" + currend_id  +"  节点类型是 " + current_type);
					//第二步  从内存中读取当前节点的操作权限，在界面上选中相关节点
					var  data  = Session.get("userPromissionSettingGroupControlData");
					//绘制当前节点的权限的checkbox选中情况 //当且仅当连续连两次点击的节点类型相同时进行重绘
					if(Session.get("userPromissionSettingGroupControlType") === current_type){
						(function(){
							var promissionCheckboxs = data[currend_id];
							console.log("promissionCheckboxs:  ");
							console.log(promissionCheckboxs);
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
						})();	
					}
					//存储当前节点信息
					Session.set("userPromissionSettingGroupControlNodeId",currend_id); //存储临时信息
					Session.set("userPromissionSettingGroupControlType",current_type); //改变模板状态			
				}
			}
		};
		
		$.fn.zTree.init($("#svse_tree_promission_check"), svsesetting, data);
		//其他设置的树
		var settingdata = NavigationSettionTree.getTreeData();
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
				//	if(Session.get("userPromissionSettingOperationControlAction") === currend_action)//两次点击同一个按钮时 无动作返回
				//		return ;
					Session.set("userpromissViewType",currend_viewType);
					Session.set("userPromissionSettingOperationControlAction",currend_action); //改变模板状态					
				}
			}
		}
		$.fn.zTree.init($("#svse_other_promission_check"), othersetting, settingdata);
	});
}

Template.userPromissViewControle.userpromissViewType = function(){
	return Session.get("userpromissViewType")
}




Template.userPromissionSettingSettingControl.type = function(){
	return Session.get("userPromissionSettingOperationControlAction");
}

Template.userPromissionSettingSettingControl.rendered = function(){
	var  data  = Session.get("userPromissionSettingOperationControlData");
	var currend_action = Session.get("userPromissionSettingOperationControlAction"); //改变模板状态
	var promissionCheckboxs = data[currend_action];
	console.log("邮件设置");
	console.log(promissionCheckboxs);
	//如果当前节点不存在授权
	if(!promissionCheckboxs)
		return;
	//勾选相应的权限选项
	for(perission in promissionCheckboxs){
		console.log(perission+":"+ promissionCheckboxs[perission]);
		if(!$("#userPromissionSettingSettingControlForm :checkbox[name="+perission+"]")[0]){
			console.log(perission);
			continue;
		}
		try{
			$("#userPromissionSettingSettingControlForm :checkbox[name="+perission+"]")[0].checked = promissionCheckboxs[perission];
		}catch(e){
			console.log(e);
		}
	}
},
Template.userPromissionSettingSettingControl.events({
	"click #userPromissionSettingSettingControlForm :checkbox":function(e){
		var name = e.target.name;
		var checked = e.target.checked;
		console.log("选中节点的name是"+name +"======="+checked);
		var  data  = Session.get("userPromissionSettingOperationControlData");
		var currend_action  =  Session.get("userPromissionSettingOperationControlAction");
		if(!data[currend_action])
			data[currend_action] = {};
		data[currend_action][name] = checked;
		Session.set("userPromissionSettingOperationControlData",data);
	}
});


Template.userPromissionSettingWarnerControl.type = function(){
	return Session.get("userPromissionSettingOperationControlAction");
}
Template.userPromissionSettingWarnerControl.rendered = function(){
	var  data  = Session.get("userPromissionSettingOperationControlData");
	var currend_action = Session.get("userPromissionSettingOperationControlAction"); //改变模板状态
	var promissionCheckboxs = data[currend_action];
	//如果当前节点不存在授权
	if(!promissionCheckboxs)
		return;
	//勾选相应的权限选项
	for(promission in promissionCheckboxs){
		if(!$("#userPromissionSettingWarnerControlForm :checkbox[name="+promission+"]")[0]){
			console.log(promission);
			continue;
		}
		try{
			$("#userPromissionSettingWarnerControlForm :checkbox[name="+promission+"]")[0].checked = promissionCheckboxs[promission];
		}catch(e){
			console.log(e);
		}
	}
}
Template.userPromissionSettingWarnerControl.events({
	"click #userPromissionSettingWarnerControlForm :checkbox":function(e){
		var name = e.target.name;
		var checked = e.target.checked;
		console.log("选中节点的name是"+name +"======="+checked);
		var  data  = Session.get("userPromissionSettingOperationControlData");
		var currend_action  =  Session.get("userPromissionSettingOperationControlAction");
		if(!data[currend_action])
			data[currend_action] = {};
		data[currend_action][name] = checked;
		Session.set("userPromissionSettingOperationControlData",data);
	}
});