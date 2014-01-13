process.sv_init(); //sv的初始化
var EmailTemplate = require('../EmailTemplate');

var EmailTemplateTest = function(){};
//获取所有的发送邮件模板
Object.defineProperty(EmailTemplateTest,"getEmailTemplate",{
	value:function(template){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"TXTtemplate.ini",
				"user":"default","sections":"Email"}, 0);
		var fmap = robj.fmap(0);
		var templates = fmap["Email"];
		for(i in templates){
			//console.log(i);
			if(template == i){
				console.log(templates[i]);
			}
		}

	}
});

//直接获取指定邮件模板的value值
Object.defineProperty(EmailTemplateTest,"getTemplateValue",{
	value:function(template){
		var robj = process.sv_univ({'dowhat':'GetIniFileString',"filename":"TXTtemplate.ini",
				"user":"default","section":"Email","key":template}, 0);
		var fmap = robj.fmap(0);
		console.log(fmap["return"]["value"]);

	}
});


EmailTemplate.getEmailTemplate("Default");