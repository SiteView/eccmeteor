SvseDaoAgent = {	"agent" : function(fn , args){		var flag = false;		switch(fn){			case "removeNodesById": 				flag = Agent.getPermission("nodeOpratePermission>"+args[0].replace(/\./g,"-")+">delete");				break;			default : flag = true;		}		if(!SvseDaoOnServer[fn]){			Agent.error("SvseDaoOnServer",fn);			return Agent.getReturn();		}			return flag ? SvseDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();	}}