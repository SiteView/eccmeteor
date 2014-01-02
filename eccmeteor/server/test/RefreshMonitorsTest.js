RefreshMonitorsTest = function(){};
Object.defineProperty(RefreshMonitorsTest,"test",{
	value:function(){
		var dowhat ={'dowhat':'RefreshMonitors',id:"1.9.9.1.1,1.9.9.1.3",parentid:"1.9.9.1",instantReturn:true};
		var robj= process.sv_univ(dowhat, 0);

		var fmap = robj.fmap(0);
		var result = fmap["return"];
		console.log("queueFmap:");
		console.log(result);
		if(!result || result["return"] != "true"){
			console.log("refresh fail");
			return null;
		}
		var queueName = result["queueName"];
		var dowhat ={'dowhat':'GetLatestRefresh','queueName':queueName};
		var flag = false;
		var queueFmap = null;
		while(!flag){
			var queueRobj= process.sv_univ(dowhat, 0);
			queueFmap = queueRobj.fmap(0);
			// { return: { return: 'false' } }
			flag = queueFmap["return"]["return"] == "true" ? true : false ;
		}
		console.log("queueFmap:");
		console.log(EJSON.stringify(queueFmap));
	}
});

/*
  Normal data 
 id:"1.9.9.1.5",parentid:"1.9.9.1",
 { return: { queueName: '50622013123111629_RefreshBack', return: 'true' } }

 	id:"1.9.9.1.1",parentid:"1.9.9.1"
 { return: { queueName: '51492013123111733_RefreshBack', return: 'true' } }

	id:"1.9.9.1.1,1.9.9.1.5",parentid:"1.9.9.1"
	{ return: { queueName: '53542013123111833_RefreshBack', return: 'true' } }

Error data:
 	id:"1.9.9.1",parentid:"1.9.9.1.5"
 	{ return: { return: 'false' } }


RefreshData

 id:"1.9.9.1.4,",parentid:"1.9.9.1"
 var dowhat ={'dowhat':'GetLatestRefresh','queueName':queueName};
 {	"RefreshData":{
 		"KLS_seconds":"3750",
 		"KLS_times":"4",
 		"creat_time":"2013-12-31 11:26:31",
 		"creat_timeb":"2013-12-31 10:25:33",
 		"dstr":"Disk使用率(%)=78.77, 剩余空间(MB)=4246.13, 总空间(MB)=20002.77, ",
 		"has_son":"false",
 		"status":"ok",
 		"status_disable":"ok",
 		"sv_dependson":"","sv_disable":"",
 		"sv_endtime":"",
 		"sv_id":"1.9.9.1.4",
 		"sv_intpos":"1",
 		"sv_monitortype":"11","sv_name":"Disk","sv_starttime":"",
 		"type":"monitor"
 	},
 	"return":{
 		"return":"true"
 	}
 }

id:"1.9.9.1.4,1.9.9.1.3",parentid:"1.9.9.1"
{	"RefreshData":{
 		"KLS_seconds":"5028","KLS_times":"18",
 		"creat_time":"2013-12-31 11:27:08",
 		"creat_timeb":"2013-12-31 10:06:44",
 		"dstr":"包成功率(%)=100.00, 数据往返时间(ms)=0.00, 状态值(200表示成功 300表示出错)=200.00, ",
 		"has_son":"false","status":"ok",
 		"status_disable":"ok","sv_dependson":"",
 		"sv_disable":"","sv_endtime":"",
 		"sv_id":"1.9.9.1.3","sv_intpos":"1",
 		"sv_monitortype":"5",
 		"sv_name":"Ping"
 		,"sv_starttime":"","type":"monitor"
 	},
 	"return":{
 		"return":"true"
 	}
}

 */