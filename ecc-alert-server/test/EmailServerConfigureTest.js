process.sv_init(); //sv的初始化
var EmailServerConfigure = require('../EmailServerConfigure');

var EmailServerTest = function(){};
//获取发送邮件的设置
Object.defineProperty(EmailServerTest,"test",{
	value:function(name){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"email.ini",
			"user":"default","sections":"default"}, 0);
		if(!robj.isok(0)){
			return;
		}
		var fmap= robj.fmap(0);
		if(!fmap || !fmap["email_config"]) return ;
		//fmap["email_config"]["password"] = svDecryptOne(fmap["email_config"]["password"]);
		console.log(fmap["email_config"]);
	}
});

EmailServerTest.test();
