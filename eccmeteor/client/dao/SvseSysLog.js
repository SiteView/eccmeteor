SvseSysLogDao = {

"setMessageWebConfig":function(section){
		var result = SvseMethodsOnServer.svWriteSMSWebConfigIniFileSectionString(section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's setMessageWebConfig faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		return SvseMessageDaoOnServer.getReturn(true);
	},

}