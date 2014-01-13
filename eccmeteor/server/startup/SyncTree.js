SyncTree = function(){};

Object.defineProperty(SyncTree,"sync",{
	value:function(){
		var newNodes = this.getWholeTreeNode();
		var newTree = this.getNewTreeStructure(newNodes);
	}
});

//获取整棵数的信息
Object.defineProperty(SyncTree,"getWholeTreeNode",{
	value:function(){
		return SysncDb.getDefaultTreeData('default',false);
	}
});

//对比数据库中存在的节点信息
Object.defineProperty(SyncTree,"contrastNodeAndUpdate",{
	value:function(node){
		var _self = this;
		var id = node["sv_id"];
		var target = SvseTree.findOne({sv_id:id});
		if(!target){
			Log4js.info("插入节点"+id);
			SvseTree.insert(node,function(err){
				if(!err) return;
				Log4js.error("SyncTree.contrastNodeAndUpdate  SvseTree.insert 错误！");
			});
			return;
		}
		if(_self.compareObject(node,target)){
			return;
		}
		SvseTree.update({sv_id:id},node,function(err){
			if(!err) return;
			Log4js.error("自动更新， SyncTree  contrastNodeAndUpdate SvseTree.update 错误！");
		});
	}
});

//根据树节点信息获取新的树结构图
Object.defineProperty(SyncTree,"getNewTreeStructure",{
	value:function(newNodes){
		var _self = this;
		var seBranch = [];
		var groupBranch = [];
		var entityBranch = [];
		var monitorBranch = [];
		for(nodeName in newNodes){
			var node = newNodes[nodeName];
			_self.contrastNodeAndUpdate(node);//更新节点信息减少一次单独的循环
			switch(node.type){
				case "se" : seBranch.push(node);break;
				case "group" : groupBranch.push(node);break;
				case "entity" : entityBranch.push(node);break;
				case "monitor" : monitorBranch.push();break;
			}
		}

		return newTreeStructure;
	}
});
//生成设备树的分支
Object.defineProperty(SyncTree,"spanningEntityBranches",{
	value:function(entityBranch,monitorBranch){
		var _self = this;
		var newEntityBranch = {};
		for(entity in entityBranch){
			var sv_id = entity.sv_id;
			var obj = {
				sv_id:sv_id,
				parentid:_self.getParentId(sv_id),
				type:"entity",
				submonitor:[];
			}
			newEntityBranch[sv_id] = obj;
		}
		for(monitor in monitorBranch){
			var monitorId = monitor.sv_id;
			var monitorParentId = _self.getParentId(monitorId),
			newEntityBranch[monitorParentId].has_son = true;
			newEntityBranch[monitorParentId].submonitor.push(monitorId);
		}
		return newEntityBranch;
	}
});


//合并新旧树的结构
Object.defineProperty(SyncTree,"mergeTreeBetweenOldAndNew",{
	value:function(){
		
	}
});

/**
	比较两个对象是否相同，相同 返回true，否则false
*/
Object.defineProperty(SyncTree,"compareObject",{
	value: function(original,target){ 
		for (property in original){
			if(property === "KLS_seconds" || property === "KLS_times" ){
				continue;
			}
			if(original[property] !== target[property]){
				return false;
			}			
		}
		return true;
	}
}

Object.defineProperty(SyncTree,"getParentId",{
	value:function(id){
		if(id == "1"){
			return "0";
		}
		return id.substr(id,sv_id.lastIndexOf("\.");
	};
});