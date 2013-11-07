Template.warnerruleofsound.events({
	"click #warnerruleofsoundcancelbtn":function(){
		$("#soundwarnerdiv").modal("hide");
	},
	"click #warnerruleofsoundsavebtn":function(){
		var warnerruleofsoundform = ClientUtils.formArrayToObject($("#warnerruleofsoundform").serializeArray());
		var warnerruleofsoundformsendconditions = ClientUtils.formArrayToObject($("#warnerruleofsoundformsendconditions").serializeArray());
		for(param in warnerruleofsoundformsendconditions){
			warnerruleofsoundform[param] = warnerruleofsoundformsendconditions[param];
		}
		warnerruleofsoundform["AlertCond"] = 3;
		warnerruleofsoundform["SelTime1"] = 2;
		warnerruleofsoundform["SelTime2"] = 3;
		warnerruleofsoundform["AlertState"] = "Enable";
		warnerruleofsoundform["AlertType"] = "SoundAlert";
		warnerruleofsoundform["AlwaysTimes"] = 1;
		warnerruleofsoundform["OnlyTimes"] = 1;
		
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
				$('#soundwarnerdiv').modal('hide');
			}else{
				SystemLogger(result.msg);
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