var EmailServerConfigure = function(){};

//获取发送邮件的配置
Object.defineProperty(EmailServerConfigure,"getEmailServerConfigure",{
	value:function(){
		var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"email.ini",
			"user":"default","sections":"default"}, 0);
		if(!robj.isok(0)){
			return;
		}
		var fmap= robj.fmap(0);
		if(!fmap || !fmap["email_config"]) return ;
		fmap["email_config"]["password"] = this.svDecryptOne(fmap["email_config"]["password"]);
		var emailConfig = fmap["email_config"];
		//console.log(fmap["email_config"]);
		return {
		    host: "smtp.qq.com",//emailConfig.server
		    port: 465,
		    secureConnection: true,
		    auth: {
		        user: emailConfig.user,
		        pass: emailConfig.password
		    }
		}
	}
});

//解密
Object.defineProperty(EmailServerConfigure,"svDecryptOne",{
	value:function(password){
		var dowhat = {
			'dowhat':'decrypt'
		}
		dowhat[password]="";
		var robj = process.sv_univ(dowhat,0);
		var fmap = robj.fmap(0);
	//	console.log(fmap)
		return fmap.return[password];
	}
});

module.exports = EmailServerConfigure;