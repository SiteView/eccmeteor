//节点关系
var SvseDao = {
	//根据 节点id和子节点组名 获取该节点的子节点id
	getChildrenIdsByRootIdAndChildSubType:function(id,subtype){
		var node = Svse.findOne({sv_id:id});
		if(!node) return [];
		if(!node[subtype])return [];
		return node[subtype];
	},
	getNodesByRootId:function(rootId){
		return Svse.find({parentid:rootId}).fetch();
	},
	getTree:function(parentid){
		var branch =[];
		var root = Svse.find({parentid:parentid}).fetch();
		for(index in root){
			var node ={}
			//node["parentid"] = parentid;
			node["id"] = root[index]["sv_id"];
		//	node["label"]= SvseTree.findOne({sv_id:root[index]["sv_id"]})["sv_name"];
			node["name"]= SvseTree.findOne({sv_id:root[index]["sv_id"]})["sv_name"];
			//node["label"]=  root[index]["sv_id"];
			node["type"] = root[index]["type"];
			if(root[index]["type"] !== "entity" && root[index]["has_son"]){
				node["children"]= this.getTree(node["id"]);
			}
			if(root[index] && root[index]["type"] !== "entity"){
				node["isParent"] = true;
			}
			if(parentid === "0") node["open"] = true;
			branch.push(node);
		}
		return branch;
	},
	removeNodesById:function(id){  //根据ID删除节点 返回删除的节点数
		//同时删除SvseTree和Svse中的数据而且删除其子节点。 //先删除服务器中的节点再删本地数据库中的节点
		Meteor.call("svDelChildren",id,function (err,result){
			if(err){
				SystemLogger(err);
				return;
			}
			Meteor.call("removeNodesById",id,function (err){
				if(err)return;			
			});	
		});	
	},
	addNode:function(group,parentid,fn){
		fn = Utils.checkReCallFunction(fn);
		//服务器端插入组
		Meteor.call("svSubmitGroup",group,parentid,function (err,result){
			if(err){
				fn(err);//回调函数
				return;
			}
			//客户端数据库插入数据
			//Svse Collention
			SystemLogger("sv返回到客户端的result:");
			SystemLogger(result);
			var selfId = result["return"]["id"];
			var selfProperty = result["property"];
			//1. 插入节点到SvseTree	
			Meteor.call("getNodeByParentIdAndId",parentid,selfId,function (err,result){
				if(err){
					fn(err);//回调函数
					return;
				}
				SvseTree.insert(result,function(err,_id){
					if(err){
						SystemLogger("插入到SvseTree失败，错误是：");
						fn(err);//回调函数
						return;
					}
					SystemLogger("插入到SvseTree成功，_id为"+_id);
					SystemLogger("FindOne结果是：");
					SystemLogger(SvseTree.findOne(_id));
					//2插入本身到Svse
					var node ={
						"parentid" : parentid,
						"sv_id" : selfId,
						"property" : selfProperty,
						"type" : result.type
					};
					Svse.insert(node, function (err1, r_id) {
						if (err1) {
							SystemLogger("插入子节点" +selfId + "失败");
							fn(err1);//回调函数
							return;
						}
						
						SystemLogger("插入自身到Svse成功，_id为"+r_id);
						SystemLogger("FindOne结果是：");
						SystemLogger(Svse.findOne(r_id));
						//3 插入到父节点（更新父节点）
						var parentNode = Svse.findOne({sv_id:parentid});
						SystemLogger("找到的父节点是");
						SystemLogger(parentNode);
						Svse.update(parentNode._id,{$set:{has_son:true},$push:{subgroup:selfId}},function(err2){
							if(err2){
								SystemLogger("更新父节点失败，错误是：");
								fn(err2);//回调函数
								return;
							}
							SystemLogger("更新父节点成功，_id为"+parentNode._id);
							SystemLogger("FindOne结果是：");
							SystemLogger(Svse.findOne(parentNode._id));
							fn();
						});
					});
				});
			});	
		});	
	},
	
	editNode:function(group){
		Meteor.call("svSubmitGroup",group,undefined,function (err,result){
			if(err){
				SystemLogger(err);
				return;
			}
		//	var nodeId = result["return"]["id"];
			SystemLogger("修改以后");
			SystemLogger(result);
			var sv_id = result["return"]["id"];
			var node = SvseTree.findOne({sv_id:sv_id});
			if(!node){
				SystemLogger("SvseTree 找不到"+sv_id);
				return;
			}
			
			SvseTree.update(
				node._id,
				{$set:
					{
						sv_name:result.property.sv_name,
						sv_description:result.property.sv_description
					}
				},
				function(err){
					if(err){
						SystemLogger("SvseTree更新错误");
						SystemLogger(err);
					}
				}
			);
			
			Svse.update({sv_id:sv_id},{$set:{property:result.property}},function(err){
				if(err){
					SystemLogger("Svse更新错误");
					SystemLogger(err);
				}
			})
			
		});	
	},
	
	getGroup:function(id){
		var group = Svse.findOne({sv_id:id});
		if(!group || !group["property"])
			return {};
		return group["property"];
	},
	
	removeMonitor : function(monitorid,parentid,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call("deleteMonitor",monitorid,parentid,function (err,result){
			err ? fn(err) : fn();
		});
	},
	forbidNode : function(ids,fn){
		console.log("forbiNode ids is ");
		console.log(ids);
		fn = Utils.checkReCallFunction(fn);
		Meteor.call("svDisableForever",ids,function(err,result){
			err ? fn(err) : fn();
			console.log(result);
			Meteor.call("syncTreeData");//数据更新
		});
	},
	enableNode : function(ids,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call("svEnable",ids,function(err,result){
			err ? fn(err) : fn();
			console.log(result);
			Meteor.call("syncTreeData");//数据更新
		});
	},
	refreshTreeData : function(){
		Meteor.call("syncTreeData");//数据更新
	},
	forbidTemp : function(ids,starttime,endtime,fn){
		console.log("forbiNode ids is ");
		console.log(ids);
		fn = Utils.checkReCallFunction(fn);
		Meteor.call("svDisableTemp",ids,starttime,endtime,function(err,result){
			err ? fn(err) : fn();
			console.log(result);
			Meteor.call("syncTreeData");//数据更新
		});
	}
}