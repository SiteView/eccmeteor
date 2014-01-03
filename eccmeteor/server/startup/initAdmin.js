initAdminAccount = function(){
	if(Meteor.users.findOne({username:"admin"})){
		return;
	}	
	var admin = {
		username:"admin",
		password:"system",
		profile:{
			aliasname:"SiteView",
			accountstatus:true,
			accounttype:"admin"
		}
	}
	Accounts.createUser(admin);
}