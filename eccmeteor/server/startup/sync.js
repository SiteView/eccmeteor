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
		if(fmap["subgroup"]){
			var subgroup = [];
			for(x in fmap["subgroup"]){
				subgroup.push(x);
			}
			var originalGroup = SysncDb.findSubGroupById(id);
			if(!originalGroup) return;
			var changeGroupObj = Utils.compareArray(originalGroup,subgroup);
			if(!changeGroupObj) return;
			SystemLogger(changeGroupObj);
			if(changeGroupObj["push"] && changeGroupObj["push"].length > 0)
				SysncDb.addGroupByIds(changeGroupObj["push"]);
			if(changeGroupObj["pop"] && changeGroupObj["pop"].length > 0)
				SysncDb.removeGroupByIds(changeGroupObj["pop"])
		}
		
		if(fmap["subentity"]){
			var subentity = [];
			for(y in fmap["subentity"]){
				subentity.push(y);
			}
			var originalEntity = SysncDb.findSubEntityById(id);
			if(!originalEntity) return;
			var changeEntityObj = Utils.compareArray(originalEntity,subentity);
			if(!changeEntityObj) return;
			SystemLogger(changeEntityObj);
			if(changeEntityObj["push"] && changeEntityObj["push"].length > 0)
				SysncDb.addEntityByIds(changeEntityObj["push"]);
			if(changeEntityObj["pop"] && changeEntityObj["pop"].length > 0)
				SysncDb.removeEntityByIds(changeEntityObj["pop"])	
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
	}

}