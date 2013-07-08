initWarnerRuleAtStartUp = function(debug){
	SystemLogger("初始化报警规则列表开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseWarnerRule.remove({});
		SystemLogger("SvseWarnerRule Collection 已清空");
	}
	var list = SvseMethodsOnServer.svGetWarnerRule();
	if(!list){
		SystemLogger("初始化报警规则列表失败",0);
		return;
	}
	//console.log(list)
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseWarnerRule.insert(list[itemname],function(err,r_id){
			if(err){
				SystemLogger("插入报警规则"+itemname+"失败",-1);
				SystemLogger(err,-1);
			}else{
			//	console.log(r_id)
			}
		});
	}
	SystemLogger("初始化报警规则结束");
}