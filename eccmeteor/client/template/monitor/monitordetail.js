Template.showMonitorDetailSvg.events = {
	"click #queryDetailLineData" : function(){
		drawDetailLineAgain();
	},
	"click ul li a":function(e,t){
		MonitorDetailAction.timeLinkClick(e,t,this);
	}
}
Template.showMonitorDetailSvg.rendered = function(){
	MonitorDetailAction.render(this);
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
	if(!id){
		return;
	}
	drawDetailLineAgain();
});