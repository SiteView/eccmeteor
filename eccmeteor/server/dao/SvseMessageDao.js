SvseMessageDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncMessageList();
	},
	//添加短信
	"addMessage":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteMessageIniFileSectionString(sectionname,section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's addMessage add " + sectionname +" faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		var messageresult = result[sectionname];
		SvseMessageList.insert(messageresult,function(err,r_id){
			if(err){
				Log4js.error(err);
				throw new Meteor.Error(500,err);
			}
		})
	},
	//根据id删除短信
	"deleteMessageByIds":function(ids){
		var message = ids.join();
		var result = SvseMethodsOnServer.svDeleteMessageIniFileSection(message);
		if(!result){
			var msg = "SvseMessageDaoOnServer's deleteMessageByIds"+ids+" faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			SvseMessageList.remove(SvseMessageList.findOne({nIndex:ids[index]})._id);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},
	"updateMessage":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteMessageIniFileSectionString(sectionname,section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's addMessage  update " + sectionname +" faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		var messageresult = result[sectionname];
		var s_id = SvseMessageList.findOne({nIndex:sectionname})._id;
		console.log("s_id is " + s_id);
		console.log("messageresult is ");
		console.log(messageresult);
		SvseMessageList.update(s_id,{$set:messageresult},function(err){
			if(err){
				Log4js.error(err);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"getMessageTemplates" : function(){
		return SvseMethodsOnServer.svGetMessageTemplates();
	},
	"getWebMessageTemplates": function(){
		return SvseMethodsOnServer.svGetWebMessageTemplates();
	},
	"updateMessageStatus":function(ids,status){
		var count = 0;
		for(index in ids){
			var id = ids[index];
			var result = SvseMethodsOnServer.svWriteMessageStatusInitFilesection(id,status);
			if(result){
				SvseMessageList.update(SvseMessageList.findOne({nIndex:id})._id,{$set:{"Status":status}});
				console.log("status:"+status);
				count = count+1;
			}else{
				var msg = "SvseMessageDaoOnServer's updateMessageStatus "+index+" faild";
				Log4js.error(msg);
			}
		}
		return SvseMessageDaoOnServer.getReturn(true,1);
	},
	"setMessageWebConfig":function(section){
		var result = SvseMethodsOnServer.svWriteSMSWebConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's setMessageWebConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},
	"setMessageCommConfig":function(section){
		var result = SvseMethodsOnServer.svWriteSMSCommConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's setMessageWebConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},
	"WriteSMSTemplateSetting":function(name,content){
		var result = SvseMethodsOnServer.svWriteSMSTemplateSettingFilesection(name,content);
		//console.log(result);
		if(!result){
			var msg = "SvseMessageDaoOnServer's WriteSMSTemplateSetting faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},
	// "WriteWebSMSTemplateSetting":function(name,content){
		// var result = SvseMethodsOnServer.svGetWebMessageTemplates(name,content);
		// console.log(result);
		// if(!result){
			// var msg = "SvseMessageDaoOnServer's WriteWebSMSTemplateSetting faild";
			// Log4js.error(msg);
			// throw new Meteor.Error(500,msg);
		// }
		// return SvseMessageDaoOnServer.getReturn(true);
	// },
	"deleteSMSTemplateSetting":function(key,section){
		var result = SvseMethodsOnServer.svDeleteSMSTemplateSettingFilesection(key,section);
		//console.log(result);
		if(!result){
			var msg = "SvseMessageDaoOnServer's deleteSMSTemplateSetting faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},
	/* "getSmsDllName":function(){
		var result = SvseMethodsOnServer.svGetSmsDllName();
		if(!result){
			var msg = "SvseMessageDaoOnServer's getSmsDllName faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	} */
}