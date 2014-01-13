var EmailTemplate = function(){};

//获取指定发送邮件模板的值
Object.defineProperty(EmailTemplate,"getEmailTemplate",{
	value:function(template){
		var robj = process.sv_univ({'dowhat':'GetIniFileString',"filename":"TXTtemplate.ini",
				"user":"default","section":"Email","key":template}, 0);
		var fmap = robj.fmap(0);
		console.log(fmap["return"]["value"]);
		return fmap["return"]["value"];
		//return "hello @name , ,..... @age";
	}
});
module.exports = EmailTemplate;