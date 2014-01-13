var MonitorInformation = function(){};

//根据监视器信息重新封装数据
/*
警报来自SiteView。
监测器:		@Group@ : @monitor@   
组:		@AllGroup@  
状态:		@Status@ 
时间:		@Time@ 

--对应格式

警报来自SiteView。
监测器:	 192.168.1.124(Windows) : Ping   
组:	 SiteView ECC 8.8 : PC设备 :   
状态:	 ERROR 
时间:	 2014-01-08 17:14:03 

阀值       包成功率(%)==0
*/

//获取监视器数据
Object.defineProperty(MonitorInformation,"getMonitorInformation",{
	value:function(){
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
		//console.log(fmap);
		var monitors = [];
		for(f in fmap){
			if(fmap[f]["type"] == "monitor"){
				monitors.push(fmap[f]);
			}
		}
		return monitors;
	}
});

//判断监视器信息的状态
Object.defineProperty(MonitorInformation,"checkMonitorStatus"{
	value:function(monitorId){
		var monitors = this.getMonitorInformation();
		for(m in monitors){
			if(monitorId == monitors[m]["sv_id"]){
				console.log(monitors[m]["status"]);
			}
		}
	}
});

module.exports = MonitorInformation;