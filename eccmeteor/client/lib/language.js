Language = new Meteor.Collection();
Deps.autorun(function (c) {
	var language = [
		{
			name : "EN-US",
			value:{
				_language : "English",
				save : "Save",
				cancel : "Cancel",
				username:"username",
				password:"password",
				home : "HOME",
				link : "LINK",
				startTime : 'Start Time',
				endTime : 'End Time',
				addbtn:"Add",
				delbtn:"Delete",
				allowbtn:"Allow",
				forbidbtn:"Forbid",
				refreshbtn:"Refresh",
				templatesettiongbtn:"Template Setting",
				helpmessagebtn:"Help",
				nameTh:"Name",
				statusTh : 'Status',
				emailTh:'Email',
				phoneTh:'Phone',
				optionTh:'Option',
				basicsettiontilte:"Basic Setting",
				status:"Status",
				ok:"OK",
				bad:"Bad",
				disable:"Disable",
				warning:"Warning",
				error:"Error",
				emailsettingmodel:{
					sendserverSMTPlab:"Server SMTP",
					sendemailAddresslab:"Email",
					sendbackupserverlab:"Backup Server SMTP",
					usernamelab:"Username",
					passwordlab:"Password",
					applybtn:"Apply",
					testbtn:"Test",
					editbtn:"Edit"
				},
				messagesettingmodel:{
					applybtn:"Apply",
					recoverbtn:"Recover",
					testbtn:"Test"
				},
				warnerrulemodel:{
					emailwarner :"Emial Warner",
					messagewarner :"Message Warner",
					scriptwarner:"Script Warner",
					soundwarner:"Sound Warner",
					addemailwarnerruletitle:"Add Email Warner's rule",
					saveemailwarnerrulesettingbtn:"Save",
					cancelemailwarnerrulesettingbtn:"Cancel"
				},
				othersetting:{
					setting : 'Setting',
					basicsetting : 'Basic Setting',
					emailsetting : 'Email Setting',
					messagesetting : 'Message Setting',
					usersetting:'User Setting'
				},
				ReportModel:{
					Report:"Report",
					statistical:"Statistical Report",
					trend:"Trend Report",
					topN:"Top N Report",
					statusStatistical:"Status Statistical Report",
					contrast:"Contrast Report",
					operationAndMaintenance:"Operation And Maintenance",
					time:"Time Contrast Report",
					monitorInfo:"Monitor Infomation Report",
					SysLogQuery:"System Log Query"
				},
				AlertModel:{
					Alert : 'Alert',
					Alertrule : 'Alert Rules',
					Alertlog : 'Alert Log',
					Alertplan : 'Alert Plan'
				},
				BasicModel:{
					applybtn:"Apply",
					againgetbtn:"AgainGet",
					previewbtn:"Preview",
					recoverdefaultbtn:"RecoverDefault",
					helpbtn:"Help",
					bordercolor:"BorderColor",
					borderwidth:"BorderWidth"
				}
			}
		},
		{
			name : "ZH-CN",
			value : {
				_language:"中文",
				save : "保存",
				cancel : "取消",
				username:"用户名",
				password:"密码",
				home : "首页",
				link : "链接",
				startTime : '开始时间',
				endTime : '结束时间',	
				addbtn:"添加",
				delbtn:"删除",
				allowbtn:"允许",
				forbidbtn:"禁止",
				refreshbtn:"刷新",
				templatesettiongbtn:"模板设置",
				helpmessagebtn:"帮助",
				nameTh:"名称",
				statusTh : '状态',
				emailTh:'邮箱',
				phoneTh:'手机号码',
				optionTh:'操作',
				basicsettiontilte:"基本设置",
				status:"状态",
				ok:"正常",
				bad:"错误",
				error:"错误",
				disable:"禁用",
				warning:"警告",
				emailsettingmodel:{
					sendserverSMTPlab:"发送服务器SMTP",
					sendemailAddresslab:"发送方Email地址",
					sendbackupserverlab:"备份发送服务器",
					usernamelab:"身份验证用户名",
					passwordlab:"身份验证密码",
					applybtn:"应用",
					testbtn:"测试",
					editbtn:"编辑"
				},
				messagesettingmodel:{
					editbtn:"编辑",
					applybtn:"应用",
					recoverbtn:"重新获得",
					testbtn:"测试"
				},
				warnerrulemodel:{
					emailwarner :"Emial报警",
					messagewarner :"短信报警",
					scriptwarner:"脚本报警",
					soundwarner:"声音报警",
					addemailwarnerruletitle:"添加Email报警",
					saveemailwarnerrulesettingbtn:"保存",
					cancelemailwarnerrulesettingbtn:"取消"
				},
				othersetting:{
					setting : '设置',
					basicsetting : '基础设置',
					emailsetting : '邮件设置',
					messagesetting : '短信设置',
					usersetting:'用户设置'
				},
				ReportModel:{
					Report:"报表",
					statistical:"统计报告",
					trend:"趋势报告",
					topN:"TopN报告",
					statusStatistical:"状态统计报告",
					contrast:"对比报告",
					operationAndMaintenance:"运维统计报告",
					time:"时段对比报告",
					monitorInfo:"监测器信息报告",
					SysLogQuery:"系统日志查询"
				},
				AlertModel:{
					Alert : '报警',
					Alertrule : '报警规则',
					Alertlog : '报警日志',
					Alertplan : '报警策略'
				},
				TopNModel:{
				    datereport:"日报",
				    weekreport:"周报",
				    monthreport:"月报"
				},
				statisticalModel:{
					datereport:"日报",
				    weekreport:"周报",
				    monthreport:"月报"
				},
				BasicModel:{
					applybtn:"应用",
					againgetbtn:"重新获得",
					previewbtn:"预览",
					recoverdefaultbtn:"恢复默认",
					helpbtn:"帮助",
					bordercolor:"边框颜色",
					borderwidth:"边框宽度"
				}
			}
		}
	];
	if(Language.find().fetch().length)
		Language.remove({});
	for(index in language){
		Language.insert(language[index]);
	}
	c.stop();
});

/**
使用
LanguageModel.getLanguage().link
接收一个参数,制定需要调用二级模块. 默认为不设置.
	Demo: LanguageModel.getLanguage("warnerrulemodel").emailwarner
*/
LanguageModel = {
	getLanaguage : function(modul){
		if(!modul)
			return Language.findOne({name:Session.get("language")})["value"];
		return Language.findOne({name:Session.get("language")})["value"][modul];
	}
}
