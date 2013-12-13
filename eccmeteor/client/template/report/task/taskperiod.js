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
		var basicinfooftaskabsoluteadd = ClientUtils.formArrayToObject($("#taskperiodaddofbasciinfo").serializeArray());
		//表单数据校验。
	/*	var sv_name = taskperiodaddofbasciinfo["sv_name"];
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
		var nIndex = Utils.getUUID();
		basicinfooftaskabsoluteadd["nIndex"] = nIndex
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
			$('#taskperiodadddiv').modal('toggle');

		});
	}
}
Template.taskperiodlist.events({
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
*/		$('#taskperiodeditdiv').modal('toggle');
	}
});