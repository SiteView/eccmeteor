UserDaoOnServer = {
	"getPermission" : function(permission){
		var user = Meteor.user();
		if(!user) return false;
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
	"register" : function(user){
		//判断当前用户权限是否可以注册
		/*
			if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>add"))
				return {status:false,msg:"Permission isn't enoungh"};
		*/
		if(Meteor.users.find({username:user.username}).fetch().length){
            return {status:false,msg:"Username is existed"};
        }
        var _id = Accounts.createUser(user);
		return _id ? {status:true} : {status:false,msg:"Create User has errors"};
	},
	/*
	"setPermission" : function(username,arr){
		//判断当前用户权限是否可以设置权限
		
			if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
				return {status:false,msg:"Permission isn't enoungh"};
		
    },
	*/
    "deleteUser" : function(username){
       //判断当前用户权限是否可以删除用户
	   /*
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>delete"))
			return {status:false,msg:"Permission isn't enoungh"};
		*/
		try{
			Meteor.users.remove({username:username});
			return {status:true};
		}catch(e){
			return {status:false,msg:"Remove Failed"};
		}
		
    },
}