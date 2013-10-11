//插入监视器模板信息
initSvseMonitorsTemplateAtStartUp = function(debug){
	if(debug === -1)return;
	var result = SvseMethodsOnServer.svGetAllMonitorTempletInfo();
	if(!result){
		SystemLogger("initSvseMonitorsTemplateAtStartUp failed,svGetAllMonitorTempletInfo exists errors!!",-1);
		return;
	}
	SvseMonitorTemplate.remove({});
	SystemLogger("模板正在更新。。。");
	for(id in result["monitors"]){
		var monitor = SvseMethodsOnServer.svGetMonitorTemplet(id);
		if(!monitor){
			SystemLogger("initSvseMonitorsTemplateAtStartUp  failed,svGetMonitorTemplet " +id+" exists errors!!",-1);
			continue;
		}
		SvseMonitorTemplate.insert(monitor,function(err,r_id){
			if(err)SystemLogger(err,-1);
		});
	}
	SystemLogger("模板更新完成！");
}