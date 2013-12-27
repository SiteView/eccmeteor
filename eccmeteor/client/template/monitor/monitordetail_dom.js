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
		var monitorId  = template.find("input:hidden").value;
		this.draw(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate),monitorId,template);
	}
});

Object.defineProperty(MonitorDetailAction,"timeLinkClick",{
	value:function(e,template,context){
		/**deal with css*/
		var target = $(e.currentTarget);
		target.parents("ul").find("a").removeClass();
		target.addClass("label label-success");

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
		var endDate = endPicker.getDate();
		var monitorId  = template.find("input:hidden").value;
		this.draw(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate),monitorId,template);
	}
});

Object.defineProperty(MonitorDetailAction,"draw",{
	value:function(start,end,checkedMonitorId,template){
		//画图前 获取相关数据
		SvseMonitorDao.getMonitorReportData(checkedMonitorId,start,end,function(result){
			if(!result.status){
				Message.error(result.msg);
				return;
			}
			var dataProcess = new ReportDataProcess(result.content);
			var imageData = dataProcess.getImageData();
			var st = ClientUtils.objectToDate(start);
			var et = ClientUtils.objectToDate(end);
			var extendDate = [st,et];
			var selector = template.find("svg#detailLine");
			DrawMonitorModuleDetailLine.draw(imageData,selector,extendDate);
		});
	}
});
Object.defineProperty(MonitorDetailAction,"queryDetailLineDataAction",{
	value:function(e,template,context){
		var monitorId  = template.find("input:hidden").value;
		if($(template.find("#datetimepickerStartDate")).length === 0){ //判断是否具有时间选择器
			return;
		}
		var startDate   = $(template.find("#datetimepickerStartDate")).data('datetimepicker').getDate();
		var endDate   =  $(template.find("#datetimepickerEndDate")).data('datetimepicker').getDate();
		this.draw(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate),monitorId,template);
	}
});