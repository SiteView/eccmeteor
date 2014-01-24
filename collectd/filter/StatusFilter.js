//处理数据状态
var StatusFilter = function(){};

Object.defineProperty(StatusFilter,"doFilter",{
	value:function(record,next){
		var _self = this;
		record.status = _self.getRecordStatus(record);
		next();
	}
});


//数据状态。0 表示 warning 。1 表示 ok 正常
Object.defineProperty(StatusFilter,"getRecordStatus",{
	value:function(record){
		/**
			根据此监视器信息获取相关 阀值
			....
		**/
		return 1;
	}
});

module.exports = StatusFilter;