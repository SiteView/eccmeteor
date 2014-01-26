var DB = require('../connection/Connection').getConnection();
var EntityCollection = DB.getCollection('entity_monitor');
var cache = require("./cache/EntityMonitorDataCache");
var EntityAndMonitorFilter = function(){};

module.exports = EntityAndMonitorFilter;

Object.defineProperty(EntityAndMonitorFilter,"doFilter",{
	value:function(records,guid,next){
		var _self = this;

		var guid = records[0].host;//取一条数据的host模拟Guid

		var enityGuid = _self.parseEnityGuid(guid);
	
		_self.save(enityGuid,records);

		next();
	}
});

//根据guid解析 设备名称guid
Object.defineProperty(EntityAndMonitorFilter,"parseEnityGuid",{
	value:function(guid){
		var Guid = require('../utils/Guid');
		return Guid.parse(guid).entityId;
	}
});
//存储设备和节点关系
//应该建立一个缓存池
Object.defineProperty(EntityAndMonitorFilter,"save",{
	value:function(enityGuid,records){
		var _self = this;
		if(!cache.isCacheEntity(enityGuid)){
			_self.saveEntity(enityGuid,function(){
				_self.saveMonitors(enityGuid,records);
			});
			return ;
		}
		_self.saveMonitors(enityGuid,records);
		
	}
});

Object.defineProperty(EntityAndMonitorFilter,"saveEntity",{
	value:function(enityGuid,fn){
		EntityCollection.findOne({entityId:enityGuid},function(error,find){
			if(find){
				fn();
				return;
			}
			console.log("-----insert Entity--------")
			EntityCollection.insert(
				{
					entityId:enityGuid,
					monitors:[]
				},
				function(error,insert){
					console.log("插入数据------------------")
					if(error){
						console.log(error)
					}else{
						console.log(insert);
						fn();
					}
					console.log("------------------")
				}
			)
		})
	}
});

Object.defineProperty(EntityAndMonitorFilter,"saveMonitors",{
	value:function(enityGuid,records){
		var monitors = {};
		for(var i = 0 ; i < records.length ;i++){
			monitors[records[i].type] = 1;
		}
		var arr = [];
		for(x in monitors){
			arr.push(x)
		}
		console.log(monitors)
		if(cache.isCacheMonitor(enityGuid,arr)){
			console.log("---------======-----------");
			return;
		}
		//,monitors:{$not:{$all:arr}}
		EntityCollection.update(
			{entityId:enityGuid},  
			{$set:{monitors:arr}},
			function(error){
				if(error){
					console.log(error)
				}else{
					console.log("worker "+process.pid+" 通过缓存isCacheMonitor更新数据集")
				}
			}
		);

	}
});