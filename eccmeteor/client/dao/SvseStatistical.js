SvseStatisticalDao = {
	"AGENT":"SvseStatisticalDaoAgent",
	/*
	//根据id获取统计报告的list
	"getStatisticalresult" : function(id){
	return SvseStatisticalresultlist.findOne({nIndex:id});
	},
	*/
	"getStatisticalresultlist" : function(){
		return SvseStatisticalresultlist.find().fetch()
	},
	"addStatistical":function(addressname,address,fn){
		console.log("SvseStatisticalDao client addStatistical");
		Meteor.call(SvseStatisticalDao.AGENT,'addStatistical',[addressname,address],function(err,result){	
			console.log(result);
			if(err){
				SystemLogger(err);				
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	//批量删除统计报告list
	"deleteStatisticalByIds":function(ids,fn){
		Meteor.call(SvseStatisticalDao.AGENT,"deleteStatisticalByIds",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"getStatisticalById":function(id){
	return SvseStatisticalresultlist.findOne({nIndex:id});
	},
	
	"updateStatistical":function(addressname,address,fn){
	 Meteor.call(SvseStatisticalDao.AGENT,'updateStatistical',[addressname,address],function(err,result){
	 if(err){
	 	SystemLogger(err);
	 	fn({status:false,msg:err})
	 }else{
	 		if(result && !result[status]){
	 			SystemLogger(err);
	 			fn(result);
	 		}else{
	 			fn({status:true})
	 		}
		 }
	 });
	},
//允许,禁止操作
	"updateStatisticalStatus":function(ids,status,fn){
		Meteor.call(SvseStatisticalDao.AGENT,"updateStatisticalStatus",[ids,status],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);	
			}
		});
	},
//刷新
	"sync":function(fn){
		Meteor.call(SvseStatisticalDao.AGENT,"sync",function(err,result){
		if(result && !result.status){
			fn(result);
		}else{
			fn({status:true});
		}
		});
	}

}