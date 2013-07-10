SvseTreeDaoOnServer = {
	//根据父节点id和本身Id插入节点
	"getNodeByParentIdAndId" : function(parentid,id){
		var dowhat = {
		'dowhat' : 'GetTreeData',
		'parentid' : parentid
		}
		var node = {};
		var result = SvseMethodsOnServer.svForest(dowhat);
		if(!result)throw new Meteor.Error(500,"SvseTreeDaoOnServer.getNodeByParentIdAndId has errors");
		for(index in result){
			if(result[index]["sv_id"] === id){
				node = result[index];
					break;
			}	
		}
		return node;
	}
}