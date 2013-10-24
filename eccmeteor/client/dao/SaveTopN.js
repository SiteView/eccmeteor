SvseTopNDao = {
	"AGENT":"SvseTopNDaoAgent",
	//根据id获取topN报告
	/*"getTopNresult" : function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},*/
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
	}
}
	