StatisticsReportFactoryTest = function(){};
Object.defineProperty(StatisticsReportFactoryTest,"getRecords",{
	value:function(){
		var factory = new StatisticsReportFactory("333qfB3rDbwPELy7W");
		factory.genaritionReport();
	}
});

Object.defineProperty(StatisticsReportFactoryTest,"test",{
	value:function(){
		StatisticsReportFactoryTest.getRecords();
		//console.log(SvseStatisticalresultlist.find().fetch());{nIndex:reportConfigureId}
		//console.log(SvseStatisticalresultlist.findOne("w8rGbu9BKPMbSMkB7"));

	}
});
/*
*getRecords
{
	"1.9.8.1.1.1":{
		"(Return_0)1.9.8.1.1.1":"ReturnValue",
		"MonitorName":"test2:Ping",
		"errorCondition":"[包成功率(%) == 0]",
		"errorPercent":"0.00",
		"latestCreateTime":"2014-01-07 17:33:25",
		"latestDstr":"包成功率(%)=100.00, 数据往返时间(ms)=0.00, 状态值(200表示成功 300表示出错)=200.00, ",
		"latestStatus":"ok",
		"okPercent":"100.00",
		"warnPercent":"0.00"
	},
	"1.9.8.1.1.2":{
		"(Return_0)1.9.8.1.1.2":"ReturnValue",
		"MonitorName":"test2:Disk",
		"errorCondition":"[Disk使用率(%) > 98]",
		"errorPercent":"0.00",
		"latestCreateTime":"2014-01-07 17:33:25",
		"latestDstr":"Disk使用率(%)=21.96, 剩余空间(MB)=43924.45, 总空间(MB)=56282.38, ",
		"latestStatus":"ok","okPercent":"100.00","warnPercent":"0.00"
	},
	"1.9.8.1.1.3":{
		"(Return_4)1.9.8.1.1.3":"ReturnValue",
		"MonitorName":"test2:Service",
		"errorCondition":"[运行实例个数(个) < 1]",
		"errorPercent":"100.00",
		"latestCreateTime":"2014-01-07 17:33:25",
		"latestDstr":"是否已启动=False, 运行状态=Stopped, 服务状态=OK, 对应的进程名称=NA, 运行实例个数(个)=0, ",
		"latestStatus":"error",
		"okPercent":"0.00",
		"warnPercent":"0.00"
	},
	"1.9.8.1.1.4":{
		"(Return_0)1.9.8.1.1.4":"ReturnValue",
		"MonitorName":"test2:Process",
		"errorCondition":"[进程总数(个) < 1]",
		"errorPercent":"0.00",
		"latestCreateTime":"2014-01-07 17:33:25",
		"latestDstr":"CPU使用率(%)=0.00, 进程总数(个)=2, 线程总数(个)=28, 使用物理内存空间(KB)=43716.00, 物理内存使用率(%)=2.09, 使用虚拟内存空间(KB)=72900.00, 虚拟内存使用率(%)=1.81, ",
		"latestStatus":"ok",
		"okPercent":"100.00",
		"warnPercent":"0.00"
	},
	"1.9.8.1.1.5":{
		"(Return_0)1.9.8.1.1.5":"ReturnValue",
		"(Return_1)1.9.8.1.1.5":"ReturnValue",
		"MonitorName":"test2:Cpu",
		"errorCondition":"[CPU综合使用率(%) >= 98]",
		"errorPercent":"0.00",
		"latestCreateTime":"2014-01-07 17:33:25",
		"latestDstr":"CPU综合使用率(%)=30, CPU详细使用率(%)=CPU0:30, ",
		"latestStatus":"ok","okPercent":"100.00",
		"warnPercent":"0.00"
	},"1.9.8.1.1.6":{"(Return_0)1.9.8.1.1.6":"ReturnValue","(Return_1)1.9.8.1.1.6":"ReturnValue","MonitorName":"test2:Cpu","errorCondition":"[ < 1]","errorPercent":"0.00","latestCreateTime":"2014-01-07 17:33:25","latestDstr":"Error:Set state error","latestStatus":"bad","okPercent":"0.00","warnPercent":"0.00"}}

*/