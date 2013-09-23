Utils = {
	"checkReCallFunction":function(fn){
		if(!fn || typeof fn !== "function"){
			fn = function(obj){
				SystemLogger(obj);
			}
		}
		return fn;
	},
	"compareArray" : function (original,target) {//比较两个数组，如果数组相同返回false;如果不同，返回数组变化情况。以对象描述
		if(typeof original === "undefined" && typeof target === "undefined") 
			return false;
		var changeObj =  {};
		if(!original && target){
			changeObj["push"] = target;
			return changeObj;
		}
		if(original && !target){
			changeObj["pop"] = original;
			return changeObj;
		}
		
		var oriLength = original.length;
		var tarLength = target.length;
		changeObj["push"] = [];
		changeObj["pop"] = [];
		for(x=0;x<oriLength;x++){
			var flag = false;
			for(y=0;y<tarLength;y++){
				if(original[x] === target[y]){
					flag = true;
					break;
				}
			}
			if(flag) continue;
			changeObj["pop"].push(original[x]);		
		}
		for(i=0;i<tarLength;i++){
			var flag = false;
			for(j=0;j<oriLength;j++){
				if(original[j] === target[i]){
					flag = true;
					break;
				}
			}
			if(flag) continue;
			changeObj["push"].push(target[i]);		
		}
		
		if(changeObj["push"].length === 0 && changeObj["pop"].length === 0){
			return false;
		}
		return changeObj;
	},
	
	/**
		比较两个对象
		exception代表例外的属性 格式是 {name:true,age:true} 
		表示忽略两个对象的name和age属性比较
	*/
	compareObject : function(original,target,exception){ 
		for (property in original){
			if(exception && exception[property]) continue;
			if(original[property] !== target[property]){
				return false;
			}			
		}
		return true;
	},
	//获取惟一标识符
	getUUID : function(){
		var  _rnds = new Array(16);
		var rnds = (function() {
			for (var i = 0, r; i < 16; i++) {
				if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
				_rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
			}
			return _rnds;
		})();
		rnds[6] = (rnds[6] & 0x0f) | 0x40;
		rnds[8] = (rnds[8] & 0x3f) | 0x80;
		var _byteToHex = [];
		for (var i = 0; i < 256; i++) {
			_byteToHex[i] = (i + 0x100).toString(16).substr(1);
		}
		var d = (function(buf) {
			var i = 0;
			var bth = _byteToHex;
			return  bth[buf[i++]] + bth[buf[i++]] +
					bth[buf[i++]] + bth[buf[i++]] + '-' +
					bth[buf[i++]] + bth[buf[i++]] + '-' +
					bth[buf[i++]] + bth[buf[i++]] + '-' +
					bth[buf[i++]] + bth[buf[i++]] + '-' +
					bth[buf[i++]] + bth[buf[i++]] +
					bth[buf[i++]] + bth[buf[i++]] +
					bth[buf[i++]] + bth[buf[i++]];
		})(rnds);
		return d;
	}
}
