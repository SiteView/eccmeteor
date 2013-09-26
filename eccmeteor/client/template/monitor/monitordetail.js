Template.showMonitorDetailSvg.events = {
	"click #queryDetailLineData" : function(){
		var startDate   =  $('#datetimepickerStartDate').data('datetimepicker').getDate();
		var enddate   =  $('#datetimepickerEndDate').data('datetimepicker').getDate();
		drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(enddate));
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
Template.showMonitorDetailSvg.rendered = function(){
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$('#datetimepickerStartDate').datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$('#datetimepickerEndDate').datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
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

	$('#showMonitorDetailSvgDiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -(($(this).width() / 2)+ 50);
			},
		});
}

var drawDetailLine =  function(startDate,endDate){
	console.log("==================================");
	console.log(startDate);
	console.log(endDate);
	console.log("==================================");
	var id = SessionManage.getCheckedMonitorId();
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	SvseMonitorDao.getMonitorRuntimeRecordsByTime(id,startDate,endDate,function(result){
		if(!result.status){
			SystemLogger(result.msg);
			return;
		}
		var dataProcess = new DataProcess(result.content,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var selector = "svg#detailLine" ;
		var line = new DrawLine(
							resultData,
							{
								key:foreigkeys["monitorPrimary"],
								label:foreigkeys["monitorDescript"],
								dateformate:"%m-%d %H:%M"
							},
							selector);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
	})


}