var getMessageSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("messageSettingList");
}
//定义分页
var page = new Pagination("messagePage",{currentPage:1,perPage:5});

Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('show');
		console.log("弹出");
	},
	//删除短信
	/* "click #delmessagesetting" : function(){
		
		var ids = getMessageSelectAll();
		SvseMessageDao.checkMessageSelect(ids);
		if(ids.length)
			$("#delmessagesetting").confirm({
				'message':"确定删除操作？"
			});
			
			// SvseMessageDao.deleteMessageByIds(ids,function(result){
				// Log4js.info(result);
			// });
	}, */
	//改变状态-允许
	"click #allowmessagesetting" : function(){  //启用邮件地址
		var ids = getMessageSelectAll();
		SvseMessageDao.checkMessageSelect(ids);
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"Yes",function(result){
				Log4js.info(result);
			});
	},
	//改变状态-禁止
	"click #forbidmessagesetting" : function(){ //禁用邮件地址
		var ids = getMessageSelectAll();
		SvseMessageDao.checkMessageSelect(ids);
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"No",function(result){
				Log4js.info(result);
			});
	},
	//刷新
	"click #refreshmessagesetting" : function(){
		SvseMessageDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				Log4js.info(result);
			}
			
		});
	},
	//模板设置
	//短信模板设置
	"click #smsmessagetemplatesetting" : function(){
		//$("#messageTemplateSettingDiv").modal("show");
		SvseMessageDao.getMessageTemplates(function(err,result){
			console.log(result);
			var messageTemplate = [];
			var defaulttemplate = {};
			for(index in result){
				var temp = {};
				//console.log(index);
				//console.log(result[index]);
				temp["name"] = index;
				temp["context"] = result[index];
				console.log(temp);
				messageTemplate.push(temp);
				if(index == "Default"){
					defaulttemplate = temp;
				}
				//console.log(messageTemplate);
				
			}
			// console.log(messageTemplate);
			// console.log(defaulttemplate);
			var context = {Template:messageTemplate,showTemplate:defaulttemplate};
			RenderTemplate.showParents("#messageTemplateSettingDiv","messagetemplatesetting",context);
		});
	},
	
	//web短信模板设置
	"click #webmessagetemplatesetting" : function(){
		SvseMessageDao.getWebMessageTemplates(function(err,result){
			console.log(result);
			var webmessageTemplate = [];
			var defaultwebtemplate = {};
			for(index in result){
				var temp = {};
				// console.log(index);
				// console.log(result[index]);
				var context = result[index].split("\\;");
				console.log(context);
				temp["name"] = index;
				temp["webtemplatetitle"] = context[0];
				temp["messagecontext"] = context[1];
				console.log(temp);
				webmessageTemplate.push(temp);
				if(index == "Simple"){
					defaultwebtemplate = temp;
				}
				//console.log(webmessageTemplate);
				
			}
			console.log(webmessageTemplate);
			console.log(defaultwebtemplate);
			var content = {webTemplate:webmessageTemplate,showWebTemplate:defaultwebtemplate};
			RenderTemplate.showParents("#webmessageTemplateSettingDiv","webmessagetemplatesetting",content);
		});
	},
	//帮助
	"click #messagehelpmessage" : function(){
 
	}
}

Template.messagesetting.rendered = function(){
	$(function(){
		//在点击删除操作时弹出提示框实现进一步提示
		$("#delmessagesetting").confirm({
			'message':"确定删除操作？",
			'action':function(){
				var ids = getMessageSelectAll();
				SvseMessageDao.checkMessageSelect(ids);
				if(ids.length){
					SvseMessageDao.deleteMessageByIds(ids,function(result){
						Log4js.info(result);
					});
					//console.log("确定");
				}
				$("#delmessagesetting").confirm("hide");
			}
		});

	});
}

Template.messagesettingList.rendered = function(){
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("messageSettingList");
		//初始化 checkbox事件
	    ClientUtils.tableSelectAll("messagesettingtableselectall");  
	    //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("messageSettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("messageSettingList");
		//实现模板的拖拽
		ModalDrag.draggable("#addmessagesettingdiv");
		ModalDrag.draggable("#editmessagesettingdiv");
	});
}

//获取messagelist的集合
Template.messagesettingList.messagelist = function(){
	//console.log(SvseMessageDao.getMessageList());
	//return SvseMessageDao.getMessageList();
	return SvseMessageList.find({},page.skip());
}
//分页的使用
Template.messagesettingList.pager = function(){
	return page.create(SvseMessageList.find().count());
}

// Template.messagesettingList.destroyed = function(){
	// page.destroy();
// }

Template.messagesettingList.events({
	"click td .btn":function(e,t){
		console.log(e.currentTarget.id);
		var result = SvseMessageDao.getMessageById(e.currentTarget.id);
		/* console.log(editresult);
		var tasks = getLoadTaskNames(editresult["TaskType"]);
		//console.log(tasks);
		
		SvseMessageDao.getMessageTemplates(function(err,result){
			var template = [];
			for(name in result){
				template.push(name);
			}
			console.log(template);
			var messageinfo = {Message:editresult,Tasks:tasks,MessageTemplate:template}
			var context = {MessageInfo:messageinfo};
			RenderTemplate.showParents("#messageTemplateSettingDiv","editmessagebasicsetting",context);
			$("#editmessagePlanlist").find("option[value='"+editresult["Plan"]+"']:first").attr("selected","selected").prop("selected",true);
			$("#messagebasicsettingofmessagetemplatelistedit").find("option[value='"+editresult["Template"]+"']:first").attr("selected","selected").prop("selected",true);
		}); */
		
		
		
		 //console.log(result);
		//编辑的时候填充表单
		$("#editmessagesettingdiv").find(":hidden[name='nIndex']:first").val(result.nIndex);
		$("#editmessagesettingdiv").find(":text[name='Name']:first").val(result.Name);
		$("#editmessagesettingdiv").find(":text[name='Phone']:first").val(result.Phone);
		var checkedTemplate = result["Template"].split(",");
		//console.log(checkedTemplate);
		for(var etl = 0 ; etl < checkedTemplate.length; etl ++){
			$("#messagebasicsettingofmessagetemplatelistedit").find("option[value='"+checkedTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var status = result["Status"];
		//console.log(status);
		//console.log("val:"+$(":checkbox[name='Status']").val());
		$(":checkbox[name='Status']").attr("checked",false);
		//console.log("true:"+($(":checkbox[name='Status']").val()===status));
		if($(":checkbox[name='Status']").val() === status){
			$(":checkbox[name='Status']").attr("checked",true);
		}
		var templateType = result["TemplateType"].split(",");
		for(var etl = 0 ; etl < templateType.length; etl ++){
			$("#editmessageTemplateTypelist").find("option[value='"+templateType[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var taskType = result["TaskType"].split(",");
		for(var etl = 0 ; etl < taskType.length; etl ++){
			$("#editmessageTaskTypelist").find("option[value='"+taskType[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var plan = result["Plan"].split(",");
		for(var etl = 0 ; etl < plan.length; etl ++){
			$("#editmessagePlanlist").find("option[value='"+plan[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		$('#editmessagesettingdiv').modal('show'); 
		
	}
});
//发送短信的方式应用
Template.sendingmessagemethods.events({
	//以web方式发送短信
	"click #webmessagesettingapplybtn":function(){
		var username=$("#methodsendforweb").find(":text[name='User']").val();
		if(!username){
			Message.info("用户名不能为空");
			return;
		}
		var pwd=$("#methodsendforweb").find(":password[name='Pwd']").val();
		if(!pwd){
			Message.info("密码不能为空");
			return;
		}
		var weblength=$("#methodsendforweb :text[name='Length']").val();
		if(weblength == 0 || weblength > 70){
			 Message.warn("请输入长度大于0并且小于等于70的信息！"); 
			 $("#methodsendforweb :text[name='Length']").val(0);
			 return;
		}
		var methodsendforweb = ClientUtils.formArrayToObject($("#methodsendforweb").serializeArray());
		//console.log(methodsendforweb);
		SvseMessageDao.setMessageWebConfig(methodsendforweb,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	"click #webmessagesettingrecoverbtn":function(){
		Meteor.call("svGetSMSWebConfigSetting",function(err,smsweb){
			//console.log(smsweb);
			if(!smsweb) return;
			var context = {SmsWeb:smsweb};
			RenderTemplate.renderIn("#methodsendforwebFormDiv","methodsendforwebForm",context);
			// $("#methodsendforweb :text[name='User']").val(smsweb["User"]);
			// $("#methodsendforweb :password[name='Pwd']").val(smsweb["Pwd"]);
			// $("#methodsendforweb :text[name='Length']").val(smsweb["Length"]);
		});
	},
	//以com方式发送短信
	"click #commessagesettingapplybtn":function(){
		var comlength=$("#methodsendforcom :text[name='length']").val();
		if(!comlength || comlength == 0 || comlength > 70){
			Message.warn("请输入长度大于0并且小于等于70的信息！"); 
			$("#methodsendforcom :text[name='length']").val(0);
			return;
		}
		var methodsendforcom = ClientUtils.formArrayToObject($("#methodsendforcom").serializeArray());
		//console.log(methodsendforcom);
		SvseMessageDao.setMessageCommConfig(methodsendforcom,function(result){
			//console.log(result);
			console.log("成功！");
		});
	},
	"click #commessagesettingrecoverbtn":function(){
		Meteor.call("svGetSMSComConfigSetting",function(err,smscom){
			//console.log(smscom);
			if(!smscom) return;
			var context = {SmsCom:smscom};
			RenderTemplate.renderIn("#methodsendforcomFormDiv","methodsendforcomForm",context);
			// $("#comselectport").find("option[value='"+smscom["Port"]+"']:first").attr("selected","selected").prop("selected",true);
			// $("#methodsendforcom :text[name='length']").val(smscom["length"]);
		});
	}
});

Template.sendingmessagemethods.rendered = function(){
	Meteor.call("svGetSMSWebConfigSetting",function(err,smsweb){
		//console.log(smsweb);
		if(!smsweb){
			var smsweb = {};
		}
		var context = {SmsWeb:smsweb};
		RenderTemplate.renderIn("#methodsendforwebFormDiv","methodsendforwebForm",context);
		// $("#methodsendforweb :text[name='User']").val(smsweb["User"]);
		// $("#methodsendforweb :password[name='Pwd']").val(smsweb["Pwd"]);
		// $("#methodsendforweb :text[name='Length']").val(smsweb["Length"]);
	});
	Meteor.call("svGetSMSComConfigSetting",function(err,smscom){
		//console.log(smscom);
		if(!smscom){
			var smscom = {};
		}
		var context = {SmsCom:smscom};
		RenderTemplate.renderIn("#methodsendforcomFormDiv","methodsendforcomForm",context);
		// $("#comselectport").find("option[value='"+smscom["Port"]+"']:first").attr("selected","selected").prop("selected",true);
		// $("#methodsendforcom :text[name='length']").val(smscom["length"]);
	});
	
	//获取定制开发的发送短信的 dll名
	// Meteor.call("svGetSmsDllName",function(err,result){
		// console.log("svGetSmsDllName");
		// if(err){
			// console.log("err");
			// return;
		// }
		// console.log(result);
	// });
	
	
}

var getMessageNameOfAlertUsing = function(ids){
	//得到所有短信报警正在使用中的短信名称
	var getAlertByType = SvseWarnerRuleDao.getAlertByAlertType("SmsAlert");
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

/* //获取任务计划
var getLoadTaskNames = function(tasktype){
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#editmessagePlanlist").empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		var tasknames = [];
		
		for(var i=0;i<tasks.length;i++){
			var task = {};
			if(tasks[i] == "") continue;
			tasknames.push(tasks[i]);
		}
		//console.log(tasknames);
		return tasknames;
	}
}; */
