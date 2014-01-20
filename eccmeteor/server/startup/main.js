/*
	Type： add | modify
	Author：任杰
	Date:2013-10-18 10:18
	Content:增加 "initTopNListAtStartUp":initTopNListAtStartUp

===============================================

	Type： add 
	Author：xuqiang
	Date:2013-10-24 12:00
	Content:initStatisticalList.js ////initStatisticalAtStartUp

===================================================
	Type： add 
	Author：huyinghuan
	Date:2013-10-29 16:18
	Content:增加 initSettingNodes

===================================================
	Type： add 
	Author：huyinghuan
	Date:2013-11-4 13:29
	Content:增加语言 initLanguageAtStartUp
*/

//综合./init*.js中的方法，提供统一访问接口
initDateAtStartUp = {
	"initSvseMonitorsTemplateAtStartUp":initSvseMonitorsTemplateAtStartUp, //初始化监视器模板信息
	"initSvseEntityTempletGroupAtStartUp":initSvseEntityTempletGroupAtStartUp, //初始化设备模板信息
//	"initSvseEntityInfoAtStartUp":initSvseEntityInfoAtStartUp, //初始化设备详细信息
	"initTaskAtStartUp":initTaskAtStartUp,
	"initEmailListAtStartUp":initEmailListAtStartUp,
	"initWarnerRuleAtStartUp":initWarnerRuleAtStartUp,
	"initAdminAccount":initAdminAccount,
	"initTopNListAtStartUp":initTopNListAtStartUp,
	"initMessageListAtStartUp":initMessageListAtStartUp,
	"initSettingNodes":initSettingNodes,
	"initStatisticalAtStartUp":initStatisticalAtStartUp,
	"initLanguageAtStartUp":initLanguageAtStartUp
};