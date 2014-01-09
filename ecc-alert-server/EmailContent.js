var MonitorInformation = require('./MonitorInformation');
var EmailTemplate = require('./EmailTemplate');

var EmailContent = function(){};

Object.defineProperty(EmailContent,"getEmailContent",{
	value:function(){
		var info = MonitorInformation.getMonitorInformation();
		var template = EmailTemplate.getEmailTemplate();
		for(x in info){
			template = template.replace("@"+x,info[x]);
		}
		return template;
	}
});

module.exports = EmailContent;