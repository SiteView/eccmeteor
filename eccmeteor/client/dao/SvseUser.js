SvseUserDao = {
	"register":function(user,fn){
		Meteor.call("register",user,function(err,result){
			fn(result);
		});
	},
	"delete":function(username,fn){
		Meteor.call("deleteUser",username,function(err,result){
			fn(result);
		});
	}
}