//监视器模板属性
var SvseMonitorTemplateDao ={
	getTemplateById:function(id){//根据id获取模板
		return SvseMonitorTemplate.findOne({"return.id" : id});
	},
	getMonityTemplateParametersById:function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var parameters = [];
		for(item in template){
			if(item.indexOf("ParameterItem") == -1 || item.indexOf("AdvanceParameterItem") != -1)continue;
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
	getMonityTemplateStatesById:function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var states = [];
		states.push(template["error"]);
		states.push(template["warning"]);
		states.push(template["good"]);
		return states;
	},
	getMonityTemplateAdvanceParametersById:function(id){//根据id获取监视器模板参数
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
	},
	addMonitor:function(monitor,parentid,fn){ //添加监视器
		Utils.checkReCallFunction(fn);
		Meteor.call("entityAddMonitor",monitor,parentid,function(err,r_monitor){
			if(err){
				fn(err);
				return;
			}
			SystemLogger("插入到服务端成功,服务端返回是数据是");
			console.log(r_monitor);
			var selfId = r_monitor["return"]["id"];
			Meteor.call("getNodeByParentIdAndId",parentid,selfId,function(err,n_monitor){
				if(err){
					fn(err);
					return;
				}
				SystemLogger("从服务端获取到的SvseTree数据是");
				console.log(n_monitor);
				SvseTree.insert(n_monitor,function(err,r_id){
					if(err){
						fn(err);						
						return;
					}
					SystemLogger("插入数据到SvseTree成功");
					//3 插入到父节点（更新父节点）
					var parentNode = Svse.findOne({sv_id:parentid});
					SystemLogger("找到的父节点是");
					SystemLogger(parentNode);
					Svse.update(parentNode._id,{$push:{submonitor:selfId}},function(err){
						if(err){
							SystemLogger("更新父节点失败，错误是：");
							fn(err);
							return;
						}
						SystemLogger("根据树结构的父节点成功");
						fn();
					});
				});
			});
		});
	}
}