var Memory = function(){};
var Standard = require('./standard');

Object.defineProperty(Memory,"getSetting",{
	value:function(){
		return {
			unit:"MB",
			div:1024*1024,
			fixed:2
		};
	}
});

Object.defineProperty(Memory,"format",{
	value:function(obj){
		var _self = this;
		return Standard.format(obj,_self.getSetting());
	}
});

module.exports = Memory;