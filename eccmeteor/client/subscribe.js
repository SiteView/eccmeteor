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
Meteor.subscribe("svse_messagelist");
Meteor.subscribe("svse_TopNresultlist");
/*
Type： add 
Author：xuqiang
Date:2013-10-15 
Content:增加统计报告订阅数据
*/ 
Meteor.subscribe("Svse_Statisticalresultlist");


/*‌‌
   Type：  add ‌‌
   Author： huyinghuan
   Date:2013-10-29 10:40 星期二‌‌
   Content: 增加获取设置节点集合函数
*/
Meteor.subscribe("svse_settingnodes");
/*‌‌
   Type：  add ‌‌
   Author： huyinghuan
   Date:2013-11-04 13:55 星期一
   Content: 增加设置语言集合集合
*/
Meteor.subscribe("svse_language");