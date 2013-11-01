Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('show');
		console.log("弹出");
	},
	//删除短信
	"click #delmessagesetting" : function(){
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.deleteMessageByIds(ids,function(result){
				SystemLogger(result);
			});
	},
	//改变状态-允许
	"click #allowmessagesetting" : function(){  //启用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"Yes",function(result){
				SystemLogger(result);
			});
	},
	//改变状态-禁止
	"click #forbidmessagesetting" : function(){ //禁用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"No",function(result){
				SystemLogger(result);
			});
	},
	//刷新
	"click #refreshmessagesetting" : function(){
		SvseMessageDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	//模板设置
	"click #messagetemplatesetting" : function(){
 
	},
	//帮助
	"click #messagehelpmessage" : function(){
 
	}
}

Template.messagesettingList.rendered=function(){
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("messageSettingList");
		//初始化 checkbox事件
	    ClientUtils.tableSelectAll("messagesettingtableselectall");  
	    //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("messageSettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("messageSettingList");
	});
}

//获取messagelist的集合
Template.messagesettingList.messagelist = function(){
	console.log(SvseMessageDao.getMessageList());
	return SvseMessageDao.getMessageList();
}

Template.messagesettingList.events({
	"click td .btn":function(e){
		console.log(e.currentTarget.id);
		var result = SvseMessageDao.getMessageById(e.currentTarget.id);
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
		console.log(status);
		console.log("val:"+$(":checkbox[name='Status']").val());
		$(":checkbox[name='Status']").attr("checked",false);
		console.log("true:"+($(":checkbox[name='Status']").val()===status));
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
		var weblength=$("#methodsendforweb :text[name=Length]").val();
		if(weblength > 70){
			 Message.warn("请输入长度大于0并且小于等于70的信息！"); 
			 return;
		}
		var methodsendforweb = ClientUtils.formArrayToObject($("#methodsendforweb").serializeArray());
		console.log(methodsendforweb);
		SvseMessageDao.setMessageWebConfig(methodsendforweb,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	"click #webmessagesettingrecoverbtn":function(){
		Meteor.call("svGetSMSWebConfigSetting",function(err,smsweb){
		console.log(smsweb);
		if(!smsweb) return;
		$("#methodsendforweb :text[name=User]").val(smsweb["User"]);
		$("#methodsendforweb :password[name=Pwd]").val(smsweb["Pwd"]);
		$("#methodsendforweb :text[name=Length]").val(smsweb["Length"]);
		});
	},
	//以com方式发送短信
	"click #commessagesettingapplybtn":function(){
		var comlength=$("#methodsendforcom :text[name=length]").val();
		if(comlength > 70){
			Message.warn("请输入长度大于0并且小于等于70的信息！"); 
			return;
		}
		var methodsendforcom = ClientUtils.formArrayToObject($("#methodsendforcom").serializeArray());
		console.log(methodsendforcom);
		SvseMessageDao.setMessageCommConfig(methodsendforcom,function(result){
			console.log(result);
			console.log("成功！");
		});
	},
	"click #commessagesettingrecoverbtn":function(){
		Meteor.call("svGetSMSComConfigSetting",function(err,smscom){
		console.log(smscom);
		if(!smscom) return;
		$("#comselectport").find("option[value='"+smscom["Port"]+"']:first").attr("selected","selected").prop("selected",true);
		$("#methodsendforcom :text[name=length]").val(smscom["length"]);
		});
	}
});

Template.sendingmessagemethods.rendered=function(){
	Meteor.call("svGetSMSWebConfigSetting",function(err,smsweb){
		console.log(smsweb);
		if(!smsweb) return;
		$("#methodsendforweb :text[name=User]").val(smsweb["User"]);
		$("#methodsendforweb :password[name=Pwd]").val(smsweb["Pwd"]);
		$("#methodsendforweb :text[name=Length]").val(smsweb["Length"]);
	});
	Meteor.call("svGetSMSComConfigSetting",function(err,smscom){
		console.log(smscom);
		if(!smscom) return;
		$("#comselectport").find("option[value='"+smscom["Port"]+"']:first").attr("selected","selected").prop("selected",true);
		$("#methodsendforcom :text[name=length]").val(smscom["length"]);
	});
	Meteor.call("svGetSmsDllName",function(err,dllname){
		console.log("svGetSmsDllName");
		console.log(dllname);
	});
}
