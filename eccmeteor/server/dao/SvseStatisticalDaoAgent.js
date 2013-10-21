SvseStatisticalDaoAgent = {
	"agent" : function(fn , args){
		Log4js.info("SvseStatisticalDaoAgent");
		console.log("SvseStatisticalDaoAgent");
		var flag = false;
		switch(fn){
			case "addStatistical": 
				Log4js.info("SvseStatisticalDaoAgent");
				flag = Agent.getPermission("settingOperatePermission>statistical>add");
				break;
			/*
			case "setEmailBasicSetting": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			*/
			case "updateStatistical":
				flag = Agent.getPermission("settingOperatePermission>statistical>update");
				break;
			case "deleteStatisticalByIds":
				flag = Agent.getPermission("settingOperatePermission>statistical>delete");
				break;
			case "updateStatisticalStatus":
				flag = Agent.getPermission("settingOperatePermission>statistical>update");
				break;
			/*
			case "sync": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>sync");
				break;
			*/	
			default : flag = true;
		}
		if(!SvseStatisticalOnServer[fn]){
			Agent.error("SvseStatisticalOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseStatisticalOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}