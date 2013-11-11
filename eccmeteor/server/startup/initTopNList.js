initTopNListAtStartUp = function(debug){
	Log4js.info("初始化TopN报告列表开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseTopNresultlist.remove({});
		Log4js.info("SvseTopNlist Collection 已清空");
	}
	var list = SvseMethodsOnServer.svGetTopNList();
	if(!list){
		Log4js.info("初始化TopN报告列表失败",0);
		return;
	}
	//console.log(list)
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseTopNresultlist.insert(list[itemname],function(err,r_id){
			if(err){
				Log4js.info("插入TopN报告"+itemname+"失败",-1);
				Log4js.info(err,-1);
			}else{
			//	console.log(r_id)
			}
		});
	}
	Log4js.info("初始化TopN报告列表结束");
}