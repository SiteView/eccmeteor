Template.warnerruleofmessage.events={
	"click #warnerruleofmessagecancelbtn":function(){
		$('#messagewarnerdiv').modal('toggle');
	},
	"click #warnerruleofmessagesavebtn":function(){
		var warnerruleofmessageform = ClientUtils.formArrayToObject($("#warnerruleofmessageform").serializeArray());
		var warnerruleofmessageformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofmessageformsendconditions").serializeArray());
		for(param in warnerruleofmessageformsendconditions){
			warnerruleofmessageform[param] = warnerruleofmessageformsendconditions[param];
		}
		
		var selectSmsNumber = $(".messagemultiselect").val()
		console.log(selectSmsNumber);
		var selectSmsNumberStr = SvseWarnerRuleDao.getValueOfMultipleSelect(selectSmsNumber);
		warnerruleofmessageform["SmsNumber"] = selectSmsNumberStr;
		
		//warnerruleofmessageform["AlertCond"] = 3;
		//warnerruleofmessageform["SelTime1"] = 2;
		//warnerruleofmessageform["SelTime2"] = 3;
		warnerruleofmessageform["AlertState"] = "Enable";
		warnerruleofmessageform["AlertType"] = "SmsAlert";
		//warnerruleofmessageform["AlwaysTimes"] = 1;
		//warnerruleofmessageform["OnlyTimes"] = 1;
		
		var alertName = warnerruleofmessageform["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(alertresult){
			Message.info("报警名称已经存在");
			return;
		}
		var smsNumber = warnerruleofmessageform["SmsNumber"];
		var otherNumber = warnerruleofmessageform["OtherNumber"];
		if(!smsNumber && !otherNumber){
			Message.info("报警短信接收地址不能为空");
			return;
		}
		//当手机号存在时验证手机号码的格式是否正确
		if(otherNumber){
			var flag = SvseMessageDao.checkPhoneNumberFormat(otherNumber);
			if(!flag) return;
		}
		
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_add").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		//console.log(arr);
		for(index in arr){
			//console.log("index:"+arr[index].id);
			//console.log("name:"+arr[index].name);
			targets.push(arr[index].id);
		}
		warnerruleofmessageform["AlertTarget"] = targets.join();
		if(!warnerruleofmessageform["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		warnerruleofmessageform["nIndex"] = nIndex;
		console.log(warnerruleofmessageform);
		var section = {};
		section[nIndex] = warnerruleofmessageform;
		console.log(section);
		SvseWarnerRuleDao.setWarnerRuleOfMesaage(nIndex,section,function(result){
			if(result.status){
				$('#messagewarnerdiv').modal('toggle');
				//$("#messagewarnerdiv")[0].reset();//重置表单（待修改）
			}else{
				SystemLogger(result.msg);
			}
			
		});
	},
	//短信模板的改变事件
	"change #messageSendModelist":function(){
		var type = $("#messageSendModelist").val()
		//console.log("type:" + type);
		if(type == "Web"){
			$("#messagetemplatelist").empty();//清空select的option
			SvseMessageDao.getWebMessageTemplates(function(err,result){
				for(name in result){
					//console.log(name);
					var option=$("<option value"+name+"></option>").html(name)
					$("#messagetemplatelist").append(option);
				}
			});
		}else{
			$("#messagetemplatelist").empty();//清空select的option
			SvseMessageDao.getMessageTemplates(function(err,result){
				for(name in result){
					//console.log(name);
					var option = $("<option value="+name+"></option>").html(name)
					$("#messagetemplatelist").append(option);
				}
			});
		}
	},
}

Template.warnerruleofmessage.rendered = function(){
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
		$.fn.zTree.init($("#svse_tree_check_add"), setting, data);
	});
}

Template.warnerruleofmessageform.rendered=function(){
	$(document).ready(function() {
		//接收手机号下拉列表多选框
		$('.messagemultiselect').multiselect({
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
		//填充短信模板列表
		SvseMessageDao.getWebMessageTemplates(function(err,result){
			for(name in result){
				console.log(name);
				var option=$("<option value"+name+"></option>").html(name)
				$("#messagetemplatelist").append(option);
			}
		});
	});
}

Template.warnerruleofmessageform.messagelist = function(){
	return SvseMessageDao.getMessageList();
}

Template.messagewarnerformedit.messagelist = function(){
	return SvseMessageDao.getMessageList();
}

//编辑时的渲染
Template.messagewarnerformedit.rendered=function(){
	$(function(){
		//填充报警接收手机号下拉列表
		var messagelist = SvseMessageDao.getMessageList();
		for(var l = 0 ; l < messagelist.length ; l++){
			console.log(messagelist[l]);
			var name = messagelist[l].Name;
			var option = $("<option value="+name+"></option>").html(name);
			$("#warnersmsnumber").append(option);
		}
		$('.messagemultiselectedit').multiselect({
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
		$.fn.zTree.init($("#svse_tree_check_editsms"), setting, data);
	});
	
	//填充短信模板列表
	SvseMessageDao.getMessageTemplates(function(err,result){
		for(name in result){
			//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#messagetemplatelistedit").append(option);
		}
	});
}
/* Template.messagewarnerformedit.smstemplate=function(){
	SvseMessageDao.getMessageTemplates(function(err,result){
		var smstemplate=[];
		for(name in result){
			//console.log(name);
			smstemplate.push(name);
		} 
		//console.log(smstemplate);
		Session.set("smstemplate",smstemplate);
	});
	//console.log(Session.get("smstemplate"));
	return Session.get("smstemplate");
} */

//编辑时的事件
Template.messagewarnerformedit.events({
	"click #editwarnerruleofmessagecancelbtn":function(){
		$("#messagewarnerdivedit").modal("hide");
	},
	//保存短信报警编辑
	"click #editwarnerruleofmessagesavebtn":function(){
		var warnerruleofmessageformedit = ClientUtils.formArrayToObject($("#warnerruleofmessageformedit").serializeArray());
		var warnerruleofmessageformsendconditionsedit = ClientUtils.formArrayToObject($("#warnerruleofmessageformsendconditionsedit").serializeArray());
		for(param in warnerruleofmessageformsendconditionsedit){
			warnerruleofmessageformedit[param] = warnerruleofmessageformsendconditionsedit[param];
		}
		
		var selectSmsNumber = $(".messagemultiselectedit").val()
		console.log(selectSmsNumber);
		var selectSmsNumberStr = SvseWarnerRuleDao.getValueOfMultipleSelect(selectSmsNumber);
		warnerruleofmessageformedit["SmsNumber"] = selectSmsNumberStr;
		
		//warnerruleofmessageformedit["AlertCond"] = 3;
		//warnerruleofmessageformedit["SelTime1"] = 2;
		//warnerruleofmessageformedit["SelTime2"] = 3;
		warnerruleofmessageformedit["AlertState"] = "Enable";
		warnerruleofmessageformedit["AlertType"] = "SmsAlert";
		//warnerruleofmessageformedit["AlwaysTimes"] = 1;
		//warnerruleofmessageformedit["OnlyTimes"] = 1;
		var alertName = warnerruleofmessageformedit["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var result = SvseWarnerRuleDao.getWarnerRule(warnerruleofmessageformedit["nIndex"]);
		var alertresult = SvseWarnerRuleDao.getAlertByName(alertName);
		if(result["AlertName"] != alertName)
		{
			if(alertresult){
				Message.info("报警名称已经存在");
				return;
			}
		}
		
		var smsNumber = warnerruleofmessageformedit["SmsNumber"];
		var otherNumber = warnerruleofmessageformedit["OtherNumber"];
		if(!smsNumber && !otherNumber){
			Message.info("报警接收手机号不能为空");
			return;
		}
		//当手机号存在时验证手机号码的格式是否正确
		if(otherNumber){
			var flag = SvseMessageDao.checkPhoneNumberFormat(otherNumber);
			if(!flag) return;
		}
		
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_editsms").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofmessageformedit["AlertTarget"] = targets.join();
		if(!warnerruleofmessageformedit["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		console.log(warnerruleofmessageformedit);
		var section = {};
		section[warnerruleofmessageformedit["nIndex"]] = warnerruleofmessageformedit;
		console.log(section);
		SvseWarnerRuleDao.updateWarnerRule(warnerruleofmessageformedit["nIndex"],section,function(result){
			$('#messagewarnerdivedit').modal('hide');
		});
	},
	
	//短信模板的改变事件
	"change #messageSendModelistedit":function(){
		var type = $("#messageSendModelistedit").val()
		//console.log("type:" + type);
		if(type == "Web"){
			$("#messagetemplatelistedit").empty();//清空select的option
			SvseMessageDao.getWebMessageTemplates(function(err,result){
				for(name in result){
					//console.log(name);
					var option=$("<option value"+name+"></option>").html(name)
					$("#messagetemplatelistedit").append(option);
				}
			});
		}else{
			$("#messagetemplatelistedit").empty();//清空select的option
			SvseMessageDao.getMessageTemplates(function(err,result){
				for(name in result){
					//console.log(name);
					var option = $("<option value="+name+"></option>").html(name)
					$("#messagetemplatelistedit").append(option);
				}
			});
		}
	},
});