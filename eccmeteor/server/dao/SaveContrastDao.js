SvseContrastDaoOnServer = {
"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	getMonitorRuntimeRecords : function(monitorid,count){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	},
	//根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(monitorid,beginDate,endDate){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecordsByTime(monitorid,beginDate,endDate);
	},
	// getQueryRecordsByTime : function(monitorid,count){
		// return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	// },
	"getContrastDetailData":function(id,type){
		//Log4js.info("SvseTrendOnServer getContrastDetailData ok!");
		var result = SvseMethodsOnServer.svGetTrendList(id,type);
			console.log(result);		
		if(!result){
		var msg = "SvseMethodsOnServer'getContrastDetailData error !"
			SystemLogger.log(msg,-1);	
				throw new Meteor.Error(500,msg);
		}
			console.log(result);		
		//return SvseMethodsOnServer.svGetTrendList(); 
	}

}