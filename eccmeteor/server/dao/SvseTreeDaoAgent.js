SvseTreeDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		/*
		switch(fn){
			default : flag = true;
		}*/
		flag = true;
		if(!SvseTreeDaoOnServer[fn]){
			Agent.error("SvseTreeDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseTreeDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}