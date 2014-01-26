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
	ModalDrag.draggable("#emailDiv");
	//监视器选择树
	$(function(){
		var data = SvseDao.getSimpleMonitorTree();
		console.log(data);
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
			},
			callback:{
				onRightClick: WarnerOnRightClick
			}
		};
		$.fn.zTree.init($("#svse_tree_check_addemail"), setting, data);
		
		function WarnerOnRightClick(event, treeId, treeNode) { 
			console.log(treeNode);
			console.log(event);
			var resultData = getMonitorDataOfRMenu(data,treeNode);
			if (!treeNode || treeNode == null) {   
				showRMenu("root", event.clientX, event.clientY);   
			} else if (treeNode && !treeNode.noR) { //noR属性为true表示禁止右键菜单   
				if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {     
					showRMenu("root", event.clientX, event.clientY);   
				} else {     
					var scrollTop = $(document).scrollTop();
					var scrollLeft = $(document).scrollLeft();
					showRMenu("node", event.clientX + scrollLeft, event.clientY + scrollTop); 
					var content = {monitorData:resultData};
					RenderTemplate.renderIn("#emailWarnerruleRMenu","warnerrule_rMenu",content);
				}   
			}   
		}
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



//显示右键菜单的操作
function showRMenu(type, x, y) {
	if(type == "node"){
		console.log("show rMenu!!");
		$("#emailWarnerruleRMenu").attr("style","display");
	}else{
		//hideRMenu();
		$("#emailWarnerruleRMenu").attr("style","display:none");
	}
    
    $("#emailWarnerruleRMenu").css({
        "top" : y + "px",
        "left" : x + "px",
        "visibility" : "visible"
    });
 
    $("body").bind("mousedown", onBodyMouseDown);
} 

function hideRMenu() {
    if ($("#emailWarnerruleRMenu"))
        $("#emailWarnerruleRMenu").css({
            "visibility" : "hidden"
        });
    $("body").unbind("mousedown", onBodyMouseDown);
}

function onBodyMouseDown(event) {
    if (!(event.target.id == "#emailWarnerruleRMenu" || $(event.target).parents("#emailWarnerruleRMenu").length > 0)) {
        $("#emailWarnerruleRMenu").css({
            "visibility" : "hidden"
        });
    }
}

//获取树上右键菜单的相关数据
var getMonitorDataOfRMenu = function(data,treeNode){
	if(!treeNode || treeNode == null){
		return;
	}
	console.log(treeNode.type);
	var resultData = [];
	if(treeNode.type === "se"){
		for(i in data){
			if(data[i]["type"] == "monitor"){
				resultData.push(data[i]["name"]);
			}
		}
	}else if(treeNode.type === "group"){
		for(i in data){
			if(data[i]["pId"] === treeNode.id){
				console.log(data[i]["id"]);
				for(j in data){
					if(data[j]["pId"] === data[i]["id"]){
						resultData.push(data[j]["name"]);
					}
				}
			}
		}
	}else if(treeNode.type === "entity"){
		for(i in data){
			if(data[i]["pId"] === treeNode.id){
				resultData.push(data[i]["name"]);
				
			}
		}
	}else if(treeNode.type === "monitor"){
		for(i in data){
			if(data[i]["pId"] === treeNode.pId){
				resultData.push(data[i]["name"]);
				
			}
		}
	}
	//console.log(resultData);
	//去重
	var rec = [];
	var result = [];
	for(var j = 0;j < resultData.length;j++){
		if(!rec[resultData[j]]){   
		  rec[resultData[j]] = true;   
		  result.push(resultData[j]);   
		}  
	}
	console.log(result);
	return result;
}
