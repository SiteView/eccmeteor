SvseTopNDao = {
	"AGENT":"SvseTopNDaoAgent",
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
				if(result && !result[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	//批量删除
	"deleteTopNByIds":function(ids,fn){
		Meteor.call(SvseTopNDao.AGENT,"deleteTopNByIds",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"getTopNById":function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},

	"updateTopN":function(addressname,address,fn){
		Meteor.call(SvseTopNDao.AGENT,'updateTopN',[addressname,address],function(err,result){
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
	//批量更新topN报告状态
	/*"updateTopNStatus": function(ids,status,fn){
		SystemLogger(typeof fn);
		Meteor.call(SvseTopNDao.AGENT,"updateTopNStatus",[ids,status],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				if(result && !result.status){
					fn(result)
				}else{
					fn({status:true,option:{count:ids.length}});
				}
			}
		});
	},*/
	
	"updateTopNStatus" : function(ids,status,fn){
		Meteor.call(SvseTopNDao.AGENT,"updateTopNStatus",[ids,status],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//刷新同步
	/*"sync":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	}*/
	"sync" : function(){
		Meteor.call(SvseTopNDao.AGENT,"sync");
	},
	
}
	