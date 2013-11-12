var NavigationSettingTreeEvents = {
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
