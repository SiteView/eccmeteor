SvseEntityTemplateDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addEmailAddress": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			default : flag = true;
		}
		if(!SvseEntityTemplateDao[fn]){
			Agent.error("SvseEntityTemplateDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseEntityTemplateDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}