Language = new Meteor.Collection();
Session.setDefault("language",navigator.language.toLocaleUpperCase())
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
				warner : 'Warner',
				warnerrule : 'Warner Rules',
				warnerlog : 'Warner Log',
				warnerplan : 'Warner Plan',
				setting : 'Setting',
				basicsetting : 'Basic Setting',
				emailsetting : 'Email Setting',
				messagesetting : 'Message Setting',
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
				optionTh:'Option',
				basicsettiontilte:"Basic Setting",
				emailsettingmodel:{
					sendserverSMTPlab:"Server SMTP",
					sendemailAddresslab:"Email",
					sendbackupserverlab:"Backup Server SMTP",
					usernamelab:"Username",
					passwordlab:"Password",
					applybtn:"Apply",
					testbtn:"Test",
					editBtn:"Edit"
				},
				warnerrulemodel:{
					emailwarner :"Emial Warner",
					messagewarner :"Message Warner",
					scriptwarner:"Script Warner",
					soundwarner:"Sound Warner"
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
				warner : '报警',
				warnerrule : '报警规则',
				warnerlog : '报警日志',
				warnerplan : '报警策略',
				setting : '设置',
				basicsetting : '基础设置',
				emailsetting : '邮件设置',
				messagesetting : '短信设置',
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
				optionTh:'操作',
				basicsettiontilte:"基础上设置",
				emailsettingmodel:{
					sendserverSMTPlab:"发送服务器SMTP",
					sendemailAddresslab:"发送方Email地址",
					sendbackupserverlab:"备份发送服务器",
					usernamelab:"身份验证用户名",
					passwordlab:"身份验证密码",
					applybtn:"应用",
					testbtn:"测试",
					editBtn:"编辑"
				},
				warnerrulemodel:{
					emailwarner :"Emial报警",
					messagewarner :"短信报警",
					scriptwarner:"脚本报警",
					soundwarner:"声音报警"
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
*/
LanguageModel = {
	getLanaguage : function(){
		return Language.findOne({name:Session.get("language")})["value"];
	}
}
