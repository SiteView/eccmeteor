var SvseEntityTemplateDao = {
	getEntityGroup:function(){//获取设备分组数据
		return SvseEntityTempletGroup.find({}).fetch();
	},
	getEntityPropertyById:function(id){//获取设备模板的属性
		return SvseEntityTemplet.findOne({"return.id":id}).property;
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
		Utils.checkReCallFunction(fn);
		Meteor.call("svSubmitEntity",entity,parentid,function(err,r_entity){
			if(err){
				fn(err);
				return;
			}
			SystemLogger("后台添加成功,返回值是：");
			SystemLogger(r_entity);
			SvseEntityTemplateInfo.insert(r_entity,function(err,e_id){
				if(!err){
					SystemLogger("添加设备到Info"+e_id);
				}
			});
			var selfId = r_entity["return"]["id"];
			//1. 插入节点到SvseTree	
			Meteor.call("getNodeByParentIdAndId",parentid,selfId,function (err,result){
				if(err){
					SystemLogger(err);
					return;
				}
				SvseTree.insert(result,function(err,_id){
					if(err){
						SystemLogger("插入到SvseTree失败，错误是：");
						SystemLogger(err);
						return;
					}
					SystemLogger("插入到SvseTree成功，_id为"+_id);
					SystemLogger("FindOne结果是：");
					SystemLogger(SvseTree.findOne(_id));
					//2插入本身到Svse
					var node ={
						"parentid" : parentid,
						"sv_id" : selfId,
						"type" : result.type
					};
					Svse.insert(node, function (err1, r_id) {
						if (err1) {
							SystemLogger("插入子节点" +selfId + "失败");
						}else{
							SystemLogger("插入自身到Svse成功，_id为"+r_id);
							SystemLogger("FindOne结果是：");
							SystemLogger(Svse.findOne(r_id));
							
							//3 插入到父节点（更新父节点）
							var parentNode = Svse.findOne({sv_id:parentid});
							SystemLogger("找到的父节点是");
							SystemLogger(parentNode);
							
							Svse.update(parentNode._id,{$set:{has_son:true},$push:{subentity:selfId}},function(err2){
								if(err2){
									SystemLogger("更新父节点失败，错误是：");
									SystemLogger(err2);
									return;
								}
								fn();//执行回调函数
							});
						}
					});
				});
			});	
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
		var node = SvseEntityTemplateInfo.findOne({"return.id":id});
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
		return SvseEntityTemplateInfo.findOne({"return.id":id})["property"];
	},
	editEntity:function(entity,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call("svSubmitEntity",entity,false,function(err,r_entity){
			if(err){
				fn(err);
				return;
			}
			//需要更新的地方
			//1.SvseTree 节点的sv_name
			//2.SvseEntityInfo
			SystemLogger("后台修改后的Node为");
			SystemLogger(r_entity);
			var r_id = r_entity["return"]["id"]
			var oriNode = SvseTree.findOne({sv_id:r_id});
			SystemLogger("SvseTree.findOne找到的是：");
			SystemLogger(oriNode);
			SvseTree.update(oriNode._id,{ $set: { sv_name: r_entity["property"]["sv_name"] } },function(err){ //更新SvseTree
				if(err){
					SystemLogger("editEntity 时SvseTree.update出现错误");
					SystemLogger(err);
					return;
				}
				var r_info = SvseEntityTemplateInfo.findOne({"return.id":r_id}); //获取SvseEntityTemplateInfo原来节点数据
				SystemLogger("SvseEntityTemplateInfo.findOne找到的是：");
				SystemLogger(r_info);
				SvseEntityTemplateInfo.update(r_info._id,{$set:{property:entity["property"],return:entity["return"]}},function(err){ //更新SvseEntityTemplateInfo
					if(err){
						SystemLogger("editEntity 时SvseEntityTemplateInfo.update出现错误");
						SystemLogger(err);
						return;
					}
					fn();//执行回调函数
				});
			})
		})
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