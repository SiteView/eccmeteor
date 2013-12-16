SvseSysLogDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	//删除系统日志
	"DeleteRecordsByIds":function(ids){
		//var log = ids.split(",")
		var log = ids.join()
		var result = SvseMethodsOnServer.svDeleteSysLogInitFilesection(log);
		if(!result){
			var msg = "SvseSysLogDaoOnServer's DeleteRecordsByIds"+ids+" faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			//SvseMessageList.remove(SvseMessageList.findOne({nIndex:ids[index]})._id);
		}
		return SvseSysLogDaoOnServer.getReturn(true);
	},
	"setDelCondConfig":function(section){
		var result = SvseMethodsOnServer.svWriteDelContConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseSysLogDaoOnServer's setDelCondConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseSysLogDaoOnServer.getReturn(true);
	},
	"setQueryCondEntityConfig":function(section){
		var result = SvseMethodsOnServer.svWriteQueryContEntityConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseSysLogDaoOnServer's setQueryCondEntityConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseSysLogDaoOnServer.getReturn(true);
	},
	"setQueryCondRankConfig":function(section){
		var result = SvseMethodsOnServer.svWriteQueryContRankConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseSysLogDaoOnServer's setQueryCondRankConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseSysLogDaoOnServer.getReturn(true);
	},
	// "setQueryCondConfig":function(section){
		// var result = SvseMethodsOnServer.svWriteQueryContConfigIniFileSectionString(section);
		// if(!result){
			// var msg = "SvseSysLogDaoOnServer's setQueryCondConfig faild";
			// Log4js.error(msg);
			// throw new Meteor.Error(500,msg);
		// }
		// return SvseSysLogDaoOnServer.getReturn(true);
	// }
}