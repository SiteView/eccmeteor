UserDaoAgent = {
	"agent" : function(fn , args){
		console.log(fn);
		var flag = false;
		switch(fn){
			case "register": 
				flag = Agent.getPermission("settingOperatePermission>usersetting>add");
				break;
			case "setNodeDisplayPermission":
				flag = Agent.getPermission("settingOperatePermission>usersetting>updatePermission");
				break;
			case "setSettingNodeDisplayPermission":
				flag = Agent.getPermission("settingOperatePermission>usersetting>updatePermission");
				break;
			case "setNodeOpratePermission":
				flag = Agent.getPermission("settingOperatePermission>usersetting>updatePermission");
				break;
			case "deleteUser":
				flag = Agent.getPermission("settingOperatePermission>usersetting>delete");
				break;
			case "resetPassword":
				flag = Agent.getPermission("settingOperatePermission>usersetting>updatePassword");
				break;
			case "forbid":
				flag = Agent.getPermission("settingOperatePermission>usersetting>updateStatus");
				break;
			default : flag = false;
		}
		return flag ? UserDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}