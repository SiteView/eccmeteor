var Cache = {};
var LastCache = {};
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
		var _self = this;
		return _self.compareCache(info);
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
		LastCache[companyId] = 1;
		LastCache[entityId] =1;
	}
});

Object.defineProperty(CompanyEntityDataCache,"compareCache",{
	value:function(info){
		var _self = this;
		var companyId = info.companyId;
		var entityId = info.entityId;
		var isLastCache =  _self.compareLastCache(companyId,entityId); 
		return isLastCache || _self.compareEntiretyCache(companyId,entityId)
	}
});

Object.defineProperty(CompanyEntityDataCache,"compareEntiretyCache",{
	value:function(companyId,entityId){
		if(!(companyId in Cache)){ //缓存
			return 0;
		}
		if(!(entityId in Cache[companyId])){
			return 1
		}
		return 2
	}
});

Object.defineProperty(CompanyEntityDataCache,"compareLastCache",{
	value:function(companyId,entityId){
		if((companyId in LastCache)&&(entityId in LastCache)){
			return 2;
		}
		return 0;
	}
})


module.exports = CompanyEntityDataCache;