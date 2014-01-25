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
	value:function(chunkData){
		var data = chunkData.content;
		var guid = chunkData.guid;
		var records = JSON.parse(data);
		var _self = this;
		_self.decomposeRecords(records,guid)
	}
});

//处理每条数据
Object.defineProperty(MonitorChunkDataAnalyze,"decomposeRecords",{
	value:function(records,guid){
		var _self = this;
		var formatRecords = [];
		for(var i = 0 ; i < records.length ; i++){
			var monitorType = records[i].type;
			var monitor = _self.getMonitorStandard(monitorType); //标准化工具
			var record = monitor.format(records[i]);//标准化
			formatRecords.push(record);//加工处理
		}
		_self.doFilter(formatRecords,guid);//加工处理
		console.log('=============');
	}
});

//中间件 加工处理
Object.defineProperty(MonitorChunkDataAnalyze,"doFilter",{
	value:function(records,guid){
		Filter.do(records,guid);//中间件
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