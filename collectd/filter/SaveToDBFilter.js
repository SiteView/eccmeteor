var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/meteor');
var monitor = db.collection('monitor');
var SaveToDb = function(){};
Object.defineProperty(SaveToDb,"doFilter",{
	value:function(records,next){
		monitor.insert(records,function(err,item){
			if(err){
				console.log(err);
				return;
			}
			console.log("insert");
			console.log(item);
		});
		next();
	}
});
module.exports = SaveToDb;