SysncDb =  {
	findSubGroupById :　function(id){
		var subGroup = Svse.findOne({sv_id:id},{fields: {subgroup: true}});
		if(!subGroup) return false;
		return subGroup["subgroup"];
	},
	addSubGroupByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pushAll: { subgroup: arr },$set:{has_son : true} },
				function(err){
					if(!err) return;
					Log4js.info("addSubGroupByIds  SvseTree.update 错误！\n syncDb.js 11 line");
					Log4js.info(err,-1);
				}
			);
	},
	removeGroupByIds : function (id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { subgroup: arr  } },
				function(err){
					if(!err) return;
					Log4js.info("removeGroupByIds  SvseTree.update 错误！\n syncDb.js 22 line");
					Log4js.info(err,-1);
				}
			);
		var node = Svse.findOne({sv_id: id});
		if((!node["subentity"] || !node["subentity"].length)&&(!node["subentity"] || !node["subentity"].length)){
			Svse.update(
				{ sv_id: id},
				{$set:{has_son : false}},
				function(err){
					if(!err) return;
					Log4js.info("removeGroupByIds  SvseTree.update 错误！\n syncDb.js 32 line");
					Log4js.info(err,-1);
				}
			);
		}
		for(index in arr){
			SvseDaoOnServer.removeNodesById(arr[index]);
		}
	},
	findSubEntityById : function(id){
		var subEntity = Svse.findOne({sv_id:id},{fields:{subentity:true}});
		if(!subEntity) return false;
		return subEntity["subentity"];
	},
	addSubEntityByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pushAll: { subentity: arr } ,$set:{has_son : true} },
				function(err){
					if(!err) return;
					Log4js.info("addSubEntityByIds  SvseTree.update 错误！\n syncDb.js 51 line");
					Log4js.info(err,-1);
				}
			);
	},
	removeSubEntityByIds : function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { subentity: arr  } },
				function(err){
					if(!err) return;
					Log4js.info("removeSubEntityByIds  SvseTree.update 错误！\n syncDb.js 61 line");
					Log4js.info(err,-1);
				}
			);
		var node = Svse.findOne({sv_id: id});
		if((!node["subentity"] || !node["subentity"].length)&&(!node["subentity"] || !node["subentity"].length)){
			Svse.update(
				{ sv_id: id},
				{$set:{has_son : false}},
				function(err){
					if(!err) return;
					Log4js.info("removeSubEntityByIds  SvseTree.update 错误！\n syncDb.js 71 line");
					Log4js.info(err,-1);
				}
			);
		}
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
				{ sv_id: id },
				{ $pushAll: { submonitor: arr } },
				function(err){
					if(!err) return;
					Log4js.info("addMoniorByIds  SvseTree.update 错误！\n syncDb.js 90 line");
					Log4js.info(err,-1);
				}
		);
	},
	removeMonitorByIds :  function(id,arr){
		Svse.update(
				{ sv_id: id},
				{ $pullAll: { submonitor: arr  } },
				function(err){
					if(!err) return;
					Log4js.info("removeMonitorByIds  SvseTree.update 错误！\n syncDb.js 100 line");
					Log4js.info(err,-1);
				}
			)
		for(index in arr){
			SvseTree.remove({sv_id:arr[index]});
		}
	},
	updateNode : function(node){
		var id = node["sv_id"];
		var target = SvseTree.findOne({sv_id:id});
		if(!target){
			Log4js.info("插入节点"+id);
			SvseTree.insert(node,function(err){
				if(!err) return;
				Log4js.info("自动更新，updateGroupAndEntity  SvseTree.insert 错误！\n syncDb.js 81 line");
				Log4js.info(err,-1);
			});
			return;
		}
		if(node["type"] !== "monitor" && Utils.compareObject(node,target)){
			return;
		}
		SvseTree.update({sv_id:id},node,function(err){
			if(!err) return;
			Log4js.info("自动更新，updateGroupAndEntity  SvseTree.update 错误！\n syncDb.js 88 line");
			Log4js.info(err,-1);
		});
	},
	isExistBranch : function(id){
		return Svse.find({sv_id:id}).fetch().length;
	},
	addBranchOnTree : function(node){
		Svse.insert(node,function(err){
			if(!err) return;
			Log4js.info("自动更新，Svse.insert插入错误！\n sync.js 51 line");
			Log4js.info(err,-1);
		});
	},
	getEntityBranchs : function(){
		return Svse.find({"type":"entity"},{fields:{sv_id:1,submonitor:1}}).fetch();
	}
}