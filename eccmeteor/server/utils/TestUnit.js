/*
*单元测试
*/
TestUnit = function(){};
Object.defineProperty(TestUnit,"test",{
	value:function(status){
		if(status === 1){
			return true;
		}
		//拿到需要测试的配置文件信息
		var testObjects = AssetsUtils.getTestObjects();
		var length = testObjects.length;
		for(var i = 0; i < length ; i++){
			var obj = testObjects[i];
			this.testObject(obj.name,obj.fn);
		}
	}
});
/*
*接收一个全局对象名称和方法名。*/
Object.defineProperty(TestUnit,"testObject",{
	value:function(name,fnn){
		if(!name || !fnn){
			console.log("Error: "+name+"或"+fnn + "为空");
			return;
		}
		//判断为object还是function
		var Obj = global[name];
		if(!Obj || (typeof(Obj) !== "object" && typeof(Obj) !== "function")){
			console.log("Error: 全局对象:"+name+"不存在");
			return;
		}
		//function
		var instance = Obj;
		//判断函数是可配置属性还是内置属性 并且判断是function还是object  调用函数名称加上标志符@则 Obj是Function。否则做Object使用
		if(fnn.indexOf("\@") === 0){ //@位于第一个这是内置属性
			fnn = fnn.replace("\@","");//去掉@符号
			instance = new Obj(); //为考虑参数问题
		}
		var fn = instance[fnn]
		if(fn && typeof(fn) === "function"){
			var result = fn();
			if(typeof result !== "undefined"){
				console.log(result)
			} 
		}else{
			console.log(fnn+"非函数");
			console.log(fn);
		}
	}
});