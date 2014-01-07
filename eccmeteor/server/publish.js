/**
	Type:add
	Author:huyinghuan
	Date:2013-10-29 14:34
	Content:增加按用户权限过滤
	for(index in nodes){ ............}
**/
//TreeDate的数据集
Meteor.publish("svse_tree", function (fieldsObj) {
	return SvseTree.find();
	/*
	if(!this.userId)
		return null;
    //如果为管理员权限
    if(UserUtils.isAdmin(this.userId))
       return SvseTree.find({},{sort:[["sv_id","asc"]]});//,fields:fieldsObj
    var nodes = UserDaoOnServer.getOwnMonitorsNodes(this.userId);
    Log4js.info(nodes);
    return SvseTree.find({$or:[{sv_id: {$in: nodes}},{type:"monitor"}]},{sort:[["sv_id","asc"]]});
    */
});
/**
	Type:add
	Author:huyinghuan
	Date:2013-10-29 14:34
	Content:增加按用户权限过滤
	for(index in nodes){............}
**/
//Svse的数据集
Meteor.publish("svse",function(){
	return Svse.find();
	/*
	if(!this.userId)
		return null;
	if(UserUtils.isAdmin(this.userId))
		return Svse.find();
	var showNodes = UserDaoOnServer.getOwnMonitorsNodes(this.userId);
	var self = this;
	Svse.find({sv_id:{$in: showNodes}}).forEach(function(newNode){
		if(newNode["type"] === "entity"){
			self.added("svse",newNode._id,newNode);
		}else{
			if(newNode["subentity"] && newNode["subentity"].length){
				newNode["subentity"]=ArrayUtils.intersect(showNodes,newNode["subentity"]) //求交集
			}
			if(newNode["subgroup"] &&  newNode["subgroup"].length){
				newNode["subgroup"] = ArrayUtils.intersect(showNodes,newNode["subgroup"]) //求交集
			}
			self.added("svse",newNode._id,newNode);
		}
	})
	self.ready();
	*/
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

/*‌‌
   Type：  modify ‌‌
   Author： huyinghuan
   Date:2013-10-29 10:40‌‌ 星期二‌‌
   Content: 修改管理员账户判断标准 UserUtils.isAdmin(this.userId)
  */
//用户信息
Meteor.publish("userData",function(){
	if(!this.userId)
		return;
	if(UserUtils.isAdmin(this.userId))
		return Meteor.users.find({},{fields: {'profile': 1,username:1}});
	return Meteor.users.find(this.userId);
});

/*‌‌
   Type：  add ‌‌
   Author： huyinghuan
   Date:2013-10-29  10:40 星期二‌‌
   Content: 增加设置节点集合
*/
Meteor.publish("svse_settingnodes",function(){
	if(!this.userId)
		return;
	if(UserUtils.isAdmin(this.userId))
		return SvseSettingNodes.find();
	var showNodes = UserDaoOnServer.getOwnSettingNodes(this.userId);
	Log4js.info("=--==============svse_settingnodes")
	Log4js.info(showNodes);
	return SvseSettingNodes.find({action:{$in: showNodes}});
});


/*‌‌
   Type：  add ‌‌
   Author： huyinghuan
   Date:2013-11-04 13:55 星期一
   Content: 增加设置语言集合集合
*/
Meteor.publish("svse_language",function(language){
	language = language || "ZH-CN";
	return SvseLanguage.find({name:{$in:[language,"All"]}});
});