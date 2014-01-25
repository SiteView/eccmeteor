var cluster = require('cluster');
var numCpus = require('os').cpus().length;
//node v0.11
//cluster.schedulingPolicy = cluster.SHED_RR    //open Round-Robin
//cluster.schedulingPolicy = cluster.NONE  //close Round-Robin
cluster.setupMaster({
	exec : "server.js"
});

var limit = 10;//60秒内超过10次重启则放弃
var during = 60000; //60秒内超过10次重启则放弃
var restart = [];
var isToolFrequently = function(){
	var time = Date.now();
	var length = restart.push(time);
	if(length > limit){
		restart = restart.slice(limit*-1);
	}
	return restart.length >= limit && restart[restart.length - 1] - restart[0] < during;
}

var createWorker = function(){
	if(isToolFrequently()){
		return;
	}
	cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
    console.log('worker %d died (%s).',worker.process.pid, signal || code);
    if (worker.suicide === true) {
   	 	console.log('Oh, it was just suicide\' – no need to worry .restarting....');
  	}else{
  		console.log('Oh, it was WARNING! now restarting....');
  	}
  	createWorker()
});
/*
cluster.on('disconnect', function(worker) {
  	console.log('The worker #' + worker.id + ' has disconnected');
});
*/
cluster.on('listening', function(worker, address) {
  	console.log("A worker  pid "+worker.process.pid+" id : "+worker.id+ " is now connected to " + address.address + ":" + address.port);
});
/*
//online 和listening事件在fork后都会触发。但是oline先触发。 在server准备好可以接受消息时listening触发
cluster.on('online', function(worker) {
  	console.log("Yay, the worker pid "+worker.process.pid+" id : "+worker.id+ "responded after it was forked");
});
*/
for(var i = 0; i < numCpus;i++){
	createWorker();
}
