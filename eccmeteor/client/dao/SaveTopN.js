SvseTopNDao = {
	//获取所有topN列表
	"getTopNList" : function(){
		return SvseTopN.find({nIndex:{$exists:true}}).fetch();
	}
}
