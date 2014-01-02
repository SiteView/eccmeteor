SvseMonitorTemplateDaoOnServer = {
	getMonityDynamicPropertyData:function(panrentid,templateMonitoryId){
		var data =  SvseMethodsOnServer.svGetEntityDynamicPropertyData(panrentid,templateMonitoryId);
		if(!data) 
			throw new Meteor.Error(500,"SvseMonitorTemplateDaoOnServer.getMonityDynamicPropertyData Errors");
		return data;
	},
	/*
		Type:Add
		Author:huyinghuan
		Date:2013-10-17 14:47
		Content:根据设备ID和设备的监视器模板Id组 一次性获取该设备的监视器动态属性
	*/
	getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds){
		var array = [];
		var data;
		for(index in templateMonitoryTemlpateIds){
			var templateId = templateMonitoryTemlpateIds[index];
			data = SvseMethodsOnServer.svGetEntityDynamicPropertyData(entityId,templateId);
			if(!data || !data["DynamicData"])
				continue;
			var DynamicProperties = [];
			for (x in data["DynamicData"]){
				DynamicProperties.push(x);
			}

			array.push({
				templateId:templateId,
				DynamicProperties:DynamicProperties
			});
		}
		return array;
	}
}
/*
获取监视器模板中的画图主键

Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getReportDataPrimaryKey",{
	value:function(monitorId){
		var monitor = SvseTree.findOne({sv_id:monitorId});//找到该监视器所依赖的监视器模板
		if(!monitor) return; //如果该监视器不存在，不划线
		var monitorTypeId = monitor.sv_monitortype+""; //获取监视器模板ID
		//获取监视器模板	
		var monitorTemplate = SvseMonitorTemplate.findOne({"return.id" : monitorTypeId})
		//遍历 模板对象，找到 画图数据的主键
		var monitorPrimary = "";//主键，主键描述
		var monitorDescript = "";
		var monitorForeignKeys = []; //定义 数据主副键的数组，用来求最大、平均等
		for (property in monitorTemplate) {
			//主键包含在ReturnItem1，ReturnItem2,..等属性中
			if(property.indexOf("ReturnItem") == -1){
				continue;
			}
			var template = monitorTemplate[property];
			var sv_name = template["sv_name"];
			var sv_label = template["sv_label"];
			if (template["sv_primary"] === "1" && template["sv_drawimage"] == "1") {  //判断是否为主键和是否可以画图
				monitorPrimary = sv_name;
				monitorDescript = sv_label;	
			}
			//SystemLogger("画图属性为"+property+"画图主键为  "+monitorPrimary + "画图说明"+monitorDescript);
			monitorForeignKeys.push({name:sv_name,label:sv_label});
		}
		//如果没有找到画图主键，或者不能画图 ，返回。
		return monitorForeignKeys.length ? {monitorForeignKeys:monitorForeignKeys,monitorPrimary:monitorPrimary,monitorDescript:monitorDescript}: undefined ;
	}
});
*/

Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getEntityMonitorByDevicetypeAsync",{
	value:function(type,status){
		template = SvseEntityTemplet.findOne({"return.id":type});
		if(!template){
			console.log("找不到设备"+type);
			return [];
		}
		var monityIds = !status ? (template["submonitor"] || []):(template["property"]["sv_quickadd"] ? template["property"]["sv_quickadd"].split("\,"):[]);
		if(monityIds.length === 0){
			console.log("该设备"+type+"不存在监视器");
			return [];
		}
		var monities = SvseMonitorTemplate.find({"return.id":{$in:monityIds}}).fetch();
		return monities;
	}
});

Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getQuickAddMonitorsAsync",{
	value:function(entityDevicetype,addedEntityId){

		template = SvseEntityTemplet.findOne({"return.id":entityDevicetype});
		var monitors =  [];
		if(!template){
			console.log("找不到设备"+type);
		}else{
			monityIds = template["property"]["sv_quickadd"]  ? template["property"]["sv_quickadd"].split("\,"):[];
			if(monityIds.length !== 0){
				monitors = SvseMonitorTemplate.find({"return.id":{$in:monityIds}}).fetch();
			}
		}

		var dynamicMonitorIds = [];
		var mLength =  monitors.length;
		//获取动态属性
		for(var i = 0 ; i < mLength; i++){
			if(!monitors[i]["property"]["sv_extradll"]){ //如果没有动态属性
				continue;
			}
			dynamicMonitorIds.push(monitors[i]["return"]["id"]);
			monitors[i]["isDynamicProperty"] = true ; //添加一个属性表明此监视器有动态属性 ####重要
		}
		if(!dynamicMonitorIds.length){ //如果动态属性不存在
			return {monitors:monitors,addedEntityId:addedEntityId};
		}
		//查询相关的动态属性  结果返回一个动态属性数组
		/*
			格式为：
			[{
				temlpateId:temlpateId, //监视器模板id
				DynamicProperties:DynamicProperties //动态属性数组：如[“C:”,“D:”]等
			},...]
		*/
		var result = SvseMonitorTemplateDaoOnServer.getMonityDynamicPropertyDataArray(addedEntityId,dynamicMonitorIds);
		for(rIndex in result){
			for(var mIndex = 0; mIndex< mLength;mIndex++){
				if(result[rIndex]["templateId"] === monitors[mIndex]["return"]["id"]){
					monitors[mIndex]["DynamicProperties"] = result[rIndex]["DynamicProperties"];
					break;
				}
			}
		}
		return {monitors:monitors,addedEntityId:addedEntityId};
	}
});




//客户端异步获取编辑监视的信息
Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getEditMonitorInfoAsync",{
	value:function(monitorId){
		var monitor = SvseTree.findOne({sv_id:monitorId});
		if(!monitor){
			return null;
		}
		
	}
});

MonitorInfomation =  function(){};
//编辑监视器时根据 监视器的id获取该监视器的模板类型
/**
	svid：监视器的id
*/
Object.defineProperty(MonitorInfomation,"getMonitorTemplateIdBySvid",{
	value:function(svid){
		var monitor = SvseTree.findOne({sv_id:svid});
		if(!monitor){
			return false;
		}
		return monitor.sv_monitortype;
	}
});