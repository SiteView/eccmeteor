Date.prototype.format = function(format){  var o = {    "M+" : (this.getMonth()+1), //month     "d+" : this.getDate(),    //day     "h+" : this.getHours(),   //hour     "m+" : this.getMinutes(), //minute     "s+" : this.getSeconds(), //second     "q+" : Math.floor((this.getMonth()+3)/3),  //quarter     "S" : this.getMilliseconds() //millisecond   }   if(/(y+)/.test(format)) format=format.replace(RegExp.$1,     (this.getFullYear()+"").substr(4 - RegExp.$1.length));   for(var k in o)if(new RegExp("("+ k +")").test(format))     format = format.replace(RegExp.$1,       RegExp.$1.length==1 ? o[k] :         ("00"+ o[k]).substr((""+ o[k]).length));   return format; } //debug级别 ：level，-1表示错误，0表示警告，1表示一般提示信息  默认为1SystemLogger = function(obj,level){	if(typeof level === "undefined" || typeof level !== "number") level = 1;	var date = new Date().format("yyyy-MM-dd hh:mm:ss");	var levelInfo ="";	switch(level){		case -1:levelInfo = "ERROR:\n";break;		case 0 :levelInfo = "WARNNING:\n";break;		default:levelInfo = "NORMAL:";break;	}	if(!obj){		var info = date+":"+levelInfo+"undefined";	}else{		var info = date+":"+levelInfo +JSON.stringify(obj).replace(/\\\"/g,"\'");	}	console.log(info);	return info;}