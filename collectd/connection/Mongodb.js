var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/meteor');

var Mongodb = function(){};

Object.defineProperty(Mongodb,"getCollection",{
	value:function(collectionName){
		return  db.collection(collectionName);
	}
});

module.exports =  Mongodb;