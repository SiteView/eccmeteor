Template.taskperiodlist.taskperiodresultlist = function () {
	//console.log(SvseTaskDao.gettaskabsoluteresultlist());
	 return SvseTask.find({Type:'2'});
	//return SvseStatisticalDao.getStatisticalresultlist();
}
//分页
/*
var page = new Pagination("statisticalPagination");
Template.taskperiodlist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseTask.find().count());
}
Template.taskperiodlist.destroyed = function(){
  page.destroy();
}
*/
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
//添加一条任务计划
	"click #taskperiodofadd" : function(e,t){
		RenderTemplate.showParents("#taskperiodaddiv","taskperiodadd");
	//弹窗可移动
	 ModalDrag.draggable("#taskperiodaddiv");		
	},
//删除操作
	"click #taskperiodofdel":function(){
		var checks = $("#taskperiodlist :checkbox[checked]");
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

//点击编辑一条任务计划
Template.taskperiodlist.events({
	"click td .btn" : function (e,t) {
		console.log(e.currentTarget.id);
		var result = SvseTaskDao.getTaskById(e.currentTarget.id);
		var content ={result:result}
		RenderTemplate.showParents("#taskperiodeditDiv","taskperiodedit_form",content);
	}
});