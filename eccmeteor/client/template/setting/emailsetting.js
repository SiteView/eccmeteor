var getEmailSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("emailSettingList");
}
//定义分页
var page = new Pagination("emailPage",{currentPage:1,perPage:5});

Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
		$('#emailaddresssettingdiv').modal('toggle');
	},
	"click #delemailsetting" : function(){
		var ids = getEmailSelectAll();
		SvseEmailDao.checkEmailSelect(ids);
		if(ids.length)
			SvseEmailDao.deleteEmailAddressByIds(ids,function(result){
				SystemLogger(result);
			});
	},
	"click #allowemailsetting" : function(){  //启用邮件地址
		var ids = getEmailSelectAll();
		SvseEmailDao.checkEmailSelect(ids);
		if(ids.length)
			SvseEmailDao.updateEmailAddressStatus(ids,"0",function(result){
				SystemLogger(result);
			});
	},
	"click #forbidemailsetting" : function(){ //禁用邮件地址
		var ids = getEmailSelectAll();
		SvseEmailDao.checkEmailSelect(ids);
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
	
	//获取任务计划列表
	getlLoadEmailTaskName("emailTaskTypelist","emailSchedulelist");
}

//获取任务计划
var getlLoadEmailTaskName = function(id1,id2){
	var tasktype = $("#"+id1).val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#"+id2).empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#"+id2).append(option);
		}
	}
};

//获取任务计划
var getEmailTaskName = function(id1,id2){
	var tasktype = $("#"+id1).val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#"+id2).empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		if(!tasks || tasks == ""){
			Message.info("任务计划没有设值！");
			return;
		}
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#"+id2).append(option);
		}
	}
};

Template.emailbasicsettingofaddress.events = {
	"click #emailbasicsettingofaddresscancelbtn":function(){
		$('#emailaddresssettingdiv').modal('toggle');
	},
	"click #emailbasicsettingofaddresssavebtn":function(){
		var emailbasicsettingofaddressbasciinfo = ClientUtils.formArrayToObject($("#emailbasicsettingofaddressbasciinfo").serializeArray());
		var nIndex = Utils.getUUID();
		emailbasicsettingofaddressbasciinfo["nIndex"] = nIndex
	//	console.log(emailbasicsettingofaddressbasciinfo);
		var name = emailbasicsettingofaddressbasciinfo["Name"];
		if(!name){
			Message.info("请填写名称");
			return;
		}
		var result = SvseEmailDao.getEmailByName(name);
		if(result){
			Message.info("此名称已存在");
			return;
		}
		var mail = emailbasicsettingofaddressbasciinfo["MailList"];
		if(!mail){
			Message.info("请填写Email地址");
			return;
		}
		var flag = SvseEmailDao.checkEmailFormat(mail);
		if(!flag) return;
		
		var address = {};
		address[nIndex] = emailbasicsettingofaddressbasciinfo;
		SvseEmailDao.addEmailAddress(nIndex,address,function(result){
			Log4js.info(result);
			$('#emailaddresssettingdiv').modal('toggle');
		});
	},
	//任务计划类型改变事件，对应任务计划
	"change #emailTaskTypelist":function(){
		getEmailTaskName("emailTaskTypelist","emailSchedulelist");
	},
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
		var name = emailbasicsettingofaddressbasciinfoedit["Name"];
		if(!name){
			Message.info("请填写名称");
			return;
		}
		//检查重名
		var result = SvseEmailDao.getEmailById(nIndex);
		var emailresult = SvseEmailDao.getEmailByName(name);
		if(result["Name"] != name){
			if(emailresult){
				Message.info("此名称已存在");
				return;
			}
		}
		
		var mail = emailbasicsettingofaddressbasciinfoedit["MailList"];
		if(!mail){
			Message.info("请填写Email地址");
			return;
		}
		//验证邮件地址
		var flag = SvseEmailDao.checkEmailFormat(mail);
		if(!flag) return;
		
		var address = {};
		address[nIndex] = emailbasicsettingofaddressbasciinfoedit;
	//	console.log(address);
		SvseEmailDao.updateEmailAddress(nIndex,address,function(){
			$('#emailaddresssettingdivedit').modal('toggle');
		});
	},
	//任务计划类型改变事件，对应任务计划
	"change #editemailTaskTypelist":function(){
		getEmailTaskName("editemailTaskTypelist","editemailSchedulelist");
	},
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
	
	//获取任务计划列表
	getlLoadEmailTaskName("editemailTaskTypelist","editemailSchedulelist");
}

Template.emailsettingList.events({
	"click td .btn":function(e){
		console.log(e.currentTarget.id);
		var result = SvseEmailDao.getEmailById(e.currentTarget.id);
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



//获取email的集合
Template.emailsettingList.emaillist = function(){
	console.log(SvseEmailDao.getEmailList());
	//return SvseEmailDao.getEmailList();
	return SvseEmailList.find({},page.skip());
}
//分页的使用
Template.emailsettingList.paper = function(){
	return page.create(SvseEmailList.find().count());
}

// Template.emailsettingList.destroyed = function(){
	// page.destroy();
// }

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