//数据标准化
var Standard = function(){};

Object.defineProperty(Standard,"format",{
	value:function(obj,setting){
		var _self = this;
		var b = new Date();
		b.setTime(obj.time * 1000);
		obj.value =  _self.exceptionToNormal(obj.values[0]);
		obj.recordDate = b;
		return obj;
	}
});

Object.defineProperty(Standard,"exceptionToNormal",{
	value:function(value,setting){
		if(!setting){
			return value ? value : 0;
		}
		var max = setting.max;
		var min = setting.min;
		if(max){
			value = value > max ? max : value;
		}
		if(min){
			value = value < min ? min : value;
		}
		return value;
	}
});

module.exports = Standard;