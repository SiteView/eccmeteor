SvseContrastDaoOnServer = {

    getMonitorRuntimeRecords : function(monitorid,count){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	},
	//根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(monitorid,startDate,endDate){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecordsByTime(monitorid,startDate,endDate);
	}

}