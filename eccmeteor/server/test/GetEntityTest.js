GetEntityTest = function(){}

Object.defineProperty(GetEntityTest,"test",{
	value:function(){
		var arr = ["1.30","34.1"];
		for(var i = 0;i<arr.length;i++){
			var entityinfo = SvseMethodsOnServer.svGetEntity(arr[i]);
			console.log(entityinfo)
			console.log(typeof entityinfo);
		}
		
	}
});