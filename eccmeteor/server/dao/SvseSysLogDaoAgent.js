SvseSysLogDaoAgent = {
        "agent" : function(fn , args){
                var flag = false;
                 switch(fn){
                        case "DeleteRecordsByIds":
							 flag = Agent.getPermission("settingOperatePermission>SysLogsetting>delete");
                        default : flag = true;
                } 
                flag = true;
                if(!SvseSysLogDaoOnServer[fn]){
                        Agent.error("SvseSysLogDaoOnServer",fn);
                        return Agent.getReturn();
                }
                return flag ? SvseSysLogDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
        }
}