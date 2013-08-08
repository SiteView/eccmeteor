//调用定义在Server/startup/main.js中的方法
function initAllDateStartUp(status){
	if(status === 0)
		return;
	initDateAtStartUp["initTreeDataAtStartup"](0);
	initDateAtStartUp["initSvseTreeStructureAtStartUp"](0);
	initDateAtStartUp["initSvseMonitorsTemplateAtStartUp"](0);
	initDateAtStartUp["initSvseEntityTempletGroupAtStartUp"](0);
	initDateAtStartUp["initSvseEntityInfoAtStartUp"](0);
	initDateAtStartUp["initTaskAtStartUp"](0);
	initDateAtStartUp["initEmailListAtStartUp"](0);
	initDateAtStartUp["initWarnerRuleAtStartUp"](0);
	initDateAtStartUp["initAdminAccount"]();
	SystemLogger("全部数据初始化完毕");
//	var timeloop = new UnrealThread(SyncFunction.sync,70*1000);
//	timeloop.start();

}
Meteor.startup(function(){
	process.sv_init();
	initAllDateStartUp();	
});