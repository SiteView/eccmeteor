/**
处理当前用户相关业务
*/
UserUtils = {};
//判断当前用户是否为管理员
Object.defineProperty(UserUtils, "isAdmin", {
	value:function(id){
		var user = Meteor.users.findOne(id);
		if(!user || !user.profile)
			return false;
		if(user.profile.accounttype === "admin")
			return true;
		return false;
	}
});
//判断当前用户状态是否正常
Object.defineProperty(UserUtils, "isActive", {
	value:function(id){
		var user =  Meteor.users.findOne(id);
		if(!user || !user.profile)
			return false;
		if( user.profile.accounttype === "admin" || user.profile.accountstatus)
			return true
		return false;
	}
})
