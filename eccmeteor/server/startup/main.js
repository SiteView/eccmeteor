/*
Type： add | modify
Author：任杰
Date:2013-10-18 10:18
Content:增加 "initTopNListAtStartUp":initTopNListAtStartUp
*/

//综合./init*.js中的方法，提供统一访问接口
initDateAtStartUp = {
	"initTreeDataAtStartup":initTreeDataAtStartup,//初始化所有节点信息
	"initSvseTreeStructureAtStartUp":initSvseTreeStructureAtStartUp,//初始化所有树信息
	"initSvseMonitorsTemplateAtStartUp":initSvseMonitorsTemplateAtStartUp, //初始化监视器模板信息
	"initSvseEntityTempletGroupAtStartUp":initSvseEntityTempletGroupAtStartUp, //初始化设备模板信息
	"initSvseEntityInfoAtStartUp":initSvseEntityInfoAtStartUp, //初始化设备详细信息
	"initTaskAtStartUp":initTaskAtStartUp,
	"initEmailListAtStartUp":initEmailListAtStartUp,
	"initWarnerRuleAtStartUp":initWarnerRuleAtStartUp,
	"initAdminAccount":initAdminAccount,
	"initTopNListAtStartUp":initTopNListAtStartUp,
	"initMessageListAtStartUp":initMessageListAtStartUp
};