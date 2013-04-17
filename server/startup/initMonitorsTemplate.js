//插入监视器模板信息
function initSvseMonitorsTemplateAtStartUp(debug){
	if(debug === -1)return;
	var dowhat ={'dowhat':'GetAllMonitorTempletInfo'};
	Meteor.call("meteorSvUniv", dowhat, function (err, result) {
		if(err){
			SystemLogger("initSvseMonitorsTemplateAtStartUp方法错误："+err);
			return;
		}
		SvseMonitorTemplate.remove({});
		SystemLogger("模板正在更新。。。");
		for(id in result["monitors"]){
			Meteor.call("GetMonitorTemplet",id,function (err, monitor) {
				if(err){
					SystemLogger("GetMonitorTemplet错误："+err);
				}else{
					SvseMonitorTemplate.insert(monitor,function(err1,r_id){
						if(err1)SystemLogger(err1);
					});
				}
			});		
		}
		SystemLogger("模板更新完成！");
	})
}