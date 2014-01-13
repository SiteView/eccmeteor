Template.taskabsolutelist.taskabsoluteresultlist = function () {
	//console.log(SvseTaskDao.gettaskabsoluteresultlist());
	 return SvseTask.find({Type:'1'});
	 //return SvseTask.find().fetch();
	//return SvseStatisticalDao.getStatisticalresultlist();
}
/*
//定义分页
var page = new Pagination("taskabsolute",{currentPage:1,perPage:5});

Template.taskabsolutelist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseTask.find({Type:'1'}).count());
}
Template.taskabsolutelist.destroyed = function(){
  page.destroy();
}
*/
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
			//弹窗移动
	ModalDrag.draggable("#taskabsoluteeditdiv");
}
Template.taskabsolute.rendered = function(){
		//弹窗移动
	ModalDrag.draggable("#taskabsoluteadddiv");
}
Template.taskabsolute.events = {
//添加一条任务操作
	"click #taskabsoluteofadd" : function(e,t){
		RenderTemplate.showParents("#taskabsoluteadd","taskabsoluteadd");
	//弹窗可移动
	 ModalDrag.draggable("#taskabsoluteadd");	
	},
//删除任务操作
	"click #taskabsoluteofdel":function(){
	
		var checks = $("#taskabsolutelist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
			console.log(ids);
		}
		if (ids.length)
			SvseTaskDao.deleteTaskByIds(ids, function(result) {
				SystemLogger(result);
					console.log(ids);
			});
			
	}
}
//编辑一条任务计划记录
Template.taskabsolutelist.events({
	"click td .btn" : function (e,t) {
		console.log(e.currentTarget.id);
		var result = SvseTaskDao.getTaskById(e.currentTarget.id);
		console.log(result);
		var content = {result:result};
		RenderTemplate.showParents("#taskabsoluteeditdiv","taskabsolute_editform",content);
	}
});