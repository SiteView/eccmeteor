//处理数据状态
var StatusFilter = function(){};

Object.defineProperty(StatusFilter,"doFilter",{
	value:function(records,guid,next){
		var _self = this;
		_self.getRecordStatus(records);
		next();
	}
});


//数据状态。0 表示 warning 。1 表示 ok 正常
Object.defineProperty(StatusFilter,"getRecordStatus",{
	value:function(records){
		/**
			根据此监视器信息获取相关 阀值
			....
		**/
		if(!records.length){
			return;
		}
		records.forEach(function(record){
			record["status"] = 1
		});
	}
});

module.exports = StatusFilter;