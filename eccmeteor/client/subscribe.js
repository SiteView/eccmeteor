
Meteor.subscribe("svse_tree",function(){
	SystemLogger("重新订阅");
	SessionManage.collectionCompleted(CONLLECTIONMAP.SVSETREE);

});
Meteor.subscribe("svse",function(){
	SessionManage.collectionCompleted(CONLLECTIONMAP.SVSE);//客户端订阅数据完成
});
Meteor.subscribe("svse_monitor_template");
Meteor.subscribe("svse_entity_template_group");
Meteor.subscribe("svse_entity_template");
Meteor.subscribe("svse_entity_info");
Meteor.subscribe("svse_task");
Meteor.subscribe("svse_emaillist");
Meteor.subscribe("svse_warnerrule");
Meteor.subscribe("userData");