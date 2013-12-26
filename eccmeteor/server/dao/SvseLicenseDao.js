SvseLicenseDaoOnServer = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"getLicenselist" : function(){
		return SvseMethodsOnServer.svGetLicenselist();
	},
		"getMessageTemplates" : function(){
		return SvseMethodsOnServer.svGetMessageTemplates();
	},
}