Meteor.subscribe("svse_tree");
Meteor.subscribe("svse",function(){
	Session.set("SvseCollectionComplete",true);//客户端订阅数据完成
	SystemLogger("订阅完成");
});
Meteor.subscribe("svse_monitor_template");
Meteor.subscribe("svse_entity_template_group");
Meteor.subscribe("svse_entity_template");
Meteor.subscribe("svse_entity_info");
Meteor.subscribe("svse_task");