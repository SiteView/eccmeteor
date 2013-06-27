SvseWarnerRuleDao = {
	//	根据id获取报警规则
	"getWarnerRule" : function(id){
		return SvseWarnerRule.findOne({nIndex:id});
	},
	//获取所有报警规则
	"getWarnerRuleList" : function(){
		return SvseWarnerRule.find({}).fetch();
	},
	"setWarnerRuleOfEmail":function(sectionname,section,fn){
		Meteor.call("svWriteAlertIniFileSectionString",sectionname,section,function(err,result){
			var rule = result[sectionname];
			SvseWarnerRule.insert(rule,function(err,r_id){
				if(err){
					SystemLogger(err,-1);
				}else{
					SystemLogger(r_id);
					if(typeof fn === "function") fn();
				}	
			});
		});
	},
	//批量删除报警规则
	'deleteWarnerRules' : function(ids){
		Meteor.call("svDeleteAlertInitFileSection",ids.join(),function(err,result){
			if(result){
				for(i in ids){
					SvseWarnerRule.remove(SvseWarnerRule.findOne({nIndex:ids[i]})._id);
				}
			}
		})
	},
	//批量更新报警规则状态
	"updateWarnerRulesStatus": function(ids,status){
		for(index in ids){
			var id = ids[index];
			Meteor.call("svWriteAlertStatusInitFileSection",id,status,function(err,result){});
			SvseWarnerRule.update(SvseWarnerRule.findOne({nIndex:id})._id,{$set:{"AlertState":status}});	
		}
	},
	//刷新同步
	"sync":function(fn){
		Meteor.call("SyncWarnerRules",function(err){
			if(!err) fn();
		});
	},
	//更新报警规则
	"updateWarnerRule" : function(nIndex,section,fn){
		Meteor.call("svWriteAlertIniFileSectionString",nIndex,section,function(err,result){
			var rule = result[nIndex];
			SvseWarnerRule.update(SvseWarnerRule.findOne({nIndex:nIndex})._id,{$set:rule},function(err){
				if(err){
					SystemLogger(err,-1);
				}else{
					fn();
				}	
			});
		});
	}
}