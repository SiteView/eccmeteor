var DB = require('../connection/Connection').getConnection();
var CompanyCollection = DB.getCollection('company_entity');
var cache = require("./cache/CompanyEntityDataCache");

var CompanyAndEnityFilter = function(){};

Object.defineProperty(CompanyAndEnityFilter,"doFilter",{
	value:function(records,guid,next){
		var _self = this;

		var guid = records[0].host;//取一条数据的host模拟Guid

		var info = _self.parseCompanyAndEnity(guid);
		
		_self.save(info);//保存设备和公司信息

		records.forEach(function(record){
			for(x in info){
				record[x] = info[x];
			}
		});

		next();
	}
});

//根据guid解析 公司名称(guid)和设备名称(guid)
Object.defineProperty(CompanyAndEnityFilter,"parseCompanyAndEnity",{
	value:function(guid){
		var Guid = require('../utils/Guid');
		return Guid.parse(guid);
	}
});

//存储公司和设备
//应该建立一个缓存池
Object.defineProperty(CompanyAndEnityFilter,"save",{
	value:function(info){
		var companyId = info.companyId;
		var entityId = info.entityId;

		var cacheLevel = cache.isCache(info);

		if(cacheLevel == 2){ //公司和设备存在于缓存因此已经添加过了
			//console.log("worker "+process.pid+" cacheLevel is "+cacheLevel);
			return;
		}

		cache.setCache(info);//设置缓存

		if(cacheLevel == 1){//公司存在于缓存
			CompanyCollection.update(
				{companyId:companyId,entityIds:{$not:{$all:[entityId]}}},
				{$push:{entityIds:entityId}},
				function(error,update){
					if(error){
						//console.log(error)
					}else{
						//console.log("worker "+process.pid+" 通过缓存1更新数据集")
					}
				}
			);
			return;
		}
		//如果缓存不存在 则检查一次数据集
		//console.log("worker "+process.pid+" 无缓存更新")
		CompanyCollection.findOne({companyId:companyId},function(error,find){
			if(error){
				//console.log("CompanyAndEnityFilter  save Error");
				//console.log(error);
				return;
			}
			//console.log(find);
			if(!find){
				//console.log("-----insert--------")
				CompanyCollection.insert(
					{
						companyId:companyId,
						entityIds:[entityId]
					},
					function(error,insert){
						//console.log("插入数据------------------")
						if(error){
							//console.log(error)
						}else{
							//console.log(insert);
						}
						//console.log("------------------")
					}
				)
			}else{
				//console.log("-----find.entityIds--------")
				var flag = false;
				for(x in find.entityIds){
					if(find.entityIds[x] == entityId){
						flag = true;
						break;
					}
				}
				if(flag){
					return;
				}
				//console.log("更新数据------------------")
				CompanyCollection.update(
					{_id:find._id},
					{$push:{entityIds:entityId}},
					function(error,update){
						if(error){
							//console.log(error)
						}else{
							//console.log(update);
						}
					}
				);
				//console.log("更新数据------------------")

			}
		});
	}
});

module.exports = CompanyAndEnityFilter;