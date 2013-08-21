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