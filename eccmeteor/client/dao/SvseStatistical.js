SvseStatisticalDao = {
	"AGENT":"SvseStatisticalDaoAgent",
	"getStatisticalresultlist" : function(){
		return SvseStatisticalresultlist.find({nIndex:{$exists:true}}).fetch()
	},
	"addStatistical":function(addressname,address,fn){
		Meteor.call(SvseStatisticalDao.AGENT,'addStatistical',[addressname,address],function(err,result){
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
	"setEmailBasicSetting":function(setting,fn){
		Meteor.call(SvseEmailDao.AGENT,"setEmailBasicSetting",[setting],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"getEmailById" : function(id){
		return SvseEmailList.findOne({nIndex:id});
	},
	"updateEmailAddress":function(addressname,address,fn){
		Meteor.call(SvseEmailDao.AGENT,'updateEmailAddress',[addressname,address],function(err,result){
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
	//批量删除邮件地址
	"deleteEmailAddressByIds":function(ids,fn){
		Meteor.call(SvseEmailDao.AGENT,"deleteEmailAddressByIds",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//批量更新邮件地址状态
	"updateEmailAddressStatus" : function(ids,status,fn){
		Meteor.call(SvseEmailDao.AGENT,"updateEmailAddressStatus",[ids,status],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"sync" : function(){
		Meteor.call(SvseEmailDao.AGENT,"sync");
	},
	getEmailTemplates : function(fn){
		Meteor.call(SvseEmailDao.AGENT,"getEmailTemplates",[],fn);
	}
}