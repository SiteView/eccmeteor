SvseSysLogDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		/* switch(fn){
			case "addMessage": 
				flag = Agent.getPermission("settingOperatePermission>messagesetting>add");
				break;
			
			case "setMessageBasicSetting": 
				flag = Agent.getPermission("settingOperatePermission>messagesetting>add");
				break;
			
			case "updateMessage":
				flag = Agent.getPermission("settingOperatePermission>messagesetting>update");
				break;
			case "deleteMessageByIds":
				flag = Agent.getPermission("settingOperatePermission>messagesetting>delete");
				break;
			case "updateMessageStatus":
				flag = Agent.getPermission("settingOperatePermission>messagesetting>update");
				break;
			
			case "sync": 
				flag = Agent.getPermission("settingOperatePermission>messagesetting>sync");
				break;
			default : flag = true;
		} */
		flag = true;
		if(!SvseSysLogDaoOnServer[fn]){
			Agent.error("SvseSysLogDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseSysLogDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}