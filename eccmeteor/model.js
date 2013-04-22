SvseTree = new Meteor.Collection("svse_tree");//TreeDate的数据集  只包含第一级树的信息
Svse = new Meteor.Collection("svse");//Svse的数据集
SvseMonitorTemplate = new Meteor.Collection("svse_monitor_template");//监视器模板
SvseEntityTemplet = new Meteor.Collection("svse_entity_template");//设备模板集
SvseEntityTempletGroup = new Meteor.Collection("svse_entity_template_group");//设备模板组集
SvseEntityTemplateInfo = new Meteor.Collection("svse_entity_info");//设备详细信息
SvseTask = new Meteor.Collection("svse_task"); //计划任务
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


SvseEntityTemplateInfo.allow({
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