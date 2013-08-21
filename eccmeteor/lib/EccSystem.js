EccSystem = {
	/**
	*定义获取npm模块的方法,参数为模块名称
	**/
	require : function(modulname){
		if (Meteor.isClient) {
			var detail = "EccSystem.require can't be called in Client,just on Server";
			var reason = "require " + modulname + " failed";
			throw new Meteor.Error(500,reason,detail);
		}
		return Npm.require(modulname);
	}
};
