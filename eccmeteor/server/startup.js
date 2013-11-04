/*
	Type： add
	Author：xuqiang
	Date:2013-10-24 13:40
	Content: add  initStatisticalAtStartUp

====================================================

	Type： add
	Author：renjie
	Date:2013-10-24 13:50
	Content:增加 initTopNList 的 initTopNListAtStartUp初始化

====================================================

	Type： add
	Author： huyinghuan
	Date:2013-10-29 18:30
	Content:增加initDateAtStartUp["initSettingNodes"]初始化

*/ 
//调用定义在Server/startup/main.js中的方法
/*
	-1: 不做相应
	0:清空集合并重新初始化数据
	以下集合初始化一次就可以。增加meteor的启动速度
	initSvseMonitorsTemplateAtStartUp,initSvseEntityTempletGroupAtStartUp
*/
function initAllDateStartUp(status){
	if(status === -1)
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
	initDateAtStartUp["initMessageListAtStartUp"](0);
	initDateAtStartUp["initStatisticalAtStartUp"](0);
	initDateAtStartUp["initTopNListAtStartUp"](0);
	initDateAtStartUp["initSettingNodes"]();
	initDateAtStartUp["initLanguageAtStartUp"]();
	SystemLogger("全部数据初始化完毕");
//	var timeloop = new UnrealThread(SyncFunction.sync,70*1000);
//	timeloop.start();
}
/**
	Type： Modify
	Author： huyinghuan
	Date:2013-11-04 14:18
	Content:修改获取应用根目录的方式
**/
/**读取INI配置文件*/
var SetSvdbAddr = function(){
    var dir = EccSystem.getRootPath("svapi.ini");
	process.sv_univ({'dowhat':'SetSvdbAddrByFile','filename': dir,}, 2); 
	var robj= process.sv_univ({'dowhat':'GetSvdbAddr' }, 2); 
	var addr = 'Invalid addr';
	if( robj.isok!=undefined )
	{
		addr= robj.fmap(0)['return']['return'];
	}
	console.log( ' ----  SetSvdbAddr.js to: ' + addr + '  by file: ' + dir + ' ---- ');
}

Meteor.startup(function(){
	process.sv_init();
	SetSvdbAddr();
	initAllDateStartUp(-1);	
});
