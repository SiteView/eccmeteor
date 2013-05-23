Meteor.methods({
  "meteorSvUniv":meteorSvUniv,//调用 /lib/svdb.js中定义的方法
  "meteorSvForest":meteorSvForest, //调用 /lib/svdb.js中定义的方法
  "getQueryRecords":getQueryRecords,
  "GetMonitorTemplet":GetMonitorTemplet,
  "removeNodesById":SvseDaoOnServer.removeNodesById,
  "svSubmitGroup":svSubmitGroup,
  "svDelChildren":svDelChildren,
  "getNodeByParentIdAndId":SvseTreeDaoOnServer.getNodeByParentIdAndId,
  "svSubmitEntity":svSubmitEntity,
  "entityAddMonitor":SvseMonitorDaoOnServer.addMonitor,
  "getMonitorInfoById" :SvseMonitorDaoOnServer.getMonitorInfoById,
  "entityEditMonitor":SvseMonitorDaoOnServer.editMonitor,
  "deleteMonitor":SvseMonitorDaoOnServer.deleteMonitor,
  "svGetDynamicData":svGetDynamicData,
  "svDisableForever":svDisableForever,
  "svEnable":svEnable,
  "svDisableTemp":svDisableTemp,
  "syncTreeData":SyncFunction.sync //同步数据
});//给客户端调用的

//给服务端调用的。
var SvseMethodsOnServer = {
	"GetAllEntityGroups":GetAllEntityGroups,
	"GetEntityTemplet":GetEntityTemplet,
	"meteorSvUniv":meteorSvUniv,//调用 /lib/svdb.js中定义的方法
	"meteorSvForest":meteorSvForest,//调用 /lib/svdb.js中定义的方法
	"svForest":svForest,
	"svGetEntity":svGetEntity,
	"svGetAllTask":svGetAllTask,
	"svSubmitMonitor":svSubmitMonitor,
	"svRefreshMonitors":svRefreshMonitors,
	"svGetRefreshed":svGetRefreshed,
	"svGetMonitor":svGetMonitor,
	"svDeleteMonitor" : svDeleteMonitor
}

var SvseSyncData = {
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetSVSE" : svGetSVSE,
	"svGetGroup" : svGetGroup,
	"svGetEntity" : svGetEntity
}