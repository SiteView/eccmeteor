Template.taskperiodlist.taskperiodresultlist = function () {
	//console.log(SvseTaskDao.gettaskabsoluteresultlist());
	 return SvseTask.find({Type:'2'},page.skip());
	//return SvseStatisticalDao.getStatisticalresultlist();
}
//分页
var page = new Pagination("statisticalPagination");
Template.taskperiodlist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseTask.find().count());
}
Template.taskperiodlist.destroyed = function(){
  page.destroy();
}
Template.taskperiodlist.rendered = function () {
	$(function () {
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("taskperiodlist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("taskperiodlistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("taskperiodlist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("taskperiodlist");
	});
}
Template.taskperiod.events = {
	"click #taskperiodofadd" : function(e){
	$('#taskperiodadddiv').modal('toggle');
	}
}
Template.taskperiodadd.rendered = function(){
	ModalDrag.draggable("#taskperiodadddiv");
}
Template.taskperiodadd.events = {
	"click #taskperiodcancelbtn" : function () {
		$('#taskperiodadddiv').modal('toggle');
	},
	"click #taskperiodofsavebtn" : function () {
		var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("#taskabsoluteaddofbasciinfo").serializeArray());
		//表单数据校验。
		var Name = taskabsoluteaddofbasciinfo["Name"];
			if(!Name){
			Message.warn("报告标题不能为空，请重新输入！");
			return;
		}
		//报告标题是否重复判断
		var result =SvseStatisticalDao.getTitle(Title);
			if(result){
				Message.warn("报告名称已存在，请重新输入！");
			return;
		}
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function (node) {
				return (node.checked && node.type === "monitor")
			});
		for (index in arr) {
			targets.push(arr[index].id);
		}
		basicinfoofstatisticaladd["GroupRight"] = targets.join();

		var nIndex = Utils.getUUID();
		basicinfoofstatisticaladd["nIndex"] = nIndex

			console.log(basicinfoofstatisticaladd); //控制台打印添加的信息

		var address = {};
		address[nIndex] = basicinfoofstatisticaladd;

		console.log(address[nIndex]);

		SvseStatisticalDao.addStatistical(nIndex, address, function (result) {
			SystemLogger(result);
			console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");
			$('#statisticalofadddiv').modal('toggle');
		});
	}
}