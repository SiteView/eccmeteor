SvseStatisticalOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncStatisticalList();
	},
	"addStatistical":function(addressname,address){
		Log4js.info("SvseStatisticalOnServer addStatistical");
		var result = SvseMethodsOnServer.svWriteStatisticalIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseStatisticalOnServer's addStatistical  add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseStatisticalresultlist.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
	
	"deleteStatisticalByIds" : function(ids){
		var address = ids.join();
		var result = SvseMethodsOnServer.svDeleteStatisticalIniFileSection(address);
		if(!result){
			var msg = "SvseStatisticalOnServer's deleteStatisticalByIds"+ids+" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		for(index in ids){
			SvseStatisticalresultlist.remove(SvseStatisticalresultlist.findOne({nIndex:ids[index]})._id);
		}
		return SvseStatisticalOnServer.getReturn(true);
	}


}