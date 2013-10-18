SvseTopNOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"sync":function(){
		SyncFunction.SyncTopNList();
		},
	"addTopN":function(addressname,address){
		Log4js.info("SvseTopNOnServer addTopN");
		var result = SvseMethodsOnServer.svWriteTopNIniFileSectionString(addressname,address);
		if(!result){
			var msg = "SvseTopNOnServer's addTopN  add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseTopNresultlist.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	}	
	
}