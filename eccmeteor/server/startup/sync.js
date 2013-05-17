var SyncFunction = {
	'findTreeNodes' : function (id,parentid,type) {
		var fmap;
		if(type === "group"){
			fmap = SvseSyncData.svGetGroup(id);
		}else if(type === "entity"){
			fmap = SvseSyncData.svGetEntity(id);
		}else if(type === "se"){
			fmap = SvseSyncData.svGetSVSE(id);
		}
		if(!fmap) {
			SystemLogger("SyncFunction findTreeNodes fmap不存在");
			return;
		}
		//获取子元素
		if(fmap["subgroup"]){
			var subgroup = [];
			for(x in fmap["subgroup"]){
				subgroup.push(x);
			}
		}
		if(fmap["subentity"]){
			var subentity = [];
			for(y in fmap["subentity"]){
				subentity.push(y);
			}
		}
		if(fmap["submonitor"]){
			var submonitor = [];
			for(z in fmap["submonitor"]){
				submonitor.push(z);
			}
		}
		//添加不存在的分支
		if(!SysncDb.isExistBranch(id)){//如果该设备分支没有存储过，则插入到数据库中。
			SystemLogger("SyncFunction findTreeNodes 插入节点");
			var obj = {};
			obj["type"] = type;
			obj["parentid"] = parentid;
			obj["sv_id"] = id;
			if(type === "entity"){
				if(submonitor)
					obj["submonitor"] = submonitor;
			}else{
				if(subgroup) 
					obj["subgroup"]= subgroup;
				if(subentity)
					obj["subentity"] = subentity;
				if(subgroup || subentity)
					obj["has_son"] = true;
				if(type === "group"){
					obj["property"] = fmap["property"]
				}
			}
			SysncDb.addBranchOnTree(obj);
		}else{ //更新分支
			if(subgroup && subgroup.length){
				var originalGroup = SysncDb.findSubGroupById(id);
				if(!originalGroup) return;
				var changeGroupObj = Utils.compareArray(originalGroup,subgroup);
				if(changeGroupObj){
					SystemLogger("SyncFunction findTreeNodes 更新新节点");
					SystemLogger("changeGroupObj:");
					SystemLogger(changeGroupObj);
					if(changeGroupObj["push"] && changeGroupObj["push"].length > 0)
						SysncDb.addSubGroupByIds(id,changeGroupObj["push"]);
					if(changeGroupObj["pop"] && changeGroupObj["pop"].length > 0)
						SysncDb.removeSubGroupByIds(id,changeGroupObj["pop"]);
				}
			}
			
			if(subentity && subentity.length){
				var originalEntity = SysncDb.findSubEntityById(id);
				if(!originalEntity) return;
				var changeEntityObj = Utils.compareArray(originalEntity,subentity);
				if(changeEntityObj) {
					SystemLogger("changeEntityObj:");
					SystemLogger(changeEntityObj);
					if(changeEntityObj["push"] && changeEntityObj["push"].length > 0)
						SysncDb.addSubEntityByIds(id,changeEntityObj["push"]);
					if(changeEntityObj["pop"] && changeEntityObj["pop"].length > 0)
						SysncDb.removeSubEntityByIds(id,changeEntityObj["pop"]);	
				}
			}
			
			if(submonitor && submonitor.length){
				var originalMonitor = SysncDb.findSubMonitorById(id);
				if(!originalMonitor) return;
				var changeMonitorObj = Utils.compareArray(originalMonitor,submonitor);
				if(changeMonitorObj){//如果监视器个数变化
					SystemLogger("changeEntityObj:");
					SystemLogger(changeMonitorObj);
					if(changeMonitorObj["push"] && changeMonitorObj["push"].length > 0)
						SysncDb.addSubEntityByIds(id,changeMonitorObj["push"]);
					if(changeMonitorObj["pop"] && changeMonitorObj["pop"].length > 0)
						SysncDb.removeSubEntityByIds(id,changeMonitorObj["pop"]);
				}
			}
		
		}
		//深度遍历
		if(subgroup && subgroup.length){
			for(subgroupIndex in subgroup){
				SyncFunction.findTreeNodes(subgroup[subgroupIndex],id,"group");
			}
		}
		if(subentity && subentity.length){
			for(subentityIndex in subentity){
				SyncFunction.findTreeNodes(subentity[subentityIndex],id,"entity");
			}
		}
		
	},
	'SyncTreeStructure' : function () { //更新树结构
		SystemLogger("检查SyncTreeStructure变动开始。。")
		var fmap = SvseSyncData.svGetDefaultTreeData('default',true);
		if(!fmap){
			SystemLogger("SyncTreeStructure fmap不存在");
			return;
		};
		for(son in fmap){	
			var parentid = "0";
			var sv_id = fmap[son]["sv_id"];
			var type = fmap[son]["type"];
			SyncFunction.findTreeNodes(sv_id,parentid,type);
		}
		SystemLogger("检查SyncTreeStructure变动结束。。")
	},
	'SyncTreeNodeData' : function(){ 
		//更新树节点。监视器节点除外
		var fmap = SvseSyncData.svGetDefaultTreeData('default',false);
		for(son in fmap){
			var node = fmap[son];
			if(node["type"] === "monitor")
				continue;
			SysncDb.updateNode(node);
		}
		//更新监视器节点
		var  entities = SysncDb.getEntityBranchs();
		for(index in entities){
			var entityFmap =  SvseSyncData.svGetDefaultTreeData(entities[index]["sv_id"],true);
			for(son2  in entityFmap){
				SysncDb.updateNode(entityFmap[son2]);
			}
		}
	},
	'sync' : function(){
		SystemLogger("检查变动开始。。");
		SyncFunction.SyncTreeNodeData();
		SyncFunction.SyncTreeStructure();
		SystemLogger("检查变动结束。。");
	}
}