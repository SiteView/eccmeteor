var getWarnerRuleListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("warnerrulelist");
}

//定义分页
var page = new Pagination("alertPage",{currentPage:1,perPage:5});

Template.warnerrule.events = {
	"click #emailwarner":function(e){
		//邮件接收地址
		var emaillist = SvseEmailDao.getEmailList();
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
		var messagelist = SvseMessageDao.getMessageList();
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
		$("#scriptwarnerdiv").modal("show");
	},
	"click #soundwarner":function(){
		$("#soundwarnerdiv").modal("show");
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

Template.warnerruleofemail.events = {
	"click #warnerruleofemailcancelbtn" : function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #warnerruleofemailsavebtn":function(e,t){
		var warnerruleofemailform = ClientUtils.formArrayToObject($("#warnerruleofemailform").serializeArray());
		var warnerruleofemailformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofemailformsendconditions").serializeArray());
		for(param in warnerruleofemailformsendconditions){
			warnerruleofemailform[param] = warnerruleofemailformsendconditions[param];
		}
		
		var selectEmailAdress = $(".emailmultiselect").val()
		console.log(selectEmailAdress);
		var selectEmailAdressStr = SvseWarnerRuleDao.getValueOfMultipleSelect(selectEmailAdress);
		warnerruleofemailform["EmailAdress"] = selectEmailAdressStr;
		
		//warnerruleofemailform["AlertCond"] = 3;
		//warnerruleofemailform["SelTime1"] = 2;
		//warnerruleofemailform["SelTime2"] = 3;
		warnerruleofemailform["AlertState"] = "Enable";
		warnerruleofemailform["AlertType"] = "EmailAlert";
		//warnerruleofemailform["AlwaysTimes"] = 1;
		//warnerruleofemailform["OnlyTimes"] = 1;
		
		var alertName=warnerruleofemailform["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(alertresult){
			Message.info("报警名称已经存在");
			return;
		}
		var emailAdress=warnerruleofemailform["EmailAdress"];
		var otherAdress = warnerruleofemailform["OtherAdress"];
		if(!emailAdress && !otherAdress){
			Message.info("报警邮件接收地址不能为空");
			return;
		}
		//当其他邮件地址存在的时候，检查邮件地址的格式是否正确
		if(otherAdress){
			var flag = SvseEmailDao.checkEmailFormat(otherAdress);
			if(!flag) return;
		}
		
		//判断停止次数不能小于升级次数，且不能为空
		var stop = warnerruleofemailform["Stop"];
		var upgrade = warnerruleofemailform["Upgrade"];
		if(stop == "" || upgrade == ""){
			Message.info("停止次数与升级次数不能为空！");
			return;
		}else{
			if(stop < upgrade){
				Message.info("停止次数不能小于升级次数！");
				return;
			}
		}
		
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofemailform["AlertTarget"] = targets.join();
		if(!warnerruleofemailform["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		warnerruleofemailform["nIndex"] = nIndex;
		console.log(warnerruleofemailform);
		var section = {};
		section[nIndex] = warnerruleofemailform;
		console.log(section);
		SvseWarnerRuleDao.setWarnerRuleOfEmail(nIndex,section,function(result){
			if(result.status){
				RenderTemplate.hideParents(t);
			}else{
				Log4js.info(result.msg);
			}
			
		});
	}
}

Template.warnerruleofemail.rendered = function(){
	//监视器选择树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
}

Template.warnerruleofemailform.rendered = function(){
	$(document).ready(function() {
		//邮件下拉列表多选框
		$('.emailmultiselect').multiselect({
			buttonClass : 'btn',
			buttonWidth : 'auto',
			buttonContainer : '<div class="btn-group" />',
			maxHeight : 400,
			enableFiltering : true,
			buttonText : function (options) {
				if (options.length == 0) {
					return 'None selected <b class="caret"></b>';
				} else if (options.length > 3) {
					return options.length + ' selected  <b class="caret"></b>';
				} else {
					var selected = '';
					options.each(function () {
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
				}
			}
		});
	});
}

// Template.warnerruleofemailform.emaillist = function(){
	// return SvseEmailDao.getEmailList();
// }
//获取报警列表
Template.warnerrulelist.rulelist = function(){
	console.log(SvseWarnerRuleDao.getWarnerRuleList());
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
			var emaillist = SvseEmailDao.getEmailList();
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
			//填充表单
			//报警接收手机号
			var messagelist = SvseMessageDao.getMessageList();
			//填充短信模板列表
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


		}
		//脚本报警ScriptAlert
		if(alertType=="ScriptAlert"){
			console.log("ScriptAlert");
			//console.log(result);
			$("#warnerruleofscriptformedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#warnerruleofscriptformedit").find(":text[name='ScriptParam']:first").val(result.ScriptParam);
			$("#warnerruleofscriptformedit").find(":text[name='Strategy']:first").val(result.Strategy);
			$("#warnerruleofscriptformedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
			
			var checkedScriptFile = result["ScriptFile"].split(",");
			for(var etl = 0 ; etl < checkedScriptFile.length; etl ++){
				$("#selectscriptfile").find("option[value='"+checkedScriptFile[etl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			
			var AlertCategory = result.AlertCategory;
			$("#warnerruleofscriptformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
				if($(this).val() === AlertCategory){
					$(this).attr("checked",true);
				}
			});
			$("#scriptwarnerdivedit").modal('show');
			
			var checkednodes = result.AlertTarget.split("\,");
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editscript");
			treeObj.checkAllNodes(false);//清空上一个用户状态
			//节点勾选
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
		}
		//声音报警SoundAlert
		if(alertType=="SoundAlert"){
			console.log("SoundAlert");
			//console.log(result);
			$("#warnerruleofsoundformedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#warnerruleofsoundformedit").find(":text[name='Server']:first").val(result.Server);
			$("#warnerruleofsoundformedit").find(":text[name='LoginName']:first").val(result.LoginName);
			$("#warnerruleofsoundformedit").find(":password[name='LoginPwd']:first").val(result.LoginPwd);
			$("#warnerruleofsoundformedit").find(":text[name='Strategy']:first").val(result.Strategy);
			$("#warnerruleofsoundformedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
			
			$("#soundwarnerdivedit").modal('show');
			
			var checkednodes = result.AlertTarget.split("\,");
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editsound");
			treeObj.checkAllNodes(false);//清空上一个用户状态
			//节点勾选
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
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

Template.warnerruleofemailedit.rendered = function(){
	$(function(){
		/* //填充邮件地址下拉列表
		var emaillist = SvseEmailDao.getEmailList();
		var emailaddressselect = $("#emailwarnerdivedit").find(".emailmultiselectedit:first");
		for(var l = 0 ; l < emaillist.length ; l++){
			// console.log(emaillist[l]);
			var name = emaillist[l].Name;
			var option = $("<option value="+name+"></option>").html(name);
			emailaddressselect.append(option);
		} */
		$('.emailmultiselectedit').multiselect({
			buttonClass : 'btn',
			buttonWidth : 'auto',
			buttonContainer : '<div class="btn-group" />',
			maxHeight : 400,
			enableFiltering : true,
			buttonText : function (options) {
				if (options.length == 0) {
					return 'None selected <b class="caret"></b>';
					return 'None selected <b class="caret"></b>';
				} else if (options.length > 3) {
					return options.length + ' selected  <b class="caret"></b>';
				} else {
					var selected = '';
					options.each(function () {
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
				}
			}
		});
	});
	
	//树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			}
		};
		
		$.fn.zTree.init($("#svse_tree_check_edit"), setting, data);
		
		var nIndex = $("#getemailwarnerid").val();
		console.log("nIndex:"+nIndex);
		var result = SvseWarnerRuleDao.getWarnerRule(nIndex);
		var displayNodes = result.AlertTarget.split("\,");
		console.log(displayNodes);
		if(displayNodes && displayNodes.length){
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
			//节点勾选
			for(var index  = 0; index < displayNodes.length ; index++){
				if(displayNodes[index] == "") continue;
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === displayNodes[index];
				},true),true);
			}
		}
	});

}


Template.warnerruleofemailedit.events = {
	"click #warnerruleofemailcancelbtnedit":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #warnerruleofemailsavebtnedit" : function(e,t){
		var warnerruleofemailformedit = ClientUtils.formArrayToObject($("#warnerruleofemailformedit").serializeArray());
		var warnerruleofemailformsendconditionsedit = ClientUtils.formArrayToObject($("#warnerruleofemailformsendconditionsedit").serializeArray());
		for(param in warnerruleofemailformsendconditionsedit){
			warnerruleofemailformedit[param] = warnerruleofemailformsendconditionsedit[param];
		}
		
		var selectEmailAdress = $(".emailmultiselectedit").val()
		console.log(selectEmailAdress);
		var selectEmailAdressStr = SvseWarnerRuleDao.getValueOfMultipleSelect(selectEmailAdress);
		warnerruleofemailformedit["EmailAdress"] = selectEmailAdressStr;
		
		//warnerruleofemailformedit["AlertCond"] = 3;
		//warnerruleofemailformedit["SelTime1"] = 2;
		//warnerruleofemailformedit["SelTime2"] = 3;
		warnerruleofemailformedit["AlertState"] = "Enable";
		warnerruleofemailformedit["AlertType"] = "EmailAlert";
		//warnerruleofemailformedit["AlwaysTimes"] = 1;
		//warnerruleofemailformedit["OnlyTimes"] = 1;
		
		var alertName=warnerruleofemailformedit["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var result=SvseWarnerRuleDao.getWarnerRule(warnerruleofemailformedit["nIndex"]);
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(result["AlertName"]!=alertName)
		{
			if(alertresult){
				Message.info("报警名称已经存在");
				return;
			}
		}
		
		var emailAdress=warnerruleofemailformedit["EmailAdress"];
		var otherAdress = warnerruleofemailformedit["OtherAdress"];
		if(!emailAdress && !otherAdress){
			Message.info("报警邮件接收地址不能为空");
			return;
		}
		//当其他邮件地址存在的时候，检查邮件地址的格式是否正确
		if(otherAdress){
			var flag = SvseEmailDao.checkEmailFormat(otherAdress);
			if(!flag) return;
		}
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_edit").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofemailformedit["AlertTarget"] = targets.join();
		if(!warnerruleofemailformedit["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		console.log(warnerruleofemailformedit);
		var section = {};
		section[warnerruleofemailformedit["nIndex"]] = warnerruleofemailformedit;
		console.log(section);
		SvseWarnerRuleDao.updateWarnerRule(warnerruleofemailformedit["nIndex"],section,function(result){
			RenderTemplate.hideParents(t);
		});
	}
}