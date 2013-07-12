﻿Meteor.methods({
  "meteorSvUniv":meteorSvUniv,//调用 /lib/svdb.js中定义的方法
  "meteorSvForest":meteorSvForest,
  "getQueryRecords":getQueryRecords,
//  "removeNodesById":SvseDaoOnServer.removeNodesById,
//  "svSubmitGroup":svSubmitGroup,
//  "svDelChildren":svDelChildren,
  "getNodeByParentIdAndId":SvseTreeDaoOnServer.getNodeByParentIdAndId,
  "svSubmitEntity":svSubmitEntity,
  "entityAddMonitor":SvseMonitorDaoOnServer.addMonitor,
  "getMonitorInfoById" :SvseMonitorDaoOnServer.getMonitorInfoById,
  "entityEditMonitor":SvseMonitorDaoOnServer.editMonitor,
//  "deleteMonitor":SvseMonitorDaoOnServer.deleteMonitor,
  "svGetDynamicData":svGetDynamicData,
//  "svDisableForever":svForbidNodeForever,
//  "svEnable":svAllowNode,
//  "svDisableTemporary":svDisableTemporary,
  "svQueryRecordsByTime":svQueryRecordsByTime,
  "svGetSendEmailSetting":svGetSendEmailSetting,
  "svGetEmailTemplates":svGetEmailTemplates,
  "svWriteAlertIniFileSectionString":svWriteAlertIniFileSectionString,
  "svWriteEmailAddressIniFileSectionString":svWriteEmailAddressIniFileSectionString,
  "svWriteEmailIniFileSectionString":svWriteEmailIniFileSectionString,
  "svDeleteEmailAddressIniFileSection":svDeleteEmailAddressIniFileSection,
  "svEmailTest":svEmailTest,
  "svWriteEmailAddressStatusInitFilesection":svWriteEmailAddressStatusInitFilesection,
  "svDeleteAlertInitFileSection":svDeleteAlertInitFileSection,
  "svWriteAlertStatusInitFileSection":svWriteAlertStatusInitFileSection,
  "syncTreeData":SyncFunction.sync, //同步数据
  "syncEmailList" : SyncFunction.SyncEmailList,
  "SyncWarnerRules" : SyncFunction.SyncWarnerRules,
  "userDaoAgent":UserDaoAgent.agent,
  "svseDaoAgent":SvseDaoAgent.agent,
  "svseMonitorDaoAgent":SvseMonitorDaoAgent.agent
});//给客户端调用的

//给服务端调用的。
SvseMethodsOnServer = {
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
	"svDeleteMonitor" : svDeleteMonitor,
	"svGetEmailList" : svGetEmailList,
	"svGetWarnerRule" :svGetWarnerRule,
	"svGetAllMonitorTempletInfo":svGetAllMonitorTempletInfo,
	"svGetMonitorTemplet":svGetMonitorTemplet,
	"svGetTreeData":svGetTreeData,
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetTreeDataChildrenNodes":svGetTreeDataChildrenNodes,
	"svDelChildren":svDelChildren,
	"svSubmitGroup":svSubmitGroup,
	"svGetNodeByParentidAndSelfId":svGetNodeByParentidAndSelfId,
	"svForbidNodeTemporary":svForbidNodeTemporary,
	"svForbidNodeForever":svForbidNodeForever,
	"svAllowNode":svAllowNode
}

SvseSyncData = {
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetSVSE" : svGetSVSE,
	"svGetGroup" : svGetGroup,
	"svGetEntity" : svGetEntity
}