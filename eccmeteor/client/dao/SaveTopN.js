SvseTopNDao = {
   /* "AGENT":"svseTopNDaoAgent",‌
	//	根据id获取TopN报告‌
	"getTopN" : function(id){‌
		return SvseTopN.findOne({nIndex:id});‌
	},*/
	//获取所有topN列表
	/*"getTopNList" : function(){
		return SvseTopN.find({nIndex:{$exists:true}}).fetch();
	},
	"setTopNOfReport":function(sectionname,section,fn){
		Meteor.call(SvseTopNDao.AGENT,"setTopNOfReport",[sectionname,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});*/
	"AGENT":"svseTopNDaoAgent",
	"getTopNresultlist" : function(){
		return SvseTopNresultlist.find({nIndex:{$exists:true}}).fetch()
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
	},
	//批量删除TopN报告
	'deleteTopNs' : function(ids){
		Meteor.call(SvseTopNDao.AGENT,"deleteTopNs",[ids],function(result){});
	},
	//批量更新TopN报告状态
	"updateTopNsStatus": function(ids,status,fn){
		SystemLogger(typeof fn);
		Meteor.call(SvseTopNDao.AGENT,"updateTopNsStatus",[ids,status],function(err,result){
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
	},
	//刷新同步
	"sync":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	},
	//更新TopN报告
	"updateTopN" : function(nIndex,section,fn){
	/*
		Meteor.call("svWriteAlertIniFileSectionString",nIndex,section,function(err,result){
			var rule = result[nIndex];
			SvseWarnerRule.update(SvseWarnerRule.findOne({nIndex:nIndex})._id,{$set:rule},function(err){
				if(err){
					SystemLogger(err,-1);
				}else{
					fn();
				}	
			});
		});
		*/
		Meteor.call(SvseTopNDao.AGENT,"updateTopN",[nIndex,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});
	}
	
}
