Agent = {
	"getReturn":function(status,msg){
		status = !!status;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"getPermission" : function(permission){
		return true;
		var user = Meteor.user();
		if(!user) return false;
		if(user.profile.accounttype === "admin") //如果是管理员则拥有全部权限
			return true;
		//权限层次关系以 ">" 作为分割符
		var permissionArr = permission.split(">");
		var permissionflag = Meteor.user().profile;
		try{
			for(i in permissionArr){
				permissionflag = permissionflag[permissionArr[i]];
			}
		}catch(e){
			return false;
		}
		return permissionflag;
	},
	"error":function(cls,fn){
		SystemLogger(cls +" function "+fn+" isn't exists",-1);
	}
}