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
*/
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