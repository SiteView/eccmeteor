/**
 Type:add
 Author:huyinghuan
 Date: 2013-11-27 10:47
 Content :添加检查错误的机制 在服务端调用SvAPI时
*/
var checkErrorOnServer = function(robj){
	if(typeof robj === "string"){
		return robj;
	}
	if(!robj.isok(0) &&robj.estr(0) !== ""){
		return robj.estr(0);
	}
}
/*
DataType : sv_univ | sv_forest | sv_submit
{
	"DataType":"sv_univ",
	"Parameters":{
		'dowhat' : 'GetTreeData',
		'parentid' : "parentid",
		'onlySon'  :true,
		....
	},
	"Module":{}
}
*/
process.sv_init();
var buildMessage = function(content,flag){
	if(typeof flag === "undefined"){
		flag = true;
	}
	var message  = null;
	if(!flag){
		message = {
			"status":false,
			"message" : content
		}
	}else{
		message = {
			"status":true,
			"message" : content
		}
	}
	return message;
}
var Svdb = function(){};

Object.defineProperty(Svdb,"do",{
	value:function(jsonStr){
		var result = null;
		var obj = null;
		try{
			obj = JSON.parse(jsonStr);
			var method = obj.DataType;
			var dowhat = obj.Parameters;
			if(method === "sv_submit"){
				var moduel = obj.Module;
				var robj = process.sv_submit(moduel,dowhat,0);
			}else{
				var robj = process[method](dowhat,0);
			}
			
			var flag = checkErrorOnServer(robj);
			if(typeof flag === "string"){
				result = buildMessage(flag,false);
			}else{
				result = buildMessage(robj.fmap(0),true);
			}
		}catch(e){
			console.log(e.stack)
			result = buildMessage(e.stack,false);	
		}
		return JSON.stringify(result);
	}
});

module.exports = Svdb;
