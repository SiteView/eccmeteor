SvseContrastDaoAgent = {
	"agent" : function(fn , args){
		var flag = false;
		/*
		switch(fn){
			default : flag = true;
		}*/
		flag = true;
		if(!SvseContrastDaoOnServer[fn]){
			Agent.error("SvseContrastDaoOnServer",fn);
			return Agent.getReturn();
		}
		return flag ? SvseContrastDaoOnServer[fn].apply(undefined,args) : Agent.getReturn();
	}
}