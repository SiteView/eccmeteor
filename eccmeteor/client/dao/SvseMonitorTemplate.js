//监视器模板属性
var SvseMonitorTemplateDao ={
	getTemplateById:function(id){//根据id获取模板
		return SvseMonitorTemplate.findOne({"return.id" : id});
	},
	getMonityTemplateParametersById:function(id){//根据id获取监视器模板参数
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
	getMonityTemplateStatesById : function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var states = [];
		states.push(template["error"]);
		states.push(template["warning"]);
		states.push(template["good"]);
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
	}
}