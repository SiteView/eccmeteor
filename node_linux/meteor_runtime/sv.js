var http = require('http');
process.sv_init(); //sv的初始化
var hello = process.sv_hello();   //调用了 sv 中的 hello 方法
// var obj= addon.createObject(); //直接创建一个默认 c++对象

//////////////////////////////////////////////////////////////////////////////////////
//  以下所说调试开关，例如robj.fmap(1) 可以在 node.exe 的命令行窗口显示调试信息，便于查错；如下可以关闭调试开关：robj.fmap() 或 robj.fmap(0)   
//////////////////////////////////////////////////////////////////////////////////////

var TestUnivData = function(text){
	// var robj= process.sv_univ({'dowhat':'QueryAllMonitorInfo'}, 0); 
	//var robj= process.sv_univ({'dowhat':'GetMonitor','id':'1.31.1.1',}, 2); 
	// var robj= process.sv_univ({'dowhat':'DelChildren','parentid':'1.31.12',}, 2); 
	var robj= process.sv_univ({'dowhat':'GetMonitorTemplet','id':'5',}, 0);  //读取监测器模板数据，调试开关可为 1 或 2（显示更详细）
	text+= '\n\n=== TestUnivData ===';
	if( robj.isok!=undefined )
	{
		//走到这一句，说明返回了c++对象
		text+= '\nisok():' + robj.isok(0); //调用svapi函数成功吗，调试开关可为 1
		text+= '\nestr():' + robj.estr(0); //调用svapi函数的错误信息，调试开关可为 1
		var fmap= robj.fmap(0);			   //数据对象，调试开关可为 1
		if(fmap.property)
		{
			// 访问数据对象的成员
			text+= '\nsv_description= ' + fmap.property.sv_description;
			text+= '\nsv_id= ' + fmap.property.sv_id;
			text+= '\nsv_dll= ' + fmap.property.sv_dll;
		}
	}
	else
		text+= robj;//传入给sv的参数不对等低级错误时，直接返回错误字符串
	return text;
}

var TestForestData = function(text){
	// var robj= process.sv_forest({'dowhat':'QueryRecordsByCount','id':'1.23.10.1.1','count':'10'}, 1);
	var robj= process.sv_forest({'dowhat':'GetTreeData','parentid':'1.31','onlySon':'false'}, 0); //1.31.1，1.23.22，default //返回ecc页面左侧的树数据，根据你本地的数据传入合适的 parentid，调试开关可为 1 或 2（显示更详细）
	text+= '\n\n=== TestForestData ===';
	if( robj.isok(1)!==undefined )
	{
		//走到这一句，说明返回了c++对象
		text+= '\nisok():' + robj.isok(0); //调用svapi函数成功了吗，调试开关可为 1
		text+= '\nestr():' + robj.estr(0); //调用svapi函数的错误信息，调试开关可为 1
		var fmap= robj.fmap(0);			   //数据对象，调试开关可为 1
		if(fmap.m1)
		{
			// 访问数据对象的成员
			text+= '\nsv_id= ' + fmap.m1.sv_id;
		}
		
		//以下递归取出数据对象的所有 key，调试开关可为 1，在构造ecc左侧树的时候需要用到
		var key= true; //取出第一个 key
		do{
			key= robj.nextkey(key,0); //取出下一个 key
			if(key!=false)
				console.log("key:" + key + ", sv_id:" + fmap[key].sv_id);
		}while(key!=false);
	}
	else
		text+= robj; //传入给sv的参数不对等低级错误时，直接返回错误字符串
	return text;
}


var TestSubmit = function(text){
	var group= {'property':{'sv_name':'测试设备','sv_description':'测试设备'},'return':{'id':'1.35.2'}};
	var robj= process.sv_submit(group,{'dowhat':'SubmitGroup',},0);  //保存组的数据，根据你本地的数据传入合适的 parentid，调试开关可为 1 或 2（显示更详细）  //,'parentid':'1.35'
	text+= '\n\n=== TestSubmit ===';
	if( robj.isok!=undefined )
	{
		//走到这一句，说明返回了c++对象
		text+= '\nisok():' + robj.isok(0); //调用svapi函数成功了吗，调试开关可为 1
		text+= '\nestr():' + robj.estr(0); //调用svapi函数的错误信息，调试开关可为 1
		var fmap= robj.fmap(0);			   //数据对象，调试开关可为 1
		if(fmap.property)
		{
			// 访问数据对象的成员
			text+= '\nsv_description= ' + fmap.property.sv_description;
		}		
		if(fmap.return)
		{
			text+= '\nid= ' + fmap.return.id;		
		}		
	}
	else
		text+= robj; //传入给sv的参数不对等低级错误时，直接返回错误字符串
	return text;
}

var count= 1;
var getText = function (text){	
	text= '\ncount: '+ count++ + '\n';
	// text+= '\n svdb addr:';
	// text+= process.sv_test(); //调用了sv中的 svapi 方法，取得 svdb 的地址
	text= TestUnivData(text);
	text= TestForestData(text);
	// text= TestSubmit(text);
	return text;
}
		
var requestFunction = function (req, res){ 
	req.setEncoding('UTF-8');
	res.setHeader('content-type','text/plain; charset=UTF-8');
	res.writeHead(200, {"Content-Type": "text/plain"});
	
	hello= getText('');
	// console.log(hello);
	res.end(hello);
}

var server = http.createServer(); 
server.on('request',requestFunction); 
server.listen(1337, "127.0.0.1"); 

console.log('Server running at http://127.0.0.1:1337/');
// console.log('obj.isok(): '+obj.isok());
console.log(getText(hello));
console.log('\n');


