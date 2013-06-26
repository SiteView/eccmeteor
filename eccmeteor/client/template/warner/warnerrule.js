var getWarnerRuleListSelectAll = function(){
	var checks = $("#warnerrulelist :checkbox[checked]");
	var ids = [];
	for(var i = 0 ; i < checks.length; i++){
		ids.push($(checks[i]).attr("id"));
	}
	return ids;
}
Template.warnerrule.events = {
	"click #emailwarner":function(e){
		$('#emailwarnerdiv').modal('toggle');
	},
	"click #delwarnerrule" : function(){
		SvseWarnerRuleDao.deleteWarnerRules(getWarnerRuleListSelectAll());
	},
	"click #allowewarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Enable");
	},
	"click #forbidwarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Disable");
	},
	"click #refreshwarnerrule":function(){
		SvseWarnerRuleDao.sync(function(){
			console.log("刷新完成");
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
		
		var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
		for(index in arr){
			targets.push(arr[index].id);
		}
		warnerruleofemailform["AlertTarget"] = targets.join();
		warnerruleofemailform["nIndex"] = nIndex;
		console.log(warnerruleofemailform);
		var section = {};
		section[nIndex] = warnerruleofemailform;
		console.log(section);
		SvseWarnerRuleDao.setWarnerRuleOfEmail(nIndex,section,function(){
			$('#emailwarnerdiv').modal('toggle');
		});
	}
}

Template.warnerruleofemail.rendered = function(){
	//监视器选择树
	$(function(){
		$('#emailwarnerdiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		//	height:"600"
		});
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
				console.log(name);
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
	return SvseWarnerRuleDao.getWarnerRuleList();
}

Template.warnerrulelist.rendered = function(){
	//初始化checkbox选项
	$(function(){
		$("#warnerrulelistselectall").click(function(){
			var flag = this.checked; 
			$(this).closest("table").find("tbody :checkbox").each(function(){
				this.checked = flag;
			});
		});
	});
}
Template.warnerrulelist.events = {
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseWarnerRuleDao.getWarnerRule(e.target.id);
		Session.set("warnerruleofemaileditform",result);
		var checkedArr = result["AlertTarget"].split(",");
		$("#emailwarnerdivedit").modal('toggle');
	}

}

Template.warnerruleofemailedit.rendered = function(){
	//弹窗
	$(function(){
		$('#emailwarnerdivedit').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		//	height:"600"
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
			console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#emailtemplatelistedit").append(option);
		}
	});
}

Template.warnerruleofemailedit.warnerruleofemaileditform = function(){
	return Session.get("warnerruleofemaileditform");
}
Template.warnerruleofemailedit.emaillist = function(){
	return SvseEmailDao.getEmailList();
}
