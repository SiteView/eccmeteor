//单击添加按钮事件
Template.statistical.events = {
	"click #statisticalofadd":function(e){
		$('#statisticalofadddiv').modal('toggle');
	},
//删除单行，多行记录
	"click #statisticalofdel":function(){
	var checks = $("#statisticallist :checkbox[checked]");
	var ids = [];
	for(var i = 0; i < checks.length; i++){
	   ids.push($(checks[i]).attr("id"));
	}
	if(ids.length)
	  SvseStatisticalDao.deleteStatisticalByIds(ids,function(result){
	  	SystemLogger(result);
	  });
	},
//允许操作
	"click #allowestatistical" : function(){ 
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids,"on",function(result){
				SystemLogger(result);
			});
			
	},
//禁止操作
		"click #forbidstatistical" : function(){ 
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids,"No",function(result){
				SystemLogger(result);
			});
	},
	"click #refreshstatistical":function(){
		SvseStatisticalDao.sync(function(result){
			if(result.status){
				console.log("页面刷新已完成！");
			}else{
				SystemLogger(result);
			}
		});
	},
//帮助	
	"click #statisticalhelpmessage":function(){
		console.log("这里是帮助信息...");
	},	
/*	
//允许操作
	"click #allowestatistical":function(){
		var checks = $("#statisticallist :checkbox[checked]");
		var ids =[];
		for(var i =0; i<checks.length; i++){
			ids.push($(checks.[i]).attr("id"));
		}
		if(ids.length)
		SvseStatisticalDao.updateStatisticalStatus(ids,"On",function(result){
		SystemLogger(result);
		});
	}
	
//禁止操作
	"click #forbidstatistical":function(){
		var checks = $("#statisticallist":checkbox[checked]);
		var ids = [];
		for(var i =0; i<checks.length; i++){
			ids.push($(checks.[i]).attr("id"));
		}
	 	if(ids.length)
	 	SvseStatisticalDao.updateStatisticalStatus(ids,"No",function(result){
	 	SystemLogger(result);
	 	});
	}
	
*/
}
//弹窗初始化
Template.statistical.rendered = function(){

	$(function(){
		$('#datereportdiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		});
	});
	
}

Template.statisticalofadd.events = {
	"click #statisticalofaddcancelbtn":function(){
		$('#statisticalofadddiv').modal('toggle');
	},
	"click #statisticalofaddsavebtn":function(){
		var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("#basicinfoofstatisticaladd").serializeArray());
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
			targets.push(arr[index].id);
			}
			basicinfoofstatisticaladd["AlertTarget"] = targets.join();
			
		var nIndex = Utils.getUUID();
		basicinfoofstatisticaladd["nIndex"] = nIndex
		
		console.log(basicinfoofstatisticaladd); //控制台打印添加的信息
		
		var address = {};
		address[nIndex] = basicinfoofstatisticaladd;
		
		console.log(address[nIndex]); 
		
		SvseStatisticalDao.addStatistical(nIndex,address,function(result){
			SystemLogger(result);
			console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");		
			$('#statisticalofadddiv').modal('toggle');
		});
	}
}

/*
Type： add 
Author：xuqiang
Date:2013-10-15 
Content:初始化statistical 列表
*/ 
Template.statisticallist.statisticalresultlist = function(){
	console.log(SvseStatisticalDao.getStatisticalresultlist());
	return SvseStatisticalDao.getStatisticalresultlist();
}

Template.statisticallist.rendered = function(){
$(function(){
		 //隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("statisticallist");
		  //初始化 checkbox事件
		ClientUtils.tableSelectAll("statisticallistselectall");
		 //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("statisticallist");
		 //tr 鼠标悬停显示操作按钮效果
		 ClientUtils.showOperateBtnInTd("statisticallist");
	 
});
}

 //根据id编辑报告表单
Template.statisticallist.events({
"click td .btn":function(e){
console.log(e.target.id);
   var result = SvseStatisticalDao.getStatisticalById(e.target.id); 
		$("#statisticalofadddivedit").find(":text[name='Title']:first").val(result.Title);
		$("#statisticalofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
		$("#statisticalofadddivedit").find("input[type='email'][name='EmailSend']:first").val(result.EmailSend);
		$("#statisticalofadddivedit").find("input[type='number'][name='Generate']:first").val(result.Generate);
		$("#statisticalofadddivedit").find(":input[type='time'][name='EndTime']:first").val(result.EndTime);
		$("#statisticalofadddivedit").find(":text[name='WeekEndTime']:first").val(result.WeekEndTime);
		$("#statisticalofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);	
		
		$("#reporttypePeriodlisted").find("option[value = '"+result["Period"]+"']:first").attr("selected","selected");
		$("#statisticalofaddtypelisted").find("option[value = '"+result["ComboGraphic"]+"']:first").attr("selected","selected");
		$("#statisticaloutputtypeed").find("option[value = '"+result["fileType"]+"']:first").attr("selected","selected");
		
		
			var CheckedGraphic = result.Graphic;
			 $("#statisticalofadddivedit").find(":checkbox[name='Graphic']").each(function(){
				 if($(this).val()=== CheckedGraphic){
					 $(this).attr("checked",true);
					 }
				 });	
		
 			 var CheckedListError = result.ListError;
			 $("#statisticalofadddivedit").find(":checkbox[name='ListError']").each(function(){
				 if($(this).val()=== CheckedListError){
					 $(this).attr("checked",true);
					 }
				 });
				 
  			 var CheckedListDanger = result.ListDanger;
			 $("#statisticalofadddivedit").find(":checkbox[name='ListDanger']").each(function(){
				 if($(this).val()=== CheckedListDanger){
					 $(this).attr("checked",true);
					 }
				 });
   			 var CheckedParameter = result.Parameter;
			 $("#statisticalofadddivedit").find(":checkbox[name='Parameter']").each(function(){
				 if($(this).val()=== CheckedParameter){
					 $(this).attr("checked",true);
					 }
				 });
   			 var CheckedDeny = result.Deny;
			 $("#statisticalofadddivedit").find(":checkbox[name='Deny']").each(function(){
				 if($(this).val()=== CheckedDeny){
					 $(this).attr("checked",true);
					 }
				 });
 	//Session.set("emailbasicsettingofaddressbasciinfoeditform",result);
	$('#statisticalofadddivedit').modal('toggle');
	
	//加载编辑弹出页面左侧树
		var checkednodes = result.AlertTarget.split("\,")
		//左边树的勾选
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
		treeObj.checkAllNodes(false);//清空上一个用户状态
		//节点勾选
		for(var index  = 0; index < checkednodes.length ; index++){
			treeObj.checkNode(treeObj.getNodesByFilter(function(node){
				return  node.id  === checkednodes[index];
			}, true), true);
		}
	
	}
});

Template.statisticalofedit.rendered = function(){
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
}
	

Template.statisticalofadd.rendered = function(){
	//监视器选择树
	$(function(){
		$('#statisticalofadddiv').modal({
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

Template.statisticalofedit.events = {
	"click #statisticalofeditcancelbtn":function(){
		$("#statisticalofadddivedit").modal('toggle');
	},
	"click #statisticalofeditsavebtn":function(){
		var statisticalofaddformedit = ClientUtils.formArrayToObject($("#statisticalofaddformedit").serializeArray());
		var nIndex = statisticalofaddformedit["nIndex"];
		var address = {};
		address[nIndex] = statisticalofaddformedit;
		
		SvseStatisticalDao.updateStatistical(nIndex,address,function(result){
	
			$('#statisticalofadddivedit').modal('toggle');
		});
	}
}