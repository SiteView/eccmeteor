SvseAlertLogDao = {
	"AGENT":"SvseAlertLogDaoAgent",
	
	//获取查询报警日志的数据记录
	"getQueryAlertLog":function(beginDate,endDate,alertQueryCondition,fn){
		Meteor.call(SvseAlertLogDao.AGENT,"getQueryAlertLog",[beginDate,endDate,alertQueryCondition],function (err,result){
			console.log("logg");
			if(err){
				fn({status:false,msg:err})
				return;
			}
			console.log("log");
			fn({status:true,content:result});
		});
	}

}