SvseEntityTemplateDao = {
	AGENT:"svseEntityTemplateDaoAgent",
	getEntityGroup:function(){//获取设备分组数据
		return SvseEntityTempletGroup.find({}).fetch();
	},
	//获取设备模板的属性  ,若第二个属性name存在,则获取模板的属性值
	getEntityPropertyById:function(id,name){
		var property = SvseEntityTemplet.findOne({"return.id":id}).property;
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
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1)continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			items.push(temp);
		}
		SystemLogger("items is :");
		SystemLogger(items);
		return items;
	},
	addEntity:function(entity,parentid,fn){//根据提交的信息和父节点添加设备
		fn = Utils.checkReCallFunction(fn);

		Meteor.call(SvseEntityTemplateDao.AGENT,"addEntity",[entity,parentid],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	getSvseEntityDevicetypeBySvseTreeId:function(id){//根据设备在SvseTree的id获取该设备的类型
		var node = SvseTree.findOne({sv_id:id});
		return node.sv_devicetype;
	},
	getItemsAndDefaultValueBySvIdAndDevicetype:function(id,type){//根据设备的id和类型 分别在SvseEntityInfo中获取设备的属性信息和需要编辑的属性字段。
		SystemLogger("SvseEntityTemplate.js 的方法getItemsAndDefaultValueBySvIdAndDevicetype打印：")
		SystemLogger("获取设备的id是: "+id+"  设备的类型是："+type);
		//获取node数据
		var node = SvseEntityInfo.findOne({"return.id":id});
		SystemLogger("获取设备的数据是：");
		SystemLogger(node);
		var template = SvseEntityTemplet.findOne({"return.id":type});
		SystemLogger("获取设备的模板是：");
		SystemLogger(template);
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
			var selects = []; 
			for(label in item){
				if(label.indexOf("sv_itemlabel") === -1)continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = item[label];
				select.value = item[sub];
				selects.push(select);
			}
			item["selects"] = selects;
			items.push(item);
		}
		SystemLogger("items is :");
		SystemLogger(items);
		return items;
	},
	getItemsAndDefaultValueBySvId:function(id){//获取一般属性
		return SvseEntityInfo.findOne({"return.id":id})["property"];
	},
	editEntity:function(entity,entityId,fn){
		Meteor.call(SvseEntityTemplateDao.AGENT,"updateEntity",[entity,entityId],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	getEntityMontityByDevicetype:function(type,status){ //获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
		SystemLogger("SvseEntityTemplate.js 的getQuickAddMontityByDevicetype打印：");
		template = SvseEntityTemplet.findOne({"return.id":type});
		if(!template){
			SystemLogger("找不到设备"+type);
			return [];
		}
		var monityIds = !status ? (template["submonitor"] || []):(template["property"]["sv_quickadd"] ? template["property"]["sv_quickadd"].split("\,"):[]);
		if(monityIds.length === 0){
			SystemLogger("该设备"+type+"不存在监视器");
			return [];
		}
		SystemLogger("该设备监视器有：");
		SystemLogger(monityIds);
		var monities = SvseMonitorTemplate.find({"return.id":{$in:monityIds}}).fetch();
		return monities;
	}
}