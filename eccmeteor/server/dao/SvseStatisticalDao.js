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
	},
	
	"updateStatistical":function(addressname,address){
			Log4js.info("SvseStatisticalOnServer updateStatistical");
		var result = SvseMethodsOnServer.svWriteStatisticalIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseEmailDaoOnServer's addStatistical  update " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		var s_id = SvseStatisticalresultlist.findOne({nIndex:addressname})._id;
			console.log("s_id is" + s_id);
			console.log("addressresult is");
			console.log(addressresult);
		SvseStatisticalresultlist.update(s_id,{$set:addressresult},function(err){
		if(err){
			SystemLogger(err,-1);
			throw new Meteor.Error(500,err);
		}
	})
},
"updateStatisticalStatus":function(ids,status){
	var count = 0;
	for(index in ids){
		var id = ids[index];
		var result = SvseMethodsOnServer.svWriteStatisticalStatusInitFilesection(id,status);
		if(result){
			SvseStatisticalresultlist.update(SvseStatisticalresultlist.findOne({nIndex:id})._id,{$set:{"Deny":status}});
			count = count + 1;
		}else{
			var msg= "SvseStatisticalOnServer's updateStatisticalStatus "+index+" faild";
			SystemLogger.log(msg,-1);
		}
	}
	return SvseStatisticalOnServer.getReturn(true,1);
}

}