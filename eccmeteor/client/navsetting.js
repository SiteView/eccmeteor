var NavigationSettionTreeEvents = {
	"warner":function(){},
	"setting":function(){},
	"warnerrule":function(){
		SwithcView.view(SETTINGVIEW.WARNERRULE);
	},
	"warnerlog":function(){
		console.log("执行了 warnerlog");
	},
	"warnerplan":function(){
		console.log("执行了 warnerplan");
	},
	"basicsetting":function(){
		console.log("执行了 basicsetting");
	},
	"emailsetting":function(){
		SwithcView.view(SETTINGVIEW.EMAILSETTING);
	},
	"messagesetting":function(){
		console.log("执行了 messagesetting");
	},
	"usersetting":function(){
		SwithcView.view(SETTINGVIEW.USERSETTING);
	}
}
NavigationSettionTree = {
	getTreeData:function(){
		return [
			{id:1,pId:0,name:LanguageModel.getLanaguage().warner,action:"warner"},
			{id:2,pId:0,name:LanguageModel.getLanaguage().setting,action:"setting"},
			{id:11,pId:1,name:LanguageModel.getLanaguage().warnerrule,action:"warnerrule"},
			{id:12,pId:1,name:LanguageModel.getLanaguage().warnerlog,action:"warnerlog"},
			{id:13,pId:1,name:LanguageModel.getLanaguage().warnerplan,action:"warnerplan"},
			{id:21,pId:2,name:LanguageModel.getLanaguage().othersetting.basicsetting,action:"basicsetting"},
			{id:22,pId:2,name:LanguageModel.getLanaguage().othersetting.emailsetting,action:"emailsetting"},
			{id:23,pId:2,name:LanguageModel.getLanaguage().othersetting.messagesetting,action:"messagesetting"},
			{id:24,pId:2,name:LanguageModel.getLanaguage().othersetting.usersetting,action:"usersetting"},
		];
	},
	execute:function(action){
		NavigationSettionTreeEvents[action]();
	}
}