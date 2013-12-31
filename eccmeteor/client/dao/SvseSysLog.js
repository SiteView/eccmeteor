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
		"getQuerySysLog":function(beginDate,endDate,fn){
			Meteor.call(SvseSysLogDao.AGENT,"getQuerySysLog",[beginDate,endDate],function (err,result){
				if(err){
					fn({status:false,msg:err})
					return;
				}
				console.log("55555");
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
			{id:0,type:"Emergence"},
			{id:1,type:"Alert"},
			{id:2,type:"Critical"},
			{id:3,type:"Error"},
			{id:4,type:"Warning"},
			{id:5,type:"Notice"},
			{id:6,type:"Informational"},
			{id:7,type:"Debug"},
			
			{name:0,type:"Kernel"},
			{name:1,type:"User"},
			{name:2,type:"Mail"},
			{name:3,type:"Demon"},
			{name:4,type:"Auth"},
			{name:5,type:"Syslog"},
			{name:6,type:"Lpr"},
			{name:7,type:"News"},
			{name:8,type:"UUCP"},
			{name:9,type:"Cron"},
			{name:10,type:"FTP Daemon"},
			{name:11,type:"Ntp"},
			{name:12,type:"Log audit"},
			{name:13,type:"Log alert"},
			{name:14,type:"Clock Daemon"},
			{name:15,type:"local0"},
			{name:16,type:"local1"},
			{name:17,type:"local2"},
			{name:18,type:"local3"},
			{name:19,type:"Syslog"},
			{name:20,type:"local4"},
			{name:21,type:"local5"},
			{name:22,type:"local6"},
			{name:23,type:"local7"}
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