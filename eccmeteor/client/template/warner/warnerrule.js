var getWarnerRuleListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("warnerrulelist");
}

//定义分页
var page = new Pagination("alertPage",{currentPage:1,perPage:5});

Template.warnerrule.events = {
	"click #emailwarner":function(e){
		//邮件接收地址
		var emaillist = SvseEmailDao.getEmailListSync();
		//邮件模板列表
		SvseEmailDao.getEmailTemplates(function(err,result){
			var emailTemplate = [];
			for(name in result){
				emailTemplate.push(name);
			}
			var context = {EmailList:emaillist,EmailTemplate:emailTemplate};
			RenderTemplate.showParents("#emailwarnerDiv","warnerruleofemail",context);
		});
		
	},
	"click #messagewarner":function(e){
		//报警接收手机号
		var messagelist = SvseMessageDao.getMessageListSync();
		console.log(messagelist);
		//填充短信模板列表
		SvseMessageDao.getWebMessageTemplates(function(err,result){
			var messageTemplate = [];
			for(name in result){
				messageTemplate.push(name);
			}
			var context = {MessageList:messagelist,MessageTemplate:messageTemplate};
			RenderTemplate.showParents("#messagewarnerDiv","warnerruleofmessage",context);
		});
	},
	"click #scriptwarner":function(){
		//获取脚本服务器
		var entity = SvseTree.find({type:"entity"}).fetch();
		//console.log(entity);
		var scriptserver = [];
		for(i in entity){
			scriptserver.push(entity[i]["sv_name"]);
		}
		//console.log(scriptserver);
		//获取脚本
		SvseWarnerRuleDao.getScriptFiles(function(err,result){
			var scriptTemplate = [];
			for(file in result){
				scriptTemplate.push(file);
			}
			var context = {ScriptTemplate:scriptTemplate,ScriptServer:scriptserver};
			RenderTemplate.showParents("#scriptwarnerDiv","warnerruleofscript",context);
		});
	},
	"click #soundwarner":function(){
		RenderTemplate.showParents("#soundwarnerDiv","warnerruleofsound");
	},
	// "click #delwarnerrule" : function(){
		// SvseWarnerRuleDao.checkWarnerSelect(getWarnerRuleListSelectAll());
		// SvseWarnerRuleDao.deleteWarnerRules(getWarnerRuleListSelectAll());
	// },
	"click #allowewarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Enable",function(result){
			if(result.status){
				Log4js.info("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #forbidwarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Disable",function(result){
			if(result.status){
				Log4js.info("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #refreshwarnerrule":function(){
		SvseWarnerRuleDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				Log4js.info(result);
			}
			
		});
	},
	"click #warnerrulehelpmessage":function(){
		console.log("warnerrulehelpmessage");
	},

}

Template.warnerrule.rendered = function(){
	$(function(){
		//在点击删除操作时弹出提示框实现进一步提示
		$("#delwarnerrule").confirm({
			'message':"确定删除操作？",
			'action':function(){
				var ids = getWarnerRuleListSelectAll();
				SvseWarnerRuleDao.checkWarnerSelect(ids);
				if(ids.length){
					SvseWarnerRuleDao.deleteWarnerRules(ids,function(result){
						Log4js.info(result);
					});
					//console.log("确定");
				}
				$("#delwarnerrule").confirm("hide");
			}
		});
	});
	
}

// Template.warnerruleofemailform.emaillist = function(){
	// return SvseEmailDao.getEmailList();
// }
//获取报警列表
Template.warnerrulelist.rulelist = function(){
	console.log(SvseWarnerRule.find().fetch());
	return SvseWarnerRule.find({},page.skip());
}

//分页的使用
Template.warnerrulelist.pager = function(){
	return page.create(SvseWarnerRule.find().count());
}

//分页的禁用
// Template.warnerrulelist.destroyed = function(){
	// page.destroy();
// }

Template.warnerrulelist.rendered = function(){
	//初始化checkbox选项
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("warnerrulelist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("warnerrulelistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("warnerrulelist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("warnerrulelist");
	});

}
Template.warnerrulelist.events = {
	"click #warnerrulelist button[name='edit']":function(e){
		console.log(e.currentTarget.id);
		var id = e.currentTarget.id;
		var result = SvseWarnerRuleDao.getWarnerRule(e.currentTarget.id);
		var alertType = result["AlertType"];
		console.log("alerttype:"+alertType);
		//邮件报警EmailAlert
		if(alertType=="EmailAlert"){
			console.log("EmailAlert");
			var emaillist = SvseEmailDao.getEmailListSync();
			SvseEmailDao.getEmailTemplates(function(err,emailresult){
				var emailTemplate = [];
				for(name in emailresult){
					emailTemplate.push(name);
				}
				var emailwarnerinfo = {EmailWarner:result,EmailList:emaillist,EmailTemplate:emailTemplate}
				var context = {EmailWarnerInfo:emailwarnerinfo};
				RenderTemplate.showParents("#emailwarnereditDiv","warnerruleofemailedit",context);
				
				if(!result["EmailAdress"] || result["EmailAdress"]=="其他"){
					result["EmailAdress"]="";
				}
				//选中对应的邮件接收地址
				var checkedEmailAdress = result["EmailAdress"].split(",");
				//当邮件设置中的邮件数据被删除的时候，对邮件报警的邮件地址做些处理
				 for(var eal = 0 ; eal < checkedEmailAdress.length ; eal ++){
					try{
						console.log(checkedEmailAdress[eal]);
						checkemail = SvseEmailDao.getEmailByName(checkedEmailAdress[eal]);
						if(checkedEmailAdress[eal] !=="" ){
							if(!checkemail){
								//console.log(checkemail);
								Message.info("这个邮件地址可能已经不存在了！请重新选择！");
								continue;
							}
						}
						
						$(".emailmultiselectedit").multiselect('select',checkedEmailAdress[eal]);
					}catch(e){}
				}
				//选中对应的邮件模板
				var checkedEmailTemplate = result["EmailTemplate"].split(",");
				for(var etl = 0 ; etl < checkedEmailTemplate.length; etl ++){
					$("#emailtemplatelistedit").find("option[value='"+checkedEmailTemplate[etl]+"']:first").prop("selected",true);
				}
			});

		}else
		//短信报警SmsAlert
		if(alertType=="SmsAlert"){
			console.log("SmsAlert");
			console.log(result);
			//console.log(result["SmsSendMode"]);
			//填充表单
			//报警接收手机号
			var messagelist = SvseMessageDao.getMessageListSync();
			//填充短信模板列表
			if(result["SmsSendMode"] == "Web"){
				SvseMessageDao.getWebMessageTemplates(function(err,messageresult){
					var messageTemplate = [];
					for(name in messageresult){
						messageTemplate.push(name);
					}
					var messagewarnerinfo = {MessageWarner:result,MessageList:messagelist,MessageTemplate:messageTemplate};
					var context = {MessageWarnerInfo:messagewarnerinfo};
					RenderTemplate.showParents("#messagewarnereditDiv","messagewarnerformedit",context);
					
					if(!result["SmsNumber"]){
						result["SmsNumber"] = "";
					}
					if(!result["SmsSendMode"]){
						result["SmsSendMode"] = "";
					}
					var checkedSmsNumber = result["SmsNumber"].split(",");
					for(var eal = 0 ; eal < checkedSmsNumber.length ; eal ++){
						try{
							console.log(checkedSmsNumber[eal]);
							$(".messagemultiselectedit").multiselect('select',checkedSmsNumber[eal]);
						}catch(e){}
					}
					var checkedSmsTemplate = result["SmsTemplate"].split(",");
					console.log(checkedSmsTemplate);
					for(var etl = 0 ; etl < checkedSmsTemplate.length; etl ++){
						$("#messagetemplatelistedit").find("option[value='"+checkedSmsTemplate[etl]+"']:first").prop("selected",true);
					}
				});
			}else{
				SvseMessageDao.getMessageTemplates(function(err,messageresult){
					var messageTemplate = [];
					for(name in messageresult){
						messageTemplate.push(name);
					}
					var messagewarnerinfo = {MessageWarner:result,MessageList:messagelist,MessageTemplate:messageTemplate};
					var context = {MessageWarnerInfo:messagewarnerinfo};
					RenderTemplate.showParents("#messagewarnereditDiv","messagewarnerformedit",context);
					
					if(!result["SmsNumber"]){
						result["SmsNumber"] = "";
					}
					if(!result["SmsSendMode"]){
						result["SmsSendMode"] = "";
					}
					var checkedSmsNumber = result["SmsNumber"].split(",");
					for(var eal = 0 ; eal < checkedSmsNumber.length ; eal ++){
						try{
							console.log(checkedSmsNumber[eal]);
							$(".messagemultiselectedit").multiselect('select',checkedSmsNumber[eal]);
						}catch(e){}
					}
					var checkedSmsTemplate = result["SmsTemplate"].split(",");
					console.log(checkedSmsTemplate);
					for(var etl = 0 ; etl < checkedSmsTemplate.length; etl ++){
						$("#messagetemplatelistedit").find("option[value='"+checkedSmsTemplate[etl]+"']:first").prop("selected",true);
					}
				});
			}


		}
		//脚本报警ScriptAlert
		if(alertType=="ScriptAlert"){
			console.log("ScriptAlert");
			//console.log(result);
			//获取脚本服务器
			var entity = SvseTree.find({type:"entity"}).fetch();
			//console.log(entity);
			var scriptserver = [];
			for(i in entity){
				scriptserver.push(entity[i]["sv_name"]);
			}
			//console.log(scriptserver);
			//获取脚本
			SvseWarnerRuleDao.getScriptFiles(function(err,fileresult){
				var scriptTemplate = [];
				for(file in fileresult){
					scriptTemplate.push(file);
				}
				var scriptwarnerinfo = {ScriptWarner:result,ScriptTemplate:scriptTemplate,ScriptServer:scriptserver};
				var context = {Scriptwarnerinfo:scriptwarnerinfo};
				RenderTemplate.showParents("#scriptwarnereditDiv","editwarnerruleofscript",context);
				
				var checkedScriptFile = result["ScriptFile"].split(",");
				for(var etl = 0 ; etl < checkedScriptFile.length; etl ++){
					$("#selectscriptfile").find("option[value='"+checkedScriptFile[etl]+"']:first").prop("selected",true);
				}
				var checkedScriptServer = result["ScriptServer"].split(",");
				for(var etl = 0 ; etl < checkedScriptServer.length; etl ++){
					$("#selectscriptserver").find("option[value='"+checkedScriptServer[etl]+"']:first").prop("selected",true);
				}
			});
			
		}
		//声音报警SoundAlert
		if(alertType=="SoundAlert"){
			console.log("SoundAlert");
			//console.log(result);
			var context = {SoundWarner:result};
			RenderTemplate.showParents("#soundwarnereditDiv","editwarnerruleofsound",context);
			
		}
		
	},
	
	//点击表中的行时勾选框并查询报警日志
	"click tbody tr":function(){
		var index = this.nIndex;
		//当点击行选中时，让其他的选中取消
		var ids = ClientUtils.tableGetSelectedAll("warnerrulelist");
		console.log(ids);
		for(var i = 0;i< ids.length;i++){
			$("#"+ids[i]).prop("checked",false);
		}
		
		var flag = $("#"+index).prop("checked");
		if(!flag){
			$("#"+index).prop("checked",true);
		}
		
		var end = new Date();
		var start = new Date();
		start.setTime(start.getTime() - 1000*60*60*24);
		
		var beginDate = ClientUtils.dateToObject(start);
		var endDate = ClientUtils.dateToObject(end);
		console.log("#############################");
		console.log(beginDate);
		console.log(beginDate["month"]);
		console.log(endDate);
		console.log("#######################");
		console.log(this);
		$("#warnerruleloglist").empty();
		var querylogCondition = {AlertName:this.AlertName,AlertReceiver:"",AlertType:""};
		console.log(querylogCondition);
		SvseAlertLogDao.getQueryAlertLog(beginDate,endDate,querylogCondition,function(result){
			console.log("result");
			if(!result.status){
				Log4js.info(result.msg);
				return;
			}
			console.log(result);
			//var dataProcess = new DataProcess(result.content);
			var resultData = result.content;
			if(!resultData){
				console.log("查出报警日志没有数据");
				return;
			}
			//console.log(resultData.length);
			//console.log(resultData);
			var types = SvseAlertLogDao.defineAlertTypeData();
			//绘制表
			for(var i = 0;i < resultData.length;i++){
				var data = resultData[i];
				//判断报警状态的显示
				if(data["_AlertStatus"] == 0){
					data["_AlertStatus"] = "Fail";
				}
				if(data["_AlertStatus"] == 1){
					data["_AlertStatus"] = "Success";
				}
				for(var j = 0; j < types.length;j++){
					if(data["_AlertType"] == types[j]["id"]){
						data["_AlertType"] = types[j]["type"];
					}
				}

			}
			var context = {QueryWarnData:resultData};
			RenderTemplate.renderIn("#warnerloglistDiv","warnerloglist",context);
		});
	}

}
