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
		$("#emailbasicsetting :text[name=server]").val(setting["server"]);
		$("#emailbasicsetting :text[name=from]").val(setting["from"]);
		$("#emailbasicsetting :text[name=backupserver]").val(setting["backupserver"]);
		$("#emailbasicsetting :text[name=user]").val(setting["user"]);
		$("#emailbasicsetting :password[name=password]").val(setting["password"]);
	});
}

Template.emailsetting.emaillist = function(){
	return SvseEmailDao.getEmailList();
}