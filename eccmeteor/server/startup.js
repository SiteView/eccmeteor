//调用定义在Server/startup/main.js中的方法
function initAllDateStartUp(){
	initDateAtStartUp["initTreeDataAtStartup"](-1);
	initDateAtStartUp["initSvseTreeStructureAtStartUp"](-1);
	initDateAtStartUp["initSvseMonitorsTemplateAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityTempletGroupAtStartUp"](-1);
	initDateAtStartUp["initSvseEntityInfoAtStartUp"](-1);
	initDateAtStartUp["initTaskAtStartUp"](-1);
	SystemLogger("全部数据初始化完毕");
}

Meteor.startup(function(){
	process.sv_init();
	initAllDateStartUp();
});