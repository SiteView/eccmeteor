SvseUserDao = {
	"register":function(user,fn){
		Meteor.call("userDaoAgent","register",[user],function(err,result){
			fn(result);
		});
	},
	"getUserByUsername":function(username){
		return Meteor.users.findOne({username:username});
	},
	"getUserByUserId" : function(userid){
		return Meteor.users.findOne(userid);
	},
	"setPassword":function(user,fn){
		Meteor.call("userDaoAgent","resetPassword",[user],function(err,result){
			fn(result);
		});
	},
	"forbid":function(ids,status,fn){
		Meteor.call("userDaoAgent","forbid",[ids,status],function(err,result){
			fn(result);
		});
	},
	"deleteUser":function(ids,fn){
		Meteor.call("userDaoAgent","deleteUser",[ids],function(err,result){
			fn(result);
		});
	},
	"setDisplayPermission":function(userid,svseNodes,settingNodes,fn){ //设置节点的可见性
		Meteor.call("userDaoAgent","setNodeDisplayPermission",[userid,svseNodes,settingNodes],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	'getNodePermissionByUserIdAndNodeId':function(userId,nodeId){
		var user = Meteor.users.findOne(userId);
		return user.profile.nodeOpratePermission ? user.profile.nodeOpratePermission[nodeId] : undefined;
	},
	"getNodeOpratePermissionByUserId" : function(userId){
		var user = Meteor.users.findOne(userId);
		return user.profile.nodeOpratePermission ? ClientUtils.changePointAndLine(user.profile.nodeOpratePermission,-1) : {};
	},
	"setNodeOpratePermission":function(userId,nodePermission,fn){
		Meteor.call("userDaoAgent","setNodeOpratePermission",[userId,nodePermission],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	'getDisplayNodesByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		return user.profile.nodeDisplayPermission ? user.profile.nodeDisplayPermission : [];
	},
	'getDisplaySettingNodesByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		return user.profile.settingNodeDisplayPermission ? user.profile.settingNodeDisplayPermission : [];
	},
	'getSettingOperatePermissionByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		return user.profile.settingOperatePermission ? user.profile.settingOperatePermission : {};
	},
	"setSettingOperatePermission":function(userId,nodePermission,fn){
		Meteor.call("userDaoAgent","setSettingOperatePermission",[userId,nodePermission],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	"login":function(usename,password,fn){
	    if(Meteor.users.findOne({username:usename}) && Meteor.users.findOne({username:usename}).profile.accountstatus){
	        Meteor.loginWithPassword(usename,password,fn);
	    }else{
	        fn("你的帐户已被禁用，请联系系统管理员",true)
	    }
	    
	}
}
