SvseEntityTemplateDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addEntity": 
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">add");
				break;
			case "updateEntity":
				flag = Agent.getPermission("nodeOpratePermission>"+args[1].replace(/\./g,"-")+">edit");
			default : flag = true;
		}
		if(!SvseEntityTemplateDao[fn]){
			Agent.error("SvseEntityTemplateDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseEntityTemplateDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}