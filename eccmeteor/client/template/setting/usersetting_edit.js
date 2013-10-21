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