var ClientUtils = {
	"formArrayToObject":function(arr){
		if(!arr ||arr.length == 0)return{};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		return property;
	},
	"objectCoalescence":function(obj1,obj2){
		if(!obj2) return obj1||{};
		if(!obj1) return obj2||{};
		for(property in  obj1){
			obj2[property] = obj1[property];
		}
		return obj2;
	},
	"createInputHiddenDom":function(name,value){
		 var hidden = $("<input type='hidden'/>");
		 hidden.attr("name",name);
		 hidden.val(value);
		 return hidden;
	},
	/**接受td的内容的数组，如数组里面存的是对象，则需要指出需要显示的字段名称。如果未指明则默认显示原始值
		第二个参数为设置参数，数据类型为Object，其中label属性指明需要显示的字段
		如{label:"value"}
	*/
	"creatTrDom":function(tdArray,property){
		var tr = $("<tr></tr>");
		if(!property){ //设置属性不存在
			for(index in tdArray){
				var td = $("<td></td>");
				td.html(JSON.stringify(tdArray[index]));
				tr.append(td);
			}
			return tr;
		}
		//设置属性存在
		var label = property.label;
		for(index in tdArray){
				var td = $("<td></td>");
				td.html(tdArray[index][label]);
				tr.append(td);
		}
		return tr;
	}
}
var ServerUtils ={}

var Utils = {
	"checkReCallFunction":function(fn){
		if(!fn || typeof fn !== "function"){
			fn = function(obj){
				SystemLogger(obj);
			}
		}
		return fn;
	}
}