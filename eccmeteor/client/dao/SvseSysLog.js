SvseSysLogDao = {
        "AGENT":"svseSysLogDaoAgent",
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