SyncFunction = {
	//同步邮件列表
	'SyncEmailList':function(){
		Log4js.info("扫描 SysncEmailList 变动开始。。");
		var list = SvseMethodsOnServer.svGetEmailList();
		if(!list){
			Log4js.info("初始化邮件列表失败",-1);
			return;
		}
		for(itemname in list){
			if(itemname.indexOf("return") !== -1) continue;
			var item = list[itemname];
			var flag = Utils.compareObject(item,SvseEmailList.findOne({nIndex:item["nIndex"]}),{_id:true});
			if(flag) continue;
			SvseEmailList.update({nIndex:item["nIndex"]},item);
		}
		Log4js.info("扫描 SysncEmailList 变动结束。。");
	},
	
	
	//同步统计报告列表
	'SyncStatisticalList':function(){
		Log4js.info("扫描统计报告list开始！");
		var list = SvseMethodsOnServer.svGetStatisticalList();
		if(!list){
		Log4js.info("初始化统计报告列表失败",-1);
		return;
		}
		for(itemname in list){
		if(itemname.indexof("return")!== -1) continue;
		var item = list[itemname];
		var flag = Utils.compareObject(item,SvseStatisticalresultlist.findOne({nIndex:item["nIndex"]}),{_id:true});
		if(flag) continue;
		SvseStatisticalresultlist.update({nIndex:item["nIndex"]},item);
		}
		Log4js.info("扫描统计报告list结束！");
	},
	
	
	//同步报警规则
	'SyncWarnerRules' : function(){
		Log4js.info("扫描 SyncWarnerRules 变动开始。。");
		var list = SvseMethodsOnServer.svGetWarnerRule();
		if(!list){
			Log4js.info("初始化报警规则失败",-1);
			return;
		}
		for(itemname in list){
			if(itemname.indexOf("return") !== -1) continue;
			var item = list[itemname];
			var flag = Utils.compareObject(item,SvseWarnerRule.findOne({nIndex:item["nIndex"]}),{_id:true});
			if(flag) continue;
			SvseWarnerRule.update({nIndex:item["nIndex"]},item);
		}
		Log4js.info("扫描 SyncWarnerRules 变动结束。。");
	},
	/*
		Type： add | modify
		Author：任杰
		Date:2013-10-18 09:40
		Content:增加和修改 SyncTopNList
	*/ 
	//同步TopN报告列表
	'SyncTopNList' : function(){
		Log4js.info("扫描 SyncTopNList 变动开始。。");
		var list = SvseMethodsOnServer.svGetTopNList();
		if(!list){
			Log4js.info("初始化TopN报告失败",-1);
			return;
		}
		for(itemname in list){
			if(itemname.indexOf("return") !== -1) continue;
			var item = list[itemname];
			var flag = Utils.compareObject(item,SvseTopNresultlist.findOne({nIndex:item["nIndex"]}),{_id:true});
			if(flag) continue;
			SvseTopNresultlist.update({nIndex:item["nIndex"]},item);
		}
		Log4js.info("扫描 SyncTopNresultlist 变动结束。。");
	},
	/*
		Author:zhuqing
		Data:2013-10-23 10:00
		Content:添加 SyncMessageList
	*/
	//同步短信列表
	'SyncMessageList':function(){
		Log4js.info("扫描 SyncMessageList 变动开始。。");
		var list = SvseMethodsOnServer.svGetMessageList();
		if(!list){
			Log4js.info("初始化短信列表失败",-1);
			return;
		}
		for(itemname in list){
			if(itemname.indexOf("return") !== -1) continue;
			var item = list[itemname];
			var flag = Utils.compareObject(item,SvseMessageList.findOne({nIndex:item["nIndex"]}),{_id:true});
			if(flag) continue;
			SvseMessageList.update({nIndex:item["nIndex"]},item);
		}
		Log4js.info("扫描 SyncMessageList 变动结束。。");
	},
	
	'sync' : function(){
		Log4js.info("扫描变动开始。。");
		SyncFunction.SyncEmailList();
		SyncFunction.SyncWarnerRules();
		SyncFunction.SyncTopNList();
		SyncFunction.SyncMessageList();
		SyncFunction.SyncStatisticalList();
		Log4js.info("扫描变动结束。。");
	}
}