Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
		$('#emailaddresssettingdiv').modal('toggle');
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
 
	},
	"click #emailbasicsettingapplybtn" : function(){
		var emailbasicsetting = ClientUtils.formArrayToObject($("#emailbasicsetting").serializeArray());
		console.log(emailbasicsetting);
		SvseEmailDao.setEmailBasicSetting(emailbasicsetting,function(){
			console.log("成功！")
		});
	},
	"click #emailbasicsettingtestbtn" : function(){
	
	}
}

Template.emailsetting.rendered = function(){
	Meteor.call("svGetSendEmailSetting",function(err,setting){
		console.log(setting);
		if(!setting) return;
		$("#emailbasicsetting :text[name=server]").val(setting["server"]);
		$("#emailbasicsetting :text[name=from]").val(setting["from"]);
		$("#emailbasicsetting :text[name=backupserver]").val(setting["backupserver"]);
		$("#emailbasicsetting :text[name=user]").val(setting["user"]);
		$("#emailbasicsetting :password[name=password]").val(setting["password"]);
	});
	
	$(function(){
		$('#emailaddresssettingdiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		});
	});
}

Template.emailbasicsettingofaddress.rendered = function(){
		//邮件模板下拉列表
		Meteor.call("svGetEmailTemplates",function(err,result){
			for(name in result){
				console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#emailbasicsettingofaddressemailtemplatelist").append(option);
			}
		});
}

Template.emailbasicsettingofaddress.events = {
	"click #emailbasicsettingofaddresscancelbtn":function(){
		$('#emailaddresssettingdiv').modal('toggle');
	},
	"click #emailbasicsettingofaddresssavebtn":function(){
		var emailbasicsettingofaddressbasciinfo = ClientUtils.formArrayToObject($("#emailbasicsettingofaddressbasciinfo").serializeArray());
		var nIndex = Utils.getUUID();
		emailbasicsettingofaddressbasciinfo["nIndex"] = nIndex
		console.log(emailbasicsettingofaddressbasciinfo);
		var address = {};
		address[nIndex] = emailbasicsettingofaddressbasciinfo;
		SvseEmailDao.addEmailAddress(nIndex,address,function(){
			$('#emailaddresssettingdiv').modal('toggle');
		});
	}
}

Template.emailsetting.emaillist = function(){
	return SvseEmailDao.getEmailList();
}