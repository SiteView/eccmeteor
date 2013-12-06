SvseAlertLogDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	//获取查询报警日志的数据记录
	"getQueryAlertLog" : function(beginDate,endDate,alertQueryCondition){
		var result = SvseMethodsOnServer.svGetQueryAlertLog(beginDate,endDate,alertQueryCondition);
		if(!result){
			console.log("error");
			throw new Meteor.Error(500,"SvseAlertLogDaoOnServer.getQueryAlertLog failed");
		}
		//console.log("resultde");
		//console.log(result);
		return result;
	},
}