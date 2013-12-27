
StatisticsReportFactory = function(reportConfigureId){
	this.setting = {};
	this.monitorIds = [];
	this.extentDate = [];
	this.init(reportConfigureId);
};

StatisticsReportFactory.prototype.init = function(reportConfigureId){
	this.setting = SvseStatisticalresultlist.findOne(reportConfigureId);

};


StatisticsReportFactory.prototype.getReportConfigure = function(){};


StatisticsReportFactory.prototype.getSendEmailConfigure = function(){};

StatisticsReportFactory.prototype.setExtentDate = function(setting){
	var dateType = setting.Period ;
	var today = new Date();

	switch(dateType){
		case "Day" : ;
	}

};

StatisticsReportFactory.prototype.getExtentDate = function(){};


StatisticsReportFactory.prototype.getMonitorIds = function(){};