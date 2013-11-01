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
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("userSettingList");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("usersettingtableselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("userSettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("userSettingList");
	});
}
Template.usersettingListTable.events({
	"click #userSettingList button[name='edit']":function(e){
		var id = e.currentTarget.id;
		var user = SvseUserDao.getUserByUserId(id);
		console.log(user);
		if(!user){
			SystemLogger(Meteor.users.find().fetch());
			SystemLogger("edit 数据暂未缓冲");
			return;
		}
		$('#usersettingeditdiv :text[name="username"]').val(user.username);
		$('#usersettingeditdiv :text[name="aliasname"]').val(user.profile.aliasname);
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #userSettingList button[name='promission']":function(e){ //点击授权按钮时 获取临时数据
		var user = SvseUserDao.getUserByUserId(e.currentTarget.id);
		if(!user){
			SystemLogger(Meteor.users.find().fetch());
			SystemLogger("promission 数据暂未缓冲");
			return;
		}
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

