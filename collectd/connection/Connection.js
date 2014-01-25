var Connection = function(){};

var Mongodb = require('./Mongodb');

Object.defineProperty(Connection,"getConnection",{
	value:function(){
		return Mongodb;
	}
});

module.exports =  Connection;