Template.warnerruleofscript.events({
	"click #warnerruleofscriptcancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #warnerruleofscriptsavebtn":function(e,t){
		var warnerruleofscriptform = ClientUtils.formArrayToObject($("#warnerruleofscriptform").serializeArray());
		var warnerruleofscriptformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofscriptformsendconditions").serializeArray());
		for(param in warnerruleofscriptformsendconditions){
			warnerruleofscriptform[param] = warnerruleofscriptformsendconditions[param];
		}
		//warnerruleofscriptform["AlertCond"] = 3;
		//warnerruleofscriptform["SelTime1"] = 2;
		//warnerruleofscriptform["SelTime2"] = 3;
		warnerruleofscriptform["AlertState"] = "Enable";
		warnerruleofscriptform["AlertType"] = "ScriptAlert";
		//warnerruleofscriptform["AlwaysTimes"] = 1;
		//warnerruleofscriptform["OnlyTimes"] = 1;
		
		var alertName=warnerruleofscriptform["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(alertresult){
			Message.info("报警名称已经存在");
			return;
		}
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_addscript").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofscriptform["AlertTarget"] = targets.join();
		if(!warnerruleofscriptform["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		warnerruleofscriptform["nIndex"] = nIndex;
		console.log(warnerruleofscriptform);
		var section = {};
		section[nIndex] = warnerruleofscriptform;
		console.log(section);
		SvseWarnerRuleDao.setWarnerRuleOfMesaage(nIndex,section,function(result){
			if(result.status){
				RenderTemplate.hideParents(t);
			}else{
				Log4js.info(result.msg);
			}
			
		});
	}
});

Template.warnerruleofscript.rendered=function(){
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
		$.fn.zTree.init($("#svse_tree_check_addscript"), setting, data);
	});
	
}

//脚本编辑时的渲染
Template.editwarnerruleofscript.rendered=function(){
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
		$.fn.zTree.init($("#svse_tree_check_editscript"), setting, data);
		
		var nIndex = $("#getscriptwarnerid").val();
		console.log("nIndex:"+nIndex);
		var result = SvseWarnerRuleDao.getWarnerRule(nIndex);
		var displayNodes = result.AlertTarget.split("\,");
		console.log(displayNodes);
		if(displayNodes && displayNodes.length){
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editscript");
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

//脚本编辑时的事件
Template.editwarnerruleofscript.events({
	"click #editwarnerruleofscriptcancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	//保存编辑
	"click #editwarnerruleofscriptsavebtn":function(e,t){
		var warnerruleofscriptformedit = ClientUtils.formArrayToObject($("#warnerruleofscriptformedit").serializeArray());
		var warnerruleofscriptformsendconditionsedit = ClientUtils.formArrayToObject($("#warnerruleofscriptformsendconditionsedit").serializeArray());
		for(param in warnerruleofscriptformsendconditionsedit){
			warnerruleofscriptformedit[param] = warnerruleofscriptformsendconditionsedit[param];
		}
		//warnerruleofscriptformedit["AlertCond"] = 3;
		//warnerruleofscriptformedit["SelTime1"] = 2;
		//warnerruleofscriptformedit["SelTime2"] = 3;
		warnerruleofscriptformedit["AlertState"] = "Enable";
		warnerruleofscriptformedit["AlertType"] = "ScriptAlert";
		//warnerruleofscriptformedit["AlwaysTimes"] = 1;
		//warnerruleofscriptformedit["OnlyTimes"] = 1;
		//check
		var alertName=warnerruleofscriptformedit["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var result=SvseWarnerRuleDao.getWarnerRule(warnerruleofscriptformedit["nIndex"]);
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(result["AlertName"]!=alertName)
		{
			if(alertresult){
				Message.info("报警名称已经存在");
				return;
			}
		}
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_editscript").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofscriptformedit["AlertTarget"] = targets.join();
		if(!warnerruleofscriptformedit["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		console.log(warnerruleofscriptformedit);
		var section = {};
		section[warnerruleofscriptformedit["nIndex"]] = warnerruleofscriptformedit;
		console.log(section);
		SvseWarnerRuleDao.updateWarnerRule(warnerruleofscriptformedit["nIndex"],section,function(result){
			RenderTemplate.hideParents(t);
		});
	},
});

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