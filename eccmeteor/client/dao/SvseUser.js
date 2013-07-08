SvseUserDao = {
	"register":function(user,fn){
		Meteor.call("register",user,function(err,result){
			fn(result);
		});
	},
	"getUserByUsername":function(username){
		return Meteor.users.findOne({username:username});
	},
	"setPassword":function(user,fn){
		Meteor.call("modifyPassword",user,function(err,result){
			fn(result);
		});
	},
	"forbid":function(ids,status,fn){
		Meteor.call("forbidUser",ids,status,function(err,result){
			fn(result);
		});
	},
	"deleteUser":function(ids,fn){
		Meteor.call("deleteUser",ids,function(err,result){
			fn(result);
		});
	},
	"setDisplayPromission":function(userid,svseNodes,settingNodes,fn){ //设置节点的可见性
		Meteor.call("setNodeDisplayPermission",userid,svseNodes,settingNodes,function(err,result){
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
		return user.profile.nodeOpratePermission ? user.profile.nodeOpratePermission : {};
	}
}