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
		if(!fmap) return;
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
		//添加不存在的节点
		if(Svse.find({sv_id:id}).fetch().length === 0 ){//如果该设备没有存储过，则插入到数据库中。
			var obi = {};
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
				if(type === "group"){
					obj["property"] = fmap["property"]
				}
			}
			Svse.insert(obj,function(err){
				if(err){
					SystemLogger("自动更新，Svse.insert插入错误！\n sync.js 51 line");
					SystemLogger(err,-1);
				}
			});
		}else{ //更新节点
			if(subgroup && subgroup.length){
				var originalGroup = SysncDb.findSubGroupById(id);
				if(!originalGroup) return;
				var changeGroupObj = Utils.compareArray(originalGroup,subgroup);
				if(!changeGroupObj) return;
				SystemLogger(changeGroupObj);
				if(changeGroupObj["push"] && changeGroupObj["push"].length > 0)
					SysncDb.addSubGroupByIds(id,changeGroupObj["push"]);
				if(changeGroupObj["pop"] && changeGroupObj["pop"].length > 0)
					SysncDb.removeSubGroupByIds(id,changeGroupObj["pop"])
			}
			
			if(subentity && subentity.length){
				var originalEntity = SysncDb.findSubEntityById(id);
				if(!originalEntity) return;
				var changeEntityObj = Utils.compareArray(originalEntity,subentity);
				if(!changeEntityObj) return;
				SystemLogger(changeEntityObj);
				if(changeEntityObj["push"] && changeEntityObj["push"].length > 0)
					SysncDb.addSubEntityByIds(id,changeEntityObj["push"]);
				if(changeEntityObj["pop"] && changeEntityObj["pop"].length > 0)
					SysncDb.removeSubEntityByIds(id,changeEntityObj["pop"]);
			}
			
			if(submonitor && submonitor.length){
				var originalMonitor = SysncDb.findSubMonitorById(id);
				if(!originalMonitor) return;
				var changeMonitorObj = Utils.compareArray(originalMonitor,submonitor);
				if(!changeMonitorObj) return; //如果监视器个数无变化
				SystemLogger(changeMonitorObj);
				if(changeMonitorObj["push"] && changeMonitorObj["push"].length > 0)
					SysncDb.addSubEntityByIds(id,changeMonitorObj["push"]);
				if(changeMonitorObj["pop"] && changeMonitorObj["pop"].length > 0)
					SysncDb.removeSubEntityByIds(id,changeMonitorObj["pop"])
			}
		
		}
		
		//深度遍历
		if(subgroup && subgroup.length){
			for(subgroupIndex in subgroup){
				SyncFunction.findTreeNodes(subgroup[subgroupIndex],id,"group")
			}
		}
		if(subentity && subentity.length){
			for(subentityIndex in subentity){
				SyncFunction.findTreeNodes(subentity[subentityIndex],id,"entity")
			}
		}
		
	},
	'SyncTreeStructure' : function () {
		var fmap = SvseSyncData.svGetDefaultTreeData('default',true);
		if(!fmap) return;
		for(son in fmap){	
			var parentid = "0";
			var sv_id = fmap[son]["sv_id"];
			var type = fmap[son]["type"];
			SyncFunction.findTreeNodes(sv_id,parentid,type);
		}
	},
	'SyncTreeNodeData' : function(){
	
	},
	'sync' : function(){
	
	}
}