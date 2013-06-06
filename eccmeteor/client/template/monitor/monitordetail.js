Template.detailSvg.events = {
	"click #queryDetailLineData" : function(){
			var startdate   =   new  Date(Date.parse($("#startdate").val().replace(/-/g,"/")));   
			var enddate   =   new  Date(Date.parse($("#enddate").val().replace(/-/g,"/")));   
			drawDetailLine(ClientUtils.dateToObject(startdate),ClientUtils.dateToObject(enddate));
	}
}
Template.detailSvg.rendered = function(){
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startdate = new Date();
		startdate.setTime(startdate.getTime() - 1000*60*60*24);
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
		drawDetailLine(ClientUtils.dateToObject(startdate),ClientUtils.dateToObject(endDate));
	});
}

var drawDetailLine =  function(startdate,endDate){
	console.log("==================================");
	console.log(startdate);
	console.log(endDate);
	console.log("==================================");
	var id = SessionManage.getCheckedMonitorId();
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	Meteor.call("svQueryRecordsByTime",id,startdate,endDate, function (err, result) {
		if(err){
			SystemLogger(err,-1);
			return;
		}
		var dataProcess = new DataProcess(result,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
	//	var recordsData = dataProcess.getRecordsDate();
	//	var keys = dataProcess.getDataKey();
	//	var table = new DrawTable();//调用 client/lib 下的table.js 中的drawLine函数画图
	//	table.drawTable(keys,"#tableData");
		var line = new DrawLine(resultData,foreigkeys["monitorPrimary"],foreigkeys["monitorDescript"]);
		line.svgDomId = "svg#detailLine";
		line.dateformate = "%m-%d %H:%M";
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
	//	Session.set("recordsData",recordsData);
	});
}