var SysncDb =  {
	findSubGroupById :　function(id){
		var subGroup = Svse.findOne({sv_id:id},{fields: {subgroup: true}});
		if(!subGroup) return false;
		return subGroup["subgroup"];
	},
	addSubGroupByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $push: { subgroup: { $each: arr } } }
			);
	},
	removeGroupByIds : function (id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { subgroup: arr  } }
			)
		for(index in arr){
			SvseDaoOnServer.removeNodesById(arr[index]);
		}
	},
	findSubEntityById : function(id){
		var subEntity = Svse.findOne({sv_id:id},{fields:{subentity:true}});
		if(!subEntity) return false;
		return subEntity["subentity"];
	},
	addEntityByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $push: { subentity: { $each: arr } } }
			);
	},
	removeEntityByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { subentity: arr  } }
			)
		for(index in arr){
			SvseDaoOnServer.removeNodesById(arr[index]);
		}
	},
	findSubMonitorById : function(id){
		var subMonitor = Svse.findOne({sv_id:id},{fields:{submonitor:true}});
		if(!subMonitor) return false;
		return subMonitor["submonitor"];
	},
	addMoniorByIds : function (id,arr){
		Svse.update(
				{ sv_id: id},
				{ $push: { submonitor: { $each: arr } } }
		);
	},
	removeMonitorByIds :  function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { submonitor: arr  } }
			)
		for(index in arr){
			SvseTree.remove({sv_id:arr[index]});
		}
	}
}