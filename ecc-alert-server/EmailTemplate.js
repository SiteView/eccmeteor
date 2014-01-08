var EmailTemplate = function(){};

Object.defineProperty(EmailTemplate,"getEmailTemplate",{
	value:function(){
		return "hello @name , ,..... @age";
	}
});
module.exports = EmailTemplate;