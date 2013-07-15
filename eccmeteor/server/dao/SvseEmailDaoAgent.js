SvseEmailDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		switch(fn){
			case "addEmailAddress": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			/*
			case "setEmailBasicSetting": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>add");
				break;
			*/
			case "updateEmailAddress":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>update");
				break;
			case "deleteEmailAddressByIds":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>delete");
				break;
			case "updateEmailAddressStatus":
				flag = Agent.getPermission("settingOperatePermission>emailsetting>update");
				break;
			/*
			case "sync": 
				flag = Agent.getPermission("settingOperatePermission>emailsetting>sync");
				break;
			*/	
			default : flag = true;
		}
		if(!SvseEmailDaoOnServer[fn]){
			Agent.error("SvseEmailDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseEmailDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}