StatisticsReportFactory = function(reportConfigureId){
	this.setting = {};
	this.monitorIds = [];
	this.extentDate = [];
	this.fileType = [];
	this._options = {
		NoGraphicReportMnotoring:"StatisticsReportNoGraphicMonitoring"
	}
	this.init(reportConfigureId);
};

StatisticsReportFactory.prototype.init = function(reportConfigureId){
	this.setting = SvseStatisticalresultlist.findOne(reportConfigureId);
};

StatisticsReportFactory.prototype.getReportConfigure = function(){};


StatisticsReportFactory.prototype.getSendEmailConfigure = function(){};

StatisticsReportFactory.prototype.getExtentDate = function(){
	var dateType = this.setting.Period ;
	var extent  = [];
	switch(dateType){
		case 'Day' :extent =  ReportDateUtils.getCurrentDay() ;
			break;
		case 'Week' :extent = ReportDateUtils.getCurrentWeek();
			break;
		case 'Month' :extent = ReportDateUtils.getCurrentMonth();
			break;
		default:
			//数据抽取错误则返回当天数据
			//Other@timestart@Mon Dec 23 00:00:00 CST 2013@timeend@Tue Dec 10 00:00:00 CST 2013
			var otherDateArray = dateType.replace("Other@","").split("@");
			var startTime = null;
			var endTime = null;
			try{
				for(var i = 0; i < otherDateArray.length; i = i+2){
					if(otherDateArray[i] == "timestart"){
						startTime = new Date(otherDateArray[i+1]);	
					}else if(otherDateArray[i] == "timeend"){
						endTime = new Date(otherDateArray[i+1]);	
					}
					extent =  [startTime,endTime];
				}
			}catch(e){
				Log4js.error(e);
				Log4js.error("Date parse error in" + dateType);
				extent =  ReportDateUtils.getCurrentDay();
			}
	}
	return this.buildTime(extent);
	
};

//拼接时间
StatisticsReportFactory.prototype.joinTime = function(obj){
	return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
}

StatisticsReportFactory.prototype.buildTime = function(extent){
	var construtTimeObject = function(date){
		return {
			year:date.getFullYear(),
			month:date.getMonth() + 1,
			day:date.getDate(),
			hour:date.getHours(),
			minute:date.getMinutes(),
			second:date.getSeconds()
		}
	}
	var startTime = construtTimeObject(extent[0]);
	var endTime = construtTimeObject(extent[1]);
	return [startTime,endTime];
}


StatisticsReportFactory.prototype.getMonitorIds = function(){};

//获取生成报告的文件类型  先默认为html 其他文件类型 以后支持
StatisticsReportFactory.prototype.getFileType = function(){
	//return this.setting.fileType
	return "html";
};

StatisticsReportFactory.prototype.genaritionReport = function(){
	if(this.setting.Graphic == "No"){
		this.drawNoGraphicReport();
	}
}

StatisticsReportFactory.prototype.drawNoGraphicReport = function(){
	var _self = this; 
	var monitorIds = _self.setting.GroupRight.replace(/\,$/,"");
	var filter = null;
	var dateExtent = _self.getExtentDate();
	/*
	每次获取制定个数的监视器数据以提高反应速度
	var monitorIdArray = monitorIds.split(",");
	// SvseMonitorDaoOnServer.getMonitorReportDataByfilter();
	for(var i = 0; i < monitorIdArray.length;i = i+3){
		var recordsIds = monitorIdArray.slice(i, i+3).join(",");

	}
	*/
	var monitoringRecords = SvseMonitorDaoOnServer.getMonitorReportDataByfilter(monitorIds,dateExtent[0],dateExtent[1],filter,false);
	var statisticalRecords = [];
	for(x in monitoringRecords){
		if(x.indexOf("Return") !== -1 || x.indexOf("return") !== -1){
			statisticalRecords.push(monitoringRecords[x]);
			delete monitoringRecords[x];
		}
	}
	var baseData = this.buildNoGraphicReportOtherSetting();
	var monitoringContext = {
		baseData:baseData,
		records:monitoringRecords
	}
	var monitoringTemplate = this._option.NoGraphicReportMnotoring;
	var uuid = Meteor.uuid();
	var monitoring = HtmlTemplate.render(monitoringTemplate,monitoringContext);

}

StatisticsReportFactory.prototype.buildNoGraphicReportOtherSetting=function(){
	var self = this;
	var dateExtent = this.getExtentDate();
	return {
		reportTitle: self.setting.Title.split("\|")[0],
		startTime:self.joinTime(dateExtent[0]),
		endTime:self.joinTime(dateExtent[0]),
		theLastPage:0,
		theBeforePage:0,
		theBeforePage:0,
		theAfterPage:0
	}
}

StatisticsReportFactory.prototype.write = function(string){
	
}