var DB = require('../connection/Connection').getConnection();
var monitorCollection = DB.getCollection('monitor_data');
var SaveMonitorFilter = function(){};
Object.defineProperty(SaveMonitorFilter,"doFilter",{
	value:function(records,guid,next){
		monitorCollection.insert(records,function(err,item){
			if(err){
				console.log(err);
				return;
			}
			console.log("insert");
		});
		next();
	}
});
module.exports = SaveMonitorFilter;