initMessageListAtStartUp = function(debug){
	SystemLogger("初始化短信列表开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseMessageList.remove({});
		SystemLogger("MessageList Collection 已清空");
	}
	var list = SvseMethodsOnServer.svGetMessageList();
	if(!list){
		SystemLogger("初始化短信列表失败",-1);
		return;
	}
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseMessageList.insert(list[itemname],function(err,r_id){
			if(err){
				SystemLogger("插入短信列表"+itemname+"失败",0);
				SystemLogger(err,0);
			}
		});
	}
	SystemLogger("初始化短信列表结束");
}