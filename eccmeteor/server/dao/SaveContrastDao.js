SvseContrastDaoOnServer = {
"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	//获取查询报警日志的数据记录
	"getQueryRecordsByTime" : function(beginDate,endDate,alertQueryCondition){
		var result = SvseMethodsOnServer.svGetMonitorRuntimeRecords(beginDate,endDate,alertQueryCondition);
		if(!result){
			console.log("error");
			throw new Meteor.Error(500,"SvseContrastDaoOnServer.getQueryRecordsByTime failed");
		}
		console.log("resultde");
		console.log(result);
		return result;
	},

    getMonitorRuntimeRecords : function(monitorid,count){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	},
	//根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(monitorid,startDate,endDate){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecordsByTime(monitorid,startDate,endDate);
	}

}