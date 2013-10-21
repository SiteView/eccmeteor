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
				if(result && !reult[status]){ // 无权限
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
	}
}