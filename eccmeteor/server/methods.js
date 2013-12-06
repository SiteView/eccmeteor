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
  "svseMessageDaoAgent":SvseMessageDaoAgent.agent,	//by zhuqing add
  "svGetSMSWebConfigSetting":svGetSMSWebConfigSetting,
  "svGetSMSComConfigSetting":svGetSMSComConfigSetting,
  "svGetEmailTemplates":svGetEmailTemplates,
  /*
	Type： add
	Author：xuqiang
	Date:2013-10-28 10:40
	Content:增加 趋势报告 的agent声明
*/ 
  "svGetTrendList":svGetTrendList,
  /*
	Type： add
	Author：renjie
	Date:2013-12-2 13:40
	Content:增加 syslog 的agent声明
*/
	"svseSysLogDaoAgent":SvseSysLogDaoAgent.agent,	
	"svGetSysLogDelCondConfigSetting":svGetSysLogDelCondConfigSetting,
	"svGetSysLogQueryContEntityConfigSetting":svGetSysLogQueryContEntityConfigSetting,
	"svGetSysLogQueryContRankConfigSetting":svGetSysLogQueryContRankConfigSetting,
	//"svGetSysLogQueryContConfigSetting":svGetSysLogQueryContConfigSetting,
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

	=====================================

	Type：add 
	Author：renjie
	Date:2013-10-24 15:00
	Content:添加"svWriteTopNStatusInitFilesection":svWriteTopNStatusInitFilesection,

    ======================================
    
	Type： add
	Author：xuqiang
	Date:2013-10-24 17:10
	Content:增加统计报表允许，禁止操作，api声明

**/
/*
	Type:add and modify some methods at cilent and server
	Author:zhuqing
	Date:2013-11-12
	Content:在客户端和服务端添加一些定义的方法
*/
/*
	Type： add
	Author：xuqiang
	Date:2013-10-28 10:40
	Content:增加 趋势报告 的agent声明
*/ 
/*
	Type： add
	Author：xuqiang
	Date:2013-12-05 15:40
	Content:任务计划接口调用的声明
*/	
/*
	Type： add
	Author：renjie
	Date:2013-12-2 14:40
	Content:增加 syslog 
*/
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
	"svGetScriptFileofScriptAlert":svGetScriptFileofScriptAlert,
	"svGetQueryAlertLog":svGetQueryAlertLog,
	"svWriteTopNIniFileSectionString":svWriteTopNIniFileSectionString,
	"svWriteTopNStatusInitFilesection":svWriteTopNStatusInitFilesection,
	"svGetTopNList": svGetTopNList,
	"svDeleteTopNIniFileSection":svDeleteTopNIniFileSection,
	"svWriteAlertStatusInitFileSection":svWriteAlertStatusInitFileSection,
	"svWriteMessageIniFileSectionString":svWriteMessageIniFileSectionString,
	"svDeleteMessageIniFileSection":svDeleteMessageIniFileSection,
	"svGetMessageTemplates":svGetMessageTemplates,
	"svGetWebMessageTemplates":svGetWebMessageTemplates,
	"svWriteMessageStatusInitFilesection":svWriteMessageStatusInitFilesection,
	"svWriteSMSWebConfigIniFileSectionString":svWriteSMSWebConfigIniFileSectionString,
	"svWriteSMSCommConfigIniFileSectionString":svWriteSMSCommConfigIniFileSectionString,
	"svGetMessageList":svGetMessageList,
	"svWriteStatisticalIniFileSectionString":svWriteStatisticalIniFileSectionString,
	"svGetStatisticalList": svGetStatisticalList,
	"svDeleteStatisticalIniFileSection":svDeleteStatisticalIniFileSection,
	"svWriteStatisticalStatusInitFilesection":svWriteStatisticalStatusInitFilesection,
	"svGetTrendList":svGetTrendList,
	"svWriteTaskIniFileSectionString":svWriteTaskIniFileSectionString,
    "svWriteDelContConfigIniFileSectionString":svWriteDelContConfigIniFileSectionString,
	"svWriteQueryContEntityConfigIniFileSectionString":svWriteQueryContEntityConfigIniFileSectionString,
	"svWriteQueryContRankConfigIniFileSectionString":svWriteQueryContRankConfigIniFileSectionString,
	//"svWriteQueryContConfigIniFileSectionString":svWriteQueryContConfigIniFileSectionString,
	"svDeleteSysLogInitFilesection":svDeleteSysLogInitFilesection,
}

SvseSyncData = {
	"svGetDefaultTreeData" : svGetDefaultTreeData,
	"svGetSVSE" : svGetSVSE,
	"svGetGroup" : svGetGroup,
	"svGetEntity" : svGetEntity
}
