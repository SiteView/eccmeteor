var Standard = require('./standard');
var CPU = function(){};

Object.defineProperty(CPU,"format",{
	value:function(obj){
		return Standard.format(obj,{unit:"%",div:10000,fixed:2});
	}
});

module.exports = CPU;