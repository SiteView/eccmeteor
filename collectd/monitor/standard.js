//一般数据标准化
var Standard = function(){};

/**
	setting  type:Object
		unit: string 设置单位  可选
		max:  number 最大值，一旦数据(数值计算后)超过最大值 则给它赋值最大值 可选
		min:  number 最小值,一旦数据(数值计算后)少于最小值 则给它赋值最小值 可选
		mul:  number 把数据扩大n倍(n>0) 可选  默认1
		div:  number 把数据缩小n(n>0)倍 可选  默认1
		fixed: number 有效小数(n>=0) 默认不处理
*/

Object.defineProperty(Standard,"format",{
	value:function(obj,setting){
		var _self = this;
		var b = new Date();
		b.setTime(obj.time * 1000);
		obj.value =  _self.exceptionToNormal(obj.values[0],setting);
		obj.recordDate = b;
		obj.unit = _self.getUnit(setting);
		return obj;
	}
});

Object.defineProperty(Standard,"exceptionToNormal",{
	value:function(value,setting){
		if(!setting){
			return value;
		}

		if(typeof setting.mul === 'number' && setting.mul > 0){
			value = value * setting.mul;
		}

		if(typeof setting.div === 'number' && setting.div > 0){
			value = value / setting.div;
		}

		var max = setting.max;
		var min = setting.min;
		if(typeof max === "number"){
			value = value > max ? max : value;
		}
		if(typeof min === "number"){
			value = value < min ? min : value;
		}
		if(typeof setting.fixed === "number" && (!(setting.fixed < 0)) ){
			value = value.toFixed(setting.fixed);
		}
		return value;
	}
});

Object.defineProperty(Standard,"getUnit",{
	value:function(setting){
		if(setting){
			return setting.unit ? setting.unit :"";
		}
		return "";
		
	}
});

module.exports = Standard;