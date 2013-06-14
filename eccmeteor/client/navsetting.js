var NavigationSettionTreeEvents = {
	"warner":function(){},
	"setting":function(){},
	"warnerrule":function(){
		
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
		SwithcView.view(MONITORVIEW.EMAILSETTING);
	},
	"messagesetting":function(){
		console.log("执行了 messagesetting");
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
			{id:21,pId:2,name:LanguageModel.getLanaguage().basicsetting,action:"basicsetting"},
			{id:22,pId:2,name:LanguageModel.getLanaguage().emailsetting,action:"emailsetting"},
			{id:23,pId:2,name:LanguageModel.getLanaguage().messagesetting,action:"messagesetting"},
		];
	},
	execute:function(action){
		NavigationSettionTreeEvents[action]();
	}
}