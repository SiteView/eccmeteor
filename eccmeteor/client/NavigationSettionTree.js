var NavigationSettingTreeEvents = {
	"alert":function(){},
	"setting":function(){},
	"AlertRule":function(){
		SwithcView.view(ALERTVIEW.WARNERRULE);
	},
	"AlertLog":function(){
		SwithcView.view(ALERTVIEW.ALERTLOG);
	},
	"AlertPlan":function(){
		console.log("执行了 warnerplan");
	},
	"BasicSetting":function(){
		SwithcView.view(SETTINGVIEW.BASICSETTING);
	},
	"EmailSetting":function(){
		SwithcView.view(SETTINGVIEW.EMAILSETTING);
	},
	"MessageSetting":function(){
		SwithcView.view(SETTINGVIEW.MESSAGESETTING);
	},
	"UserSetting":function(){
		SwithcView.view(SETTINGVIEW.USERSETTING);
	},
	"topN":function(){
		SwithcView.view(REPORT.TOPN);
	},
	"statistical":function(){
		SwithcView.view(REPORT.STATISTICAL);
	},
	/*
	Type： add 
	Author：xuqiang
	Date:2013-11-13 09:40
	Content:增加trend趋势报告
	*/
	"timeconstrastreport":function(){
		SwithcView.view(REPORT.TIMECONSTRASTREPORT);
	},
	/*
	Type： add 
	Author：xuqiang
	Date:2013-11-13 09:40
	Content:增加trend趋势报告
	*/ 
	"trend":function(){
		SwithcView.view(REPORT.TREND)
	},
/*
	Type： add 
	Author：xuqiang
	Date:2013-11-28 15:00
	Content:增加任务计划的 绝对时间任务计划
	*/ 
	"taskabsolute":function(){
		SwithcView.view(TASK.TASKABSOLUTE)
	},
	"taskperiod":function(){
		SwithcView.view(TASK.TASKPERIOD)		
	},
	/*
	Type：add
	Author：renjie
	Date:2013-11-14 09:20
	Content:添加 SwithcView.view(REPORT.STATUSSTATISTICAL);
	*/ 
   "statusStatistical":function(){
       SwithcView.view(REPORT.STATUSSTATISTICAL);
    },
	/*
	Type：add
	Author：renjie
	Date:2013-11-18 15:20
	Content:添加contrast对比报告
	*/ 
	"contrast":function(){
       SwithcView.view(REPORT.CONTRAST);
    },
	"SysLogsetting":function(){
		SwithcView.view(SETTINGVIEW.SYSLOGSETTING);
	},
	
	//zhuqing add SysLogQuery
	"SysLogQuery":function(){
		SwithcView.view(REPORT.SYSLOGQUERY);
	},
/*
	Type：add
	Author：renjie
	Date:2013-11-18 15:20
	Content:添加contrast对比报告
	*/ 
	"License":function(){
       SwithcView.view(SETTINGVIEW.LICENSE);
    }
}
NavigationSettingTree = {
	getTreeData:function(){
		var nodes = [];
		SvseSettingNodes.find().forEach(function(node){
			node.name = LanguageModel.getLanaguage("SettingNodeTree")[node.name];
			nodes.push(node);
		});
		return nodes;
	},
	execute:function(action){
		NavigationSettingTreeEvents[action]();
	}
}
