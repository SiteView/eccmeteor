Template.usersetting.events({
	"click #addusersetting":function(e,t){
		RenderTemplate.showParents("#UserSettingAddModal","usersettingadd");
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
		var id = this._id;
		var user = SvseUserDao.getUserByUserId(id);
		
		if(!user){
			Log4js.info(Meteor.users.find().fetch());
			Log4js.info("edit 数据暂未缓冲");
			return;
		}
		RenderTemplate.showParents("#UserSettingEditModal","usersettingedit",{user:user});
	},
	"click #userSettingList button[name='promission']":function(e,t){ //点击授权按钮时 获取临时数据
		var uid = this._id;
		var user = SvseUserDao.getUserByUserId(uid);
		if(!user){
			SystemLogger(Meteor.users.find().fetch());
			SystemLogger("promission 数据暂未缓冲");
			return;
		}
		RenderTemplate.showParents("#UserPromissionSettingModal","UserPromission",{user:user});
	}
});

