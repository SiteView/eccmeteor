SvseAlertLogDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		/*
		switch(fn){
			default : flag = true;
		}*/
		flag = true;
		if(!SvseAlertLogDaoOnServer[fn]){
			Agent.error("SvseAlertLogDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseAlertLogDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}