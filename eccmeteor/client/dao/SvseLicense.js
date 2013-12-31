SvseLicenseDao = {
	"AGENT":"svseLicenseDaoAgent",
	
	//获取软件许可的列表
	"getLicenselist":function(fn){
		Meteor.call(SvseLicenseDao.AGENT,"getLicenselist",fn);
	}
}