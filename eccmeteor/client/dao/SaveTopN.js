SvseWarnerRuleDao = {
	"AGENT":"svseTopNDaoAgent",
	//	根据id获取报警规则
	"getTopN" : function(id){
		return SvseTopN.findOne({nIndex:id});
	},
	//获取所有报警规则
	"getTopNList" : function(){
		return SvseTopN.find({}).fetch();
	},
	"setTopNOfReport":function(sectionname,section,fn){
		Meteor.call(SvseTopNDao.AGENT,"setTopNOfReport",[sectionname,section],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				fn(result);
			}
		});