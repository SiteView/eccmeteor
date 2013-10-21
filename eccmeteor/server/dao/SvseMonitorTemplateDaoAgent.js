SvseMonitorTemplateDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "getMonityDynamicPropertyData": 
				flag = true;
				break;
			case "getMonityDynamicPropertyDataArray":
				flag = true;
				break;
			default : flag = true;
		}
		if(!SvseMonitorTemplateDaoOnServer[fn]){
			Agent.error("SvseMonitorTemplateDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseMonitorTemplateDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}