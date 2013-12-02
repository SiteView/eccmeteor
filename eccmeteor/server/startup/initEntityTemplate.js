var findOsType = function(entity){
	if(entity["return"]["id"] !== "_unix"){//如果是操作系统。那么添加操作系统类型
		return;
	}
	for(itemName in entity){
		if(itemName.indexOf("EntityItem") === -1 || entity[itemName].sv_name !== "_OsType"){
			continue;
		}
		var Item = entity[itemName];
		//获取操作系统类型
		var _OsTypes = AssetsUtils.getEntityTemplateOsType();
		var length = _OsTypes.length;
		Item["sv_itemcount"] = length;
		for(var i = 0 ; i < length ; i++){
			Item["sv_itemlabel"+i] = _OsTypes[i].description;
			Item["sv_itemvalue"+i] = _OsTypes[i].name;
		}
		break;
	}
}

//初始化设备模板信息
initSvseEntityTempletAtStartUp = function (entityIds){
	for(id in entityIds){
		var temp = SvseMethodsOnServer.GetEntityTemplet(entityIds[id])
		if(!temp){
			Log4js.info("添加设备模板"+entityIds[id]+"失败");
			continue;
		}
		var subs = temp.submonitor;//将对象转数组 {"1":"","2":""} --> ["1","2"]
		var arr = [];
		for(sub in subs){
			arr.push(sub);
		}
		temp.submonitor = arr;
		findOsType(temp);//如果是操作系统。那么添加操作系统类型
		SvseEntityTemplet.insert(temp,function(err,r_id){
			if(err){
				Log4js.info(err);
			}
		});
	}
}

//初始化设备模板组信息
initSvseEntityTempletGroupAtStartUp = function (debug){
	Log4js.info("设备模板初始化开始。。。");
	if(debug === -1)return;

	SvseEntityTempletGroup.remove({});
	Log4js.warn("SvseEntityTempletGroup 数据清除");
	SvseEntityTemplet.remove({});
	Log4js.warn("SvseEntityTemplet 数据已清除");
	
	var entityGroup = SvseMethodsOnServer.GetAllEntityGroups();//调用server/methods.js中的方法
	if(!entityGroup){
		Log4js.info("设备组为空");
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
		var tids = node["entityTemplateId"];
		SvseEntityTempletGroup.insert(node,function(err,r_id){  //插入设备模板组
			if(err){
				Log4js.info("初始化组"+entityTemplate+"失败")
				Log4js.info(err);
				return;
			}
		});
		initSvseEntityTempletAtStartUp(tids); //插入设备模板
	}
	Log4js.info("设备模板初始化完成");
}

