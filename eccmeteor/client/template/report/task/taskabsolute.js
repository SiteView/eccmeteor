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
/*
    var r=document.getElementsByName("r");  
    for(var i=0;i<r.length;i++){
         if(r[i].checked){
         alert(r[i].value+","+r[i].nextSibling.nodeValue);
       }
    } 
*/
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
//根据id编辑一条记录
Template.taskabsolutelist.events({
	"click td .btn" : function (e,t) {
		console.log(e.currentTarget.id);
		var result = SvseTaskDao.getTaskById(e.currentTarget.id);
		
		RenderTemplate.showParents("#taskabsoluteedit","taskabsolute_editform",result);
		
/*		var html = Meteor.render(function(){
			return Template.taskabsolute_editform(result);
		})
		$("#taskabsoluteeditdiv").empty().html(html);
		$("#taskabsoluteeditdiv").modal('show');
		console.log("111111");
		console.log(result);
*/
	//	$('#statisticalofadddivedit').modal('toggle');
	}
});

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

Template.taskabsolutelist.events({
	"click #taskabsoluteeditcancelbtn":function(){
		$("#taskabsoluteeditdiv").modal('toggle');
	},
	"click td .btn" : function (e) {
		console.log(e.currentTarget.id);
/*		var result = SvseStatisticalDao.getStatisticalById(e.currentTarget.id);
		console.log("111111");
		console.log(result);
		$("#statisticalofadddivedit").find(":input[type='text'][name='Title']:first").val(result.Title);
		$("#statisticalofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
		$("#statisticalofadddivedit").find("input[type='email'][name='EmailSend']:first").val(result.EmailSend);
		$("#statisticalofadddivedit").find("input[type='number'][name='Generate']:first").val(result.Generate);
		$("#statisticalofadddivedit").find(":input[type='time'][name='EndTime']:first").val(result.EndTime);
		$("#statisticalofadddivedit").find(":text[name='WeekEndTime']:first").val(result.WeekEndTime);
		$("#statisticalofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);

		$("#reporttypePeriodlisted").find("option[value = '" + result["Period"] + "']:first").attr("selected", "selected");
		$("#statisticalofaddtypelisted").find("option[value = '" + result["ComboGraphic"] + "']:first").attr("selected", "selected");
		$("#statisticaloutputtypeed").find("option[value = '" + result["fileType"] + "']:first").attr("selected", "selected");

		var CheckedGraphic = result.Graphic;
		$("#statisticalofadddivedit").find(":checkbox[name='Graphic']").each(function () {
			if ($(this).val() === CheckedGraphic) {
				$(this).attr("checked", true);
			}
		});

		var CheckedListError = result.ListError;
		$("#statisticalofadddivedit").find(":checkbox[name='ListError']").each(function () {
			if ($(this).val() === CheckedListError) {
				$(this).attr("checked", true);
			}
		});

		var CheckedListDanger = result.ListDanger;
		$("#statisticalofadddivedit").find(":checkbox[name='ListDanger']").each(function () {
			if ($(this).val() === CheckedListDanger) {
				$(this).attr("checked", true);
			}
		});
		var CheckedParameter = result.Parameter;
		$("#statisticalofadddivedit").find(":checkbox[name='Parameter']").each(function () {
			if ($(this).val() === CheckedParameter) {
				$(this).attr("checked", true);
			}
		});
		var CheckedDeny = result.Deny;
		$("#statisticalofadddivedit").find(":checkbox[name='Deny']").each(function () {
			if ($(this).val() === CheckedDeny) {
				$(this).attr("checked", true);
			}
		});
		//Session.set("emailbasicsettingofaddressbasciinfoeditform",result);
*/		$('#taskabsoluteeditdiv').modal('toggle');
	}
});