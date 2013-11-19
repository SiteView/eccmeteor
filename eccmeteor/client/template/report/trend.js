Template.trend.rendered = function () {
	$(function () {
		var data = SvseDao.getDetailTree();
		var setting = {
			check : {
				enable : true,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
			$(".form_datetime").datetimepicker({
			format: "yyyy MM dd hh:mm",
			autoclose: true,
			todayBtn: true,
			pickerPosition: "bottom-left"
		});
}
Template.trend_status.events = {
	"click #queryDetailLineData" : function(){
		drawDetailLineAgain();
	},
	"click ul li a":function(e){
		var str = e.target.name;
		var startDate;
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
		var today = endPicker.getDate();	
		if(str.indexOf(":") === -1){
			switch(str){
				case "today": startDate = Date.today();break;
				case "week" : startDate = today.add({days:1-today.getDay()});break;
				default		: startDate = today;
			}
		}else{
			startDate = today.add(JSON.parse(str));
		}
		startPicker.setDate(startDate);
		console.log("#############################");
		console.log(startDate);
		console.log(endPicker.getDate());
		console.log("#######################");
		drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endPicker.getDate()));
	}
}
/*
Template.trend_status.rendered = function(){
	var template = this;
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$(template.find("#datetimepickerStartDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$(template.find("#datetimepickerEndDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $(template.find("#datetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#datetimepickerEndDate")).data('datetimepicker');
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
//		$('#datetimepickerstartDate').on('changeDate', function(e) {
//			endPicker.setstartDate(e.date);
//		});
//		$('#datetimepickerEndDate').on('changeDate', function(e) {
//			startPicker.setEndDate(e.date);
//		});
		drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate));
	});
}
var drawDetailLine =  function(startDate,endDate){
	var id = SessionManage.getCheckedMonitorId();
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	var selector = "svg#detailLine";
	if($(selector).length == 0)
		return;
	var dateDifference = ClientUtils.getDateDifferenceHour(ClientUtils.objectToDate(startDate),ClientUtils.objectToDate(endDate))
	var dateformate = dateDifference > 48 ? "%m-%d %H:%M" : "%H:%M";
	SvseMonitorDao.getMonitorRuntimeRecordsByTime(id,startDate,endDate,function(result){
		if(!result.status){
			SystemLogger(result.msg);
			return;
		}
		var dataProcess = new DataProcess(result.content,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var line = new DrawLine(
							resultData,
							{
								'key':foreigkeys["monitorPrimary"],
								'label':foreigkeys["monitorDescript"],
								'dateformate':dateformate
							},
							selector);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
	})
}

var drawDetailLineAgain = function(){
	if($('#datetimepickerStartDate').length === 0) //判断是否具有时间选择器
		return;
	var startDate   =  $('#datetimepickerStartDate').data('datetimepicker').getDate();
	var enddate   =  $('#datetimepickerEndDate').data('datetimepicker').getDate();
	drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(enddate));
}
//公布一个对象给其他Template调用该Template中的方法 或者检查活性数据源？  重新绘制详细曲线图哪个更合理？
Deps.autorun(function(){
	var id = SessionManage.getCheckedMonitorId();
	if(!id)
		return;
	drawDetailLineAgain();
});
*/