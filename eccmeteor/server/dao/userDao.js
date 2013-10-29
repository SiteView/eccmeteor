UserDaoOnServer = {	
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"register" : function(user){
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
	"setNodeDisplayPermission" : function(id,nodes,settingNodes){  //设置监视节点的可见性
		Meteor.users.update(
			{_id:id},
			{$set:{
				"profile.nodeDisplayPermission":nodes,
				"profile.settingNodeDisplayPermission":settingNodes
				}
			},
			function(err){
					if(err)
						console.log(err)
			});
		return UserDaoOnServer.getReturn(true);
    },
	/*
	"setSettingNodeDisplayPermission" :  function(id,permissionValue){ //设置 '设置'节点的可见性
		Meteor.users.update({_id:id},{$set:{"profile.settingNodeDisplayPermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
	},*/
	"setNodeOpratePermission" : function(id,svseNodesPermission){ //设置 监视节点的操作权限
		Meteor.users.update(
			{_id:id},
			{$set:{"profile.nodeOpratePermission":svseNodesPermission}
			});
		return UserDaoOnServer.getReturn(true);
	},
	"setSettingOperatePermission" : function(id,permissionValue){ //设置 '设置'节点的操作权限
		Meteor.users.update({_id:id},{$set:{"profile.settingOperatePermission":permissionValue}});
		return UserDaoOnServer.getReturn(true);
	},
    "deleteUser" : function(ids){
		try{
			Meteor.users.remove({_id:{$in:ids}});
			return UserDaoOnServer.getReturn(true);
		}catch(e){
			return UserDaoOnServer.getReturn(false,"Remove Failed");
		}
    },
	"resetPassword" : function(user){
		var userid = Meteor.users.findOne({username:user.username})._id;
		if(!userid){
			return UserDaoOnServer.getReturn(false,"Operate Failed");
		}
		Accounts.setPassword(userid, user.password);
		Meteor.users.update(userid,{$set:{"profile.aliasname":user.aliasname}});
		return UserDaoOnServer.getReturn(true);
	},
	"forbid":function(ids,status){
		Meteor.users.update({_id:{$in:ids}},{$set:{"profile.accountstatus":!!status}},{multi:true});
		return UserDaoOnServer.getReturn(true);
	},
	/*获取拥有的节点 svse_tree*/
	"getOwnMonitorsNodes":function(userid){
		var user = Meteor.users.findOne(userid);
	//	Log4js.info("==========user");
	//	Log4js.info(user);
		if(!user || !user.profile)
			return [];
		var nodes = user.profile.nodeDisplayPermission;
		return nodes ? nodes : [];
	}
}