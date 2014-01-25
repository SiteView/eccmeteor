var http = require("http");
var MonitorChunkDataAnalyze = require("./MonitorChunkDataAnalyze");

http.createServer(function(request,response){
	var data = [];
	//需要增加判断数据来源是否合法
	// ....
	/*
	request.headers:
		user-agent:collectd/5.4.0
		host:192.168.9.52:1337
		accept: *\/*
		content-type:application/json
		content-length:4004
	*/
	request.on("data",function(chunk){
		data.push(chunk);
	});
	request.on("end",function(){
		var str = Buffer.concat(data).toString();
		MonitorChunkDataAnalyze.decompose({content:str,guid:""});
		response.end();
	});
}).listen(1337);//1337  3000

process.on('uncaughtException',function(err){
	console.log(err);
	server.close(function(){
		process.exit(1);
	});
});