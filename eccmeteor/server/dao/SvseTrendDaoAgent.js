SvseTrendDaoAgent = {
	"agent":function(fn,args){
		Log4js.info("SvseTrendDaoAgent");
		console.log("SvseTrendDaoAgent");
		var flag = false;	
		if(!SvseTrendOnServer[fn]){
			Agent.error("SvseTrendOnServer",fn);
			return Agent.getReturn();
		}	
		return flag ? SvseTrendOnServer[fn].apply(undefined,args) : Agent.getReturn();		
	}
}