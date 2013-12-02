SvseWarnerRuleDao = {
	"getReturn":function(status,msg){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg};
	},
	"setWarnerRuleOfEmail":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteAlertIniFileSectionString(sectionname,section);
		if(!result){
			throw new Meteor.Error(500,"SvseWarnerRuleDao.setWarnerRuleOfEmail error");
		}
		var rule = result[sectionname];
		SvseWarnerRule.insert(rule,function(err,r_id){
			if(err)
				throw new Meteor.Error(500,"SvseWarnerRuleDao.setWarnerRuleOfEmail SvseWarnerRule.insert error");
		});
		return SvseWarnerRuleDao.getReturn(true);
	},
	"deleteWarnerRules":function(ids){
		var result = SvseMethodsOnServer.svDeleteAlertInitFileSection(ids.join());
		if(result){
			for(i in ids){
				SvseWarnerRule.remove(SvseWarnerRule.findOne({nIndex:ids[i]})._id);
			}
		}
		return SvseWarnerRuleDao.getReturn(true);
	},
	"updateWarnerRulesStatus":function(ids,status){
		for(index in ids){
			var id = ids[index];
			SvseMethodsOnServer.svWriteAlertStatusInitFileSection(id,status);
			SvseWarnerRule.update(SvseWarnerRule.findOne({nIndex:id})._id,{$set:{"AlertState":status}});	
		}
	},
	"sync":function(){
		SyncFunction.SyncWarnerRules();
	},
	"updateWarnerRule":function(nIndex,section){
		var result = SvseMethodsOnServer.svWriteAlertIniFileSectionString(nIndex,section);
		if(!result){
			throw new Meteor.Error(500,"SvseWarnerRuleDao.updateWarnerRule error");
		}
		var rule = result[nIndex];
		SvseWarnerRule.update(SvseWarnerRule.findOne({nIndex:nIndex})._id,{$set:rule},function(err){
			if(err){
				throw new Meteor.Error(500,"SvseWarnerRuleDao.setWarnerRuleOfEmail SvseWarnerRule.update error");
			}
		});
		return SvseWarnerRuleDao.getReturn(true);
	},
	//添加短信的报警规则  ----zhuqing
	"setWarnerRuleOfMessage":function(sectionname,section){
		var result = SvseMethodsOnServer.svWriteAlertIniFileSectionString(sectionname,section);
		if(!result){
			throw new Meteor.Error(500,"SvseWarnerRuleDao.setWarnerRuleOfMessage error");
		}
		var rule = result[sectionname];
		SvseWarnerRule.insert(rule,function(err,r_id){
			if(err)
				throw new Meteor.Error(500,"SvseWarnerRuleDao.setWarnerRuleOfMessage SvseWarnerRule.insert error");
		});
		return SvseWarnerRuleDao.getReturn(true);
	},
	//获取报警的脚本
	"getScriptFiles":function(){
		return SvseMethodsOnServer.svGetScriptFileofScriptAlert();
	},
	"getQueryAlertLog" : function(beginDate,endDate,alertQueryCondition){
		var result = SvseMethodsOnServer.svGetQueryAlertLog(beginDate,endDate,alertQueryCondition);
		if(!result){
			console.log("error");
			throw new Meteor.Error(500,"SvseAlertLogDaoOnServer.getQueryAlertLog failed");
		}
		console.log("resultde");
		//console.log(result);
		return result;
	},
}
