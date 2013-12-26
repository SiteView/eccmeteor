SvseSysLogDao = {
        "AGENT":"svseSysLogDaoAgent",
		//根据id获取设置
		"getSysLog" : function(id){
		return SvseSyslogDetailList.findOne({nIndex:id});
		},
		//
		"getSyslogList" : function(){
		return SvseSyslogDetailList.find().fetch();
		},
	
		//获取查询系统日志的数据记录
		"getQuerySysLog":function(beginDate,endDate,syslogQueryCondition,fn){
			Meteor.call(SvseSysLogDao.AGENT,"getQuerySysLog",[beginDate,endDate,syslogQueryCondition],function (err,result){
				if(err){
					fn({status:false,msg:err})
					return;
				}
				fn({status:true,content:result});
			});
		},
		//删除系统日志
		"DeleteRecordsByIds":function(id,endDate,fn){
			Meteor.call(SvseSysLogDao.AGENT,"DeleteRecordsByIds",[id,endDate],function(err,result){
				if(err == ""){
					SystemLogger(err);
					fn({status:false,msg:err})
				}else{
			    	fn(result);
				}
			});
		},
		
	    "setDelCondConfig":function(KeepDay,fn){
			Meteor.call(SvseSysLogDao.AGENT,"setDelCondConfig",[KeepDay],function(err,result){
				if(err){
					Log4js.error(err);
					fn({status:false,msg:err})
				}else{
					fn(result);
				}
			});

    },
	 "setQueryCondEntityConfig":function(Facility,fn){
			 Meteor.call(SvseSysLogDao.AGENT,"setQueryCondEntityConfig",[Facility],function(err,result){
				 if(err){
					Log4js.error(err);
					 fn({status:false,msg:err})
				}else{
					 fn(result);
				 }
			 });

     },
	
	 "setQueryCondRankConfig":function(Severities,fn){
			 Meteor.call(SvseSysLogDao.AGENT,"setQueryCondRankConfig",[Severities],function(err,result){
				 if(err){
					Log4js.error(err);
					 fn({status:false,msg:err})
				}else{
					 fn(result);
				 }
			 });

     },
	 //定义参数设置类型的数组
	"defineparameterTypeData":function(){
		var parameterType = [
			{name:0,type:"Emergence"},
			{name:1,type:"Alert"},
			{name:2,type:"Critical"},
			{name:3,type:"Error"},
			{name:4,type:"Warning"},
			{name:5,type:"Notice"},
			{name:6,type:"Informational"},
			{name:7,type:"Debug"},
			
			{id:0,type:"Kernel"},
			{id:1,type:"User"},
			{id:2,type:"Mail"},
			{id:3,type:"Demon"},
			{id:4,type:"Auth"},
			{id:5,type:"Syslog"},
			{id:6,type:"Lpr"},
			{id:7,type:"News"},
			{id:8,type:"UUCP"},
			{id:9,type:"Cron"},
			{id:10,type:"FTP Daemon"},
			{id:11,type:"Ntp"},
			{id:12,type:"Log audit"},
			{id:13,type:"Log alert"},
			{id:14,type:"Clock Daemon"},
			{id:15,type:"local0"},
			{id:16,type:"local1"},
			{id:17,type:"local2"},
			{id:18,type:"local3"},
			{id:19,type:"Syslog"},
			{id:20,type:"local4"},
			{id:21,type:"local5"},
			{id:22,type:"local6"},
			{id:23,type:"local7"}
			];

		return parameterType;
	}
	 // "setQueryCondConfig":function(fn){
			 // Meteor.call(SvseSysLogDao.AGENT,"setQueryCondConfig",function(err,result){
				 // if(err){
					// Log4js.error(err);
					 // fn({status:false,msg:err})
				// }else{
					 // fn(result);
				 // }
			 // });

     // }
}