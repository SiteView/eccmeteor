SvseUserDao = {
	"register":function(user,fn){
		Meteor.call("userDaoAgent","register",[user],function(err,result){
			fn(result);
		});
	},
	"getUserByUsername":function(username){
		return Meteor.users.findOne({username:username});
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
	"setDisplayPromission":function(userid,svseNodes,settingNodes,fn){ //设置节点的可见性
		Meteor.call("userDaoAgent","setNodeDisplayPermission",[userid,svseNodes,settingNodes],function(err,result){
			if(err){
				SystemLogger(err,-1);
			}
			fn(result);
		});
	},
	'getNodePromissByUserIdAndNodeId':function(userId,nodeId){
		var user = Meteor.users.findOne(userId);
		return user.profile.nodeOpratePermission ? user.profile.nodeOpratePermission[nodeId] : undefined;
	},
	"getNodeOpratePromissByUserId" : function(userId){
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
	}
}