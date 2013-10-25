/*
	Type： add
	Author：xuqiang
	Date:2013-10-24 13:40
	Content: add  initStatisticalAtStartUp
*/ 
//调用定义在Server/startup/main.js中的方法
function initAllDateStartUp(status){
	if(status === 0)
		return;
	initDateAtStartUp["initTreeDataAtStartup"](0);
	initDateAtStartUp["initSvseTreeStructureAtStartUp"](0);
	initDateAtStartUp["initSvseMonitorsTemplateAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityTempletGroupAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityInfoAtStartUp"](0);
	initDateAtStartUp["initTaskAtStartUp"](-1);
	initDateAtStartUp["initEmailListAtStartUp"](-1);
	initDateAtStartUp["initWarnerRuleAtStartUp"](-1);
	initDateAtStartUp["initAdminAccount"]();
	initDateAtStartUp["initMessageListAtStartUp"](0);
	initDateAtStartUp["initStatisticalAtStartUp"](0);
	SystemLogger("全部数据初始化完毕");
//	var timeloop = new UnrealThread(SyncFunction.sync,70*1000);
//	timeloop.start();
}
Meteor.startup(function(){
	process.sv_init();
	initAllDateStartUp(1);	
});