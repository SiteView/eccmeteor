process.sv_init(); //sv的初始化
var MonitorInfo = require('../MonitorInformation');

var MonitorInfoTest = function(){};
//测试获取的监视器数据
Object.defineProperty(MonitorInfoTest,"getInfo",{
	value:function(parentid){
		if(typeof parentid === "undefined")
			parentid = "default";
		var dowhat = {
			'dowhat' : 'GetTreeData',
			'parentid' : parentid,
			'onlySon':false
		}
		var robj = process.sv_forest(dowhat, 0);
		if(!robj.isok(0)){
			return;
		}
		var fmap = robj.fmap(0);
		console.log(fmap);
		// for(i in fmap){
			// console.log(i);
		// }
	}
});


MonitorInfoTest.getInfo("1.27.1");