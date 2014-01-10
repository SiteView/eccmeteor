/*
Type： add
Author：xuqiang
Date:2013-10-15
Content:初始化statistical 列表
 */
Template.statisticallist.statisticalresultlist = function () {
	console.log(SvseStatisticalDao.getStatisticalresultlist());
	 return SvseStatisticalresultlist.find({},page.skip());
	//return SvseStatisticalDao.getStatisticalresultlist();
}
//分页的实现

var page = new Pagination("statisticalPagination");
Template.statisticallist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseStatisticalresultlist.find().count());
}
Template.statisticallist.destroyed = function(){
  page.destroy();
}
//单击添加按钮事件
Template.statistical.events = {
	"click #statisticalofadd" : function (e,t) {
		RenderTemplate.showParents("#statisticalofadddiv","statisticalofadd");
	//弹窗可移动
	 ModalDrag.draggable("#statisticalofadddiv");		
	},
	//删除单行，多行记录
/*
	"click #statisticalofdel" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.deleteStatisticalByIds(ids, function (result) {
				SystemLogger(result);
			});
	},
*/
	//允许操作
	"click #allowestatistical" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids, "on", function (result) {
				SystemLogger(result);
			});

	},
	//禁止操作
	"click #forbidstatistical" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids, "No", function (result) {
				SystemLogger(result);
			});
	},
	"click #refreshstatistical" : function () {
		SvseStatisticalDao.sync(function (result) {
			if (result.status) {
				console.log("页面刷新已完成！");
			} else {
				SystemLogger(result);
			}
		});
	},
	//帮助
	"click #statisticalhelpmessage" : function () {
		console.log("这里是帮助信息...");
	}
}
var getstatisticalSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("statisticallist");
}
Template.statistical.rendered = function(){
	 $(function(){
					//在点击删除操作时弹出提示框实现进一步提示
					$("#statisticalofdel").confirm({
							'message':"确定删除操作？",
							'action':function(){
									var ids = getstatisticalSelectAll();
									SvseStatisticalDao.checkStatisticallistSelect(ids);
									if(ids.length){
											SvseStatisticalDao.deleteStatisticalByIds(ids,function(result){
													Log4js.info(result);
											});
											//console.log("确定");
									}
									$("#statisticalofdel").confirm("hide");
							}
					});
			});
}

Template.statisticallist.rendered = function () {
	$(function () {
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
	"click td .btn" : function (e,t) {
		console.log(e.currentTarget.id);
		var result = SvseStatisticalDao.getStatisticalById(e.currentTarget.id);
		console.log("111111");
		console.log(result);
		var content = {result:result};
		RenderTemplate.showParents("#statisticalofeditdiv","statisticalofedit_form",content);

		}
});
Template.statistical_detail.monitortypelist = function (treeId,subtype) {
	var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(treeId,subtype);
    return SvseTreeDao.getNodesByIds(childrenIds);
	/*		var nodes = Svse.find().fetch();
	console.log(nodes);
	console.log("123");
	var branch =[];
	for(index in nodes){
	var obj = nodes[index];
	var branchNode = {};
	branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]}).property.sv_name;
	}
	//return branchNode["name"];
	 */
}
