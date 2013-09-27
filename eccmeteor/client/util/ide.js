var ideUrl = "http://ide.siteview.com";//配置IDE域名
var devMode = false; //配置是否为开发者模式
var ideAccoutnName="nj001";//配置IDE账户名称
var projectRoot = "/eccmeteor/eccmeteor/";//配置ide下project的根目录
//配置文件映射
var templateMap = {
	"moitorContentTree":"/client/MonitorContentTree.html",
	"404":"/client/404.html",
	"Login":"/client/Login.html",
	"bodyheader":"/client/bodyheader.html",
	"showEntityGroup":"/client/template/monitor/entitygroup.html",
	"showMonitor":"/client/template/monitor/entitymodule.html",
	"ChooseMonitorTemplate":"/client/template/monitor/entitymodule_monitor_add.html",
	"showGroupAndEntity":"/client/template/monitor/groupmodule.html",
	"showGroupAdd":"/client/template/monitor/groupmodule_edit_add.html",
	"showMonitorDetailSvg":"/client/template/monitor/monitordetail.html",
	"operateNode":"/client/template/monitor/operatenodebutton.html",
	"showQuickMonityTemplate":"/client/template/monitor/quicklyAddMonitor.html",
	"emailsetting":"/client/template/setting/emailsetting.html",
	"usersetting":"/client/template/setting/usersetting.html",
	"usersettingadd":"/client/template/setting/usersetting_add.html",
	"usersettingedit":"/client/template/setting/usersetting_edit.html",
	"userPromissionSetting":"/client/template/setting/usersetting_promissionsetting.html",
	"warnerrule":"/client/template/warner/warnerrule.html"
}
var getIdeUrl = function(templateName){
	return ideUrl + "/edit/edit.html#/file/"+ideAccoutnName+projectRoot+templateMap[templateName];
}
//跳转相关页面助手
Handlebars.registerHelper('ide',function(templateName){
	var result = devMode ? "<a href='"+getIdeUrl(templateName)+"' target='_blank'><i class='icon-edit'></i>编辑</a>"
						 :"";
	return new Handlebars.SafeString(result)
});