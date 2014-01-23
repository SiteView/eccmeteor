var Standard = require('./standard');
var CPU = function(){};

Object.defineProperty(CPU,"format",{
	value:function(obj){
		return Standard.format(obj);
	}
});

module.exports = CPU;