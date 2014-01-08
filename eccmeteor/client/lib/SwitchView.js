//定义视图状态
MONITORVIEW = {
	GROUPANDENTITY : "showGroupAndEntity", //组与设备视图 表格
//	MONTIOTR : "showMonitor", //监视器视图  表格，统计图，数据状态统计
//	ENTITYGROUP : "showEntityGroup", //设备模板展示视图
//	ENTITYITEM : "showEntity", //设备模板信息添加视图
//	ENTITYEDIT : "showEditEntity",
//	GROUPADD : "showGroupAdd", //添加组信息视图
//	GROUPEDIT : "showGroupEdit", //修改组信息
//	MONITORTEMPLATES : "showMonitorTemplate", //设备的监视器列表
//	MONITORADD : "showMonitorInfo", //监视器的增加
	MONITOREDIT:"showMonitorEditInfo", //监视器的修改
//	QUICKLYADDMONITY:"showQuickMonityTemplate",//快速添加监视器
	MONITORDETAIL:"detailSvg"//监视器的详细信息
	
};
//设置视图 
SETTINGVIEW = {
	BASICSETTING:"basicsetting",//基本设置
	EMAILSETTING:"emailsetting", //邮箱设置
	MESSAGESETTING:"messagesetting",//短信设置
	USERSETTING:"usersetting", //用户设置
/*Type：add
	Author：renjie
	Date:2013-12-23 09:20
	Content:增加"软件许可"License
*/ 
	SYSLOGSETTING:"SysLogsetting",	//SysLog设置
	LICENSE:"License",//软件许可
	ABOUT:"About"    //产品介绍
}
//报警试图
ALERTVIEW = {
	WARNERRULE:"warnerrule", // 报警规则
	ALERTLOG:"warnerrulelog"	//报警日志
}
//整体模块视图
MODULEVIEW = {
	ENTITYMODULE:"EntityModule", //设备视图
	GROUPMODULE:"GroupModule"
}
//
LAYOUTVIEW = {
	SettingLayout:"SettingLayout",//设置布局
	EquipmentsLayout:"EquipmentsLayout"//带操作按钮的节点布局
}
//报表
/*
Type： add 
Author：xuqiang
Date:2013-11-13 09:40
Content:增加trend趋势报告

=========================
	Type：add
	Author：renjie
	Date:2013-11-14 09:20
	Content:"状态统计报告"statusStatistical

=======================
	Type：add
	Author：renjie
	Date:2013-11-14 09:20
	Content:增加contrast对比报告
*/ 
REPORT ={
	STATISTICAL:"statistical",
	TOPN:"topN",//topN报告
	TREND:"trend", //趋势报告
	CONTRAST:"contrast",//对比报告
	STATUSSTATISTICAL:"statusStatistical",//"状态统计报告"
	MONITORINFO:"monitorInfo",//监测器信息报告, 搜索测试
	SYSLOGQUERY:"sysLogQuery",//syslog查询
	TIMECONSTRASTREPORT:"timeconstrastreport",//时间段对比报告
}
/*
Type： add 
Author：xuqiang
Date:2013-11-28 14:40
Content:增加任务计划导航
*/
TASK ={ 
	TASKABSOLUTE:"taskabsolute",//绝对时间任务计划
	TASKPERIOD:"taskperiod",    //"时间段任务计划",
	TASKRELATIVE:"taskrelative" //"相对时间任务计划",		
}
//视图切换
SwithcView = {}
Object.defineProperty(SwithcView,"view",{
	value:function(viewName){ 
		//如果当前布局为设备树
		if(Session.equals("layout",LAYOUTVIEW.EquipmentsLayout)){
			Session.set("ViewType",viewName);
		}else{//为设置树
			Session.set("ViewTypeForSetting",viewName);
		}
		
	}
});
Object.defineProperty(SwithcView,"layout",{
	value:function(layoutname){
		if(layoutname){
			Session.set("layout",layoutname);
		}
		return Session.get("layout");
	}
});
Object.defineProperty(SwithcView,"render",{
	value:function(viewName,layoutname){
		Session.set("layout",layoutname);
		Session.set("ViewType",viewName);
	}
});
