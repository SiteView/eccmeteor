Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
	 
	},
	"click #delemailsetting" : function(){
 
	},
	"click #allowemailsetting" : function(){
 
	},
	"click #forbidemailsetting" : function(){
 
	},
	"click #refreshemailsetting" : function(){
 
	},
	"click #emailtemplatesetting" : function(){
 
	},
	"click #emailhelpmessage" : function(){
 
	}
}

Template.emailsetting.rendered = function(){
	Meteor.call("svGetSendEmailSetting",function(err,setting){
		console.log(setting);
		$("#emailbasicsettion :text[name=server]").val(setting["server"]);
		$("#emailbasicsettion :text[name=from]").val(setting["from"]);
		$("#emailbasicsettion :text[name=backupserver]").val(setting["backupserver"]);
		$("#emailbasicsettion :text[name=user]").val(setting["user"]);
		$("#emailbasicsettion :password[name=password]").val(setting["password"]);
	});
}

Template.emailsetting.emaillist = function(){
	return SvseEmailDao.getEmailList();
}