
Meteor.subscribe("svse_tree",function(){
	SystemLogger("重新订阅");
});
Meteor.subscribe("svse",function(){
	Session.set(SessionManage.CONLLECTIONMAP.SVSECOMPLETE,true);//客户端订阅数据完成
	SystemLogger("订阅完成");
});
Meteor.subscribe("svse_monitor_template");
Meteor.subscribe("svse_entity_template_group");
Meteor.subscribe("svse_entity_template");
Meteor.subscribe("svse_entity_info");
Meteor.subscribe("svse_task");
Meteor.subscribe("svse_emaillist");
Meteor.subscribe("svse_warnerrule");
Meteor.subscribe("userData");