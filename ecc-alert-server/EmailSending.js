var EmailServerConfigure = require('./EmailServerConfigure');
var EmailClientConfigure = require('./EmailClientConfigure');
var EmailContent = require('./EmailContent');
var nodemailer = require("nodemailer");

var EmailSending = function(){};

Object.defineProperty(EmailSending,"send",{
	value : function(){
		var transport = this.getTransport();
		var mailOptions = this.getMailOptions();
		transport.sendMail(mailOptions,function(error){
			if(error){
				console.log("Send Fail");
				console.log(error.message);
			}else{
				console.log("Send Successfully");
			}
			transport.close();
		});
	}
});

Object.defineProperty(EmailSending,"getTransport",{
	value:function(){
		var serverConfigure = EmailServerConfigure.getEmailServerConfigure();
		var smtpTransport = nodemailer.createTransport("SMTP",serverConfigure);
		return smtpTransport;
	}
});

Object.defineProperty(EmailSending,"getMailOptions",{
	value:function(){
		var sender = EmailServerConfigure.getEmailServerConfigure().auth.user;
		var contents = EmailContent.getEmailContent();
		var clientConfigure = EmailClientConfigure.getEmailClientConfigure();
		var receivers = clientConfigure.join(',');

		var mailOptions = {
		    from: sender, // sender address
		    to: receivers, // list of receivers
		    subject: "Alert Server Test Demo", // Subject line
		    text: contents, //plaintext body
		    html: "<b>"+contents+"</b>" // html body
		}
		return mailOptions;
	}
});


module.exports = EmailSending;