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
		warnerruleofmessageform["AlertCond"] = 3;
		warnerruleofmessageform["SelTime1"] = 2;
		warnerruleofmessageform["SelTime2"] = 3;
		warnerruleofmessageform["AlertState"] = "Enable";
		warnerruleofmessageform["AlertType"] = "SmsAlert";
		warnerruleofmessageform["AlwaysTimes"] = 1;
		warnerruleofmessageform["OnlyTimes"] = 1;
		
		var alertName=warnerruleofmessageform["AlertName"];
		if(!alertName){
			Message.info("请填写名称");
			return;
		}
		
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_add").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofmessageform["AlertTarget"] = targets.join();
		warnerruleofmessageform["nIndex"] = nIndex;
		console.log(warnerruleofmessageform);
		var section = {};
		section[nIndex] = warnerruleofmessageform;
		console.log(section);
		SvseWarnerRuleDao.setWarnerRuleOfMesaage(nIndex,section,function(result){
			if(result.status){
				$('#messagewarnerdiv').modal('toggle');
			}else{
				SystemLogger(result.msg);
			}
			
		});
	}
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
	SvseMessageDao.getMessageTemplates(function(err,result){
		for(name in result){
		//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#Messagetemplatelist").append(option);
		}
	});
}

Template.warnerruleofmessageform.messagelist = function(){
	return SvseMessageDao.getMessageList();
}