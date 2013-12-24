MonitorDetailAction = function(){};
Object.defineProperty(MonitorDetailAction,"render",{
	value:function(template){
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
		//drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate));
		var monitorId  = template.find("input:hidden").value;
		this.draw(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate),monitorId);
	}
});

Object.defineProperty(MonitorDetailAction,"timeLinkClick",{
	value:function(e,t,context){
		var str = e.currentTarget.name;
		var startDate;
		var startPicker = $(template.find("#datetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#datetimepickerEndDate")).data('datetimepicker');
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
});

Object.defineProperty(MonitorDetailAction,"draw",{
	value:function(start,end,checkedMonitorId){
		//画图前 获取相关数据
		SvseMonitorDao.getMonitorReportData(checkedMonitorId,start,end,function(result){
			if(!result.status){
				Message.error(result.msg);
				return;
			}
			var dataProcess = new ReportDataProcess(result.content);
		//	var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
		//	var statusData = dataProcess.getStatusData();
			var extendDate = dataProcess.getExtentDate();
			SessionManage.setMonitorStatisticalDetailTableData(tableData);
			
			var selector = "svg#line";
			var setting = {
				'width':$(selector).parent().width(),
				'height':$(selector).parent().height()
			};
			DrawMonitorModuleLine.draw(imageData,selector,setting,extendDate);
		});
	}
});
