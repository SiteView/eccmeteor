var ClientUtils = {
	"formArrayToObject":function(arr){
		if(!arr ||arr.length == 0)return{};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		return property;
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