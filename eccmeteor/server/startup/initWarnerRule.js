initWarnerRuleAtStartUp = function(debug){
	Log4js.info("初始化报警规则列表开始...");
	if(debug === -1)return;
	SvseWarnerRule.remove({});
	Log4js.info("SvseWarnerRule Collection 已清空");
	var list = SvseMethodsOnServer.svGetWarnerRule();
	if(!list){
		Log4js.info("初始化报警规则列表失败",0);
		return;
	}
	//console.log(list)
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseWarnerRule.insert(list[itemname],function(err,r_id){
			if(err){
				Log4js.info("插入报警规则"+itemname+"失败",-1);
				Log4js.info(err,-1);
			}else{
			//	console.log(r_id)
			}
		});
	}
	Log4js.info("初始化报警规则结束");
}