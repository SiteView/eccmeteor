/*
*报告的html模板渲染
*/
var ejs = Meteor.require('ejs');
HtmlTemplate = function(){};
Object.defineProperty(HtmlTemplate,"render",{
	value:function(filename,context){
		return ejs.render(AssetsUtils.getReportTemplate(filename),context);
	}
});