//监视器模板属性
var SvseMonitorTemplateDao ={
	getTemplateById:function(id){
		return SvseMonitorTemplate.findOne({"return.id" : id});
	},
	getMonityTemplateParametersById:function(id){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var parameters = [];
		for(item in template){
			if(item.indexOf("ParameterItem") == -1)continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				parameters.push(temp);
				continue;
			};
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1)continue;
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
	getMonityTemplateStatesById:function(id){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var states = [];
		states.push(template["error"]);
		states.push(template["warning"]);
		states.push(template["good"]);
		return states;
	},
	getMonityTemplateAdvanceParametersById:function(id){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var advanceParameters = [];
		for(item in template){
			if(item.indexOf("AdvanceParameterItem") == -1)continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				advanceParameters.push(temp);
				continue;
			};
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1)continue;
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
}