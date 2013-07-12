SvseMonitorDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addMonitor": 
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">addMonitor");
				break;
			case "editMonitor":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">addGroup");
				break;
			case "deleteMonitor":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">deleteMonitor");
				break;
			default : flag = true;
		}
		if(!SvseMonitorDaoOnServer[fn]){
			Agent.error("SvseMonitorDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseMonitorDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}