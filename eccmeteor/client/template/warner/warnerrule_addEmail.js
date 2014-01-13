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
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_addemail").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
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
		$.fn.zTree.init($("#svse_tree_check_addemail"), setting, data);
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

Template.warnerruleofemailedit.rendered = function(){
	$(function(){
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
		
		$.fn.zTree.init($("#svse_tree_check_editemail"), setting, data);
		
		var nIndex = $("#getemailwarnerid").val();
		console.log("nIndex:"+nIndex);
		var result = SvseWarnerRuleDao.getWarnerRule(nIndex);
		var displayNodes = result.AlertTarget.split("\,");
		console.log(displayNodes);
		if(displayNodes && displayNodes.length){
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editemail");
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
		
		warnerruleofemailformedit["AlertState"] = "Enable";
		warnerruleofemailformedit["AlertType"] = "EmailAlert";
		
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
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_editemail").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
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