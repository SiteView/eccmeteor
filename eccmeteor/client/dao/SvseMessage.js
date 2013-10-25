SvseMessageDao = {
	"AGENT":"svseMessageDaoAgent",
	"sync" : function(){
		Meteor.call(SvseMessageDao.AGENT,"sync");
	},
	//获取短信集合列表
	"getMessageList": function(){
		return SvseMessageList.find({nIndex:{$exists:true}}).fetch();
	},
	//添加短信信息
	"addMessage":function(messagename,message,fn){
		Meteor.call(SvseMessageDao.AGENT,'addMessage',[messagename,message],function(err,result){
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
	//根据ids(批量)删除短信
	"deleteMessageByIds":function(ids,fn){
		Meteor.call(SvseMessageDao.AGENT,"deleteMessageByIds",[ids],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//根据id获取Message对象
	"getMessageById" : function(id){
		return SvseMessageList.findOne({nIndex:id});
	},
	"updateMessage":function(sectionname,section,fn){
		Meteor.call(SvseMessageDao.AGENT,'updateMessage',[sectionname,section],function(err,result){
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
	"getMessageTemplates":function(fn){
		Meteor.call(SvseMessageDao.AGENT,"getMessageTemplates",[],fn);
	},
	//批量更新短信状态
	"updateMessageStatus" : function(ids,status,fn){
		Meteor.call(SvseMessageDao.AGENT,"updateMessageStatus",[ids,status],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"getMessageDllName":function(fn){
		Meteor.call(SvseMessageDao.AGENT,"getMessageDllName",[],fn);
	}
}