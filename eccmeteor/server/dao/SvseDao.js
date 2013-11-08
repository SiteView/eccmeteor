SvseDaoOnServer = {	"syncAll":function(){		SyncFunction.sync();	},	"getReturn":function(status,msg){ //组装返回客户端的信息		status = !!status ;		if(typeof msg === "undefined" && !status)			msg = "Permission isn't enoungh";		return {status:status,msg:msg};	},	"removeNodesById" : function(id,flag){//删除节点及其子节点		//第一步 删除服务器中的节点，		//第二步 成功后删除本地数据库的节点			if(flag){ //后台只需删除一次即可			var result = SvseMethodsOnServer.svDelChildren(id);			if(!result){				var msg = "SvseDaoOnServer's removeNodesById  delete " + id +" faild";				Log4js.error(msg);				throw new Meteor.Error(500,msg);			}		}		var node = Svse.findOne({sv_id:id});		Log4js.info("删除id: "+id);		Svse.remove({sv_id:id});		SvseTree.remove({sv_id:id});		//如果没有子节点		if(!node||!node["has_son"])return;		//存在子节点		if(node["type"] === "entity"){ //如果是设备 直接移除子节点监视器			SvseEntityInfo.remove({"return.id":id}); //从设备信息里面移除设备			var childrenId = node["submonitor"];			if(!childrenId)return;			SvseTree.remove({sv_id:{$in:childrenId}});			return;		}		var ids = [];		if(node["subentity"]) ids = node["subentity"];		if(node["subgroup"])  ids = ids.concat(node["subgroup"]);		for(index in ids){			SvseDaoOnServer.removeNodesById(ids[index],false);		}	},	"removeNodesByIds" : function(ids){		for(index in ids){			SvseDaoOnServer.removeNodesById(ids[index],true);		}	},	"addGroup":function(group,parentid){		var result = SvseMethodsOnServer.svSubmitGroup(group,parentid);		if(!result){			var msg = "SvseDaoOnServer's svSubmitGroup  addGroup " + parentid +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		var selfId = result["return"]["id"];		var selfProperty = result["property"];		var childrenNode = SvseMethodsOnServer.svGetNodeByParentidAndSelfId(parentid,selfId);		SvseTree.insert(childrenNode,function(err){			if(err){			//	Log4js.error("插入到SvseTree失败，错误是：");				return;			}			//2插入本身到Svse			var node ={				"parentid" : parentid,				"sv_id" : selfId,				"property" : selfProperty,				"type" : childrenNode.type			};			Svse.insert(node, function (err1) {				if(err1){					return;				}				//3 插入到父节点（更新父节点）				var parentNode = Svse.findOne({sv_id:parentid});				Svse.update(parentNode._id,{$set:{has_son:true},$push:{subgroup:selfId}},function(err2){					if(err2){						Log4js.error("更新父节点失败，错误是：");						return;					}				});			});		});	},	"editGroup":function(group,selfId){		var result = SvseMethodsOnServer.svSubmitGroup(group,false);		if(!result){			var msg = "SvseDaoOnServer's svSubmitGroup  editGroup " + selfId +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		var sv_id = result["return"]["id"];		var node = SvseTree.findOne({sv_id:sv_id});		if(!node){			Log4js.error("SvseDaoOnServer editGroup SvseTree.findOne " +sv_id+ "don't exists");			return;		}		SvseTree.update(			node._id,			{$set:				{					sv_name:result.property.sv_name,					sv_description:result.property.sv_description				}			},			function(err){				if(err){					Log4js.error("SvseDaoOnServer editGroup SvseTree.update exists erorrs: ");					Log4js.error(err);				}			}		);					Svse.update({sv_id:sv_id},{$set:{property:result.property}},function(err){			if(err){				Log4js.error("SvseDaoOnServer editGroup Svse.update exists erorrs: ",-1);				Log4js.error(err);			}		})	},	//临时禁用	"forbidNodeTemporary" : function(ids,starttime,endtime){		var result = SvseMethodsOnServer.svForbidNodeTemporary(ids,starttime,endtime);		if(!result){			var msg = "SvseDaoOnServer's forbidNodeTemporary  " + ids.stringify() +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		return SvseDaoOnServer.getReturn(true);	},	//永久禁用	'forbidNodeForever' : function(ids){		var result = SvseMethodsOnServer.svForbidNodeForever(ids);		if(!result){			var msg = "SvseDaoOnServer's forbidNodeForever  " + ids.stringify() +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		SvseDaoOnServer.syncAll();		return SvseDaoOnServer.getReturn(true);	},	"allowNode" : function(ids){		var result = SvseMethodsOnServer.svAllowNode(ids);		if(!result){			var msg = "SvseDaoOnServer's allowNode  " + ids.stringify() +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		SvseDaoOnServer.syncAll();		return SvseDaoOnServer.getReturn(true);	}}/**	批量启用设备以及组节点	参数		fid：这些节点的父节点id //无效参数，但不能删除，需保留		cids:子节点数组**/Object.defineProperty(SvseDaoOnServer,"enabledEquipments",{	value:function(fid,cids){		var result = SvseMethodsOnServer.svAllowNode(cids);		if(!result){			var msg = "SvseDaoOnServer's enabledEquipments  " + cids.stringify() +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		SvseDaoOnServer.syncAll();		return SvseDaoOnServer.getReturn(true);	}});/**	批量禁用设备以及组节点	参数		fid：这些节点的父节点id  //无效参数，但不能删除，需保留		cids:子节点数组**/Object.defineProperty(SvseDaoOnServer,"forbidEquipments",{	value:function(fid,cids,fn){		var result = SvseMethodsOnServer.svForbidNodeForever(cids);		if(!result){			var msg = "SvseDaoOnServer's forbidEquipments  " + cids.stringify() +" faild";			Log4js.error(msg);			throw new Meteor.Error(500,msg);		}		SvseDaoOnServer.syncAll();		return SvseDaoOnServer.getReturn(true);	}});