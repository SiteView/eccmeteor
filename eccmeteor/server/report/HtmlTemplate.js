HtmlTemplate = function(){};
Object.defineProperty(HtmlTemplate,"render",{
	value:function(filename,context){
		return AssetsUtils.getReportTemplate(filename);
	}
});