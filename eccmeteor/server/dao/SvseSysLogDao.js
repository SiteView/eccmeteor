SvseSysLogDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
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
	}
}