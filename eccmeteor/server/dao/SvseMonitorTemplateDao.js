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
			var temlpateId = templateMonitoryTemlpateIds[index];
			data = SvseMethodsOnServer.svGetEntityDynamicPropertyData(entityId,temlpateId);
			if(!data || !data["DynamicData"])
				continue;
			array.push({
				temlpateId:data["DynamicData"]
			})
		}
		return array;
	}
}