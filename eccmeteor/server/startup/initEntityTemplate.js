//初始化设备模板信息
initSvseEntityTempletAtStartUp = function (entityIds){
	for(id in entityIds){
		var temp = SvseMethodsOnServer.GetEntityTemplet(entityIds[id])
		if(!temp){
			SystemLogger("添加设备模板"+entityIds[id]+"失败");
			continue;
		}
		var subs = temp.submonitor;//将对象转数组 {"1":"","2":""} --> ["1","2"]
		var arr = [];
		for(sub in subs){
			arr.push(sub);
		}
		temp.submonitor = arr;
		SvseEntityTemplet.insert(temp,function(err,r_id){
			if(err){
				SystemLogger(err);
			}
		});
	}
}

//初始化设备模板组信息
initSvseEntityTempletGroupAtStartUp = function (debug){
	SystemLogger("设备模板初始化开始。。。");
	if(debug === -1)return;
	if(debug === 0){
		SvseEntityTempletGroup.remove({});
		SystemLogger("SvseEntityTempletGroup 数据清除");
		SvseEntityTemplet.remove({});
		SystemLogger("SvseEntityTemplet 数据已清除");
	}
	
	var entityGroup = SvseMethodsOnServer.GetAllEntityGroups();//调用server/methods.js中的方法
	if(!entityGroup){
		SystemLogger("设备组为空");
		return;
	}
	
	for(entityTemplate in entityGroup){
		if(entityTemplate === "return") continue;
		var temp = entityGroup[entityTemplate];
		var node ={};
		node["sv_description"] = temp["sv_description"];
		node["sv_id"] = temp["sv_id"];
		node["sv_index"] = temp["sv_index"];
		node["sv_label"] = temp["sv_label"];
		node["sv_name"] = temp["sv_name"];
		node["sv_hidden"] =  (temp["sv_hidden"] === 'true'? true :false);
		var subEntity = temp["entityTemplateId"];
		if(!subEntity || subEntity.length === 0){
			node["entityTemplateId"] = [];
		}else if(subEntity.lastIndexOf("\,") === subEntity.length -1){
			subEntity = subEntity.substr(0,subEntity.length -1);
			node["entityTemplateId"] = subEntity.split("\,");
		}
		SvseEntityTempletGroup.insert(node,function(err,r_id){  //插入设备模板组
			if(err){
				SystemLogger("初始化组"+entityTemplate+"失败")
				SystemLogger(err);
				return;
			}
			var subIds = node["entityTemplateId"];
			if(subIds.length === 0){
				SystemLogger("设备组"+entityTemplate+"为空");
				return;
			}
			initSvseEntityTempletAtStartUp(subIds); //插入设备模板
		});
	}
	SystemLogger("设备模板初始化完成");
}

