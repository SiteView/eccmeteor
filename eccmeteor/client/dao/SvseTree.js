//节点属性
SvseTreeDao = {
	//根据ID获取某个节点信息,或者指定的某个属性
	getNodeById:function(id,property){
		if(property){
			return SvseTree.findOne({sv_id:id})[property];
		}
		return SvseTree.findOne({sv_id:id});
	},
	getNodesByIds:function(ids){
		return SvseTree.find({sv_id:{$in:ids}}).fetch();
	},
	getMonitorTypeById :function(id){
		var node = SvseTree.findOne({sv_id:id});
		return  node ? node["sv_monitortype"] : undefined ;
	}
}