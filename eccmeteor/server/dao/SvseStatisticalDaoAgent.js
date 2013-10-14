SvseStatisticalDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addStatistical": 
				flag = Agent.getPermission("settingOperatePermission>addStatistical>add");
				break;
			/*
			case "setEmailBasicSetting": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			*/
			case "updateStatistical":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>update");
				break;
			case "deleteStatisticalByIds":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>delete");
				break;
			case "updateStatisticalStatus":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>update");
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