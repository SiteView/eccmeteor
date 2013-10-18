SvseTree = new Meteor.Collection("svse_tree");//TreeDate的数据集  只包含第一级树的信息
Svse = new Meteor.Collection("svse");//Svse的数据集
SvseMonitorTemplate = new Meteor.Collection("svse_monitor_template");//监视器模板
SvseEntityTemplet = new Meteor.Collection("svse_entity_template");//设备模板集
SvseEntityTempletGroup = new Meteor.Collection("svse_entity_template_group");//设备模板组集
SvseEntityInfo = new Meteor.Collection("svse_entity_info");//设备详细信息
SvseTask = new Meteor.Collection("svse_task"); //计划任务
SvseEmailList = new Meteor.Collection("svse_emaillist");//邮件列表
SvseMessageList = new Meteor.Collection("svse_messagelist");//短信列表
SvseWarnerRule = new Meteor.Collection("svse_warnerrule");//报警规则
SvseTopN = new Meteor.Collection("svse_topN");//topN报告(2011/10/11)
/*
Type：add
Author：xuqiang
Date:2013-10-18 09:20
Content:增加统计报告statistical Collection
*/ 
SvseStatisticalresultlist = new Meteor.Collection("Svse_Statisticalresultlist");//统计报告list

Svse.allow({
	insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
		return true;
	},
	update: function (userId, doc, fields, modifier) {
    // can only change your own documents
		return true;
	},
	remove: function (userId, doc) {
    // can only remove your own documents
		return true;
	}
});

SvseTree.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseMonitorTemplate.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseEntityTemplet.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});


SvseEntityInfo.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseTask.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseEmailList.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

/*
Type： add 
Author：xuqiang
Date:2013-10-18 09:23
Content:增加SvseStatisticalresultlist
*/ 
SvseStatisticalresultlist.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseWarnerRule.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});

SvseMessageList.allow({
	insert: function(userId, doc){
		return true;
	},
	update: function(userId, doc, fields, modifier){
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});
/*2013/10/11*/
SvseTopN.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});
