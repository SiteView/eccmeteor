SvseEntityTemplateDao= {
	"getReturn":function(status,msg,option){ //组装返回客户端的信息
		status = !!status ;
		if(typeof msg === "undefined" && !status)
			msg = "Permission isn't enoungh";
		return {status:status,msg:msg,option:option};
	},
	"sync":function(){
	//	SyncFunction.SyncEmailList();
	},
	"addEntity":function(parentid,entity){
		var isNetwork = SvseEntityTemplateDao.isNetwork(entity.property.sv_devicetype);
		if(isNetwork){
			entity.property.sv_network = "true";
		}
		var result = SvseMethodsOnServer.svSubmitEntity(entity,parentid);
		if(!result){
			var msg = "SvseEntityTemplateDao's addEntity  faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		Log4js.info("后台添加成功,返回值是：");
		Log4js.info(result);
		SvseEntityInfo.insert(result,function(err,e_id){
			if(err){
				var msg = "SvseEntityTemplateDao's SvseEntityInfo.insert faild";
				Log4js.error(msg);
				throw new Meteor.Error(500,msg);
			}
		});
		var selfId = result["return"]["id"];
		var nodeSelf = SvseMethodsOnServer.svGetNodeByParentidAndSelfId(parentid,selfId);
		if(!nodeSelf){
			var msg = "SvseEntityTemplateDao's SvseMethodsOnServer.svGetNodeByParentidAndSelfId  faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		SvseTree.insert(nodeSelf,function(err,_id){
			if(err){
				throw new Meteor.Error(500,err);
			}
			//2插入本身到Svse
			var node ={
				"parentid" : parentid,
				"sv_id" : selfId,
				"type" : nodeSelf.type
			};
			Svse.insert(node, function (err1, r_id) {
				if (err1) {
					Log4js.error(err1);
					var msg = "SvseEntityTemplateDao's Svse.insert  faild";
					throw new Meteor.Error(500,msg);
				}else{
					//3 插入到父节点（更新父节点）
					var parentNode = Svse.findOne({sv_id:parentid});
					Svse.update(parentNode._id,{$set:{has_son:true},$push:{subentity:selfId}},function(err2){
						if(err2){
							Log4js.error(err2);
							var msg = "SvseEntityTemplateDao's Svse.update  faild";
							throw new Meteor.Error(500,msg);
						}
					});
				}
			});
		});
		return  SvseEntityTemplateDao.getReturn(true,null,{id:selfId})
	},
	"updateEntity":function(selfId,entity){
		var isNetwork = this.isNetwork(entity.property.sv_devicetype);
		if(isNetwork){
			entity.property.sv_network = "true";
		}
		var result = SvseMethodsOnServer.svSubmitEntity(entity,false);
		if(!result){
			var msg = "SvseEntityTemplateDao's addEntity  faild";
			Log4js.error(msg);
			throw new Meteor.Error(500,msg);
		}
		var r_id = result["return"]["id"]
		var oriNode = SvseTree.findOne({sv_id:r_id});
		SvseTree.update(oriNode._id,{ $set: { sv_name: result["property"]["sv_name"] } },function(err){ //更新SvseTree
			if(err){
				Log4js.error(err);
				var msg = "SvseEntityTemplateDao's updateEntity SvseTree.update  faild";
				throw new Meteor.Error(500,msg);
			}
			var r_info = SvseEntityInfo.findOne({"return.id":r_id}); //获取SvseEntityInfo原来节点数据
			SvseEntityInfo.update(r_info._id,{$set:{property:entity["property"],return:entity["return"]}},function(err){ //更新SvseEntityInfo
				if(err){
					Log4js.error(err);
					var msg = "SvseEntityTemplateDao's updateEntity SvseEntityInfo.update  faild";
					throw new Meteor.Error(500,msg);
				}
			});
		})
	}
}

//判断是否为网络设备
Object.defineProperty(SvseEntityTemplateDao,"isNetwork",{
	value:function(templateId){
		var template = SvseEntityTemplet.findOne({"property.sv_id":templateId});
		return template.property["network"] === "true" ? true :false;
	}
});

//客户端异步加载
Object.defineProperty(SvseEntityTemplateDao,"getEntityGroupAsync",{
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

//客户端异步加载
Object.defineProperty(SvseEntityTemplateDao,"getEntityItemsByIdAsync",{
	value:function(id){
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
		return items;
	}
});


//客户端异步加载
//主用用于编辑设备
//根据设备的id和类型 分别在SvseEntityInfo中获取设备的属性信息和需要编辑的属性字段。
Object.defineProperty(SvseEntityTemplateDao,"getEnityInfoAsyncById",{
	value:function(id,type){
		var node = SvseEntityInfo.findOne({"return.id":id});
		var template = SvseEntityTemplet.findOne({"return.id":type});
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
		//return items;
		//获取一般属性 //主用用于编辑设备
		var entity = SvseEntityInfo.findOne({"return.id":id});

		var StaticEnitityItems = entity ? entity["property"] : {};

		return {DynamicEntityItems:items,entityId:id,StaticEnitityItems:StaticEnitityItems};
	}
})