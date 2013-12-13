SvseTaskDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"addtaskabsolute":function(address){
		Log4js.info("SvseTaskDaoOnServer addtaskabsolute");
		var result = SvseMethodsOnServer.svWriteTaskIniFileSectionString(address);
		if(!result){
			var msg = "SvseTaskDaoOnServer's addtaskabsolute  add faild";
			Log4js.info(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		console.log("11111111");
		console.log(result);
		console.log("2222222");
		return SvseTaskDaoOnServer.getReturn(true);
		 var addressresult = result[address];
		 SvseTask.insert(addressresult,function(err,r_id){
		 console.log("44444444");
			if(err){
				 SystemLogger(err,-1);
				 throw new Meteor.Error(500,err);
			 }
		 })
		 console.log("3333333");
	},
	"deleteTaskByIds" : function(ids){
		var address = ids.join();
		var result = SvseMethodsOnServer.svDeleteTaskIniFileSection(address);
		if(!result){
			var msg = "SvseTaskOnServer's deleteTaskByIds"+ids+" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			SvseStatisticalresultlist.remove(SvseStatisticalresultlist.findOne({nIndex:ids[index]})._id);
		}
		return SvseStatisticalOnServer.getReturn(true);
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