Template.warnerrule.events = {
	"click #emailwarner":function(e){
		$('#emailwarnerdiv').modal('toggle');
	},
	"click #delwarnerrule" : function(){
		SvseWarnerRuleDao.deleteWarnerRules(getWarnerRuleListSelectAll());
	},
	"click #allowewarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Enable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #forbidwarnerrule":function(){
		SvseWarnerRuleDao.updateWarnerRulesStatus(getWarnerRuleListSelectAll(),"Disable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #refreshwarnerrule":function(){
		SvseWarnerRuleDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	"click #warnerrulehelpmessage":function(){
		console.log("warnerrulehelpmessage");
	},

}