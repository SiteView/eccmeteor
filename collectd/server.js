var http = require("http");
var MonitorChunkDataAnalyze = require("./MonitorChunkDataAnalyze");

http.createServer(function(request,response){
	var data = [];
	request.on("data",function(chunk){
		data.push(chunk);
	});
	request.on("end",function(){
		var str = Buffer.concat(data).toString();
		MonitorChunkDataAnalyze.decompose(str);
		response.end();
	});
}).listen(1337);