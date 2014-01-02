SvseEntityTemplateDao = {
	AGENT:"svseEntityTemplateDaoAgent",
	getEntityGroup:function(){//获取设备分组数据
		return SvseEntityTempletGroup.find({},{sort:{sv_index:1}}).fetch();
	},
	//获取设备模板的属性  ,若第二个属性name存在,则获取模板的属性值
	getEntityPropertyById:function(id,name){
		var entityTemplate = SvseEntityTemplet.findOne({"return.id":id})
		if(!entityTemplate)
			return "";
		var property = entityTemplate.property;
		if(!name)
			return property;
		return property[name];
	},
	getEntityItemsById:function(id){ //获取设备需要编辑的字段
		var template = SvseEntityTemplet.findOne({"return.id":id});
		if(!template) return [];
		var items = [];
		for(item in template){
			if(item.indexOf("EntityItem") === -1) continue;	
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				items.push(temp);
				continue;
			};
			//组合下拉列表	
			var selects = []; 
			if(temp["selects"]){
				items.push(temp);//如果selects已经存在 选择的设备 操作系统_unix
				continue;
			}
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1)continue;
				var select = {};
				var sub = "sv_itemvalue"+label.replace("sv_itemlabel","");
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			items.push(temp);
		}
		Log4js.info("items is :");
		Log4js.info(items);
		return items;
	},
	addEntity:function(entity,parentid,fn){//根据提交的信息和父节点添加设备
		fn = Utils.checkReCallFunction(fn);

		Meteor.call(SvseEntityTemplateDao.AGENT,"addEntity",[parentid,entity],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	getSvseEntityDevicetypeBySvseTreeId:function(id){//根据设备在SvseTree的id获取该设备的类型
		var node = SvseTree.findOne({sv_id:id});
		return node ? node.sv_devicetype : "";
	},
	editEntity:function(entity,entityId,fn){
		Meteor.call(SvseEntityTemplateDao.AGENT,"updateEntity",[entityId,entity],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					Log4js.error(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	getEntityMonitorByDevicetype:function(type,status){ //获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
		Log4js.info("SeseEntityTemplate.js getEntityMonitorByDevicetype 打印：");
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
}
//主用用于编辑设备
//根据设备的id和类型 分别在SvseEntityInfo中获取设备的属性信息和需要编辑的属性字段。//变化的
Object.defineProperty(SvseEntityTemplateDao,"getDynamicEntityItems",{
	value:function(id,type){//根据设备的id和类型 分别在SvseEntityInfo中获取设备的属性信息和需要编辑的属性字段。
		Log4js.info("SvseEntityTemplate.js 的方法getItemsAndDefaultValueBySvIdAndDevicetype打印：")
		Log4js.info("获取设备的id是: "+id+"  设备的类型是："+type);
		//获取node数据
		var node = SvseEntityInfo.findOne({"return.id":id});
		Log4js.info("获取设备的数据是：");
		Log4js.info(node);
		var template = SvseEntityTemplet.findOne({"return.id":type});
		Log4js.info("获取设备的模板是：");
		Log4js.info(template);
		var property = node["property"];
		if(!template) return [];
		var items = [];
		for(field in template){  //遍历对象获取模板的编辑字段
			if(field.indexOf("EntityItem") === -1) continue;
			var item = template[field]; //编辑字段的对象
			item["sv_value"] = property[item["sv_name"]]  //获取字段item["sv_name"]在property中的值 并把该值赋值给该字段对象
			item["sv_allownull"] = (item["sv_allownull"] === 'false' ? false:true);
			if(item["sv_type"] !== "combobox"){
				items.push(item);
				continue;
			}
		   //组合下拉列表键值对
		   if(item["selects"]){
				items.push(item);//如果selects已经存在 选择的设备 操作系统_unix
				continue;
			}
			var selects = []; 
			for(label in item){
				if(label.indexOf("sv_itemlabel") === -1)continue;
				var select = {};
				var sub = "sv_itemvalue"+label.replace("sv_itemlabel","");//这样写有bug
				select.key = item[label];
				select.value = item[sub];
				selects.push(select);
			}
			item["selects"] = selects;
			items.push(item);
		}
		Log4js.info("items is :");
		Log4js.info(items);
		return items;
	}
});

//获取一般属性 //主用用于编辑设备
Object.defineProperty(SvseEntityTemplateDao,"getStaticEntityItems",{
	value:function(id){
		var entity = SvseEntityInfo.findOne({"return.id":id});
		if(entity){
			return entity["property"];
		}
		return {};
	}
});

//isEmpty  判断当前数据为空
Object.defineProperty(SvseEntityTemplateDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseEntityTempletGroup.findOne() == null){
			Session.set(Subscribe.LOADSVSEENTITYTEMPLATEGROUP,true);
			Session.set(Subscribe.LOADSVSEENTITYTEMPLATE,true);
			return true;
		}
		return false;
	}
});
//同步获取设备分组情况
Object.defineProperty(SvseEntityTemplateDao,"getEntityGroupSync",{
	value:function(){
		var groupArray = SvseEntityTempletGroup.find({},{sort:{sv_index:1}}).fetch();
		var array = new Array();
		for(var i = 0; i < groupArray.length; i++){
			var group = groupArray[i];
			var newGroup = {
				sv_hidden:group.sv_hidden,
				sv_index:group.sv_index,
				group_id:group.sv_id,
				sv_name:group.sv_name,
				entityTemplates:[]
			};
			var entityTemplates = new Array();
			var entityTemplateIds = group.entityTemplateId;
			for(var j =0; j<entityTemplateIds.length;j++){
				var template = SvseEntityTemplet.findOne({"return.id":entityTemplateIds[j]},{fields: {property: 1}});
				if(template == null){
					console.log(entityTemplateIds[j]+" is not exist");
				}else{
					console.log("running");
					var property = template.property;
					entityTemplates.push({
						sv_id:property.sv_id,
						sv_name:property.sv_name,
						sv_description:property.sv_description
					});
				}
			}
			newGroup.entityTemplates = entityTemplates;
			array.push(newGroup);
		}
		return array;
	}
});

//异步获取设备分组情况
Object.defineProperty(SvseEntityTemplateDao,"getEntityGroupAsync",{
	value:function(fn){
		Meteor.call(SvseEntityTemplateDao.AGENT,"getEntityGroupAsync",function(error,result){
			if(error){
				Log4js.info(error);
			}else{
				fn(result);
			}
		})
	}
});