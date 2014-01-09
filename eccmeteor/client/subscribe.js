Subscribe = function(){};

Object.defineProperty(Subscribe,"LOADSVSEENTITYTEMPLATEGROUP",{
   value:"LOADSVSEENTITYTEMPLATEGROUP"
});

Object.defineProperty(Subscribe,"LOADSVSEENTITYTEMPLATE",{
   value:"LOADSVSEENTITYTEMPLATE"
});

Object.defineProperty(Subscribe,"LOADSVSEMONITORTEMPLATE",{
   value:"LOADSVSEMONITOREMPLATE"
});

Object.defineProperty(Subscribe,"loadSvseEntityTemplateGroup",{
   value:function(){
      Session.set(Subscribe.LOADSVSEENTITYTEMPLATEGROUP,true);
   }
});
Object.defineProperty(Subscribe,"isLoadSvseEntityTemplateGroup",{
   value:function(){
      return Session.get(Subscribe.LOADSVSEENTITYTEMPLATEGROUP);
   }
});
Object.defineProperty(Subscribe,"loadSvseEntityTemplate",{
   value:function(){
      Session.set(Subscribe.LOADSVSEENTITYTEMPLATE,true);
   }
});
Object.defineProperty(Subscribe,"isLoadSvseEntityTemplate",{
   value:function(){
      return Session.get(Subscribe.LOADSVSEENTITYTEMPLATE);
   }
});
Object.defineProperty(Subscribe,"loadSvseSvseMonitorTemplate",{
   value:function(){
      Session.set(Subscribe.LOADSVSEMONITORTEMPLATE,true);
   }
});
Object.defineProperty(Subscribe,"isLoadSvseSvseMonitorTemplate",{
   value:function(){
      return Session.get(Subscribe.LOADSVSEMONITORTEMPLATE);
   }
});
Meteor.subscribe("svse_tree",function(){
	Log4js.info("svse_tree订阅完成");
	SessionManage.collectionCompleted(CONLLECTIONMAP.SVSETREE);

});

Meteor.subscribe("svse",function(){
   Log4js.info("svse订阅完成");
	SessionManage.collectionCompleted(CONLLECTIONMAP.SVSE);//客户端订阅数据完成
});

//邮件订阅
Object.defineProperty(Subscribe,"LOADSVSEEMAILLIST",{
   value:"LOADSVSEEMAILLIST"
});

//短信订阅
Object.defineProperty(Subscribe,"LOADSVSEMESSAGELIST",{
   value:"LOADSVSEMESSAGELIST"
});

//延迟加载
Deps.autorun(function(c){
   if(Session.get(Subscribe.LOADSVSEENTITYTEMPLATEGROUP)){
      Meteor.subscribe("svse_entity_template_group");
   }
});
//延迟加载
Deps.autorun(function(c){
   if(Session.get(Subscribe.LOADSVSEENTITYTEMPLATE)){
      Meteor.subscribe("svse_entity_template");
   }
});
//延迟加载
Deps.autorun(function(c){
   if(Session.get(Subscribe.LOADSVSEMONITORTEMPLATE)){
      Meteor.subscribe("svse_monitor_template");
   }
});
//延迟加载--邮件列表
Deps.autorun(function(c){
   if(Session.get(Subscribe.LOADSVSEEMAILLIST)){
      Meteor.subscribe("svse_emaillist");
   }
});
//延迟加载--短信列表
Deps.autorun(function(c){
   if(Session.get(Subscribe.LOADSVSEMESSAGELIST)){
      Meteor.subscribe("svse_messagelist");
   }
});

//Meteor.subscribe("svse_entity_info");
Meteor.subscribe("svse_task");
//Meteor.subscribe("svse_emaillist");
Meteor.subscribe("svse_warnerrule");
Meteor.subscribe("userData");
//Meteor.subscribe("svse_messagelist");
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

Deps.autorun(function(c){
   Meteor.subscribe("svse_language",Session.get(SessionManage.MAP.language));
});

/*
Type： add 
Author：xuqiang
Date:2013-12-5 
Content:增加任务计划订阅数据
*/ 
Meteor.subscribe("svse_task");