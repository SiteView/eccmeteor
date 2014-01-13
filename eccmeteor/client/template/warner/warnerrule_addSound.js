Template.warnerruleofsound.events({
	"click #warnerruleofsoundcancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #warnerruleofsoundsavebtn":function(e,t){
		var warnerruleofsoundform = ClientUtils.formArrayToObject($("#warnerruleofsoundform").serializeArray());
		var warnerruleofsoundformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofsoundformsendconditions").serializeArray());
		for(param in warnerruleofsoundformsendconditions){
			warnerruleofsoundform[param] = warnerruleofsoundformsendconditions[param];
		}
		//warnerruleofsoundform["AlertCond"] = 3;
		//warnerruleofsoundform["SelTime1"] = 2;
		//warnerruleofsoundform["SelTime2"] = 3;
		warnerruleofsoundform["AlertState"] = "Enable";
		warnerruleofsoundform["AlertType"] = "SoundAlert";
		//warnerruleofsoundform["AlwaysTimes"] = 1;
		//warnerruleofsoundform["OnlyTimes"] = 1;
		
		var alertName=warnerruleofsoundform["AlertName"];
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
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_addsound").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofsoundform["AlertTarget"] = targets.join();
		if(!warnerruleofsoundform["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		warnerruleofsoundform["nIndex"] = nIndex;
		console.log(warnerruleofsoundform);
		var section = {};
		section[nIndex] = warnerruleofsoundform;
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

Template.warnerruleofsound.rendered=function(){
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
		$.fn.zTree.init($("#svse_tree_check_addsound"), setting, data);
	});
}

//编辑声音报警时的渲染
Template.editwarnerruleofsound.rendered=function(){
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
		$.fn.zTree.init($("#svse_tree_check_editsound"), setting, data);
		
		var nIndex = $("#getsoundwarnerid").val();
		console.log("nIndex:"+nIndex);
		var result = SvseWarnerRuleDao.getWarnerRule(nIndex);
		var displayNodes = result.AlertTarget.split("\,");
		console.log(displayNodes);
		if(displayNodes && displayNodes.length){
			var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_editsound");
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

//编辑声音报警时的事件
Template.editwarnerruleofsound.events({
	"click #editwarnerruleofscriptcancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	//保存编辑
	"click #editwarnerruleofscriptsavebtn":function(e,t){
		var warnerruleofsoundformedit = ClientUtils.formArrayToObject($("#warnerruleofsoundformedit").serializeArray());
		var warnerruleofsoundformsendconditionsedit = ClientUtils.formArrayToObject($("#warnerruleofsoundformsendconditionsedit").serializeArray());
		for(param in warnerruleofsoundformsendconditionsedit){
			warnerruleofsoundformedit[param] = warnerruleofsoundformsendconditionsedit[param];
		}
		// warnerruleofsoundformedit["AlertCond"] = 3;
		// warnerruleofsoundformedit["SelTime1"] = 2;
		// warnerruleofsoundformedit["SelTime2"] = 3;
		warnerruleofsoundformedit["AlertState"] = "Enable";
		warnerruleofsoundformedit["AlertType"] = "SoundAlert";
		// warnerruleofsoundformedit["AlwaysTimes"] = 1;
		// warnerruleofsoundformedit["OnlyTimes"] = 1;
		//check
		var alertName=warnerruleofsoundformedit["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		var result=SvseWarnerRuleDao.getWarnerRule(warnerruleofsoundformedit["nIndex"]);
		var alertresult=SvseWarnerRuleDao.getAlertByName(alertName);
		if(result["AlertName"]!=alertName)
		{
			if(alertresult){
			Message.info("报警名称已经存在");
			return;
			}
		}
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_editsound").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofsoundformedit["AlertTarget"] = targets.join();
		if(!warnerruleofsoundformedit["AlertTarget"]){
			Message.info("监测范围不能为空");
			return;
		}
		console.log(warnerruleofsoundformedit);
		var section = {};
		section[warnerruleofsoundformedit["nIndex"]] = warnerruleofsoundformedit;
		console.log(section);
		SvseWarnerRuleDao.updateWarnerRule(warnerruleofsoundformedit["nIndex"],section,function(result){
			RenderTemplate.hideParents(t);
		});
	},
});