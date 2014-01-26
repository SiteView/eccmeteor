var Cache = {};

/*
*{
	__count__:0, //count > 100 大于100时清理一部分缓存 算法?
	"entityIds":{
		"monitorsmonitorType":1
	},
	"entityIds":{
		"monitorsmonitorType":1
	}
}
*/
var EntityMonitorDataCache = function(){};

Object.defineProperty(EntityMonitorDataCache,"isCacheEntity",{
	value:function(entityId){
		if(entityId in Cache){
			return true;
		}
		Cache[entityId] = [];
	}
});


Object.defineProperty(EntityMonitorDataCache,"isCacheMonitor",{
	value:function(entityId,monitorArr){
		var cacheArr = Cache[entityId];
		if(cacheArr.length != monitorArr.length){
			return false;
		}
		if(cacheArr.length == monitorArr.length && cacheArr.length == 0){
			return true;
		}
		var isCache = true;
		for(var i = 0; i < cacheArr.length ; i++ ){
			var flag = false;
			for(var j = 0; j < monitorArr.length ; j++ ){
				if(cacheArr[i] === monitorArr[j]){
					flag = true;
					break;
				}
			}
			if(!flag){
				isCache = false;
				break;
			}
		}
		if(isCache){
			return true;
		}
		cacheArr[entityId] = monitorArr;
		return false;
	}
});

Object.defineProperty(EntityMonitorDataCache,"setCache",{
	value:function(entityId,monitorType){
		if(entityId in Cache){
			Cache[entityId][monitorType] = 1;
		}else{
			var newCache = {};
			newCache[monitorType] = 1;
			Cache[entityId] = newCache;
		}
		LastCache[entityId] = 1;
		LastCache[monitorType] =1;
	}
});



module.exports = EntityMonitorDataCache;