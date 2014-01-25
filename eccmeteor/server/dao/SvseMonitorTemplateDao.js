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
	value:function(monitorId,entityId){
		//编辑监视器时根据 监视器的id获取该监视器的模板类型
		var monitor = SvseTree.findOne({sv_id:monitorId});
		if(!monitor){
			return null;
		}
		var monitorTemplateId =  monitor.sv_monitortype;
		// 监视器模板id获取该监视器的模板类型名称
		var monitorTemplate = SvseMonitorTemplate.findOne({"return.id":monitorTemplateId});
		if(!monitorTemplate){
			return null;
		}
		var context = MonitorInfomation.getMonitorInfoContext(monitorTemplate);
		context["monitorId"] = monitorId;
		result = MonitorInfomation.megerDynamicParameters(context,entityId);
		return result;

	}
});


//客户端同步获取编辑监视的信息
Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getAddMonitorInfoAsync",{
	value:function(monitorTemplateId,entityId){
		monitorTemplate =  SvseMonitorTemplate.findOne({"return.id" : monitorTemplateId});
		if(!monitorTemplate){
			return null;
		}
		var context = MonitorInfomation.getMonitorInfoContext(monitorTemplate);

		var monityTemplateParameters = context.MonityTemplateParameters;
		
		var mParametersLength = monityTemplateParameters.length;
		var DynamicParameters = null;
		for(var pi = 0 ; pi < mParametersLength ; pi++){
			if(monityTemplateParameters[pi]["sv_dll"]){
				DynamicParameters = {index:pi,parameter:monityTemplateParameters[pi]};
				break;
			}
		}
		//监视器不具备动态属性。直接渲染弹窗
		if(!DynamicParameters){
			return context;
		}
		//具备动态属性 && 获取动态属性
		var monitorData =  SvseMethodsOnServer.svGetEntityDynamicPropertyData(entityId,monitorTemplateId);
		if(!monitorData) {
			return null;
		}
		var optionObj = monitorData["DynamicData"];
		var DynamicDataList = [];
		for(name in optionObj){
			DynamicDataList.push({key:name,value:optionObj[name]});
		}
		//给对应的设备赋值
		context.MonityTemplateParameters[DynamicParameters.index]["selects"] = DynamicDataList;
		return context;
	}
});

var MonitorInfomation =  function(){};

Object.defineProperty(MonitorInfomation,"getMonitorInfoContext",{
	value:function(monitorTemplate){
		var monitorTemplateId = monitorTemplate["return"]["id"]
		var monitorTemplateName = monitorTemplate.property.sv_label;
		var allTemplateParameters = this.parseMonityTemplateAllParameters(monitorTemplate);
		var MonityTemplateParameters = this.parseMonityTemplateParameters(allTemplateParameters);
		var MonityTemplateAdvanceParameters = this.parseMonityTemplateAdvanceParameters(monitorTemplate);
		var MonityTemplateReturnItems = this.parseMonityTemplateReturnItems(monitorTemplate);
		var MonityTemplateStates = this.parseMonityTemplateStates(monitorTemplate);
		var MonityFrequencyLabel = this.parseMonityTemplateParameterByName(allTemplateParameters,"_frequency").sv_label;
		var MonityFrequencyDom =  this.parseMonityTemplateFrequencyParameters(allTemplateParameters);
		return {
			monitorTemplateId:monitorTemplateId,
			monitorType:monitorTemplateName,
			MonityTemplateParameters:MonityTemplateParameters,
			MonityTemplateAdvanceParameters:MonityTemplateAdvanceParameters,
			MonityTemplateReturnItems:MonityTemplateReturnItems,
			Error:MonityTemplateStates.Error,
			Warning:MonityTemplateStates.Warning,
			Good:MonityTemplateStates.Good,
			MonityFrequencyLabel:MonityFrequencyLabel,
			MonityFrequencyDom:MonityFrequencyDom
		}
	}
});

Object.defineProperty(MonitorInfomation,"megerDynamicParameters",{
	value:function(context,entityId){
		var monityTemplateParameters = context.MonityTemplateParameters;
		var monitorId = context["monitorId"];
		var monitorTemplateId = context["monitorTemplateId"];
		var mParametersLength = monityTemplateParameters.length;
		var DynamicParameters = null;
		for(var pi = 0 ; pi < mParametersLength ; pi++){
			if(monityTemplateParameters[pi]["sv_dll"]){
				DynamicParameters = {index:pi,parameter:monityTemplateParameters[pi]};
				break;
			}
		}

		var r_monitor = SvseMethodsOnServer.svGetMonitor(monitorId);
		console.log(r_monitor)
		if(!r_monitor) {
			null;
		}
		//监视器不具备动态属性。直接渲染弹窗
		if(!DynamicParameters){
			context = this.megerTemplateAndFactData(context,r_monitor);//合并模板数据和实际数据
			return context;
		}
		//具备动态属性 && 获取动态属性
		var monitorData =  SvseMethodsOnServer.svGetEntityDynamicPropertyData(entityId,monitorTemplateId);
		if(!monitorData) {
			return null;
		}

		var optionObj = monitorData["DynamicData"];
		var DynamicDataList = [];
		for(name in optionObj){
			DynamicDataList.push({key:name,value:optionObj[name]});
		}
		//给对应的设备赋值
		context.MonityTemplateParameters[DynamicParameters.index]["selects"] = DynamicDataList;
		context = this.megerTemplateAndFactData(context,r_monitor);//合并模板数据和实际数据
		return context;
	}
});

/*
合并模板数据和实际数据
*/
Object.defineProperty(MonitorInfomation,"megerTemplateAndFactData",{
	value:function(MTempalte,MInstance){
		//合并advanceParameter
		var advanceMT = MTempalte.MonityTemplateAdvanceParameters;
		var advanceMI =  MInstance.advance_parameter;
		if(advanceMT.length && advanceMI){
			for(ap in advanceMI){
				for(apIndex = 0 ; apIndex < advanceMT.length ; apIndex ++){
					if(ap == advanceMT[apIndex].sv_name){
						advanceMT[apIndex].sv_value = advanceMI[ap];
						break;
					}
				}
			}
			MTempalte.MonityTemplateAdvanceParameters = advanceMT;
		}
		//合并状态
		MTempalte.Error = this.mergeTemplateStatus(MTempalte.Error,MInstance.error);
		MTempalte.Good = this.mergeTemplateStatus(MTempalte.Good,MInstance.good);
		MTempalte.Warning = this.mergeTemplateStatus(MTempalte.Warning,MInstance.warning);

		//基础频率
		var MonityFrequency = MTempalte.MonityFrequencyDom;
		MonityFrequency[0]["sv_value"] = MInstance.parameter[MonityFrequency[0]["sv_name"]];
		MonityFrequency[1]["sv_value"] = MInstance.parameter[MonityFrequency[1]["sv_name"]];
		MTempalte.MonityFrequencyDom = MonityFrequency;

		//普通参数
		MTempalte["CommonParameter"] = MInstance.parameter;
		//MTempalte["CommonParameter"].AllTaskNames = MTempalte["AllTaskNames"];

		//普通属性
		MTempalte["CommonProperty"] = MInstance.property;
		//动态监视器属性
		var MTDynamicProperty = MTempalte["MonityTemplateParameters"];
		for(var dl = 0; dl < MTDynamicProperty.length; dl++){
			if(MTDynamicProperty[dl]["sv_name"]){
				MTDynamicProperty[dl]["sv_value"] =  MInstance.parameter[MTDynamicProperty[dl]["sv_name"]]
			}
		}
		MTempalte["MonityTemplateParameters"] = MTDynamicProperty;
		return MTempalte;
	}
});

//合并状态
Object.defineProperty(MonitorInfomation,"mergeTemplateStatus",{
	value:function(MTStatus,MIStatus){
		MTStatus.sv_conditioncount = MIStatus.sv_conditioncount;
		MTStatus.sv_expression = MIStatus.sv_expression;
		var selects = [];
		for(property in MIStatus){
			if(property.indexOf("sv_paramname") != -1){
				var index = property.replace("sv_paramname","");
				var rid = +index;
				selects.push({
					"sid":index,
					"paramenameKey":property,
					"paramenameValue":MIStatus[property],
					"operateKey":("sv_operate"+index),
					"operateValue":MIStatus[("sv_operate"+index)],
					"sv_paramvalueKey":("sv_paramvalue"+index),
					"sv_paramvalueValue":MIStatus[("sv_paramvalue"+index)],
					"sv_relationKey":("sv_relation"+index),
					"sv_relationValue":MIStatus[("sv_relation"+(rid-1))] ? MIStatus[("sv_relation"+(rid-1))] :""
				})
			}
		}
		MTStatus["selects"] = selects;
		return MTStatus;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateAllParameters",{
	value:function(template){//根据id获取监视器模板参数
		var parameters = [];
		for(item in template){
			if(item.indexOf("ParameterItem") == -1 || item.indexOf("AdvanceParameterItem") != -1) continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				parameters.push(temp);
				continue;
			}
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1) continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			parameters.push(temp);
		}
		return parameters;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateParameters",{
	value:function(parameters){//根据id获取监视器模板参数 (除了 监视频率和监视单位以外)
		var newparameters = [];
		for(index in parameters){
			if(!!parameters[index].sv_name.match(/^(_frequency|_frequencyUnit)$/)){
				continue;
			}
			newparameters.push(parameters[index]);
		}
		return newparameters;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateAdvanceParameters",{
	value: function(template){
		var advanceParameters = [];
		for(item in template){
			if(item.indexOf("AdvanceParameterItem") == -1){
				continue;
			} 
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				advanceParameters.push(temp);
				continue;
			}
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1) continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			advanceParameters.push(temp);
		}
		return advanceParameters;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateReturnItems",{
	value:function(template){//根据id获取返回参数
		var returnItems = [];
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			returnItems.push(template[item]);
		}
		return returnItems;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateStates",{
	value:function(template){//根据id获取监视器模板参数
		var states = {
			Error : template["error"],
			Warning: template["warning"],
			Good : template["good"]
		};
		return states;
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateParameterByName",{
	value:function(parameters,name){
		for(index in parameters){
			if(parameters[index].sv_name === name){
				return parameters[index]
			}
		}
	}
});

Object.defineProperty(MonitorInfomation,"parseMonityTemplateFrequencyParameters",{
	value: function(parameters){
		var arr = [];
		for(index in parameters){
			if(!!parameters[index].sv_name.match(/^(_frequency|_frequencyUnit)$/)){
				arr.push(parameters[index]);
			}
		}
		return arr;
	}
});

//客户端异步获取监视器的信息---by zhuqing
Object.defineProperty(SvseMonitorTemplateDaoOnServer,"getMonitorInfoByIdAsync",{
	value:function(monitorIds,entityidsData){
		//根据 监视器的id获取该监视器的模板类型
		var contexts = [];
		for(var i = 0;i < entityidsData.length;i++){
			console.log(entityidsData[i]);
			var result = SvseMethodsOnServer.svGetDefaultTreeData(entityidsData[i],false);
			 if(!result){
				return null;
			 }
			 Log4js.info("666666666666666666");
			Log4js.info(result);
			 var monitor = null;
			 var monitorTemplateIds = [];
			 
			 for(m in result){
				 monitor = result[m];
				 if(monitor == null){
					return null;
				 }
				var monitorTemplateId =  monitor.sv_monitortype;
				console.log(monitorTemplateId);
				// 监视器模板id获取该监视器的模板类型名称
				var monitorTemplate = SvseMonitorTemplate.findOne({"return.id":monitorTemplateId});	
				//console.log(monitorTemplate);
				if(!monitorTemplate){
					return;
				}
				//console.log(monitorTemplate);
				var context = MonitorInfomation.getMonitorInfoContext(monitorTemplate);
				context["monitorId"] = monitorIds[m];
				//console.log(context);
				contexts.push(context);
			
			}
		}
		
		return contexts;	
	}
});