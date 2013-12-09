SvseTaskDaoOnServer = {
"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},

	"addtaskabsolute":function(addressname,address){
		Log4js.info("SvseTaskDaoOnServer addtaskabsolute");
		var result = SvseMethodsOnServer.svWriteTaskIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseTaskDaoOnServer's addtaskabsolute  add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseTask.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
	"setMessageCommConfig":function(section){
		var result = SvseTaskDaoOnServer.svWriteSMSCommConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseTaskDaoOnServer's setMessageWebConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseTaskDaoOnServer.getReturn(true);
	}
}