SvseLicenseDao = {
	"AGENT":"svseLicenseDaoAgent",
	
	//获取软件许可的列表
	"getLicenselist":function(fn){
		Meteor.call(SvseLicenseDao.AGENT,"getLicenselist",[],fn);
	},
		//获取com类型的短信模板
	"getMessageTemplates":function(fn){
		Meteor.call(SvseLicenseDao.AGENT,"getMessageTemplates",[],fn);
	},
}