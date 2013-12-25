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
/* 当使用userPromissionSetting时，事件无法触发 修复*/
Template.userPromissionSetting.events({
	"click":function(e,t){
		console.log(1);
		//UserSettingPromissionAction.userPromissionSave(e,t,this);
	},
	"click button#userPromissionSettingCloseBtn":function(e,t){ //关闭权限控制弹窗
		console.log(2);
		//UserSettingPromissionAction.userPromissionCancel(e,t,this);
	}
});

Template.userPromissionSetting.userpromissViewType = function(){
	return Session.get("userpromissViewType")
}

Template.userPromissionSetting.rendered = function(){
	//UserSettingPromissionAction.userPromissionRender(this);
}


//授权树当前节点类型
Template.userPromissionSettingGroupControl.type = function(){
	return Session.get("userPromissionSettingGroupControlType");
}

//在模板中进行节点勾选 而不在树点击事件时处理是 
//由于点击事件后 当节点类型不相同时 该模板将进行重绘，重绘未完成时jquery相关操作已完成。这样讲导致Jquery无法获取相关Dom元素
Template.userPromissionSettingGroupControl.rendered = function(){
	console.log("重绘");
	var data = Session.get("userPromissionSettingGroupControlData");
	if(!data){
		return;
	}
	var currendOperationUserId = $("#promissionUserId").val();//当前被操作的用户id
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
		var name = e.currentTarget.name;
		var checked = e.currentTarget.checked;
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

Template.userPromissionSettingSettingControl.type = function(){
	return Session.get("userPromissionSettingOperationControlAction");
}
/**设置相关权限的初始化渲染*/
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
		var name = e.currentTarget.name;
		var checked = e.currentTarget.checked;
		console.log("选中节点的name是"+name +"======="+checked);
		var  data  = Session.get("userPromissionSettingOperationControlData");
		if(!data){
			return;
		}
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
		var name = e.currentTarget.name;
		var checked = e.currentTarget.checked;
		console.log("选中节点的name是"+name +"======="+checked);
		var  data  = Session.get("userPromissionSettingOperationControlData");
		var currend_action  =  Session.get("userPromissionSettingOperationControlAction");
		if(!data[currend_action])
			data[currend_action] = {};
		data[currend_action][name] = checked;
		Session.set("userPromissionSettingOperationControlData",data);
	}
});