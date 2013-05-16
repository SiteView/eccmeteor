//初始化设备详细信息 //需要在SvseTree初始化完成后进行
function initSvseEntityInfoAtStartUp(debug){
	SystemLogger("设备详细信息初始化开始...");
	if(debug == -1)return;
	if(debug == 0){
		SvseEntityInfo.remove({});
		SystemLogger("设备详细信息清除完成...");
	}
	ids = SvseTree.find({"type":"entity"},{fields: {"sv_id": 1}}).fetch();
	SystemLogger("应插入设备信息"+ids.length+"条");
	for (index in ids){
		var id = ids[index].sv_id
		var entityinfo = SvseMethodsOnServer.svGetEntity(id);
		if(!entityinfo){
			SystemLogger("设备"+id+"信息不存在");
			continue;
		}
		entityinfo.submonitor = undefined;
		SvseEntityInfo.insert(entityinfo,function(err,_id){
			if(err){
				SystemLogger("SvseEntityInfo insert errors:"+err);
			}
		});
	}
	SystemLogger("实际插入设备信息"+SvseEntityInfo.find().count()+"条");
	SystemLogger("设备详细信息初始化完成");
}