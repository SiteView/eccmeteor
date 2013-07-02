UserDaoOnServer = {
	"getReturn":function(status,msg){
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"getPermission" : function(permission){
		return true;
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
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>add"))
			return UserDaoOnServer.getReturn(false);
		if(Meteor.users.find({username:user.username}).fetch().length){
            return UserDaoOnServer.getReturn(false,"Username is existed");
        }
        var _id = Accounts.createUser(user);
		return _id ? UserDaoOnServer.getReturn(true) :  UserDaoOnServer.getReturn(false,"Create User has errors");
	},
	/*
	"setPermission" : function(username,arr){
		//判断当前用户权限是否可以设置权限
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
			return {status:false,msg:"Permission isn't enoungh"};
		
    },
	*/
    "deleteUser" : function(ids){
       //判断当前用户权限是否可以删除用户
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>delete"))
			return UserDaoOnServer.getReturn(false);
		try{
			Meteor.users.remove({_id:{$in:ids}});
			return UserDaoOnServer.getReturn(true);
		}catch(e){
			return UserDaoOnServer.getReturn(false,"Remove Failed");
		}
    },
	"resetPassword" : function(user){
		//判断当前用户权限是否可以修改密码
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updateps"))
			return UserDaoOnServer.getReturn(false);
		var userid = Meteor.users.findOne({username:user.username})._id;
		if(!userid){
			return UserDaoOnServer.getReturn(false,"Operate Failed");
		}
		Accounts.setPassword(userid, user.password);
		Meteor.users.update(userid,{$set:{"profile.aliasname":user.aliasname}});
		return UserDaoOnServer.getReturn(true);
	},
	"forbid":function(ids,status){
		//判断当前用户权限是否可以修改用户状态
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatestatus"))
			return UserDaoOnServer.getReturn(false);
		Meteor.users.update({_id:{$in:ids}},{$set:{"profile.accountstatus":!!status}},{multi:true});
		return UserDaoOnServer.getReturn(true);
	}
}