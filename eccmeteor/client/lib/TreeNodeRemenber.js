/*
*记住树展开的节点
*/
TreeNodeRemenber = {
	getCookie:function(){
		var str = $.cookie("expandnode");
		if(!str || !str.length)
			return false;
		return str;
	},
	setCookie:function(value){
		$.cookie("expandnode",value);
	},
	remenber:function(id){
		var str = TreeNodeRemenber.getCookie();
		if(!str){
			TreeNodeRemenber.setCookie(id+"");
			return;
		}
		//可用正则表达式替换 判断是否已经存在
		var arr = str.split(",");
		for(i = 0;i < arr.length ; i++){
			if(arr[i] === id){
				return;
			}
		}
		str = str + "," + id
		TreeNodeRemenber.setCookie(str);
	},
	forget : function(id){
		var str = TreeNodeRemenber.getCookie();
		if(!str)
			return;
		//可用正则表达式替换
		var arr = str.split(",");
		var newstr = "";
		for(i = 0;i < arr.length ; i++){
			if(arr[i] !== id){
				newstr = newstr + arr[i] + ","
			}
		}
		newstr = newstr.substr(0,newstr.length-1);
		TreeNodeRemenber.setCookie(newstr);
	},
	get : function(){
		var str = TreeNodeRemenber.getCookie();
		if(!str)
			return [];
		return str.split(",")
	}
}