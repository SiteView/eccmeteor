var getEmailSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("emailSettingList");
}
//定义分页
var page = new Pagination("emailPage",{currentPage:1,perPage:5});

Template.emailsetting.events  = {
	"click #addemailsetting" : function(){
		//获取任务计划列表
		var tasks = getlLoadEmailTaskName("","emailSchedulelist");
		//邮件模板下拉列表
		SvseEmailDao.getEmailTemplates(function(err,result){
			var emailTemplate = [];
			for(name in result){
				emailTemplate.push(name);
			}
			var context = {Tasks:tasks,EmailTemplate:emailTemplate};
			RenderTemplate.showParents("#emailaddresssettingDiv","emailbasicsettingofaddress",context);
		});

	},
	
	"click #allowemailsetting" : function(){  //启用邮件地址
		var ids = getEmailSelectAll();
		SvseEmailDao.checkEmailSelect(ids);
		if(ids.length)
			SvseEmailDao.updateEmailAddressStatus(ids,"0",function(result){
				Log4js.info(result);
			});
	},
	"click #forbidemailsetting" : function(){ //禁用邮件地址
		var ids = getEmailSelectAll();
		SvseEmailDao.checkEmailSelect(ids);
		if(ids.length)
			SvseEmailDao.updateEmailAddressStatus(ids,"1",function(result){
				Log4js.info(result);
			});
	},
	"click #refreshemailsetting" : function(){
		//邮件同步
		SvseEmailDao.sync();
	},
	//邮件模板设置
	"click #emailtemplatesetting" : function(){
		SvseEmailDao.getEmailTemplates(function(err,result){
			console.log(result);
			var emailTemplate = [];
			var defaulttemplate = {};
			for(index in result){
				var temp = {};
				//console.log(index);
				//console.log(result[index]);
				temp["name"] = index;
				temp["context"] = result[index];
				console.log(temp);
				emailTemplate.push(temp);
				if(index == "Default"){
					defaulttemplate = temp;
				}
				//console.log(emailTemplate);
				
			}
			// console.log(emailTemplate);
			// console.log(defaulttemplate);
			var context = {emailTemplate:emailTemplate,showTemplate:defaulttemplate};
			RenderTemplate.showParents("#emailTemplateSettingDiv","emailtemplatesetting",context);
		});
	},
	"click #emailhelpmessage" : function(){
 
	},
	"click #emailbasicsettingapplybtn" : function(){
		var emailbasicsetting = ClientUtils.formArrayToObject($("#emailbasicsetting").serializeArray());
		console.log(emailbasicsetting);
		SvseEmailDao.setEmailBasicSetting(emailbasicsetting,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	"click #emailbasicsettingtestbtn" : function(){
		$("#emailtestform")[0].reset();//重置表单
		MessageTip.close("a1");
		$("#emailTestDiv").modal("show");
	},
}

Template.emailsetting.rendered = function(){
	SvseEmailDao.getSendEmailSetting(function(setting){
		console.log(setting);
		if(!setting) return;
		var context = {BasicSetting:setting};
		RenderTemplate.renderIn("#emailbasicsettingFormDiv","emailbasicsettingForm",context);
		// $("#emailbasicsetting :text[name='server']").val(setting["server"]);
		// $("#emailbasicsetting :text[name='from']").val(setting["from"]);
		// $("#emailbasicsetting :text[name='backupserver']").val(setting["backupserver"]);
		// $("#emailbasicsetting :text[name='user']").val(setting["user"]);
		// $("#emailbasicsetting :password[name='password']").val(setting["password"]);
	});

	$(function(){
		//在点击删除操作时弹出提示框实现进一步提示
		$("#delemailsetting").confirm({
			'message':"确定删除操作？",
			'action':function(){
				var ids = getEmailSelectAll();
				console.log(ids);
				SvseEmailDao.checkEmailSelect(ids);
				if(ids.length){
					//在删除之前要先判断报警规则中有没有正在使用的邮件，如果有，则不能删除
					ids = getEmailNameOfAlertUsing(ids);
					console.log(ids);
					if(ids == "") return;
					SvseEmailDao.deleteEmailAddressByIds(ids,function(result){
						console.log(result);
					});
					//console.log("确定");
				}
				$("#delemailsetting").confirm("hide");
			}
		});
		
		
	});
}

var getEmailNameOfAlertUsing = function(ids){
	//得到所有邮件报警正在使用中的邮件接收地址名称
	var getAlertByType = SvseWarnerRuleDao.getAlertByAlertType("EmailAlert");
	console.log(getAlertByType);
	var emailaddress = [];
	var rec = {};
	var names = [];
	for(var index in getAlertByType){
		//console.log(getAlertByType[index]["EmailAdress"]);
		var address = getAlertByType[index]["EmailAdress"];
		if(!address) continue;
		var res = address.split(",");
		for(var i = 0;i < res.length;i++){
			emailaddress.push(res[i]);
		}
	}
	//console.log(emailaddress);
	for(var j = 0;j < emailaddress.length;j++){
		if(!rec[emailaddress[j]]){   
          rec[emailaddress[j]] = true;   
          names.push(emailaddress[j]);   
		}  
	}
	var nameStr = [];
	//var useids = [];
	for(var i = 0;i < names.length;i++){
		for(var k = 0;k < ids.length;k++){
			var email = SvseEmailDao.getEmailById(ids[k]);
			if(email["Name"] == names[i]){
				//useids.push(ids[k]);
				ids.splice(k,1);
				nameStr.push(email["Name"]);
				Message.info(nameStr.join() +"正在报警规则中使用，不能删除，请重选");
			}
		}
	}
	//console.log(ids);
	return ids;
	
}

Template.emailsettingList.rendered = function(){
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
	
}

//获取任务计划
var getlLoadEmailTaskName = function(tasktype,id2){
	console.log("tasktype:"+tasktype);
	if(!tasktype){
		tasktype = "2";
	}
	//获取任务计划列表
	if(tasktype){
		$("#"+id2).empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		var task = [];
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			task.push(tasks[i]);
		}
		return task;
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
	"click #emailbasicsettingofaddresscancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #emailbasicsettingofaddresssavebtn":function(e,t){
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
			RenderTemplate.hideParents(t);
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
	"click #emailbasicsettingofaddresscancelbtnedit":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #emailbasicsettingofaddresssavebtnedit":function(e,t){
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
			RenderTemplate.hideParents(t);
		});
	},
	//任务计划类型改变事件，对应任务计划
	"change #editemailTaskTypelist":function(){
		getEmailTaskName("editemailTaskTypelist","editemailSchedulelist");
	},
}

Template.emailbasicsettingofaddressedit.rendered = function(){
	
}

Template.emailsettingList.events({
	"click td .btn":function(e){
		//console.log(e.currentTarget.id);
		var editresult = SvseEmailDao.getEmailById(e.currentTarget.id);
		console.log(editresult);
		//获取任务计划列表
		var tasks = getlLoadEmailTaskName(editresult["TaskType"],"editemailSchedulelist");
		//邮件模板下拉列表
		SvseEmailDao.getEmailTemplates(function(err,result){
			var emailTemplate = [];
			for(name in result){
				emailTemplate.push(name);
			}
			var emailinfo = {Email:editresult,Tasks:tasks,EmailTemplate:emailTemplate};
			var context = {EmailInfo:emailinfo};
			RenderTemplate.showParents("#emailaddresssettingeditDiv","emailbasicsettingofaddressedit",context);
			$("#editemailSchedulelist").find("option[value='"+editresult["Schedule"]+"']:first").prop("selected",true);
			$("#emailbasicsettingofaddressemailtemplatelistedit").find("option[value='"+editresult["Template"]+"']:first").prop("selected",true);
		});
		
		
		// var template = result["Template"];
		// var bCheck = result["bCheck"];
		// $("#emailbasicsettingofaddressemailtemplatelistedit option").each(function(){
			// if($(this).val() == template) this.checked = true;
		// });
		// $(":radio[name='bCheck']").each(function(){
			// if($(this).val() == bCheck) this.checked = true;
		// });
		// Session.set("emailbasicsettingofaddressbasciinfoeditform",result);
		// $('#emailaddresssettingdivedit').modal('toggle');
	}
});



//获取email的集合
Template.emailsettingList.emaillist = function(){
	console.log(SvseEmailList.find().fetch());
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

/* Template.emailbasicsettingForm.events({
	"click #emailbasicsettingapplybtn" : function(){
		var emailbasicsetting = ClientUtils.formArrayToObject($("#emailbasicsetting").serializeArray());
		console.log(emailbasicsetting);
		SvseEmailDao.setEmailBasicSetting(emailbasicsetting,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	
	"click #emailbasicsettingtestbtn" : function(){
		$("#emailtestform")[0].reset();//重置表单
		MessageTip.close("a1");
		$("#emailTestDiv").modal("show");
		
	},
}); */

Template.emailtest.events({
	"click #cancelsendemail":function(){
		MessageTip.close("a1");
		$("#emailTestDiv").modal("hide");
	},
	//点击确认发送邮件
	"click #suresendemail":function(){
		var emailinfo = ClientUtils.formArrayToObject($("#emailtestform").serializeArray());
		//console.log(emailinfo);
		var emailto = emailinfo["mailTo"];
		if(!emailto){
			Message.info("Email地址不能为空");
			return;
		}
		//验证邮件地址
		var flag = SvseEmailDao.checkEmailFormat(emailto);
		if(!flag) return;
		
		var emailSetting = {};
		for(var i in emailinfo){
			emailSetting[i] = emailinfo[i];
		}
		//console.log(emailSetting);
		SvseEmailDao.getSendEmailSetting(function(err,setting){
			if(!setting) return;
			console.log(setting);
			
			emailSetting["mailServer"] = setting["server"];
			emailSetting["mailFrom"] = setting["from"];
			emailSetting["subject"] = setting["backupserver"];
			emailSetting["user"] = setting["user"];
			emailSetting["password"] = setting["password"];
			
			console.log(emailSetting);
			SvseEmailDao.emailTest(emailSetting,function(result){
				console.log(result.status);
				MessageTip.close("a1");
				if(!result.status){
					var content = emailSetting["mailTo"]+"发送失败";
					MessageTip.error(content,{selector:"body div#emailTestDiv",replace:false,close:true,id:"a1"});
					return;
				}
				var content = emailSetting["mailTo"]+"发送成功";
				MessageTip.info(content,{selector:"body div#emailTestDiv",replace:false,close:true,id:"a1"});
			});
		});
		
		//$("#emailTestDiv").modal("hide");
	}
});
