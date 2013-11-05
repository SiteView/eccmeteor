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
initSettingNodes = function(status){
	if(status === -1)
		return;
	SvseSettingNodes.remove({});
	var setting = [
			{id:1,pId:0,name:"Alert",action:"alert",type:"alert",icon:"imag/setting/alert.png"},
			{id:3,pId:0,name:"Report",action:"report",type:"report",icon:"imag/setting/Report.png"},
			{id:2,pId:0,name:"Setting",action:"setting",type:"setting",icon:"imag/setting/setting.png"},	
			{id:11,pId:1,name:"AlertRule",action:"AlertRule",type:"alert",icon:"imag/setting/alertrule.png"},
			{id:12,pId:1,name:"AlertLog",action:"AlertLog",type:"alert",icon:"imag/setting/alertlog.png"},
			{id:13,pId:1,name:"AlertPlan",action:"AlertPlan",type:"alert",icon:"imag/setting/alertplan.png"},
			{id:21,pId:2,name:"BasicSetting",action:"BasicSetting",type:"setting",icon:"imag/setting/setting.png"},
			{id:22,pId:2,name:"EmailSetting",action:"EmailSetting",type:"setting",icon:"imag/setting/emailsetting.png"},
			{id:23,pId:2,name:"MessageSetting",action:"MessageSetting",type:"setting",icon:"imag/setting/messagesetting.png"},
			{id:24,pId:2,name:"UserSetting",action:"UserSetting",type:"setting",icon:"imag/setting/usersetting.png"},
			{id:31,pId:3,name:"statistical",action:"statistical",type:"report",icon:"imag/setting/statistical.png"},
			{id:32,pId:3,name:"trend",action:"trend",type:"report",icon:"imag/setting/trend.png"},
			{id:33,pId:3,name:"topN",action:"topN",type:"report",icon:"imag/setting/topN.png"},
			{id:34,pId:3,name:"statusStatistical",action:"statusStatistical",type:"report",icon:"imag/setting/statusStatistical.png"},
			{id:35,pId:3,name:"contrast",action:"contrast",type:"report",icon:"imag/setting/contrast.png"},
			{id:36,pId:3,name:"operationAndMaintenance",action:"operationAndMaintenance",type:"setting",icon:"imag/setting/operationAndMaintenance.png"},
			{id:37,pId:3,name:"time",action:"time",type:"report",icon:"imag/setting/time.png"},
			{id:38,pId:3,name:"monitorInfo",action:"monitorInfo",type:"report",icon:"imag/setting/monitorInfo.png"},
			{id:39,pId:3,name:"SysLogQuery",action:"SysLogQuery",type:"report",icon:"imag/setting/SysLogQuery.png"},
		];
	var length = setting.length;
	for(var index = 0 ; index < length; index++){
		SvseSettingNodes.insert(setting[index]);
	}
}