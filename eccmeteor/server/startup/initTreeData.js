function initTreeDataAtStartup(debug){
	SystemLogger("初始化基本节点信息开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseTree.remove({});
		SystemLogger("tree date is clear");
	}
	
	var dowhat = {
		'dowhat' : 'GetTreeData',
		'parentid' : 'default',
		'onlySon':false
	}
	
	Meteor.call("meteorSvForest", dowhat, function (err, result) {
		if(err){
			SystemLogger("initTreeDataAtStartup方法错误："+err);
			return;
		}
		for(son in result){
			var treeNode = result[son];
			var sv_id = treeNode["sv_id"];
			
			if(treeNode["type"] === "monitor"){ //判断是否为设备属性，因为一次性找到的monitor信息 有很多属性没有包括，需要单独通过直接父节点获取TreeData来更新。
				continue;
			}
			if(SvseTree.find({'sv_id':sv_id}).count() === 0){
				SvseTree.insert(treeNode,function(err,r_id){
					if(err){
						SystemLogger(err);
					}else{
				//		SystemLogger("插入节点 "+ sv_id + " 信息成功");
					}
				});
			}else{  //应该不存在数据更新
				SvseTree.update({'sv_id':sv_id},treeNode,function(err,r_id){
					if(err){
						SystemLogger(err);
					}else{
				//		SystemLogger("update "+ sv_id + " successfully");
					}
				});
			}
			
		}
	});
	SystemLogger("初始化基本节点信息开始完成");
}