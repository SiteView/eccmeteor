HelloWorld = function(){}
Object.defineProperty(HelloWorld,"say",{
	value:function(){
		var fs = Npm.require('fs');
		console.log("TestUnity HelloWorld");
		var wkhtmltopdf = Meteor.require('wkhtmltopdf');
		wkhtmltopdf('http://baidu.com/', { pageSize: 'letter' })
  		.pipe(fs.createWriteStream('/home/ec/out.pdf'))
	}
})