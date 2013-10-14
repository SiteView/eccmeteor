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
			case "updateTopNsStatus":
				flag = Agent.getPermission("settingOperatePermission>TopN>update");
				break;
			case "sync":
				flag = Agent.getPermission("settingOperatePermission>TopN>sync");
				break;
			case "updateTopN":
				flag = Agent.getPermission("settingOperatePermission>TopN>update");
				break;
			
			default : flag = true;
		}
		if(!SvseTopNDao[fn]){
			Agent.error("SvseTopNDao",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTopNDao[fn].apply(undefined,args) : Agent.getReturn();
	}
}