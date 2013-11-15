var NavigationSettionTreeEvents = {
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
