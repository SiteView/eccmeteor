var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: "smtp.qq.com",
    port: 465,
    secureConnection: true,
    auth: {
        user: "646344359@qq.com",
        pass: "huyinghuan123456"
    }
});
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "646344359@qq.com", // sender address
    to: "ec.huyinghuan@gmail.com,xiacijian@163.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}
smtpTransport.sendMail(mailOptions,function(error){
	if(error){
		console.log("Send Fail");
		console.log(error.message);
	}else{
		console.log("Send Successfully");
	}
});
smtpTransport.close();