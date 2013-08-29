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
			{id:1,pId:0,name:LanguageModel.getLanaguage().warner,action:"warner",type:"warner",icon:"imag/setting/warner.png"},
			{id:2,pId:0,name:LanguageModel.getLanaguage().setting,action:"setting",type:"setting",icon:"imag/setting/setting.png"},
			{id:11,pId:1,name:LanguageModel.getLanaguage().warnerrule,action:"warnerrule",type:"warner",icon:"imag/setting/warnerrule.png"},
			{id:12,pId:1,name:LanguageModel.getLanaguage().warnerlog,action:"warnerlog",type:"warner",icon:"imag/setting/warnerlog.png"},
			{id:13,pId:1,name:LanguageModel.getLanaguage().warnerplan,action:"warnerplan",type:"warner",icon:"imag/setting/warnerplan.png"},
			{id:21,pId:2,name:LanguageModel.getLanaguage().othersetting.basicsetting,action:"basicsetting",type:"setting",icon:"imag/setting/setting.png"},
			{id:22,pId:2,name:LanguageModel.getLanaguage().othersetting.emailsetting,action:"emailsetting",type:"setting",icon:"imag/setting/emailsetting.png"},
			{id:23,pId:2,name:LanguageModel.getLanaguage().othersetting.messagesetting,action:"messagesetting",type:"setting",icon:"imag/setting/messagesetting.png"},
			{id:24,pId:2,name:LanguageModel.getLanaguage().othersetting.usersetting,action:"usersetting",type:"setting",icon:"imag/setting/usersetting.png"},
		];
	},
	execute:function(action){
		NavigationSettionTreeEvents[action]();
	}
}