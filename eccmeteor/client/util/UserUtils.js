UserUtils = {};
Object.defineProperty(UserUtils,"remberUser",{
	value:function(username,password){
		var obj = {
			a:username,
			b:password
		}
		$.cookie("helloword",EJSON.stringify(obj),{expires:5});	
	}
});

Object.defineProperty(UserUtils,"forgotUser",{
	value:function(){
		$.removeCookie('helloword');
	}
});

Object.defineProperty(UserUtils,"gotUser",{
	value:function(){
		return $.cookie("helloword") ? EJSON.parse($.cookie("helloword")) : null;
	}
});

//判断当前用户是否为管理员
Object.defineProperty(UserUtils, "isAdmin", {
	value:function(id){
		var user = Meteor.user();
		if(!user || !user.profile)
			return false;
		if(user.profile.accounttype === "admin")
			return true;
		return false;
	}
});