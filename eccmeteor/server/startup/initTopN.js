initTopNAtStartUp = function(debug){
	SystemLogger("初始化TopN报告列表开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseTopN.remove({});
		SystemLogger("SvseTopN Collection 已清空");
	}
	var list = SvseMethodsOnServer.svGetTopN();
	if(!list){
		SystemLogger("初始化TopN报告列表失败",0);
		return;
	}
	//console.log(list)
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseTopN.insert(list[itemname],function(err,r_id){
			if(err){
				SystemLogger("插入TopN报告"+itemname+"失败",-1);
				SystemLogger(err,-1);
			}else{
			//	console.log(r_id)
			}
		});
	}
	SystemLogger("初始化TopN报告结束");
}