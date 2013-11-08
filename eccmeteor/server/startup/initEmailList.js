initEmailListAtStartUp = function(debug){
	Log4js.info("初始化邮件列表开始...");
	if(debug === -1)return;
	if(debug === 0){
		SvseEmailList.remove({});
		Log4js.info("EmailList Collection 已清空");
	}
	var list = SvseMethodsOnServer.svGetEmailList();
	if(!list){
		Log4js.error("初始化邮件列表失败",-1);
		return;
	}
	for(itemname in list){
		if(itemname.indexOf("return") !== -1) continue;
		SvseEmailList.insert(list[itemname],function(err,r_id){
			if(err){
				Log4js.error("插入邮件列表"+itemname+"失败");
				Log4js.error(err);
			}
		});
	}
	Log4js.info("初始化邮件列表结束");
}