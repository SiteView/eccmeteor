SvseSysLogDaoOnServer = {
"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
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
	}
}