var fs = Npm.require('fs');
var writeFile = Meteor._wrapAsync(fs.writeFile.bind(fs));


StatisticsReportFactory = function(reportConfigureId){
	this.setting = {};
	this.monitorIds = [];
	this.extentDate = [];
	this.fileType = [];
	this._options = {
		NoGraphicReportMnotoringHtmlTemplate:"StatisticsReportNoGraphicMonitoring.html",
		NoGraphicStatisticalHtmlTemplate:"StatisticsReportNoGraphicStatistical.html",
		_perPage:24,
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
	return obj.year 
			+ "-" + (obj.month < 10 ? ("0" + obj.month):obj.month )
			+ "-" + (obj.day < 10 ? ("0" + obj.day) :obj.day )
			+ " " + obj.hour 
			+ ":" + obj.minute
			+ ":" + obj.second;
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
	
	//Log4js.info(monitoringRecords);

	var statisticalRecords = [];

	var perPage = this._options._perPage;

	var pagerMonitoringRecords = [];
	var totalMonitoringRecords = [];

	var pagerStatisticalRecords = [];
	var totalStatisticalRecords = [];


	for(x in monitoringRecords){
		if(x == "return"){
			continue;
		}
		if(x.indexOf("Return") !== -1 || x.indexOf("return") !== -1){
			pagerStatisticalRecords.push(monitoringRecords[x]);
			if(pagerStatisticalRecords.length == perPage){
				totalStatisticalRecords.push(pagerStatisticalRecords);
				pagerStatisticalRecords = new Array();
			}
			continue;
		}
		pagerMonitoringRecords.push(monitoringRecords[x]);
		if(pagerMonitoringRecords.length == perPage){
			totalMonitoringRecords.push(pagerMonitoringRecords);
			pagerMonitoringRecords = new Array();
		}
	}

	if(pagerStatisticalRecords.length){
		totalStatisticalRecords.push(pagerStatisticalRecords);
	}

	if(pagerMonitoringRecords.length){
		totalMonitoringRecords.push(pagerMonitoringRecords);
	}

	var uuid = Utils.getUUID();
	var saveDirPath = _self.getReportSavePath(uuid);

	var totalPage = totalMonitoringRecords.length + totalStatisticalRecords.length;

	var monitoringTemplate = this._options.NoGraphicReportMnotoringHtmlTemplate;
	
	var filename = "";

	for(var i = 0 ; i < totalMonitoringRecords.length ; i++){
		var baseData = this.buildNoGraphicReportOtherSetting(i,totalPage);
		var monitoringContext = {
			baseData:baseData,
			records:totalMonitoringRecords[i]
		}
		var monitoring = HtmlTemplate.render(monitoringTemplate,monitoringContext);
		filename = i+".html";
		_self.writeToHtml(monitoring,_self.joinPath(saveDirPath,filename));
	}

	var statisticalTemplate = this._options.NoGraphicStatisticalHtmlTemplate;
	for(var j = 0 ; j < totalStatisticalRecords.length ; j++){
		var baseData = this.buildNoGraphicReportOtherSetting(i+j,totalPage);
		var statisticalContext = {
			baseData:baseData,
			records:totalStatisticalRecords[j]
		}
		var statistical = HtmlTemplate.render(statisticalTemplate,statisticalContext);
		filename = (i+j)+".html";
		_self.writeToHtml(statistical,_self.joinPath(saveDirPath,filename));
	}
	_self.compressFoldToZip(saveDirPath);
}

StatisticsReportFactory.prototype.buildNoGraphicReportOtherSetting=function(currentPage,totalPage){
	var self = this;
	var dateExtent = this.getExtentDate();
	var  theLastPage = totalPage-1;
	return {
		reportTitle: self.setting.Title.split("\|")[0],
		startTime:self.joinTime(dateExtent[0]),
		endTime:self.joinTime(dateExtent[0]),
		theFirstPage:0,
		theLastPage:theLastPage,
		theCurrentPage:currentPage,
		theBeforePage:currentPage == 0 ? 0 : (currentPage - 1),
		theAfterPage:currentPage == theLastPage ? currentPage : (currentPage + 1),
		theTotalPage:totalPage
	}
}

StatisticsReportFactory.prototype.writeToHtml = function(htmlContent,fileName){
	writeFile(fileName,new Buffer(htmlContent));
}


StatisticsReportFactory.prototype.getReportSavePath = function(uuid){
	var path = "/home/ec/testReportWritefile";
	path = EccSystem.joinPath(path,uuid);
	EccSystem.mkdir(path);
	return path;
}

StatisticsReportFactory.prototype.joinPath = function(dirPath,filename){
	return EccSystem.joinPath(dirPath,filename);
}

StatisticsReportFactory.prototype.compressFoldToZip = function(saveDirPath){
	var AdmZip = Meteor.require('adm-zip');
	var zip = new AdmZip();
	// add file directly
	zip.addLocalFolder(saveDirPath);
	// get everything as a buffer
	//var willSendthis = zip.toBuffer();
	// or write everything to disk
	zip.writeZip(saveDirPath+".zip");//target file name
}/**/