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