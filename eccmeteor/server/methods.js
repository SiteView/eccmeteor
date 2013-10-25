/*
	Type： add
	Author：renjie
	Date:2013-10-18 10:40
	Content:增加SvseTopNDaoAgent 的agent声明
*/ 
Meteor.methods({
  "meteorSvUniv":meteorSvUniv,//调用 /lib/svdb.js中定义的方法
  "meteorSvForest":meteorSvForest,
  "entityEditMonitor":SvseMonitorDaoOnServer.editMonitor,
  "svGetSendEmailSetting":svGetSendEmailSetting,
  "svEmailTest":svEmailTest,
  "syncTreeData":SyncFunction.sync, //同步数据
  "userDaoAgent":UserDaoAgent.agent,
  "svseDaoAgent":SvseDaoAgent.agent,
  "svseMonitorDaoAgent":SvseMonitorDaoAgent.agent,
  "svseEmailDaoAgent":SvseEmailDaoAgent.agent,
  "svseEntityTemplateDaoAgent":SvseEntityTemplateDaoAgent.agent,
  "svseWarnerRuleDaoAgent":SvseWarnerRuleDaoAgent.agent,
  "svseMonitorTemplateDaoAgent":SvseMonitorTemplateDaoAgent.agent,
  "SvseTopNDaoAgent":SvseTopNDaoAgent.agent,
  "SvseStatisticalDaoAgent":SvseStatisticalDaoAgent.agent,
  "svseMessageDaoAgent":SvseMessageDaoAgent.agent	//by zhuqing add
});//给客户端调用的
 /**
	Type： add | modify 
	Author：任杰
	Date:2013-10-16 10:40
	Content:修改"svGetTopNList": svGetTopNList
	
	===================================
	
	Type： add 
	Author：xuqiang
	Date:2013-10-18 09:40
	Content:增加统计报告部分对svdb.js操作方法的声明
**/
//给服务端调用的。//调用 /lib/svdb.js中定义的方法
SvseMethodsOnServer = {
	"GetAllEntityGroups":GetAllEntityGroups,
	"GetEntityTemplet":GetEntityTemplet,
	"svGetEntity":svGetEntity,
	"svGetAllTask":svGetAllTask,
	"svSubmitMonitor":svSubmitMonitor,
	"svRefreshMonitors":svRefreshMonitors,
	"svGetRefreshed":svGetRefreshed,
	"svGetMonitor":svGetMonitor,
	"svGetEntityDynamicPropertyData":svGetEntityDynamicPropertyData,
	"svDeleteMonitor" : svDeleteMonitor,
	"svGetEmailList" : svGetEmailList,
	"svGetWarnerRule" :svGetWarnerRule,
	"svGetAllMonitorTempletInfo":svGetAllMonitorTempletInfo,
	"svGetMonitorTemplet":svGetMonitorTemplet,
	"svGetMonitorRuntimeRecords":svGetMonitorRuntimeRecords,
	"svGetMonitorRuntimeRecordsByTime":svGetMonitorRuntimeRecordsByTime,
	"svGetTreeData":svGetTreeData,
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetTreeDataChildrenNodes":svGetTreeDataChildrenNodes,
	"svDelChildren":svDelChildren,
	"svSubmitGroup":svSubmitGroup,
	"svGetNodeByParentidAndSelfId":svGetNodeByParentidAndSelfId,
	"svForbidNodeTemporary":svForbidNodeTemporary,
	"svForbidNodeForever":svForbidNodeForever,
	"svAllowNode":svAllowNode,
	"svWriteEmailAddressIniFileSectionString":svWriteEmailAddressIniFileSectionString,
	"svWriteEmailIniFileSectionString":svWriteEmailIniFileSectionString,
	"svDeleteEmailAddressIniFileSection":svDeleteEmailAddressIniFileSection,
	"svWriteEmailAddressStatusInitFilesection":svWriteEmailAddressStatusInitFilesection,
	"svGetEmailTemplates":svGetEmailTemplates,
	"svSubmitEntity":svSubmitEntity,
	"svWriteAlertIniFileSectionString":svWriteAlertIniFileSectionString,
	"svDeleteAlertInitFileSection":svDeleteAlertInitFileSection,
	"svWriteTopNIniFileSectionString":svWriteTopNIniFileSectionString,
	"svGetTopNList": svGetTopNList,
	"svWriteAlertStatusInitFileSection":svWriteAlertStatusInitFileSection,
	"svWriteMessageIniFileSectionString":svWriteMessageIniFileSectionString,
	"svDeleteMessageIniFileSection":svDeleteMessageIniFileSection,	//by zhuqing about deleting message
	"svGetMessageTemplates":svGetMessageTemplates,	//by zhuqing about getting message templates
	"svWriteMessageStatusInitFilesection":svWriteMessageStatusInitFilesection,	//by zhuqing
	"svGetMessageSendDllName":svGetMessageSendDllName,	//by zhuqing
	"svGetMessageList":svGetMessageList,
	"svWriteStatisticalIniFileSectionString":svWriteStatisticalIniFileSectionString,
	"svGetStatisticalList": svGetStatisticalList,
	"svDeleteStatisticalIniFileSection":svDeleteStatisticalIniFileSection,
}

SvseSyncData = {
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetSVSE" : svGetSVSE,
	"svGetGroup" : svGetGroup,
	"svGetEntity" : svGetEntity
}