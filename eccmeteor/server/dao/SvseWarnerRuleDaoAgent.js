SvseWarnerRuleDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "setWarnerRuleOfEmail":
				flag = Agent.getPermission("settingOperatePermission>warnerrule>add");
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
			default : flag = true;
		}
		if(!SvseWarnerRuleDao[fn]){
			Agent.error("SvseWarnerRuleDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseWarnerRuleDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}