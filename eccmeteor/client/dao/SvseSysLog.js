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
		"getQuerySysLog":function(id,beginDate,endDate,fn){
			Meteor.call(SvseSysLogDao.AGENT,"getQuerySysLog",[id,beginDate,endDate],function (err,result){
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