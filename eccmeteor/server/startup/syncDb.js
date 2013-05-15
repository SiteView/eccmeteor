var SysncDb =  {
	findSubGroupById :　function(id){
		var subGroup = Svse.findOne({sv_id:id},{fields: {subgroup: true}});
		if(!subGroup) return false;
		return subGroup["subgroup"];
	},
	addGroupByIds : function(arr){
	
	},
	removeGroupByIds : function (arr){
	
	},
	findSubEntityById : function(id){
		var subEntity = Svse.findOne({sv_id:id},{fields:{subentity:true});
		if(!subEntity) return false;
		return subEntity["subentity"];
	},
	addEntityByIds : function(arr){
	
	},
	removeEntityByIds : function(arr){
	
	}
}