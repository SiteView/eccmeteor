initMessageListAtStartUp = function(debug){
	Log4js.info("初始化短信列表开始...");
	if(debug === -1)return;
	SvseMessageList.remove({});
	Log4js.info("MessageList Collection 已清空");
	var list = SvseMethodsOnServer.svGetMessageList();
	if(!list){
		Log4js.info("初始化短信列表失败",-1);
		return;
	}
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseMessageList.insert(list[itemname],function(err,r_id){
			if(err){
				Log4js.info("插入短信列表"+itemname+"失败",0);
				Log4js.info(err,0);
			}
		});
	}
	Log4js.info("初始化短信列表结束");
}