SvseMonitorDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addMonitor": 
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">addMonitor");
				break;
			case "editMonitor":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">editMonitor");
				break;
			case "deleteMonitor":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">deleteMonitor");
				break;
			case "addMultiMonitor":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">addMonitor");
				break;
			case "deleteMultMonitors":
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