SyncTree = function(){};

Object.defineProperty(SyncTree,"sync",{
	value:function(){
		var newNodes = this.getWholeTreeNode();
		this.newTreeStructure(newNodes);
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
				Log4js.error("SyncTree.contrastNodeAndUpdate  SvseTree.insert 错误！");
			});
			return;
		}
		if(_self.compareObject(node,target)){
			return;
		}
		SvseTree.update({sv_id:id},node,function(err){
			Log4js.error("自动更新， SyncTree  contrastNodeAndUpdate SvseTree.update 错误！");
		});
	}
});

//根据树节点信息获取新的树结构图
Object.defineProperty(SyncTree,"newTreeStructure",{
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
				case "monitor" : monitorBranch.push(node);break;
			}
		}
		var newSeAndGroupBranches = _self.spanningSeAndSeBranches(seBranch,groupBranch);
		var newEntityBranch = _self.spanningEntityAndMonitorBranches(entityBranch,monitorBranch);
		var newGroupAndEntityBranch = _self.spanningGroupAndEntityBranches(groupBranch,entityBranch,newSeAndGroupBranches);
		newGroupAndEntityBranch = _self.spanningGroupAndGroupBranches(newGroupAndEntityBranch,groupBranch);

		_self.mergeSeBranch(newSeAndGroupBranches);
		_self.mergeGroupBranch(newGroupAndEntityBranch);
		_self.mergeEntityBranch(newEntityBranch);

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
		var _self = this;
		for(seid  in newSeAndGroupBranches){
			_self.compareSeOrGroupBranch(newSeAndGroupBranches[seid]);
		}
	}
});

//合并新旧组结构
Object.defineProperty(SyncTree,"mergeGroupBranch",{
	value:function(newGroupAndEntityBranch){
		var _self = this;
		for(seid  in newGroupAndEntityBranch){
			_self.compareSeOrGroupBranch(newGroupAndEntityBranch[seid]);
		}
	}
});

//合并新旧设备结构
Object.defineProperty(SyncTree,"mergeEntityBranch",{
	value:function(newEntityBranch){
		var _self = this;
		for(entity_id in newEntityBranch){
			_self.compareEntityBranch(newEntityBranch[entity_id]);
		}
	}
})



Object.defineProperty(SyncTree,"compareSeOrGroupBranch",{
	value:function(newSe){
		_self = this;
		var sv_id  = newSe.sv_id;
		var oldSe = Svse.findOne({sv_id:sv_id});
		if(!oldSe){
			Svse.insert(newSe);
			return;
		}
		var entityChange = _self.compareArray(oldSe.subentity,newSe.subentity);
		var pushEntities = entityChange["push"];
		var popEntities = entityChange["pop"];
		var groupChange = _self.compareArray(oldSe.subgroup,newSe.subgroup);
		var pushGroups = groupChange["push"];
		var popGroups = groupChange["pop"];
		if(!pushEntities.length && !popEntities.length && !pushGroups.length && !popGroups.length){
			return;
		}
		_self.testCompare("pushEntities:",pushEntities)
		_self.testCompare("popEntities:",popEntities)
		_self.testCompare("pushGroups:",pushGroups)
		_self.testCompare("popGroups:",popGroups)
		_self.testBeforeAfter(sv_id,"Before");

		Svse.update(
				{sv_id: sv_id},
				{ 
					$pushAll: { 
						subentity: pushEntities,
						subgroup: pushGroups
					},
					$set:{has_son : true} 
				},
				function(err){
					Log4js.error("SyncTree  compareSeOrGroupBranch");
					Log4js.error(err);
					_self.testBeforeAfter(sv_id,"Before");
				}
			);
		Svse.update(
				{sv_id: sv_id},
				{ 
					$pullAll: { 
						subentity: popEntities,
						subgroup:popGroups
					},
					$set:{has_son : true} 
				},
				function(err){
					Log4js.error("SyncTree  compareSeOrGroupBranch");
					Log4js.error(err);
					_self.testBeforeAfter(sv_id,"Before");
				}
			);
		_self.removeTreeNodesByArray(popEntities);
		_self.removeTreeNodesByArray(popGroups);
	}
});

Object.defineProperty(SyncTree,"compareEntityBranch",{
	value:function(newEntity){
		_self = this;
		var sv_id  = newEntity.sv_id;
		var oldEntity = Svse.findOne({sv_id:sv_id});
		if(!oldEntity){
			Svse.insert(newEntity);
			return;
		}
		var monitorChange = _self.compareArray(oldEntity.submonitor,newEntity.submonitor);
		var pushMonitors = monitorChange["push"];
		var popMonitors = monitorChange["pop"];
		if(!pushMonitors.length && !popMonitors.length){
			return;
		}
		_self.testCompare("pushMonitors:",pushMonitors)
		_self.testCompare("popMonitors:",popMonitors)
		_self.testBeforeAfter(sv_id,"Before");
		//不同同时使用 $pushAll 和$pullAll操作
		Svse.update(
				{sv_id: sv_id},
				{ 
					$pushAll: { 
						submonitor: pushMonitors
					},
					$set:{has_son : true} 
				},
				function(err){
					Log4js.error("SyncTree  compareEntityBranch");
					Log4js.error(err);
					_self.testBeforeAfter(sv_id,"After");
				}
			);
		Svse.update(
				{sv_id: sv_id},
				{ 
					$pullAll: { 
						submonitor: popMonitors
					}
				},
				function(err){
					Log4js.error("SyncTree  compareEntityBranch");
					Log4js.error(err);
					_self.testBeforeAfter(sv_id,"After");
				}
			);
		_self.removeTreeNodesByArray(pushMonitors);
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
//比较两个数组，如果数组相同返回false;如果不同，返回数组变化情况。以对象描述
Object.defineProperty(SyncTree,"compareArray",{
	value: function (original,target) {//比较两个数组，如果数组相同返回false;如果不同，返回数组变化情况。以对象描述
		if(typeof original === "undefined" && typeof target === "undefined"){
			return {
				push:[],
				pop:[]
			};
		}
			
		var changeObj =  {};
		if(!original && target){
			changeObj["push"] = target ? target :[];
			changeObj["pop"] = [];
			return changeObj;
		}
		if(original && !target){
			changeObj["pop"] = original ? original :[];
			changeObj["push"] = [];
			return changeObj;
		}
		
		var oriLength = original.length;
		var tarLength = target.length;
		changeObj["push"] = [];
		changeObj["pop"] = [];
		for(x=0;x<oriLength;x++){
			var flag = false;
			for(y=0;y<tarLength;y++){
				if(original[x] === target[y]){
					flag = true;
					break;
				}
			}
			if(flag) continue;
			changeObj["pop"].push(original[x]);		
		}
		for(i=0;i<tarLength;i++){
			var flag = false;
			for(j=0;j<oriLength;j++){
				if(original[j] === target[i]){
					flag = true;
					break;
				}
			}
			if(flag) continue;
			changeObj["push"].push(target[i]);		
		}
		
		if(changeObj["push"].length === 0 && changeObj["pop"].length === 0){
			return {
				push:[],
				pop:[]
			};
		}
		return changeObj;
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

Object.defineProperty(SyncTree,"removeTreeNodesByArray",{
	value:function(arr){
		SvseTree.remove({sv_id:{$in:arr}});
	}
});
Object.defineProperty(SyncTree,"isEmptyArray",{
	value:function(arr){
		return (arr && arr.length) ? arr : [];
	}
});

Object.defineProperty(SyncTree,"testCompare",{
	value:function(a,b){
		if(b.length == 0){
			return;
		}
		console.log(a)
		console.log(b);
	}
});

Object.defineProperty(SyncTree,"testBeforeAfter",{
	value:function(sv_id,s){
		console.log(s);
		console.log(Svse.findOne({sv_id:sv_id}));
	}
});