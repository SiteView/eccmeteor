//TreeDate的数据集
Meteor.publish("svse_tree", function (fieldsObj) {
	console.log(this.userId);
	if(!this.userId)
		return null;
    //如果为管理员权限
    if(UserUtils.isAdmin(this.userId))
       return SvseTree.find({},{sort:[["sv_id","asc"]]});//,fields:fieldsObj
    var nodes = UserDaoOnServer.getOwnMonitorsNodes(this.userId);
    Log4js.info(nodes);
    return SvseTree.find({sv_id: {$in: nodes}},{sort:[["sv_id","asc"]]});
});
//Svse的数据集
Meteor.publish("svse",function(){
	if(!this.userId)
		return null;
	if(UserUtils.isAdmin(this.userId))
		return Svse.find();
	var showNodes = UserDaoOnServer.getOwnMonitorsNodes(this.userId);
//	return  Svse.find({sv_id:{$in: showNodes}});
	var nodes =  Svse.find({sv_id:{$in: showNodes}}).fetch();
	if(!nodes)
		return null;
	var length = nodes.length;
	var newNodes = [];
	for(var i = 0;i<length;i++){
		var newNode = nodes[i];
		if(nodes[i]["type"] === "entity"){
			newNodes.push(newNode);
			continue;
		}
		if(newNode["subentity"] && newNode["subentity"].length){
			newNode["subentity"]=ArrayUtils.intersect(showNodes,newNode["subentity"]) //求交集
		}
		if(newNode["subgroup"] &&  newNode["subgroup"].length){
			newNode["subentity"] = ArrayUtils.intersect(showNodes,newNode["subgroup"]) //求交集
		}
		newNodes.push(newNode);
	}
	Log4js.info(newNodes);
	return newNodes;
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

/*
Type：add 
Author：xuqiang
Date:2013-10-18 09:40
Content: 统计报告
*/ 
Meteor.publish("Svse_Statisticalresultlist",function(){
	return SvseStatisticalresultlist.find();
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