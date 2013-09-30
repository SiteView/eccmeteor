SvseTopNeDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "setTopNOfReport":
				flag = Agent.getPermission("settingOperatePermission>TopN>add");
				break;
			case "deleteTopNs":
				flag = Agent.getPermission("settingOperatePermission>TopN>delete");
				break;
			
			default : flag = true;
		}
		if(!SvseWarnerRuleDao[fn]){
			Agent.error("SvseTopNDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTopNDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}