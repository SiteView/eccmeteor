SvseWarnerRuleDao = {
	"AGENT":"svseWarnerRuleDaoAgent",
	//	根据id获取报警规则
	"getWarnerRule" : function(id){
		return SvseWarnerRule.findOne({nIndex:id});
	},
	//获取所有报警规则
	"getWarnerRuleList" : function(){
		return SvseWarnerRule.find({}).fetch();
	},
	"setWarnerRuleOfEmail":function(sectionname,section,fn){
		Meteor.call(SvseWarnerRuleDao.AGENT,"setWarnerRuleOfEmail",[sectionname,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});
	},
	//批量删除报警规则
	'deleteWarnerRules' : function(ids){
		Meteor.call(SvseWarnerRuleDao.AGENT,"deleteWarnerRules",[ids],function(result){});
	},
	//批量更新报警规则状态
	"updateWarnerRulesStatus": function(ids,status,fn){
		SystemLogger(typeof fn);
		Meteor.call(SvseWarnerRuleDao.AGENT,"updateWarnerRulesStatus",[ids,status],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				if(result && !result.status){
					fn(result)
				}else{
					fn({status:true,option:{count:ids.length}});
				}
			}
		});
	},
	//刷新同步
	"sync":function(fn){
		Meteor.call(SvseWarnerRuleDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	},
	//更新报警规则
	"updateWarnerRule" : function(nIndex,section,fn){
		/*
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
		*/
		Meteor.call(SvseWarnerRuleDao.AGENT,"updateWarnerRule",[nIndex,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});
	},
	/*
		Author:zhuqing
		Context:添加短信的报警规则
	*/
	"setWarnerRuleOfMesaage":function(sectionname,section,fn){
		Meteor.call(SvseWarnerRuleDao.AGENT,"setWarnerRuleOfMessage",[sectionname,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});
	},
	//根据报警名称获取对象
	"getAlertByName":function(alertname){
		return SvseWarnerRule.findOne({AlertName:alertname});
	},
	//获取脚本报警的脚本
	"getScriptFiles":function(fn){
		Meteor.call(SvseWarnerRuleDao.AGENT,"getScriptFiles",[],fn);
	},
	//检查操作时是否勾选对象
	"checkWarnerSelect":function(getWarnerRuleListSelectAll){
		if(getWarnerRuleListSelectAll == ""){
			Message.info("请选择你要操作的对象！");
			return;
		}
	},
	"getQueryAlertLog":function(beginDate,endDate,alertQueryCondition,fn){
		Meteor.call(SvseWarnerRuleDao.AGENT,"getQueryAlertLog",[beginDate,endDate,alertQueryCondition],function (err,result){
			console.log("logg");
			if(err){
				fn({status:false,msg:err})
				return;
			}
			console.log("log");
			fn({status:true,content:result});
		});
	}
}
