SvseWarnerRuleDao = {
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
	}
}