SvseEntityTemplateDao = {
	AGENT:"svseEntityTemplateDaoAgent",
	getEntityGroup:function(){//获取设备分组数据
		return SvseEntityTempletGroup.find({},{sort:{sv_index:1}}).fetch();
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
	}
}

//isEmpty  判断设备模板当前数据为空
Object.defineProperty(SvseEntityTemplateDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseEntityTempletGroup.findOne() == null){
			Session.set(Subscribe.LOADSVSEENTITYTEMPLATEGROUP,true);
			Session.set(Subscribe.LOADSVSEENTITYTEMPLATE,true);
			Session.set(Subscribe.LOADSVSEMONITORTEMPLATE,true);
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


//同步获取设备模板属性 //获取设备需要编辑的字段
Object.defineProperty(SvseEntityTemplateDao,"getEntityItemsByIdSync",{
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

//异步获取设备模板属性 //获取设备需要编辑的字段
Object.defineProperty(SvseEntityTemplateDao,"getEntityItemsByIdAsync",{
	value:function(fn){
		Meteor.call(SvseEntityTemplateDao.AGENT,"getEntityItemsByIdAsync",function(error,result){
			if(error){
				Log4js.info(error);
			}else{
				fn(result);
			}
		})
	}
});

//异步 获取需要编辑的设备 属性
Object.defineProperty(SvseEntityTemplateDao,"getEditEntityModuleByIdAsync",{
	value:function(id,fn){
		//根据SvseTree中的sv_id获取获取设备类型（即SvseEntityTempalate中的return.id）;
		var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
        //获取设备保存的信息
        Meteor.call(SvseEntityTemplateDao.AGENT,"getEnityInfoAsyncById",[id,devicetype],function(error,entityInfo){
        	if(error){
        		console.log(error);
        		return ;
        	}
        	fn(entityInfo)
        });
	}
});