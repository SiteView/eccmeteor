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
	"register" : function(user){
		//判断当前用户权限是否可以注册
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>add"))
			return UserDaoOnServer.getReturn(false);
		if(Meteor.users.find({username:user.username}).fetch().length){
            return UserDaoOnServer.getReturn(false,"Username is existed");
        }
		var registeruser = {
			username:user.username,
			password:user.password,
			profile:{
				settingOperatePermission:{//设置操作权限
					emailsetting:{
						add:false,
						delete:false,
						update:false
					},
					usersetting:{
						add:false,//增加用户
						delete:false,//删除用户
						updateps:false, //更改密码
						updatepm : false,//更改权限
						updatestatus:false,//更改用户状态
					}
				},
				aliasname:user.aliasname,
				accountstatus:true,
				accounttype:"general"
			}
		}
        var _id = Accounts.createUser(registeruser);
		return _id ? UserDaoOnServer.getReturn(true) :  UserDaoOnServer.getReturn(false,"Create User has errors");
	},
	"setNodeShowPermission" : function(id,permissionValue){  //设置监视节点的可见性
		//判断当前用户权限是否可以设置权限
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
			return UserDaoOnServer.getReturn(false);
		Meteor.users.update({_id:id},{$set:{"profile.nodeShowPermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
    },
	"setSettingNodeShowPermission" :  function(id,permissionValue){ //设置 '设置'节点的可见性
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
			return UserDaoOnServer.getReturn(false);
		Meteor.users.update({_id:id},{$set:{"profile.settingNodeShowPermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
	},
	"setNodeOpratePermission" : function(id,permissionValue){ //设置 监视节点的操作权限
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
			return UserDaoOnServer.getReturn(false);
		Meteor.users.update({_id:id},{$set:{"profile.nodeOpratePermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
	},
	"setSettingOperatePermission" : function(id,permissionValue){ //设置 '设置'节点的操作权限
		if(!UserDaoOnServer.getPermission("settingOperatePermission>usersetting>updatepm"))
			return UserDaoOnServer.getReturn(false);
		Meteor.users.update({_id:id},{$set:{"profile.settingOperatePermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
	},
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