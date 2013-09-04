/*
*记住树展开的节点
*/
var NodeRemenber = function(key){
	this.key = key;
	this.getCookie = function(){
		var str = $.cookie(this.key);
		if(!str || !str.length)
			return false;
		return str;
	};
	this.setCookie=function(value){
		$.cookie(this.key,value);
	};
	this.remenber=function(id){
		var str = this.getCookie();
		if(!str){
			this.setCookie(id+"");
			return;
		}
		//可用正则表达式替换 判断是否已经存在
		var arr = str.split(",");
		for(i = 0;i < arr.length ; i++){
			if(arr[i] == id){
				return;
			}
		}
		str = str + "," + id
		this.setCookie(str);
	};
	this.forget = function(id){
		var str = this.getCookie();
		if(!str)
			return;
		//可用正则表达式替换
		var arr = str.split(",");
		var newstr = "";
		for(i = 0;i < arr.length ; i++){
			if(arr[i] != id){
				newstr = newstr + arr[i] + ","
			}
		}
		newstr = newstr.substr(0,newstr.length-1);
		this.setCookie(newstr);
	};
	this.get = function(){
		var str = this.getCookie();
		if(!str)
			return [];
		return str.split(",")
	};
	this.forgetAll = function(){
		this.setCookie("");
	}
}
TreeNodeRemenber = new NodeRemenber("expandnode");
SettingNodeRemenber = new NodeRemenber("expandsettingnode");