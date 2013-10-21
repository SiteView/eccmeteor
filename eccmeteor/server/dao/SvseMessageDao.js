SvseMessageDaoOnServer = {
	//添加短信
	"addMessage":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteMessageIniFileSectionString(sectionname,section);
		if(!result){
			var msg = "SvseMessageDaoOnServer's addMessage add " + addressname +" faild";
			SystemLogger.log(msg,-1);
			throw new Meteor.Error(500,msg);
		}
		var addressresult = result[addressname];
		SvseEmailList.insert(addressresult,function(err,r_id){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,err);
			}
		})
	},
}