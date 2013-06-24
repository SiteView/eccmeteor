Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
		$('#emailaddresssettingdiv').modal('toggle');
	},
	"click #delemailsetting" : function(){
	/*
		$("#emailSettingList :checkbox[checked]").each(function(){
			console.log($(this).attr("id"));
		});
	*/
		var checks = $("#emailSettingList :checkbox[checked]");
		var ids = "";
		for(var i = 0 ; i < checks.length; i++){
			ids = ids + $(checks[i]).attr("id")+",";
		}
		console.log(ids);
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
	
	},
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseEmailDao.getEmailById(e.target.id);
		var template = result["Template"];
		var bCheck = result["bCheck"];
		$("#emailbasicsettingofaddressemailtemplatelistedit option").each(function(){
			if($(this).val() == template) this.checked = true;
		});
		$(":radio[name='bCheck']").each(function(){
			if($(this).val() == bCheck) this.checked = true;
		});
		Session.set("emailbasicsettingofaddressbasciinfoeditform",result);
		$('#emailaddresssettingdivedit').modal('toggle');
	}
}

Template.emailsetting.rendered = function(){
	Meteor.call("svGetSendEmailSetting",function(err,setting){
		//console.log(setting);
		if(!setting) return;
		$("#emailbasicsetting :text[name=server]").val(setting["server"]);
		$("#emailbasicsetting :text[name=from]").val(setting["from"]);
		$("#emailbasicsetting :text[name=backupserver]").val(setting["backupserver"]);
		$("#emailbasicsetting :text[name=user]").val(setting["user"]);
		$("#emailbasicsetting :password[name=password]").val(setting["password"]);
	});
	//初始化弹窗
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
	//初始化 checkbox事件
	$(function(){
		$("#emailsettingtableselectall").click(function(){
		//	console.log("running")
			var flag = this.checked; 
			$(this).closest("table").find("tbody :checkbox").each(function(){
				this.checked = flag;
			});
		});
	
	});
}

Template.emailbasicsettingofaddress.rendered = function(){
		//邮件模板下拉列表
		Meteor.call("svGetEmailTemplates",function(err,result){
			for(name in result){
		//		console.log(name);
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
	//	console.log(emailbasicsettingofaddressbasciinfo);
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

Template.emailbasicsettingofaddressedit.emailbasicsettingofaddressbasciinfoeditform = function(){
	return Session.get("emailbasicsettingofaddressbasciinfoeditform");
}

Template.emailbasicsettingofaddressedit.events = {
	"click #emailbasicsettingofaddresscancelbtnedit":function(){
		$('#emailaddresssettingdivedit').modal('toggle');
	},
	"click #emailbasicsettingofaddresssavebtnedit":function(){
		var emailbasicsettingofaddressbasciinfoedit = ClientUtils.formArrayToObject($("#emailbasicsettingofaddressbasciinfoedit").serializeArray());
		var nIndex = emailbasicsettingofaddressbasciinfoedit["nIndex"];
		var address = {};
		address[nIndex] = emailbasicsettingofaddressbasciinfoedit;
	//	console.log(address);
		SvseEmailDao.updateEmailAddress(nIndex,address,function(){
			$('#emailaddresssettingdivedit').modal('toggle');
		});
	}
}

Template.emailbasicsettingofaddressedit.rendered = function(){
		//邮件模板下拉列表
		Meteor.call("svGetEmailTemplates",function(err,result){
			for(name in result){
			//	console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#emailbasicsettingofaddressemailtemplatelistedit").append(option);
			}
		});
}