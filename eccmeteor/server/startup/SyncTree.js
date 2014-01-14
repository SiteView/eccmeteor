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
		return this.getDefaultTreeData('default',false);
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
		//	_self.contrastNodeAndUpdate(node);//更新节点信息减少一次单独的循环
			switch(node.type){
				case "se" : seBranch.push(node);break;
				case "group" : groupBranch.push(node);break;
				case "entity" : entityBranch.push(node);break;
				case "monitor" : monitorBranch.push(node);break;
			}
		}
		var newSeAndGroupBranches = this.spanningSeAndSeBranches(seBranch,groupBranch);
		var newEntityBranch = this.spanningEntityAndMonitorBranches(entityBranch,monitorBranch);
		var newGroupAndEntityBranch = this.spanningGroupAndEntityBranches(groupBranch,entityBranch,newSeAndGroupBranches);
		newGroupAndEntityBranch = this.spanningGroupAndGroupBranches(newGroupAndEntityBranch,groupBranch);
		console.log(newEntityBranch);
		console.log("=========")
		console.log(newGroupAndEntityBranch);
		console.log("=========")
		console.log(newSeAndGroupBranches)
	}
});
//生成设备和监视器树的分支
Object.defineProperty(SyncTree,"spanningEntityAndMonitorBranches",{
	value:function(entityBranch,monitorBranch){
		var _self = this;
		var newEntityBranch = {};
		for(var i = 0; i < entityBranch.length; i++){
			var entity = entityBranch[i];
			var sv_id = entity.sv_id;
			var obj = {
				sv_id:sv_id,
				parentid:_self.getParentId(sv_id),
				type:"entity",
				submonitor:[]
			}
			newEntityBranch[sv_id] = obj;
		}
		for(var j = 0; j < monitorBranch.length; j++){
			monitor = monitorBranch[j];
			var monitorId = monitor.sv_id;
			var monitorParentId = _self.getParentId(monitorId);
			newEntityBranch[monitorParentId].has_son = true;
			newEntityBranch[monitorParentId].submonitor.push(monitorId);
		}
		return newEntityBranch;
	}
});
//生成组和设备分支树的分支
Object.defineProperty(SyncTree,"spanningGroupAndEntityBranches",{
	value:function(groupBranch,entityBranch,newSeAndSeBranches){
		var _self = this;
		var newGroupBranch = {};
		for(var i = 0; i < groupBranch.length; i++){
			var group = groupBranch[i];
			var sv_id = group.sv_id;
			var obj = {
				sv_id:sv_id,
				parentid:_self.getParentId(sv_id),
				type:"group",
				subentity:[],
				subgroup:[]
				//,property:{} //这个属性的作用？
			}
			newGroupBranch[sv_id] = obj;
		}
		for(var j = 0; j < entityBranch.length; j++){
			var entity = entityBranch[j];
			var entityId = entity.sv_id;
			
			var entityParentId = _self.getParentId(entityId);
			//非法数据
			if(!newGroupBranch[entityParentId]){
				if(newSeAndSeBranches[entityParentId]){
					newSeAndSeBranches[entityParentId].subentity.push(entityId);
				}
				continue;
			}
			newGroupBranch[entityParentId].has_son = true;
			newGroupBranch[entityParentId].subentity.push(entityId);
		}
		return newGroupBranch;
	}
});
//生成组和组分支树的分支
Object.defineProperty(SyncTree,"spanningGroupAndGroupBranches",{
	value:function(newGroupAndEntityBranch,groupBranch){
		var _self = this;
		for(var j = 0 ; j < groupBranch.length; j++ ){
			var group = groupBranch[j];
			var groupId =  group.sv_id;
			var groupParentId = _self.getParentId(groupId);
			if(groupParentId == "1"){
				continue;
			}
			//非法数据
			if(!newGroupAndEntityBranch[groupParentId]){
				continue;
			}
			newGroupAndEntityBranch[groupParentId].has_son = true;
			newGroupAndEntityBranch[groupParentId].subgroup.push(groupId);
		}
		return newGroupAndEntityBranch;
	}
});
//生成Se和组分支树的分支
Object.defineProperty(SyncTree,"spanningSeAndSeBranches",{
	value:function(seBranch,groupBranch){
		var _self = this;
		var newSeBranch = {};
		for(var i = 0; i < seBranch.length; i++){
			var se = seBranch[i];
			var sv_id = se.sv_id;
			var obj = {
				sv_id:sv_id,
				parentid:_self.getParentId(sv_id),
				type:"se",
				subentity:[],
				subgroup:[]
			}
			newSeBranch[sv_id] = obj;
		}

		for(var j = 0 ; j < groupBranch.length; j++ ){
			var group = groupBranch[j];
			var groupId =  group.sv_id;
			var groupParentId = _self.getParentId(groupId);
			//非法数据
			if(!newSeBranch[groupParentId]){
				continue;
			}
			newSeBranch[groupParentId].has_son = true;
			newSeBranch[groupParentId].subgroup.push(groupId);
		}
		return newSeBranch;
	}
});

//合并新旧树的Se结构
Object.defineProperty(SyncTree,"mergeSeBranch",{
	value:function(newSeAndGroupBranches){
		for(seid  in newSeAndGroupBranches){
			
		}
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
});

Object.defineProperty(SyncTree,"getParentId",{
	value:function(id){
		if(id == "1"){
			return "0";
		}
		return id.substr(0,id.lastIndexOf("\."));
	}
});

Object.defineProperty(SyncTree,"getDefaultTreeData",{
	value:function(svid,isGetSonNode){
		return svGetDefaultTreeData(svid,isGetSonNode);
	}
});