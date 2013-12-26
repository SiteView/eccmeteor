SvseLicenseDaoAgent = {
	"agent" : function(fn , args){
		var flag = true;
		if(!SvseLicenseDaoOnServer[fn]){
			Agent.error("SvseLicenseDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseLicenseDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}