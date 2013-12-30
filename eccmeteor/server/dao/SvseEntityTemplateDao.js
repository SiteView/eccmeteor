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

		var isNetwork = this.isNetwork(entity.property.sv_devicetype);
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

Object.defineProperty(SvseEntityTemplateDao,"isNetwork",{
	value:function(templateId){
		var template = SvseEntityTemplet.findOne({"property.sv_id":templateId});
		return template.property["network"] === "true" ? true :false;
	}
});