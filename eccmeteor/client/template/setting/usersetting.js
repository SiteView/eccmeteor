Template.usersetting.events({
	"click #addusersetting":function(){
		$('#usersettingadddiv').modal('toggle');
	},
	"click #delusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.deleteUser(ids,function(result){
				console.log(result);
			});
	},
	"click #allowusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			if(Meteor.users.findOne(id).profile.accountstatus)
				continue;
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.forbid(ids,true,function(result){
				console.log(result);
			});
	},
	"click #forbidusersetting":function(){
		var checks = $("#userSettingList :checkbox[checked]");
		if(!checks.length) return;
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			var id = $(checks[i]).attr("id");
			if(!Meteor.users.findOne(id).profile.accountstatus)
				continue;
			ids.push(id);
		}
		if(ids.length)
			SvseUserDao.forbid(ids,false,function(result){
				console.log(result);
			});
	},
	"click #helpmessage":function(){
		
	}
});
Template.usersettingListTable.userlist = function(){
	return Meteor.users.find({}).fetch();
}

Template.usersettingListTable.rendered = function(){
	//初始化 checkbox事件
	$(function(){
		$("#usersettingtableselectall").click(function(){
			var flag = this.checked; 
			$(this).closest("table").find("tbody :checkbox").each(function(){
				this.checked = flag;
			});
		});
	
	});
}
Template.usersettingListTable.events({
	"click #userSettingList button[name='edit']":function(e){
		var user = SvseUserDao.getUserByUsername(e.target.id);
		$('#usersettingeditdiv :text[name="username"]').val(user.username);
		$('#usersettingeditdiv :text[name="aliasname"]').val(user.profile.aliasname);
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #userSettingList button[name='promission']":function(e){ //点击授权按钮时 获取临时数据
		console.log(e.target.id);
		var user = SvseUserDao.getUserByUsername(e.target.id);
		console.log(user);
		$("#userPromissionSettingDiv #promissionUsername").html(user.username);
		$("#userPromissionSettingDiv #promissionUserId").val(user._id);
		$('#userPromissionSettingDiv').modal('toggle');
		var data = SvseUserDao.getNodeOpratePermissionByUserId(user._id); //初始化当前用户的授权信息到临时数据
		Session.set("userPromissionSettingGroupControlData",data);//存储设备节点的操作信息到临时数据里面
		var operationData = SvseUserDao.getSettingOperatePermissionByUserId(user._id);
		Session.set("userPromissionSettingOperationControlData",operationData);//存储其他 节点的操作信息
		//左上 树的勾选
		var displayNodes = SvseUserDao.getDisplayNodesByUserId(user._id);//获取设备树的展示状态
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_promission_check");
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

Template.usersettingadd.events({
	"click #usersettingaddformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingaddform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		SvseUserDao.register(user,function(result){
			if(result.status){
				console.log("注册成功");
				$("#usersettingaddform :text").val("");
				$("#usersettingaddform :password").val("");
				$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","none");
				$("#usersettingaddform :text[name='username']").closest("div.control-group").removeClass("error");
				$('#usersettingadddiv').modal('toggle');
			}else{
				$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","block").html(result.msg);
				$("#usersettingaddform :text[name='username']").closest("div.control-group").addClass("error");
			}
		});
	},
	"click #usersettingaddformcanclebtn":function(){
		$("#usersettingaddform :text").val("");
		$("#usersettingaddform :password").each(function(){$(this).val("")});
		$("#usersettingaddform :text[name='username']").closest("div.controls").find("span").css("display","none");
		$("#usersettingaddform :text[name='username']").closest("div.control-group").removeClass("error");
		$('#usersettingadddiv').modal('toggle');
	}
});

Template.usersettingadd.rendered = function(){
	$(function(){
		$("#usersettingaddform :password[name='password2']").blur(function(){
			if($(this).val() !== $("#usersettingaddform :password[name='password']").val()){
					$(this).closest("div.controls").find("span").css("display","block");
					$(this).closest("div.control-group").addClass("error");
			}else{
				$(this).closest("div.controls").find("span").css("display","none");
				$(this).closest("div.control-group").removeClass("error");
			}
		});
	});
}

Template.usersettingedit.rendered = function(){
	$(function(){
		$("#usersettingeditform :password[name='password2']").blur(function(){
			if($(this).val() !== $("#usersettingeditform :password[name='password']").val()){
					$(this).closest("div.controls").find("span").css("display","block")
					$(this).closest("div.control-group").addClass("error");
			}else{
				$(this).closest("div.controls").find("span").css("display","none")
				$(this).closest("div.control-group").removeClass("error");
			}
		});
	});
}

Template.usersettingedit.events({
	"click #usersettingeditformcanclebtn":function(){
		$("#usersettingeditform :password").each(function(){$(this).val("")});
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #usersettingeditformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingeditform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		console.log(user);
		SvseUserDao.setPassword(user,function(result){
			if(!result.status){
				console.log(result.msg);
			}else{
				$("#usersettingeditform :password").each(function(){$(this).val("")});
				$('#usersettingeditdiv').modal('toggle');
			}
		});
		
	}
});

Template.userPromissionSetting.rendered = function(){
	console.log("重复执行");
	$(function(){
		$('#userPromissionSettingDiv').modal({
			backdrop:false,
			keyboard:false,
			show:false
		}).css({
			height:"545",
			width:"800"
		});
	});
}

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
		/*
		//获取最后一个节点设置数据
		var currend_id = Session.get("userPromissionSettingGroupControlNodeId");
		if(currend_id){
			var operation ={};//定义节点操作权限对象
			$("#userPromissionSettingGroupControlForm :checkbox").each(function(){ //遍历复选框
				operation[$(this).attr("name")] = this.checked;
				this.checked = false;
			});
			//节点权限赋值
			data[currend_id] = operation;
		}
		*/
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
		//存储节点操作权限
		SvseUserDao.setNodeOpratePermission(uid,ClientUtils.changePointAndLine(data),function(result){
			console.log(result);
		});
		
		//存储设置节点操作权限
		SvseUserDao.setNodeOpratePermission(uid,operationData,function(result){
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
					if(Session.get("userPromissionSettingOperationControlAction") === currend_action)//两次点击同一个按钮时 无动作返回
						return ;
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
	//如果当前节点不存在授权
	if(!promissionCheckboxs)
		return;
	//勾选相应的权限选项
	for(promission in promissionCheckboxs){
		if(!$("#userPromissionSettingSettingControlForm :checkbox[name="+promission+"]")[0]){
			console.log(promission);
			continue;
		}
		try{
			$("#userPromissionSettingSettingControlForm :checkbox[name="+promission+"]")[0].checked = promissionCheckboxs[promission];
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