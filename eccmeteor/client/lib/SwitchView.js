//定义视图状态
MONITORVIEW = {
	GROUPANDENTITY : "showGroupAndEntity", //组与设备视图 表格
//	MONTIOTR : "showMonitor", //监视器视图  表格，统计图，数据状态统计
	ENTITYGROUP : "showEntityGroup", //设备模板展示视图
	ENTITYITEM : "showEntity", //设备模板信息添加视图
	ENTITYEDIT : "showEditEntity",
//	GROUPADD : "showGroupAdd", //添加组信息视图
	GROUPEDIT : "showGroupEdit", //修改组信息
//	MONITORTEMPLATES : "showMonitorTemplate", //设备的监视器列表
//	MONITORADD : "showMonitorInfo", //监视器的增加
	MONITOREDIT:"showMonitorEditInfo", //监视器的修改
	QUICKLYADDMONITY:"showQuickMonityTemplate",//快速添加监视器
	MONITORDETAIL:"detailSvg"//监视器的详细信息
	
};
//设置视图
SETTINGVIEW = {
	EMAILSETTING:"emailsetting", //邮箱设置
	WARNERRULE :"warnerrule", // 报警
	USERSETTING:"usersetting" //用户设置
}
//整体模块视图
MODULEVIEW = {
	ENTITYMODULE:"EntityModule", //设备视图
	GROUPMODULE:"GroupModule"
}
//
LAYOUTVIEW = {
	SETTING:"settingLayout",//设置布局
	NODE:"nodeLayout",//带操作按钮的节点布局
	NOTOPERATION:"notOperationNodeLayout" //无操作按钮的节点布局
}


//报表
  ReportView = {
    statistical:"statistical"
  
  }

//视图切换
SwithcView = {
	view:function(viewName){
		Session.set("viewstatus",viewName);
	},
	layout:function(layoutname){
	    Session.set("layout",layoutname);
	},
	render:function(viewName,layoutname){
		Session.set("layout",layoutname);
		Session.set("viewstatus",viewName);
	}
}


