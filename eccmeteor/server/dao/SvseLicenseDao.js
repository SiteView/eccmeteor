SvseLicenseDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"getLicenselist" : function(){
		
		return SvseMethodsOnServer.svGetLicenselist();
	}
	
	/*"getLicenselist":function(usedPoint){
		Log4js.info("SvseLicenseDaoOnServer getLicenselist ok!");
		var result = SvseMethodsOnServer.svGetLicenselist(usedPoint);
	
		if(!result){
		var msg = "SvseMethodsOnServer'getLicenselist error !"
			SystemLogger.log(msg,-1);	
				throw new Meteor.Error(500,msg);
		}
			console.log(result);		
	}*/
}