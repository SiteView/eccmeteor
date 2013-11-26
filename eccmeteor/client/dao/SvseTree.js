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
	*根据ids数组和状态获取  另外接收一个分页参数
	*/
	getNodesByIds:function(ids,status,page){
		if(!status){
			return SvseTree.find({sv_id:{$in:ids}},page).fetch();
		}
		if(status !== "disable"){
			return SvseTree.find({sv_id:{$in:ids},status:status},page).fetch();
		}
		var monitors = SvseTree.find({status:"disable"}).fetch();
		var monitorsNumber = monitors.length;
		if(!monitorsNumber){
			return [];
		}
		var newIds  = [];
		for(var index = 0 ; index < monitorsNumber ; index++){
			for(x in ids){
				if(monitors[index].sv_id.indexOf(ids[x]) != -1){
					newIds.push(ids[x]);
				}
			}
		}
		return SvseTree.find({sv_id:{$in:newIds}},page).fetch();
	},
	getMonitorTypeById :function(id){
		var node = SvseTree.findOne({sv_id:id});
		return  node ? node["sv_monitortype"] : undefined ;
	}
}

//获取符合记录的分页数目 对应getNodesByIds
Object.defineProperty(SvseTreeDao,"getNodeCountsByIds",{
	value:function(ids,status){
		if(!status)
			return SvseTree.find({sv_id:{$in:ids}}).count();
		return SvseTree.find({sv_id:{$in:ids},status:status}).count();
	}
});