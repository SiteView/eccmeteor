//监视器模板属性
SvseMonitorTemplateDao ={
	AGENT:"svseMonitorTemplateDaoAgent",
	getTemplateById:function(id){//根据id获取模板
		return SvseMonitorTemplate.findOne({"return.id" : id});
	},
	//获取监视器模板名称 如：CPU ，ping等
	getTemplateTypeById:function(id){
		return SvseMonitorTemplate.findOne({"return.id" : id}).property.sv_label;
	},
	getMonityTemplateParameters:function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
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
	},
	getMonityTemplateParametersById:function(id){//根据id获取监视器模板参数 (除了 监视频率和监视单位以外)
		var parameters = SvseMonitorTemplateDao.getMonityTemplateParameters(id);
		var newparameters = [];
		for(index in parameters){
			if(!!parameters[index].sv_name.match(/^(_frequency|_frequencyUnit)$/)){
				continue;
			}
			newparameters.push(parameters[index]);
		}
		return newparameters;
	},
	//获取监视频率参数对象
	getMonityTemplateFrequencyParameters : function(id){
		var parameters = SvseMonitorTemplateDao.getMonityTemplateParameters(id);
		var arr = [];
		for(index in parameters){
			if(!!parameters[index].sv_name.match(/^(_frequency|_frequencyUnit)$/)){
				arr.push(parameters[index]);
			}
		}
		return arr;
	},
	getMonityTemplateParameterByName : function(id,name){
		var parameters = SvseMonitorTemplateDao.getMonityTemplateParameters(id);
		for(index in parameters){
			if(parameters[index].sv_name === name){
				return parameters[index]
			}
		}
	},
	getMonityTemplateStatesById : function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var states = {
			Error : template["error"],
			Warning: template["warning"],
			Good : template["good"]
		};
		return states;
	},
	getMonityTemplateStatesByIdAndStatus : function (id,status){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		return template[status]||{};
	},
	getMonityTemplateAdvanceParametersById : function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var advanceParameters = [];
		for(item in template){
			if(item.indexOf("AdvanceParameterItem") == -1) continue;
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
	},
	getMonityTemplateReturnItemsById:function(id){//根据id获取返回参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var returnItems = [];
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			returnItems.push(template[item]);
		}
		//SystemLogger(returnItems);
		return returnItems;
	},
	getMonityTemplateReturnItemLabelByIdAndName:function(id,name){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			if(template[item]["sv_name"] === name)
				return template[item]["sv_label"];
		}
	},
	getMonityDynamicPropertyData:function(panrentid,templateMonitoryId,fn){
	//	console.log("getMonityDynamicPropertyData templateMonitoryId is:"+templateMonitoryId);
		Meteor.call(
			SvseMonitorTemplateDao.AGENT,
			"getMonityDynamicPropertyData",
			[panrentid,templateMonitoryId],
			function(err,result){
				if(err){
					Log4js.error(err);
					fn(false,err)
				}else{
					fn(true,result);
				}
			}
		);
	},
	/*
		Type:Add
		Author:huyinghuan
		Date:2013-10-17 14:25
		Content:根据设备ID和设备的监视器模板Id组 一次性获取该设备的监视器动态属性
	*/
	getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds,fn){
		Meteor.call(
			SvseMonitorTemplateDao.AGENT,
			"getMonityDynamicPropertyDataArray",
			[entityId,templateMonitoryTemlpateIds],
			function(err,result){
				if(err){
					SystemLogger(err);
					fn(false,err);
				}else{
					fn(true,result);
				}
			}
		)
	}
}

//编辑监视器时根据 监视器的id获取该监视器的模板类型
/**
	svid：监视器的id
*/
Object.defineProperty(SvseMonitorTemplateDao,"getMonitorTemplateIdBySvid",{
	value:function(svid){
		var monitor = SvseTree.findOne({sv_id:svid});
		if(!monitor){
			return false;
		}
		return monitor.sv_monitortype;
	}
});

//编辑监视器时根据 监视器的id获取该监视器的模板类型名称
/**
	templateId:监视器模板id
*/
Object.defineProperty(SvseMonitorTemplateDao,"getMonitorTemplateNameByTemplateId",{
	value:function(templateId){
		var template = SvseMonitorTemplate.findOne({"return.id":templateId})
		if(!template){
			return false;
		}
		return template.property.sv_label;
	}
});


Object.defineProperty(SvseMonitorTemplateDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseMonitorTemplate.findOne() == null){
			Session.set(Subscribe.LOADSVSEENTITYTEMPLATE,true);//缓存entity template 数据
			Session.set(Subscribe.LOADSVSEMONITORTEMPLATE,true);//monitor template 数据
			return true;
		}
		return false;
	}
});

//异步
//通过设备类型获取模板类型
//获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
Object.defineProperty(SvseMonitorTemplateDao,"getEntityMonitorByDevicetypeAsync",{
	value:function(type,status,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getEntityMonitorByDevicetypeAsync",[type,status],function(error,result){
			if(error){
				console.log(error);
			}
			fn(result);
		});
	}
});

//同步
//通过设备类型获取模板类型
//获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
Object.defineProperty(SvseMonitorTemplateDao,"getEntityMonitorByDevicetypeSync",{
	value:function(type,status){
		template = SvseEntityTemplet.findOne({"return.id":type});
		if(!template){
			Log4js.info("找不到设备"+type);
			return [];
		}
		var monityIds = !status ? (template["submonitor"] || []):(template["property"]["sv_quickadd"] ? template["property"]["sv_quickadd"].split("\,"):[]);
		if(monityIds.length === 0){
			Log4js.info("该设备"+type+"不存在监视器");
			return [];
		}
		var monities = SvseMonitorTemplate.find({"return.id":{$in:monityIds}}).fetch();
		return monities;
	}
});

//异步
//添加设备完成后的快速监视器添加 信息获取

Object.defineProperty(SvseMonitorTemplateDao,"getQuickAddMonitorsAsync",{
	value:function(entityDevicetype,addedEntityId,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getQuickAddMonitorsAsync",[entityDevicetype,addedEntityId],function(error,result){
			if(error){
				console.log(error);
				fn({status:false})
			}else{
				fn({status:true,context:result});
			}
		});
	}
});