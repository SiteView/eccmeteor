var NavigationSettingTreeEvents = {
	"alert":function(){},
	"setting":function(){},
	"AlertRule":function(){
		NavigationSettingTreeEvents.getWarnerRuleList();
		NavigationSettingTreeEvents.getEmailList();
		NavigationSettingTreeEvents.getMessageList();
		SwithcView.view(ALERTVIEW.WARNERRULE);
	},
	"AlertLog":function(){
		NavigationSettingTreeEvents.getWarnerRuleList();
		NavigationSettingTreeEvents.getEmailList();
		NavigationSettingTreeEvents.getMessageList();
		SwithcView.view(ALERTVIEW.ALERTLOG);
	},
	"AlertPlan":function(){
		console.log("执行了 warnerplan");
	},
	"BasicSetting":function(){
		SwithcView.view(SETTINGVIEW.BASICSETTING);
	},
	"EmailSetting":function(){
		NavigationSettingTreeEvents.getEmailList();
		SwithcView.view(SETTINGVIEW.EMAILSETTING);
	},
	"MessageSetting":function(){
		NavigationSettingTreeEvents.getMessageList();
		SwithcView.view(SETTINGVIEW.MESSAGESETTING);
	},
	"UserSetting":function(){
		SwithcView.view(SETTINGVIEW.USERSETTING);
	},
	"topN":function(){
		NavigationSettingTreeEvents.getTopNresultlist();
		SwithcView.view(REPORT.TOPN);
	},
	"statistical":function(){
		SwithcView.view(REPORT.STATISTICAL);
	},
	/*
	Type： add 
	Author：xuqiang
	Date:2013-11-13 09:40
	Content:增加trend趋势报告
	*/
	"timeconstrastreport":function(){
		SwithcView.view(REPORT.TIMECONSTRASTREPORT);
	},
	/*
	Type： add 
	Author：xuqiang
	Date:2013-11-13 09:40
	Content:增加trend趋势报告
	*/ 
	"trend":function(){
		SwithcView.view(REPORT.TREND)
	},
/*
	Type： add 
	Author：xuqiang
	Date:2013-11-28 15:00
	Content:增加任务计划的 绝对时间任务计划
	*/ 
	"taskabsolute":function(){
		SwithcView.view(TASK.TASKABSOLUTE)
	},
	"taskperiod":function(){
		SwithcView.view(TASK.TASKPERIOD)		
	},
	/*
	Type：add
	Author：renjie
	Date:2013-11-14 09:20
	Content:添加 SwithcView.view(REPORT.STATUSSTATISTICAL);
	*/ 
   "statusStatistical":function(){
       SwithcView.view(REPORT.STATUSSTATISTICAL);
    },
	/*
	Type：add
	Author：renjie
	Date:2013-11-18 15:20
	Content:添加contrast对比报告
	*/ 
	"contrast":function(){
       SwithcView.view(REPORT.CONTRAST);
    },
	"SysLogsetting":function(){
		//NavigationSettingTreeEvents.getEmailList();
		SwithcView.view(SETTINGVIEW.SYSLOGSETTING);
	},
	
	//zhuqing add SysLogQuery
	"SysLogQuery":function(){
		SwithcView.view(REPORT.SYSLOGQUERY);
	},
/*
	Type：add
	Author：renjie
	Date:2013-11-18 15:20
	Content:添加contrast对比报告
	*/ 
	"License":function(){
       SwithcView.view(SETTINGVIEW.LICENSE);
    },
	"About":function(){
       SwithcView.view(SETTINGVIEW.ABOUT);
    },
	"monitorInfo":function(){
       SwithcView.view(REPORT.MONITORINFO);
    },
	"TreeView":function(){
		SwithcView.view(SETTINGVIEW.TREEVIEW);
	}
}

NavigationSettingTree = {
	getTreeData:function(){
		var nodes = [];
		SvseSettingNodes.find().forEach(function(node){
			if(!NavigationSettingTree.isOwnSettingNode(node)){
				return;
			}
			node.name = LanguageModel.getLanaguage("SettingNodeTree")[node.name];
			nodes.push(node);
		});
		return nodes;
	},
	execute:function(action){
		NavigationSettingTreeEvents[action]();
	}
}

Object.defineProperty(NavigationSettingTree,"isOwnSettingNode",{
	value:function(node){
		if(UserUtils.isAdmin()){
			return true;
		}
		var user = Meteor.user();
		var displayNodes = user.profile.settingNodeDisplayPermission;
		if(!displayNodes || !displayNodes.length){
			return false;
		}
		var action = node.action;
		for(var index = 0; index < displayNodes.length; index++){
			if(action === displayNodes[index]){
				return true;
			}
		}
		return false;
	}
});

//根据情况获取所有的邮件列表
Object.defineProperty(NavigationSettingTreeEvents,"getEmailList",{
	value:function(){
		if(SvseEmailDao.isEmpty()){
			LoadingModal.loading();
			SvseEmailDao.getEmailListAsync(function(emaillist){
				LoadingModal.loaded();
				//console.log(emaillist);
			});
		}else{
			SvseEmailDao.getEmailListSync();
			//console.log(emaillist);
		}
	}
});

//根据情况获取所有的短信列表
Object.defineProperty(NavigationSettingTreeEvents,"getMessageList",{
	value:function(){
		if(SvseMessageDao.isEmpty()){
			LoadingModal.loading();
			SvseMessageDao.getMessageListAsync(function(messagelist){
				LoadingModal.loaded();
				//console.log(messagelist);
			});
		}else{
			var messagelist = SvseMessageDao.getMessageListSync();
			//console.log(messagelist);
		}
	}
});


//renjie add 
Object.defineProperty(NavigationSettingTreeEvents,"getTopNresultlist",{
	value:function(){
		if(SvseTopNDao.isEmpty()){
			LoadingModal.loading();
			SvseTopNDao.getTopNresultlistAsync(function(TopNresultlist){
				LoadingModal.loaded();
				console.log(TopNresultlist);
			});
		}else{
			var TopNresultlist = SvseTopNDao.getTopNresultlistSync();
			console.log(TopNresultlist);
		}
	}
});


