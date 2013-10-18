//TreeDate的数据集
Meteor.publish("svse_tree", function (fieldsObj) {
      //,fields:fieldsObj
	return SvseTree.find({},{sort:[["sv_id","asc"]]});
});
//Svse的数据集
Meteor.publish("svse",function(){
	return Svse.find();
});
//监视器模板
Meteor.publish("svse_monitor_template",function(){
	return SvseMonitorTemplate.find();
});
//设备模板
Meteor.publish("svse_entity_template",function(){
	return SvseEntityTemplet.find();
});
//设备模板组
Meteor.publish("svse_entity_template_group",function(){
	return SvseEntityTempletGroup.find();
});

//设备信息
Meteor.publish("svse_entity_info",function(){
	return SvseEntityInfo.find();
});

//计划任务
Meteor.publish("svse_task",function(){
	return SvseTask.find();
});

//邮件
Meteor.publish("svse_emaillist",function(){
	return SvseEmailList.find();
});

//短信
Meteor.publish("svse_messagelist",function(){
	return SvseMessageList.find();
});

//报警规则
Meteor.publish("svse_warnerrule",function(){
	return SvseWarnerRule.find();
});
/*‌‌
   Type：  modify ‌‌
   Author：任杰‌‌
   Date:2013-10-16 10:40‌‌
   Content:修改Meteor.publish("svse_TopNresultList",function(){‌
	return SvseTopNresultList.find();‌
});‌
  */
//TOPN报告
Meteor.publish("svse_TopNresultlist",function(){
	return SvseTopNresultlist.find();
});
//用户信息
Meteor.publish("userData",function(){
	if(!this.userId)
		return;
	var user = Meteor.users.findOne(this.userId);
	if(!user)
		return;
	if(user.profile.accounttype === "admin")
		return Meteor.users.find({},{fields: {'profile': 1,username:1}});
	return Meteor.users.find(this.userId);
});