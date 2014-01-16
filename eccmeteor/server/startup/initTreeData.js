initTreeDataAtStartup = function(){}

Object.defineProperty(initTreeDataAtStartup,"newTreeStructure",{
	value:function(debug){
		Log4js.info("初始化基本节点信息开始...");
		if(debug === -1)return;
		var _self = this;
		_self.clear();
		

		var result = SvseMethodsOnServer.svGetTreeData();
		if(!result){
			Log4js.info("initTreeDataAtStartup failed，svGetTreeData exists errors",-1);
			return;
		}

		var seBranch = [];
		var groupBranch = [];
		var entityBranch = [];
		var monitorBranch = [];
		for(nodeName in result){
			var node = result[nodeName];
			_self.insertTreeNode(node);//插入节点信息减少一次单独的循环
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
		_self.insertBranches(newEntityBranch);
		_self.insertBranches(newSeAndGroupBranches);
		_self.insertBranches(newGroupAndEntityBranch);
	}
});

//清空数据库
Object.defineProperty(initTreeDataAtStartup,"clear",{
	value:function(){
		SvseTree.remove({});
		Log4js.info("tree date is clear");
		Svse.remove({});
		Log4js.info("Svse date is clear");
	}
});

//生成设备和监视器树的分支
Object.defineProperty(initTreeDataAtStartup,"spanningEntityAndMonitorBranches",{
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
Object.defineProperty(initTreeDataAtStartup,"spanningGroupAndEntityBranches",{
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
Object.defineProperty(initTreeDataAtStartup,"spanningGroupAndGroupBranches",{
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
Object.defineProperty(initTreeDataAtStartup,"spanningSeAndSeBranches",{
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

//插入单个树节点
Object.defineProperty(initTreeDataAtStartup,"insertTreeNode",{
	value:function(node){
		SvseTree.insert(node,function(err){
			if(err){
				Log4js.error("initTreeDataAtStartup.insertTreeNode错误！");
				Log4js.error(node);
			}
			
		});
	}
});
//插入分支
Object.defineProperty(initTreeDataAtStartup,"insertBranches",{
	value:function(newBranches){
		for(sid in newBranches){
			var node = newBranches[sid];
			Svse.insert(node,function(err){
				if(err){
					Log4js.error("initTreeDataAtStartup.insertTreeNode错误！");
					Log4js.error(node);
				}	
			});
		}
	}
});

Object.defineProperty(initTreeDataAtStartup,"getParentId",{
	value:function(id){
		if(id == "1"){
			return "0";
		}
		return id.substr(0,id.lastIndexOf("\."));
	}
});