var getWarnerRuleListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("warnerrulelist");
}
Template.warnerrule.events = {
	"click #emailwarner":function(e){
		$('#emailwarnerdiv').modal('toggle');
	},
	"click #messagewarner":function(e){
		$('#messagewarnerdiv').modal('show');
	},
	"click #scriptwarner":function(){
		$("#scriptwarnerdiv").modal("show");
	},
	"click #soundwarner":function(){
		$("#soundwarnerdiv").modal("show");
	},
	"click #delwarnerrule" : function(){
		SvseWarnerRuleDao.checkWarnerSelect(getWarnerRuleListSelectAll());
		SvseWarnerRuleDao.deleteWarnerRules(getWarnerRuleListSelectAll());
	},
	"click #allowewarnerrule":function(){
		SvseWarnerRuleDao.checkWarnerSelect(getWarnerRuleListSelectAll());
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Enable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #forbidwarnerrule":function(){
		SvseWarnerRuleDao.checkWarnerSelect(getWarnerRuleListSelectAll());
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Disable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #refreshwarnerrule":function(){
		SvseWarnerRuleDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	"click #warnerrulehelpmessage":function(){
		console.log("warnerrulehelpmessage");
	},

}

Template.warnerruleofemail.events = {
	"click #warnerruleofemailcancelbtn" : function(){
		$('#emailwarnerdiv').modal('toggle');
	},
	"click #warnerruleofemailsavebtn":function(){
		var warnerruleofemailform = ClientUtils.formArrayToObject($("#warnerruleofemailform").serializeArray());
		var warnerruleofemailformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofemailformsendconditions").serializeArray());
		for(param in warnerruleofemailformsendconditions){
			warnerruleofemailform[param] = warnerruleofemailformsendconditions[param];
		}
		warnerruleofemailform["AlertCond"] = 3;
		warnerruleofemailform["SelTime1"] = 2;
		warnerruleofemailform["SelTime2"] = 3;
		warnerruleofemailform["AlertState"] = "Enable";
		warnerruleofemailform["AlertType"] = "EmailAlert";
		warnerruleofemailform["AlwaysTimes"] = 1;
		warnerruleofemailform["OnlyTimes"] = 1;
		
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
		if(!emailAdress){
			Message.info("报警邮件接收地址不能为空");
			return;
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
				$('#emailwarnerdiv').modal('toggle');
				$("#warnerruleofemailform")[0].reset();
			}else{
				SystemLogger(result.msg);
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
		//邮件模板下拉列表
		Meteor.call("svGetEmailTemplates",function(err,result){
			for(name in result){
				//console.log(name);
				var option = $("<option value="+name+"></option>").html(name)
				$("#emailtemplatelist").append(option);
			}
		});
	});
}

Template.warnerruleofemailform.emaillist = function(){
	return SvseEmailDao.getEmailList();
}

Template.warnerrulelist.rulelist = function(){
	console.log(SvseWarnerRuleDao.getWarnerRuleList());
	return SvseWarnerRuleDao.getWarnerRuleList();
}

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
	"click td .btn":function(e){
		console.log(e.currentTarget.id);
		var result = SvseWarnerRuleDao.getWarnerRule(e.currentTarget.id);
		var alertType=result["AlertType"];
		console.log("alerttype:"+alertType);
		//邮件报警EmailAlert
		if(alertType=="EmailAlert"){
			console.log("EmailAlert");
			//填充表单
			$("#emailwarnerdivedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#emailwarnerdivedit").find(":text[name='OtherAdress']:first").val(result.OtherAdress);
			$("#emailwarnerdivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
			$("#emailwarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
			$("#emailwarnerdivedit").find(":text[name='Stop']:first").val(result.Stop);
			$("#emailwarnerdivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
			$("#emailwarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
			$("#emailwarnerdivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
			var checkedEmailAdress = result["EmailAdress"].split(",");
			$(".emailmultiselectedit").attr("value","");
			$(".emailmultiselectedit").multiselect("refresh");
			for(var eal = 0 ; eal < checkedEmailAdress.length ; eal ++){
				try{
					$(".emailmultiselectedit").multiselect('select',checkedEmailAdress[eal]);
				}catch(e){}
			}
			var checkedEmailTemplate = result["EmailTemplate"].split(",");
			for(var etl = 0 ; etl < checkedEmailTemplate.length; etl ++){
				$("#emailtemplatelistedit").find("option[value='"+checkedEmailTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			var AlertCategory = result.AlertCategory;
			$("#warnerruleofemailformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
				if($(this).val() === AlertCategory){
					$(this).attr("checked",true);
				}
			});
			$("#emailwarnerdivedit").modal('toggle');
			
			var checkednodes = result.AlertTarget.split("\,")
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
			//节点勾选
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
		}else
		//短信报警SmsAlert
		if(alertType=="SmsAlert"){
			console.log("SmsAlert");
			//console.log(result);
			//填充表单
			var html=Meteor.render(function(){
				return Template.messagewarnerformedit(result);
			})
			$("#messagewarnerdivedit").html(html);
/* 			$("#messagewarnerdivedit").find(":text[name='AlertName']:first").val(result.AlertName);
			$("#messagewarnerdivedit").find(":text[name='OtherNumber']:first").val(result.OtherNumber);
			$("#messagewarnerdivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
			$("#messagewarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
			$("#messagewarnerdivedit").find(":text[name='Stop']:first").val(result.Stop);
			$("#messagewarnerdivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
			$("#messagewarnerdivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
			$("#messagewarnerdivedit").find(":hidden[name='nIndex']:first").val(result.nIndex); */
			var checkedSmsNumber = result["SmsNumber"].split(",");
			$(".messagemultiselectedit").attr("value","");
			$(".messagemultiselectedit").multiselect("refresh");
			for(var eal = 0 ; eal < checkedSmsNumber.length ; eal ++){
				try{
					$(".messagemultiselectedit").multiselect('select',checkedSmsNumber[eal]);
				}catch(e){}
			}
			var checkedSmsTemplate = result["SmsTemplate"].split(",");
			//console.log(checkedSmsTemplate);
			for(var etl = 0 ; etl < checkedSmsTemplate.length; etl ++){
				$("#messagetemplatelistedit").find("option[value='"+checkedSmsTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			var AlertCategory = result.AlertCategory;
			$("#warnerruleofmessageformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
				if($(this).val() === AlertCategory){
					$(this).attr("checked",true);
				}
			});
			$("#messagewarnerdivedit").modal('show');
			console.log(result.AlertTarget);
			var checkednodes = result.AlertTarget.split("\,")
			//左边树的勾选
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editsms");
			treeObj.checkAllNodes(false);//清空上一个用户状态
			//节点勾选
			console.log("000");
			for(var index  = 0; index < checkednodes.length ; index++){
				treeObj.checkNode(treeObj.getNodesByFilter(function(node){
					return  node.id  === checkednodes[index];
				}, true), true);
			}
			
			
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
			$("#warnerruleofsoundformedit").find(":text[name='LoginPwd']:first").val(result.LoginPwd);
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
		
	}

}

Template.warnerruleofemailedit.rendered = function(){
	$(function(){
		//填充邮件地址下拉列表
		var emaillist = SvseEmailDao.getEmailList();
		var emailaddressselect = $("#emailwarnerdivedit").find(".emailmultiselectedit:first");
		for(var l = 0 ; l < emaillist.length ; l++){
			console.log(emaillist[l]);
			var name = emaillist[l].Name;
			var option = $("<option value="+name+"></option>").html(name);
			emailaddressselect.append(option);
		}
		$('.emailmultiselectedit').multiselect({
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
	});
	
	//填充邮件模板列表
	Meteor.call("svGetEmailTemplates",function(err,result){
		for(name in result){
			//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#emailtemplatelistedit").append(option);
		}
	});
}


Template.warnerruleofemailedit.events = {
	"click #warnerruleofemailcancelbtnedit":function(){
		$("#emailwarnerdivedit").modal('toggle');
	},
	"click #warnerruleofemailsavebtnedit" : function(){
		var warnerruleofemailformedit = ClientUtils.formArrayToObject($("#warnerruleofemailformedit").serializeArray());
		var warnerruleofemailformsendconditionsedit = ClientUtils.formArrayToObject($("#warnerruleofemailformsendconditionsedit").serializeArray());
		for(param in warnerruleofemailformsendconditionsedit){
			warnerruleofemailformedit[param] = warnerruleofemailformsendconditionsedit[param];
		}
		warnerruleofemailformedit["AlertCond"] = 3;
		warnerruleofemailformedit["SelTime1"] = 2;
		warnerruleofemailformedit["SelTime2"] = 3;
		warnerruleofemailformedit["AlertState"] = "Enable";
		warnerruleofemailformedit["AlertType"] = "EmailAlert";
		warnerruleofemailformedit["AlwaysTimes"] = 1;
		warnerruleofemailformedit["OnlyTimes"] = 1;
		
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
		if(!emailAdress){
			Message.info("报警邮件接收地址不能为空");
			return;
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
			$('#emailwarnerdivedit').modal('toggle');
		});
	}
}