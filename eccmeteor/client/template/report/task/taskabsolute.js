Template.taskabsolutelist.taskabsoluteresultlist = function () {
	//console.log(SvseTaskDao.gettaskabsoluteresultlist());
	 return SvseTask.find({Type:'1'});
	//return SvseStatisticalDao.getStatisticalresultlist();
}
//定义分页
var page = new Pagination("taskabsolute",{currentPage:1,perPage:5});

Template.taskabsolutelist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseTask.find({Type:'1'}).count());
}
Template.taskabsolutelist.destroyed = function(){
  page.destroy();
}
Template.taskabsolutelist.rendered = function () {
	$(function () {
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("taskabsolutelist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("taskabsolutelistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("taskabsolutelist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("taskabsolutelist");
	});
}
Template.taskabsolute.events = {
	"click #taskabsoluteofadd" : function(e){
	$('#taskabsoluteadddiv').modal('toggle');
	}
}
Template.taskabsoluteadd.events = {
	"click #taskabsoluteaddcancelbtn" : function () {
		$('#taskabsoluteadddiv').modal('toggle');
	},
	"click #taskabsoluteaddofsavebtn" : function () {
		var basicinfooftaskabsoluteadd = ClientUtils.formArrayToObject($("#taskabsoluteaddofbasciinfo").serializeArray());
		//表单数据校验。
		var sv_name = taskabsoluteaddofbasciinfo["sv_name"];
			if(!sv_name){
			Message.warn("报告标题不能为空，请重新输入！");
			return;
		}
		//报告标题是否重复判断
	/*	var result =SvseStatisticalDao.getTitle(Title);
			if(result){
				Message.warn("报告名称已存在，请重新输入！");
			return;
		}
	*/
	/*	var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function (node) {
				return (node.checked && node.type === "monitor")
			});
		for (index in arr) {
			targets.push(arr[index].id);
		}
		basicinfoofstatisticaladd["GroupRight"] = targets.join();
	*/
		//var nIndex = Utils.getUUID();
		//basicinfooftaskabsoluteadd["nIndex"] = nIndex
			console.log(basicinfooftaskabsoluteadd); //控制台打印添加的信息
		var address = {};
		//address[nIndex] = basicinfooftaskabsoluteadd;
		address = basicinfooftaskabsoluteadd;
		//console.log(address[nIndex]);
		SvseTaskDao.addtaskabsolute(address, function (result) {
			SystemLogger(result);
			console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");
			$('#taskabsoluteadddiv').modal('toggle');
		});
	}
}