SvseMessageDao = {
	"AGENT":"svseMessageDaoAgent",
	"sync":function(fn){
		Meteor.call(SvseMessageDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	},
	//获取短信集合列表
	"getMessageList": function(){
		return SvseMessageList.find().fetch();
	},
	//添加短信信息
	"addMessage":function(messagename,message,fn){
		Meteor.call(SvseMessageDao.AGENT,'addMessage',[messagename,message],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					Log4js.error(err);
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
				Log4js.error(err);
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
	//根据name获取Message对象
	"getMessageByName":function(name){
		return SvseMessageList.findOne({Name:name});
	},
	"updateMessage":function(sectionname,section,fn){
		Meteor.call(SvseMessageDao.AGENT,'updateMessage',[sectionname,section],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					Log4js.error(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	//获取com类型的短信模板
	"getMessageTemplates":function(fn){
		Meteor.call(SvseMessageDao.AGENT,"getMessageTemplates",[],fn);
	},
	//获取web类型的短信模板
	"getWebMessageTemplates":function(fn){
		Meteor.call(SvseMessageDao.AGENT,"getWebMessageTemplates",[],fn);
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
	"setMessageWebConfig":function(web,fn){
		Meteor.call(SvseMessageDao.AGENT,"setMessageWebConfig",[web],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	"setMessageCommConfig":function(web,fn){
		Meteor.call(SvseMessageDao.AGENT,"setMessageCommConfig",[web],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//检查短信列表是否选中
	"checkMessageSelect":function(ids){
		if(ids.length == 0){
			Message.info("请选择你要操作的对象！");
			return;
		}
	},
	//验证手机号码的格式
	checkPhoneNumberFormat:function(phoneNumber){
		if (!phoneNumber.match(/^(((13[0-9]{1})|159|153)+\d{8})$/)) { 
			Message.info("手机号码格式不正确！"); 
			return false; 
		}
		return true;
	},
	
	/* "getSmsDllName":function(){
		Meteor.call(SvseMessageDao.AGENT,"getSmsDllName",function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	} */
}