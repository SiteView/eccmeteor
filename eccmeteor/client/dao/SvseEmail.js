SvseEmailDao = {
	"AGENT":"svseEmailDaoAgent",
	// "getEmailList" : function(){
		// return SvseEmailList.find({nIndex:{$exists:true}}).fetch()
	// },
	"addEmailAddress":function(addressname,address,fn){
		Meteor.call(SvseEmailDao.AGENT,'addEmailAddress',[addressname,address],function(err,result){
			if(err){
				Log4js.info(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					Log4js.info(err);
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
				Log4js.info(err);
				fn({status:false,msg:err})
			}else{
				//console.log(result);
				fn(result);
			}
		});
	},
	"getEmailById" : function(id){
		return SvseEmailList.findOne({nIndex:id});
	},
	"getEmailByName": function(name){
		return SvseEmailList.findOne({Name:name});
	},
	"updateEmailAddress":function(addressname,address,fn){
		Meteor.call(SvseEmailDao.AGENT,'updateEmailAddress',[addressname,address],function(err,result){
			if(err){
				Log4js.info(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					Log4js.info(err);
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
				Log4js.info(err);
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
				Log4js.info(err);
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
	},
	//检查邮件列表是否选中
	"checkEmailSelect":function(ids){
		if(ids.length == 0){
			Message.info("请选择你要操作的对象！");
			return;
		}
	},
	//验证邮件地址的格式是否正确
	checkEmailFormat:function(email){
		if (!email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) { 
			Message.info("邮件地址格式不正确"); 
			return false; 
		}
		return true;
	},
	"emailTest":function(emailSetting,fn){
		Meteor.call(SvseEmailDao.AGENT,"emailTest",[emailSetting],function(err,result){
			if(err){
				Log4js.info(err);
				fn({status:false,msg:err})
			}else{
				//console.log(result);
				fn(result);
			}
		});
	},
	//获取发送邮件的设置
	"getSendEmailSetting":function(fn){
		Meteor.call(SvseEmailDao.AGENT,"getSendEmailSetting",function(err,result){
			if(err){
				Log4js.info(err);
				fn({status:false,msg:err})
			}else{
				console.log(result);
				fn(result);
			}
		});
	},
}

	//isEmpty  判断邮件列表当前数据为空
Object.defineProperty(SvseEmailDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseEmailList.findOne() == null){
			Session.set(Subscribe.LOADSVSEEMAILLIST,true);
			return true;
		}
		return false;
	}
});

//同步获取
Object.defineProperty(SvseEmailDao,"getEmailListSync",{
	value:function(){
		return SvseEmailList.find({nIndex:{$exists:true}}).fetch();
	}
});

Object.defineProperty(SvseEmailDao,"getEmailListAsync",{
	value:function(fn){
		Meteor.call(SvseEmailDao.AGENT,"getEmailListAsync",function(error,result){
			if(error){
				Log4js.info(error);
			}else{
				fn(result);
			}
		})
	}
});