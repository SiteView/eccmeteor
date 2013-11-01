/**
	Type:add
	Author:huyinghuan
	Date:2013-10-29  星期二 17:11
	Content:初始化设置相关节点
*/
var LanguageModel = {
	getLanaguage:function(s){
		return s;
	}

}
initSettingNodes = function(){
	if(SvseSettingNodes.find().fetch().length)
		return;
	var setting = [
			{id:1,pId:0,name:LanguageModel.getLanaguage("Alert"),action:"warner",type:"warner",icon:"imag/setting/warner.png"},
			{id:3,pId:0,name:LanguageModel.getLanaguage("Report"),action:"report",type:"report",icon:"imag/setting/Report.png"},
			{id:2,pId:0,name:LanguageModel.getLanaguage("setting"),action:"setting",type:"setting",icon:"imag/setting/setting.png"},	
			{id:11,pId:1,name:LanguageModel.getLanaguage(".Alertrule"),action:"warnerrule",type:"warner",icon:"imag/setting/warnerrule.png"},
			{id:12,pId:1,name:LanguageModel.getLanaguage(".Alertlog"),action:"warnerlog",type:"warner",icon:"imag/setting/warnerlog.png"},
			{id:13,pId:1,name:LanguageModel.getLanaguage(".Alertplan"),action:"warnerplan",type:"warner",icon:"imag/setting/warnerplan.png"},
			{id:21,pId:2,name:LanguageModel.getLanaguage(".basicsetting"),action:"basicsetting",type:"setting",icon:"imag/setting/setting.png"},
			{id:22,pId:2,name:LanguageModel.getLanaguage(".emailsetting"),action:"emailsetting",type:"setting",icon:"imag/setting/emailsetting.png"},
			{id:23,pId:2,name:LanguageModel.getLanaguage(".messagesetting"),action:"messagesetting",type:"setting",icon:"imag/setting/messagesetting.png"},
			{id:24,pId:2,name:LanguageModel.getLanaguage(".usersetting"),action:"usersetting",type:"setting",icon:"imag/setting/usersetting.png"},
			{id:31,pId:3,name:LanguageModel.getLanaguage(".statistical"),action:"statistical",type:"report",icon:"imag/setting/statistical.png"},
			{id:32,pId:3,name:LanguageModel.getLanaguage(".trend"),action:"trend",type:"report",icon:"imag/setting/trend.png"},
			{id:33,pId:3,name:LanguageModel.getLanaguage(".topN"),action:"topN",type:"report",icon:"imag/setting/topN.png"},
			{id:34,pId:3,name:LanguageModel.getLanaguage(".statusStatistical"),action:"statusStatistical",type:"report",icon:"imag/setting/statusStatistical.png"},
			{id:35,pId:3,name:LanguageModel.getLanaguage(".contrast"),action:"contrast",type:"report",icon:"imag/setting/contrast.png"},
			{id:36,pId:3,name:LanguageModel.getLanaguage(".operationAndMaintenance"),action:"operationAndMaintenance",type:"setting",icon:"imag/setting/operationAndMaintenance.png"},
			{id:37,pId:3,name:LanguageModel.getLanaguage(".time"),action:"time",type:"report",icon:"imag/setting/time.png"},
			{id:38,pId:3,name:LanguageModel.getLanaguage(".monitorInfo"),action:"monitorInfo",type:"report",icon:"imag/setting/monitorInfo.png"},
			{id:39,pId:3,name:LanguageModel.getLanaguage(".SysLogQuery"),action:"SysLogQuery",type:"report",icon:"imag/setting/SysLogQuery.png"},
		];
	var length = setting.length;
	for(var index = 0 ; index < length; index++){
		SvseSettingNodes.insert(setting[index]);
	}
}