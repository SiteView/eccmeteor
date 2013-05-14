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
		}
		
	},
	'SyncTreeStructure' : function () {
		var fmap = SvseSyncData.svGetDefaultTreeData('default',true);
		if(!fmap) return;
		
	}

}