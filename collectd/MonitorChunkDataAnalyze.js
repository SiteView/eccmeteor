var monitors = require('./monitor/monitors');
var Filter = require('./filter');
var MonitorChunkDataAnalyze = function(){};

Object.defineProperty(MonitorChunkDataAnalyze,"decompose",{
	value:function(records){
		var _self = this;
		_self.decomposeDataBlock(records);
	}
});

//分解数据块 To Array
Object.defineProperty(MonitorChunkDataAnalyze,"decomposeDataBlock",{
	value:function(data){
		var arr = JSON.parse(data);
		var _self = this;
		_self.decomposeRecords(arr)
	}
});

//处理每条数据
Object.defineProperty(MonitorChunkDataAnalyze,"decomposeRecords",{
	value:function(records){
		var _self = this;
		for(var i = 0 ; i < records.length ; i++){
			var monitorType = records[i].type;
			var monitor = _self.getMonitorStandard(monitorType); //标准化工具
			var record = monitor.format(records[i]);//标准化
			_self.doFilter(record);//加工处理
		}
		console.log('=============');
	}
});

//中间件 加工处理
Object.defineProperty(MonitorChunkDataAnalyze,"doFilter",{
	value:function(record){
		Filter.do(record);//中间件
	}
});

//获取监视器处理标准
Object.defineProperty(MonitorChunkDataAnalyze,"getMonitorStandard",{
	value:function(monitorType){
		var monitor = monitors[monitorType];
		if(!monitor){
			monitor =  monitors["other"];
		}
		return monitor;
	}
});

module.exports = MonitorChunkDataAnalyze;