SvseSysLogDao = {
        "AGENT":"svseSysLogDaoAgent",
		//根据id获取设置
		// "getSysLogsetting_statusById" : function(id){
		// return SvseSysLogsetting_status.findOne({nIndex:id});
		// },
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