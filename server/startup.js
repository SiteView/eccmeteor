//调用定义在Server/startup/main.js中的方法
function initAllDateStartUp(){
	initDateAtStartUp["initTreeDataAtStartup"](0);
	initDateAtStartUp["initSvseTreeStructureAtStartUp"](0);
	initDateAtStartUp["initSvseMonitorsTemplateAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityTempletGroupAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityInfoAtStartUp"](0);
	SystemLogger("全部数据初始化完毕");
}

Meteor.startup(function(){
	process.sv_init();
	initAllDateStartUp();
});