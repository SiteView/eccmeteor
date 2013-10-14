SvseTopNDaoOnServer = {
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
		SvseTopN.insert(rule,function(err,r_id){
			if(err)
				throw new Meteor.Error(500,"SvseTopNDao.setTopNOfReport SvseTopN.insert error");
		});
		return SvseTopNDao.getReturn(true);
	},
	"deleteTopNs":function(ids){
		var result = SvseMethodsOnServer.svDeleteAlertInitFileSection(ids.join());
		if(result){
			for(i in ids){
				SvseTopN.remove(SvseTopN.findOne({nIndex:ids[i]})._id);
			}
		}
		return SvseTopNDao.getReturn(true);
	},
	"updateTopNsStatus":function(ids,status){
		for(index in ids){
			var id = ids[index];
			SvseMethodsOnServer.svWriteAlertStatusInitFileSection(id,status);
			SvseTopN.update(SvseTopN.findOne({nIndex:id})._id,{$set:{"AlertState":status}});	
		}
	},
	"sync":function(){
		SyncFunction.SyncTopNs();
	},
	"updateTopN":function(nIndex,section){
		var result = SvseMethodsOnServer.svWriteAlertIniFileSectionString(nIndex,section);
		if(!result){
			throw new Meteor.Error(500,"SvseTopNDao.updateTopN error");
		}
		var rule = result[nIndex];
		SvseTopN.update(SvseTopN.findOne({nIndex:nIndex})._id,{$set:rule},function(err){
			if(err){
				throw new Meteor.Error(500,"SvseTopNDao.setTopNOfReport SvseTopN.update error");
			}
		});
		return SvseTopNDaoOnServer.getReturn(true);
	}
}