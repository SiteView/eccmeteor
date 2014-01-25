var Cache = {};
/*
*{
	__count__:0, //count > 100 大于100时清理一部分缓存 算法?
	"companyID1":{
		"entityId":1
	},
	"companyID2":{
	
	}
}
*/
var CompanyEntityDataCache = function(){};
/*
return 
	0:没有任何缓存
	1:缓存公司
	2:缓存公司和设备
*/
Object.defineProperty(CompanyEntityDataCache,"isCache",{
	value:function(info){
		var companyId = info.companyId;
		var entityId = info.entityId;
		if(!(companyId in Cache)){ //缓存
			return 0;
		}
		if(!(entityId in Cache[companyId])){
			return 1
		}
		return 2
	}
});

Object.defineProperty(CompanyEntityDataCache,"setCache",{
	value:function(info){
		var companyId = info.companyId;
		var entityId = info.entityId;
		if(companyId in Cache){
			Cache[companyId][entityId] = 1;
		}else{
			var newCache = {};
			newCache[entityId] = 1;
			Cache[companyId] = newCache;
		}
	}
});


module.exports = CompanyEntityDataCache;