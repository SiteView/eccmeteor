SvseUserDao = {
	"AGENT":"userDaoAgent",
	"register":function(user,fn){
		Meteor.call(SvseUserDao.AGENT,"register",[user],function(err,result){
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
		Meteor.call(SvseUserDao.AGENT,"resetPassword",[user],function(err,result){
			fn(result);
		});
	},
	"forbid":function(ids,status,fn){
		Meteor.call(SvseUserDao.AGENT,"forbid",[ids,status],function(err,result){
			fn(result);
		});
	},
	"deleteUser":function(ids,fn){
		Meteor.call(SvseUserDao.AGENT,"deleteUser",[ids],function(err,result){
			fn(result);
		});
	},
	"setDisplayPermission":function(userid,svseNodes,settingNodes,fn){ //设置节点的可见性
		Meteor.call(SvseUserDao.AGENT,"setNodeDisplayPermission",[userid,svseNodes,settingNodes],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	'getNodePermissionByUserIdAndNodeId':function(userId,nodeId){
		var user = Meteor.users.findOne(userId);
		if(!user){
			Log4js.warn("user is not exist.uid:"+userId);
			return null;
		}
		return user.profile.nodeOpratePermission ? user.profile.nodeOpratePermission[nodeId] : null;
	},
	"getNodeOpratePermissionByUserId" : function(userId){
		var user = Meteor.users.findOne(userId);
		if(!user){
			Log4js.warn("user is not exist.uid:"+userId);
			return null;
		}
		return user.profile.nodeOpratePermission ? ClientUtils.changePointAndLine(user.profile.nodeOpratePermission,-1) : {};
	},
	"setNodeOpratePermission":function(userId,nodePermission,fn){
		Meteor.call(SvseUserDao.AGENT,"setNodeOpratePermission",[userId,nodePermission],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	'getDisplayNodesByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		if(!user){
			Log4js.warn("user is not exist.uid:"+userId);
			return null;
		}
		return user.profile.nodeDisplayPermission ? user.profile.nodeDisplayPermission : [];
	},
	'getDisplaySettingNodesByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		if(!user){
			Log4js.warn("user is not exist.uid:"+userId);
			return null;
		}
		return user.profile.settingNodeDisplayPermission ? user.profile.settingNodeDisplayPermission : [];
	},
	'getSettingOperatePermissionByUserId':function(userId){
		var user = Meteor.users.findOne(userId);
		if(!user){
			Log4js.warn("user is not exist.uid:"+userId);
			return null;
		}
		return user.profile.settingOperatePermission ? user.profile.settingOperatePermission : {};
	},
	"setSettingOperatePermission":function(userId,nodePermission,fn){
		Meteor.call(SvseUserDao.AGENT,"setSettingOperatePermission",[userId,nodePermission],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	"login":function(usename,password,fn){
		Meteor.logout();
		Meteor.loginWithPassword(usename,password,fn);
	}
}
/*
	获取单个设备节点的操作权限
	参数:
	 nid:节点ID，
	 permission:权限类型
*/
Object.defineProperty(SvseUserDao,"getSingleNodePermission",{
	value:function(nid,permission){
		var user = Meteor.user();
		if(!user)
			return false;
		if(UserUtils.isAdmin())
			return true;
		nid = nid.replace(/\./g,"-");
		var nodeOpratePermissions = user.profile.nodeOpratePermission;
		return nodeOpratePermissions && nodeOpratePermissions[nid] && nodeOpratePermissions[nid][permission]
	}
});
