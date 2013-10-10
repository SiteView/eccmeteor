Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
		$('#emailaddresssettingdiv').modal('toggle');
	},
	"click #delemailsetting" : function(){
		var checks = $("#emailSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseEmailDao.deleteEmailAddressByIds(ids,function(result){
				SystemLogger(result);
			});
	},
	"click #allowemailsetting" : function(){  //启用邮件地址
		var checks = $("#emailSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseEmailDao.updateEmailAddressStatus(ids,"0",function(result){
				SystemLogger(result);
			});
	},
	"click #forbidemailsetting" : function(){ //禁用邮件地址
		var checks = $("#emailSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseEmailDao.updateEmailAddressStatus(ids,"1",function(result){
				SystemLogger(result);
			});
	},
	"click #refreshemailsetting" : function(){
		//邮件同步
		SvseEmailDao.sync();
	},
	"click #emailtemplatesetting" : function(){
 
	},
	"click #emailhelpmessage" : function(){
 
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
	
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("emailSettingList");
		//初始化 checkbox事件
	    ClientUtils.tableSelectAll("emailsettingtableselectall");  
	    //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("emailSettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("emailSettingList");
	});
}

Template.emailbasicsettingofaddress.rendered = function(){
	//邮件模板下拉列表
	SvseEmailDao.getEmailTemplates(function(err,result){
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
		SvseEmailDao.addEmailAddress(nIndex,address,function(result){
			SystemLogger(result);
			$('#emailaddresssettingdiv').modal('toggle');
		});
	}
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
	SvseEmailDao.getEmailTemplates(function(err,result){
		for(name in result){
	//	console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#emailbasicsettingofaddressemailtemplatelistedit").append(option);
		}
	});
}

Template.emailsettingList.events({
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
});




Template.emailsettingList.emaillist = function(){
	console.log(SvseEmailDao.getEmailList());
	return SvseEmailDao.getEmailList();
}

Template.emailbasicsettingForm.events({
	"click #emailbasicsettingapplybtn" : function(){
		var emailbasicsetting = ClientUtils.formArrayToObject($("#emailbasicsetting").serializeArray());
		console.log(emailbasicsetting);
		SvseEmailDao.setEmailBasicSetting(emailbasicsetting,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	"click #emailbasicsettingtestbtn" : function(){
	
	}
});