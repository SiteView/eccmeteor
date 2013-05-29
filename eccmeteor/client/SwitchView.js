//定义视图状态
var MONITORVIEW = {
	GROUPANDENTITY : "GroupAndEntity", //组与设备视图 表格
	MONTIOTR : "Monitor", //监视器视图  表格，统计图，数据状态统计
	ENTITYGROUP : "EntityGroup", //设备模板展示视图
	ENTITYITEM : "EntityItem", //设备模板信息添加视图
	ENTITYEDIT : "EntityEdit",
	GROUPADD : "GroupAdd", //添加组信息视图
	GROUPEDIT : "GroupEdit", //修改组信息
	MONITORTEMPLATES : "MonitorTemplates", //设备的监视器列表
	MONITORADD : "MonitorAdd",
	MONITOREDIT:"MonitorEdit",
	QUICKLYADDMONITY:"QuicklyAddMonity"
};
//视图切换
var SwithcView = {
	view:function(viewName){
		Session.set("viewstatus",viewName);
	}
}