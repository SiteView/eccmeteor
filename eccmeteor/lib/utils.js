ClientUtils = {
	"formArrayToObject":function(arr){
		if(!arr ||arr.length == 0)return{};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
		return property;
	},
	"statusFormToObj" : function(arr){
		if(!arr ||arr.length == 0)return{};
		var property ={};
		for(index in arr){
			property[arr[index]["name"]] = arr[index]["value"];
		}
	    var objArr = [];
		var robj = {};
		for(name in property){
			if(name.indexOf("sv_paramname") === -1) continue;
			var i = +name.substr(12);
			var obj = {};
				obj["sv_paramname"] = property[name];
				obj["sv_operate"] =  property["sv_operate"+i];
				obj["sv_paramvalue"] =  property["sv_paramvalue"+i];
				obj["sv_relation"] =  property["sv_relation"+i];
				objArr.push(obj);
		}	
		if(objArr.length === 1 || objArr === 0){
			robj["sv_expression"] = 1;
		}else{
			robj["sv_expression"] = "1#"+objArr[objArr.length-2]["sv_relation"]+"2#";
		}
		robj["sv_conditioncount"] = objArr.length;
		for (j=1;j< robj["sv_conditioncount"]+1;j++){
		    var tobj = objArr[j-1];
			robj["sv_paramname"+j] = tobj["sv_paramname"];
			robj["sv_operate"+j] = tobj["sv_operate"];
			robj["sv_paramvalue"+j] = tobj["sv_paramvalue"];
			if(tobj["sv_relation"]){
				robj["sv_relation"+j] = tobj["sv_relation"];
			}
		}
		return robj;
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
	},
	/**
	参数 obj 需要进行属性删除的对象
	参数 attributes 参数数组  Array[string]
	参数flag      为true则表示保留obj中的attributes属性删除其他，否则是删除obj中的attributes属性，保留其他，默认为true*/
	"deleteAttributeFromObject" : function(obj,attributes,flag){
		if(typeof flag === "undefined")
			flag = true;
		if(flag){
			for(attr in obj){
				var status = false;
				for(index in attributes){
					if(attr.indexOf(attributes[index]) != -1){
						status = true; //保留该属性
						break;
					}
				}
				if(!status){//如果为非保留属性
					delete(obj[attr]);
				}
			}
		}else{
			for(attr in obj){
				for(index in attributes){
					if(attr.indexOf(attributes[index]) != -1){
						//该属性存在，则删除
						delete(obj[attr]);
						break;
					}
				}
			}
		}
		return obj
	},
	/**
		将日期转对象格式，如 2013-06-05 12:30:00转成{year:2013,month:06,day:04,hour:12,minute:30,second:0}对象形式
	*/
	'dateToObject':function(date){
		return {
			year:date.getFullYear(),
			month:date.getMonth() + 1,
			day:date.getDate(),
			hour:date.getHours(),
			minute:date.getMinutes(),
			second:date.getSeconds()
		}
	},
	'expandTreeNode' : function(zNode,expandnodeids){ //处理导航树的节点 展开的数据
		var branch = [];
			if(!expandnodeids.length) return zNode;
			for(index in expandnodeids){
				if(expandnodeids[index] == zNode.id){
					zNode.open = true;
					expandnodeids.splice(index,1);
					break;
				}
			}
			if(!zNode["children"]) return zNode;
			
			for(childindex in zNode["children"]){
				branch.push(ClientUtils.expandTreeNode(zNode["children"][childindex],expandnodeids));
			}
			zNode["children"] = branch;
			return zNode;
	},
	"formFillValue" : function(formid,obj){
		/*
		for(pro in obj){
			$("#"+formid+" :text[name="+pro+"]").val(obj[pro]);
		}
		*/
		$(formid).find("input:text").each(function(){
			$(this).val(obj[this.name]);
		});
	},
	//对象属性名中 的 '.'和'-'的相互替换
	"changePointAndLine":function(obj,flag){ 
		if(!obj) return obj;
		var robj = {};
		if(flag === -1){
			for(index in obj){
				robj[index.replace(/\-/g,"\.")] = obj[index];
			}
		}else{
			for(index in obj){
				robj[index.replace(/\./g,"\-")] = obj[index];
			}
		}
		return robj;
	}
}
ServerUtils ={
}

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
		if(typeof original === "undefined" && typeof target === "undefined") return false;
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