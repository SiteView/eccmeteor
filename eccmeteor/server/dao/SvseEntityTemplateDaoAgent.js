SvseEntityTemplateDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addEntity": 
				flag = Agent.getEquipmentsOpratePermission(args[0],Agent._PermissionType.addEntity);
				break;
			case "updateEntity":
				flag =  Agent.getEquipmentsOpratePermission(args[0],Agent._PermissionType.edit);
			default : flag = true;
		}
		if(!SvseEntityTemplateDao[fn]){
			Agent.error("SvseEntityTemplateDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseEntityTemplateDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}