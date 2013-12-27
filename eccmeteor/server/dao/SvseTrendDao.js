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
