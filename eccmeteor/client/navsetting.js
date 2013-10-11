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
		SwithcView.view(SETTINGVIEW.MESSAGESETTING);
	},
	"usersetting":function(){
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
		return [
			{id:1,pId:0,name:LanguageModel.getLanaguage("AlertModel").Alert,action:"warner",type:"warner",icon:"imag/setting/warner.png"},
			{id:3,pId:0,name:LanguageModel.getLanaguage("ReportModel").Report,action:"report",type:"report",icon:"imag/setting/Report.png"},
			{id:2,pId:0,name:LanguageModel.getLanaguage("othersetting").setting,action:"setting",type:"setting",icon:"imag/setting/setting.png"},	
			{id:11,pId:1,name:LanguageModel.getLanaguage("AlertModel").Alertrule,action:"warnerrule",type:"warner",icon:"imag/setting/warnerrule.png"},
			{id:12,pId:1,name:LanguageModel.getLanaguage("AlertModel").Alertlog,action:"warnerlog",type:"warner",icon:"imag/setting/warnerlog.png"},
			{id:13,pId:1,name:LanguageModel.getLanaguage("AlertModel").Alertplan,action:"warnerplan",type:"warner",icon:"imag/setting/warnerplan.png"},
			{id:21,pId:2,name:LanguageModel.getLanaguage("othersetting").basicsetting,action:"basicsetting",type:"setting",icon:"imag/setting/setting.png"},
			{id:22,pId:2,name:LanguageModel.getLanaguage("othersetting").emailsetting,action:"emailsetting",type:"setting",icon:"imag/setting/emailsetting.png"},
			{id:23,pId:2,name:LanguageModel.getLanaguage("othersetting").messagesetting,action:"messagesetting",type:"setting",icon:"imag/setting/messagesetting.png"},
			{id:24,pId:2,name:LanguageModel.getLanaguage("othersetting").usersetting,action:"usersetting",type:"setting",icon:"imag/setting/usersetting.png"},
			{id:31,pId:3,name:LanguageModel.getLanaguage("ReportModel").statistical,action:"statistical",type:"report",icon:"imag/setting/statistical.png"},
			{id:32,pId:3,name:LanguageModel.getLanaguage("ReportModel").trend,action:"trend",type:"report",icon:"imag/setting/trend.png"},
			{id:33,pId:3,name:LanguageModel.getLanaguage("ReportModel").topN,action:"topN",type:"report",icon:"imag/setting/topN.png"},
			{id:34,pId:3,name:LanguageModel.getLanaguage("ReportModel").statusStatistical,action:"statusStatistical",type:"report",icon:"imag/setting/statusStatistical.png"},
			{id:35,pId:3,name:LanguageModel.getLanaguage("ReportModel").contrast,action:"contrast",type:"report",icon:"imag/setting/contrast.png"},
			{id:36,pId:3,name:LanguageModel.getLanaguage("ReportModel").operationAndMaintenance,action:"operationAndMaintenance",type:"setting",icon:"imag/setting/operationAndMaintenance.png"},
			{id:37,pId:3,name:LanguageModel.getLanaguage("ReportModel").time,action:"time",type:"report",icon:"imag/setting/time.png"},
			{id:38,pId:3,name:LanguageModel.getLanaguage("ReportModel").monitorInfo,action:"monitorInfo",type:"report",icon:"imag/setting/monitorInfo.png"},
			{id:39,pId:3,name:LanguageModel.getLanaguage("ReportModel").SysLogQuery,action:"SysLogQuery",type:"report",icon:"imag/setting/SysLogQuery.png"},
		];
	},
	execute:function(action){
		NavigationSettionTreeEvents[action]();
	}
}
