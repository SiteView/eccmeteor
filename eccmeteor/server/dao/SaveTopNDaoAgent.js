SvseTopNDaoAgent = {
	"agent" : function(fn , args){
		Log4js.info("SvseTopNDaoAgent");
		console.log("SvseTopNDaoAgent");
		var flag = false;
		switch(fn){
			case "addTopN":
			Log4js.info("SvseTopNDaoAgent");
				flag = Agent.getPermission("settingOperatePermission>TopN>add");
				break;
			case "deleteTopNByIds":
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
		if(!SvseTopNOnServer[fn]){
			Agent.error("SvseTopNOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTopNOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}
