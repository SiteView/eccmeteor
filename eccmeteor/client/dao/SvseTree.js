//节点属性
SvseTreeDao = {
	//根据ID获取某个节点信息,或者指定的某个属性
	getNodeById:function(id,property){
		if(property){
			var node = SvseTree.findOne({sv_id:id});
			return node ? node[property] :"";
		}
		return SvseTree.findOne({sv_id:id});
	},
	/*
	*根据ids数组和状态获取
	*/
	getNodesByIds:function(ids,status){
		if(!status)
			return SvseTree.find({sv_id:{$in:ids}}).fetch();
		return SvseTree.find({sv_id:{$in:ids},status:status}).fetch();
	},
	getMonitorTypeById :function(id){
		var node = SvseTree.findOne({sv_id:id});
		return  node ? node["sv_monitortype"] : undefined ;
	}
}