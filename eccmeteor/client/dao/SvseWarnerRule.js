SvseWarnerRuleDao = {
	"getWarnerRuleList" : function(){
		return SvseWarnerRule.find({}).fetch();
	}
}