SvseTopNDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addTopN": 
				Log4js.info("SvseTopNDaoAgent");
				flag = Agent.getPermission("settingOperatePermission>topN>add");
				break;
			/*
			case "setEmailBasicSetting": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			*/
			case "updateTopN":
				flag = Agent.getPermission("settingOperatePermission>topN>update");
				break;
			case "deleteTopNByIds":
				flag = Agent.getPermission("settingOperatePermission>topN>delete");
				break;
			case "updateTopNStatus":
				flag = Agent.getPermission("settingOperatePermission>topN>update");
				break;
			
			/*case "generatereport": 
				flag = Agent.getPermission("settingOperatePermission>topN>generate");
				break;*/
				
			default : flag = true;
		}
		if(!SvseTopNOnServer[fn]){
			Agent.error("SvseTopNOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTopNOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}
