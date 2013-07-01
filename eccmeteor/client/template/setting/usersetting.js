Template.usersetting.userlist = function(){
	return Meteor.users.find({}).fetch();
}

Template.usersetting.events({
	"click #addusersetting":function(){
		$('#usersettingadddiv').modal('toggle');
	},
	"click #delusersetting":function(){
		
	},
	"click #allowusersetting":function(){
		
	},
	"click #forbidusersetting":function(){
		
	},
	"click #helpmessage":function(){
		
	},
});

Template.usersettingadd.events({
	"click #usersettingaddformsavebtn":function(){
		var user = ClientUtils.formArrayToObject($("#usersettingaddform").serializeArray());
		if(user.password !== user.password2) return;
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
		$("#usersettingaddform :password").val("");
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