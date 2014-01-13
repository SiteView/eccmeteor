initStatisticalAtStartUp = function(debug){
	Log4js.info("初始化报警规则列表开始...");
	if(debug === -1)return;
	SvseStatisticalresultlist.remove({});
	Log4js.info("SvseStatisticalresultlist Collection 已清空");
	var list = SvseMethodsOnServer.svGetStatisticalList();
	if(!list){
		Log4js.info("初始化统计报告列表失败",0);
		return;
	}
	//console.log(list)
	for(itemname in list){
	 var obj =list[itemname];
	 obj["nIndex"]=itemname;
		// console.log(itemname);
		// console.log("123333");
		if(itemname.indexOf("return") !== -1) continue;
		SvseStatisticalresultlist.insert(obj,function(err,r_id){
			if(err){
				Log4js.info("插入统计报告"+itemname+"失败",-1);
				Log4js.info(err,-1);
			}else{
			//	console.log(r_id)
			}
		});
	}
	Log4js.info("初始化报警规则结束");
}