SvseDaoOnServer = {	"getReturn":function(status,msg){ //组装返回客户端的信息		status = !!status ;		if(typeof msg === "undefined" && !status)			msg = "Permission isn't enoungh";		return {status:status,msg:msg};	},	"removeNodesById" : function(id,flag){//删除节点及其子节点		//第一步 删除服务器中的节点，		//第二步 成功后删除本地数据库的节点			if(flag){ //后台只需删除一次即可			var result = SvseMethodsOnServer.svDelChildren(id);			if(!result){				var msg = "SvseDaoOnServer's removeNodesById  delete " + id +" faild";				SystemLogger.log(msg,-1);				throw new Meteor.Error(500,msg);			}		}		var node = Svse.findOne({sv_id:id});		SystemLogger("删除id: "+id);		Svse.remove({sv_id:id});		SvseTree.remove({sv_id:id});		//如果没有子节点		if(!node||!node["has_son"])return;		//存在子节点		if(node["type"] === "entity"){ //如果是设备 直接移除子节点监视器			SvseEntityInfo.remove({"return.id":id}); //从设备信息里面移除设备			var childrenId = node["submonitor"];			if(!childrenId)return;			SvseTree.remove({sv_id:{$in:childrenId}});			return;		}		var ids = [];		if(node["subentity"]) ids = node["subentity"];		if(node["subgroup"])  ids = ids.concat(node["subgroup"]);		for(index in ids){			SvseDaoOnServer.removeNodesById(ids[index],false);		}	},	"addGroup":function(group,parentid){		var result = SvseMethodsOnServer.svSubmitGroup(group,parentid);		if(!result){			var msg = "SvseDaoOnServer's svSubmitGroup  addGroup " + parentid +" faild";			SystemLogger.log(msg,-1);			throw new Meteor.Error(500,msg);		}		var selfId = result["return"]["id"];		var selfProperty = result["property"];		var childrenNode = SvseMethodsOnServer.svGetNodeByParentidAndSelfId(parentid,selfId);		SvseTree.insert(childrenNode,function(err){			if(err){			//	SystemLogger("插入到SvseTree失败，错误是：");				return;			}			//2插入本身到Svse			var node ={				"parentid" : parentid,				"sv_id" : selfId,				"property" : selfProperty,				"type" : childrenNode.type			};			Svse.insert(node, function (err1) {				if(err1){					return;				}				//3 插入到父节点（更新父节点）				var parentNode = Svse.findOne({sv_id:parentid});				Svse.update(parentNode._id,{$set:{has_son:true},$push:{subgroup:selfId}},function(err2){					if(err2){						SystemLogger("更新父节点失败，错误是：");						return;					}				});			});		});	},	"editGroup":function(group,selfId){		var result = SvseMethodsOnServer.svSubmitGroup(group);		if(!result){			var msg = "SvseDaoOnServer's svSubmitGroup  editGroup " + selfId +" faild";			SystemLogger.log(msg,-1);			throw new Meteor.Error(500,msg);		}		var sv_id = result["return"]["id"];		var node = SvseTree.findOne({sv_id:sv_id});		if(!node){			SystemLogger("SvseDaoOnServer editGroup SvseTree.findOne " +sv_id+ "don't exists");			return;		}		SvseTree.update(			node._id,			{$set:				{					sv_name:result.property.sv_name,					sv_description:result.property.sv_description				}			},			function(err){				if(err){					SystemLogger("SvseDaoOnServer editGroup SvseTree.update exists erorrs: ",-1);					SystemLogger(err,-1);				}			}		);					Svse.update({sv_id:sv_id},{$set:{property:result.property}},function(err){			if(err){				SystemLogger("SvseDaoOnServer editGroup Svse.update exists erorrs: ",-1);				SystemLogger(err,-1);			}		})	}}