SvseTopNDao = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"setTopNOfReport":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteAlertIniFileSectionString(sectionname,section);
		if(!result){
			throw new Meteor.Error(500,"SvseTopNDao.setTopNOfReport error");
		}
		var rule = result[sectionname];
		SvseWarnerRule.insert(rule,function(err,r_id){
			if(err)
				throw new Meteor.Error(500,"SvseTopNDao.setTopNOfReport SvseTopN.insert error");
		});
		return SvseTopNDao.getReturn(true);
	}
}