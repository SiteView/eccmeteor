SvseTaskDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addtaskabsolute":
				flag = Agent.getPermission("settingOperatePermission>task>add");
				break;
			case "deleteWarnerRules":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>delete");
				break;
			case "updateWarnerRulesStatus":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>update");
				break;
			case "sync":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>sync");
				break;
			case "updateWarnerRule":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>update");
				break;
			case "setWarnerRuleOfMessage":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>add");
				break;
			default : flag = true;
		}
		if(!SvseTaskDao[fn]){
			Agent.error("SvseTaskDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTaskDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}