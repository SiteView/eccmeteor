SvseEmailDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "removeNodesById": 
				flag = Agent.getPermission("nodeOpratePermission>"+args[0].replace(/\./g,"-")+">delete");
				break;
			default : flag = true;
		}
		if(!SvseEmailDaoOnServer[fn]){
			Agent.error("SvseEmailDaoAgent",fn);
			return Agent.getReturn();
		}
		return flag ? SvseEmailDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}