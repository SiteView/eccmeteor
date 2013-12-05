SvseAlertLogDao = {
	"AGENT":"svseAlertLogDaoAgent",
	
	//获取查询报警日志的数据记录
	"getQueryAlertLog":function(beginDate,endDate,alertQueryCondition,fn){
		Meteor.call(SvseAlertLogDao.AGENT,"getQueryAlertLog",[beginDate,endDate,alertQueryCondition],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
		});
	},
	//定义报警类型的数组
	"defineAlertTypeData":function(){
		var alertType = [
			{id:1,type:"EmailAlert"},
			{id:2,type:"SmsAlert"},
			{id:3,type:"ScriptAlert"},
			{id:4,type:"SoundAlert"}
			];
		return alertType;
	}
}