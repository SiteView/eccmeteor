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
	"click #usersettingeditformcanclebtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #usersettingeditformsavebtn":function(e,t){
		var user = ClientUtils.formArrayToObject($("#usersettingeditform").serializeArray());
		if(!user.password.length || user.password !== user.password2) return;
		console.log(user);
		SvseUserDao.setPassword(user,function(result){
			if(!result.status){
				Message.error("密码修改失败，请重试");
			}else{
				Message.success("密码修改成功",{align:"center",time:1});
				RenderTemplate.hideParents(t);
			}
		});
	}
});