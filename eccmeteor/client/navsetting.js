var NavigationSettionTreeEvents = {
	"alert":function(){},
	"setting":function(){},
	"AlertRule":function(){
		SwithcView.view(SETTINGVIEW.WARNERRULE);
	},
	"AlertLog":function(){
		console.log("执行了 AlertLog");
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
	"trend":function(){
		SwithcView.view(REPORT.TREND)
	}

	/*
	Type：add
	Author：renjie
	Date:2013-11-14 09:20
	Content:添加 SwithcView.view(REPORT.STATUSSTATISTICAL);
	*/ 
   "statusStatistical":function(){
       SwithcView.view(REPORT.STATUSSTATISTICAL);
    }
}
NavigationSettionTree = {
	getTreeData:function(){
		var nodes = [];
		SvseSettingNodes.find().forEach(function(node){
			node.name = LanguageModel.getLanaguage("SettingNodeTree")[node.name];
			nodes.push(node);
		});
		return nodes;
	},
	execute:function(action){
		NavigationSettionTreeEvents[action]();
	}
}
