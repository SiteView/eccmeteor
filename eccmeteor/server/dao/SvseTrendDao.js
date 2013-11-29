SvseTrendOnServer={
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
/*参照这里编写获取trend报告的列表展示
	"getEmailTemplates" : function(){
		return SvseMethodsOnServer.svGetEmailTemplates();
	}
*/
	"getTrendList":function(id,type){
		Log4js.info("SvseTrendOnServer getTrendList ok!");
		var result = SvseMethodsOnServer.svGetTrendList(id,type);
			console.log(result);		
		if(!result){
		var msg = "SvseMethodsOnServer'getTrendList error !"
			SystemLogger.log(msg,-1);	
				throw new Meteor.Error(500,msg);
		}
			console.log(result);		
		//return SvseMethodsOnServer.svGetTrendList(); 
	}
}
/*
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
*/