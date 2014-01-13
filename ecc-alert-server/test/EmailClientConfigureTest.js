process.sv_init(); //sv的初始化
var EmailClientConfigure = require('../EmailClientConfigure');

var EmailClientTest = function(){};

//获取邮件接收地址---可能有多个地址(暂时没加上其他地址)
Object.defineProperty(EmailClientTest,"getReceiver",{
	value:function(address){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"emailAdress.ini",
			"user":"default","sections":"default"}, 0);
		if(!robj.isok(0)){
			return;
		}
		var fmap = robj.fmap(0);
		var emailReceivers = [];
		for(f in fmap){
			if(f.indexOf("return") !== -1) continue;
			//console.log(fmap[f]["Name"]);
			for(var i = 0;i < address.length;i++){
				if(address[i] == fmap[f]["Name"]){
					//console.log(fmap[f]["MailList"]);
					emailReceivers.push(fmap[f]["MailList"]);
				}
			}
			
		}
		console.log(emailReceivers);
	}
});

EmailClientTest.getReceiver(["fd","dds"]);