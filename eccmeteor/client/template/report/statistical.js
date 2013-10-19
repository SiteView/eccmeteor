//单击添加按钮
Template.statistical.events = {
	"click #statisticalofadd":function(e){
		$('#statisticalofadddiv').modal('toggle');
	},
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
	}

}
//弹窗初始化
Template.statistical.rendered = function(){
}

Template.statisticalofadd.events = {
	"click #statisticalofaddcancelbtn":function(){
		$('#statisticalofadddiv').modal('toggle');
	},
	"click #statisticalofaddsavebtn":function(){
		var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("#basicinfoofstatisticaladd").serializeArray());
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
Template.statisticallist.events = {
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseStatisticalDao.getStatisticalresult(e.target.id);
		$("#statisticalofedit").find(":text[name='Title']:first").val(result.Title);
		$("#statisticalofedit").find(":text[name='Descript']:first").val(result.Descript);
		$("#statisticalofedit").find(":text[name='EmailSend']:first").val(result.EmailSend);
		$("#statisticalofedit").find(":text[name='Generate']:first").val(result.Generate);
		$("#statisticalofedit").find(":text[name='EndTime']:first").val(result.EndTime);
	}
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