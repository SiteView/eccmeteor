SvseTopNDao = {
	"Agent":"SvseTopNDaoAgent",
	//根据id获取topN报告
	"getTopNresult" : function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},
	"getTopNresultlist" : function(){
		return SvseTopNresultlist.find().fetch()
	},
	"addTopN":function(addressname,address,fn){
		Meteor.call(SvseTopNDao.AGENT,'addTopN',[addressname,address],function(err,result){
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
	}
}
	/*"updateTopNAddress":function(addressname,address,fn){
		Meteor.call(SvseTopNlDao.AGENT,'updateTopNAddress',[addressname,address],function(err,result){
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
	//批量删除topN报告地址
	"deleteTopNlist":function(ids,fn){
		Meteor.call(SvseTopNDao.AGENT,"deleteTopNlist",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//批量更新topN报告地址状态
	"updateTopNAddressStatus" : function(ids,status,fn){
		Meteor.call(SvseTopNDao.AGENT,"updateTopNAddressStatus",[ids,status],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"sync" : function(){
		Meteor.call(SvseTopNDao.AGENT,"sync");
	},
	getTopNTemplates : function(fn){
		Meteor.call(SvseTopNDao.AGENT,"getTopNTemplates",[],fn);
	}
}*/