var EmailServerConfigure = function(){};

Object.defineProperty(EmailServerConfigure,"getEmailServerConfigure",{
	value:function(){
		return {
		    host: "smtp.qq.com",
		    port: 465,
		    secureConnection: true,
		    auth: {
		        user: "xxx@qq.com",
		        pass: "password"
		    }
		}
	}
});

module.exports = EmailServerConfigure;