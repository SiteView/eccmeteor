Template.usersetting.userlist = function(){
	return Meteor.users.find({}).fetch();
}

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
		
	},
	"click #emailSettingList button[name='edit']":function(e){
		var user = SvseUserDao.getUserByUsername(e.target.id);
		$('#usersettingeditdiv :text[name="username"]').val(user.username);
		$('#usersettingeditdiv :text[name="aliasname"]').val(user.profile.aliasname);
		$('#usersettingeditdiv').modal('toggle');
	},
	"click #emailSettingList button[name='promission']":function(e){
	
	}
});

Template.usersetting.rendered = function(){
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

Template.usersettingadd.events({
	"click #usersettingaddformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingaddform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		var registeruser = {
			username:user.username,
			password:user.password,
			profile:{
				aliasname:user.aliasname,
				accountstatus:true,
				accounttype:"general"
			}
		}
		console.log(registeruser);
		SvseUserDao.register(registeruser,function(result){
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