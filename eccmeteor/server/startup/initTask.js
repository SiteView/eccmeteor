function initTaskAtStartUp(debug){
	SystemLogger("初始化计划任务开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseTask.remove({});
		SystemLogger("Task Collection 已清空");
	}
	var tasks = SvseMethodsOnServer.svGetAllTask();
	if(!tasks){
		SystemLogger("初始化计划失败",-1);
		return;
	}
	
	for(taskid in tasks){
		var task = tasks[taskid];
		if(taskid === "return") continue;
		task["sv_name"] = taskid;
		SvseTask.insert(task,function(err,r_id){
			if(err){
				SystemLogger("插入任务"+taskid+"失败",0);
				SystemLogger(err,0);
			}
		});
	}
	SystemLogger("初始化计划任务完成");
}