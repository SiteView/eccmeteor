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
	"click #taskabsoluteofadd" : function(e){
	$('#taskabsoluteadddiv').modal('toggle');
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
//编辑一条任务计划后保存
Template.taskabsolute_editform.events = {
	"click #taskabsoluteeditcancelbtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	"click #taskabsoluteeditofsavebtn":function(e,t){
		var basicinfooftaskabsoluteedit = ClientUtils.formArrayToObject($("#taskabsoluteeditofbasciinfo").serializeArray());
		var address = {};
		address = basicinfooftaskabsoluteedit;
		console.log(address);		
		SvseTaskDao.addtaskabsolute(address, function (err,result) {
			   RenderTemplate.hideParents(t);	
			// console.log(result);
			// console.log("123");
			// console.log(result); //控制台打印添加的信息
			// console.log("123");
			// $('#taskabsoluteadddiv').modal('toggle');

		});		
	},
	"click .close":function(e,t){
		RenderTemplate.hideParents(t);
	}
};
//添加任务计划
Template.taskabsoluteadd.events = {
	"click #taskabsoluteaddcancelbtn" : function () {
		$('#taskabsoluteadddiv').modal('toggle');
	},
	"click #taskabsoluteaddofsavebtn" : function () {
		var basicinfooftaskabsoluteadd = ClientUtils.formArrayToObject($("#taskabsoluteaddofbasciinfo").serializeArray());
		//表单数据校验。
	/*	var sv_name = taskabsoluteaddofbasciinfo["sv_name"];
			if(!sv_name){
			Message.warn("报告标题不能为空，请重新输入！");
			return;
		}
		//报告标题是否重复判断
		var result =SvseStatisticalDao.getTitle(Title);
			if(result){
				Message.warn("报告名称已存在，请重新输入！");
			return;
		}
	*/
		console.log(basicinfooftaskabsoluteadd); //控制台打印添加的信息
		var address = {};
		//address[nIndex] = basicinfoofstatisticaladd;
		//address["nIndex"] = nIndex;
		address = basicinfooftaskabsoluteadd;
		//address = basicinfooftaskabsoluteadd;
		console.log(address);		
		SvseTaskDao.addtaskabsolute(address, function (err,result) {
			console.log(result);
			console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");
			$('#taskabsoluteadddiv').modal('toggle');

		});
	}
}
