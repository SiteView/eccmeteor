initTreeDataAtStartup = function(debug){
	Log4js.info("初始化基本节点信息开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseTree.remove({});
		Log4js.info("tree date is clear");
	}
	var result = SvseMethodsOnServer.svGetTreeData();
	if(!result){
		Log4js.info("initTreeDataAtStartup failed，svGetTreeData exists errors",-1);
		return;
	}
	for(son in result){
		var treeNode = result[son];
		var sv_id = treeNode["sv_id"];
		if(treeNode["type"] === "monitor"){ //判断是否为设备属性，因为一次性找到的monitor信息 有很多属性没有包括，需要单独通过直接父节点获取TreeData来更新。
			continue;
		}
		SvseTree.insert(treeNode,function(err,r_id){
			if(err){
				Log4js.info(err);
			}
		});		
	}
	Log4js.info("初始化基本节点信息完成");
}