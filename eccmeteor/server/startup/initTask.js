initTaskAtStartUp = function(debug){
	Log4js.info("初始化计划任务开始...");
	if(debug === -1)return;
	SvseTask.remove({});
	Log4js.info("Task Collection 已清空");
	var tasks = SvseMethodsOnServer.svGetAllTask();
	if(!tasks){
		Log4js.info("初始化计划失败",-1);
		return;
	}
	
	for(taskid in tasks){
		var task = tasks[taskid];
		if(taskid === "return") continue;
		task["sv_name"] = taskid;
		SvseTask.insert(task,function(err,r_id){
			if(err){
				Log4js.info("插入任务"+taskid+"失败",0);
				Log4js.info(err,0);
			}
		});
	}
	Log4js.info("初始化计划任务完成");
}