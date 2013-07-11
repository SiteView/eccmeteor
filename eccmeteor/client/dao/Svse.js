//节点关系
SvseDao = {
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
	getTree:function(parentid){ //不包含监视器 复杂数据类型
		var branch =[];
		var root = Svse.find({parentid:parentid}).fetch();
		for(index in root){
			var node ={}
			node["id"] = root[index]["sv_id"];
			node["name"]= SvseTree.findOne({sv_id:root[index]["sv_id"]})["sv_name"];
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
	getTreeSimple:function(){//不包含监视器 简单数据类型
		var nodes = Svse.find().fetch();
		var branch = [];
		for(index in nodes){
			var obj = nodes[index];
			var branchNode = {};
			branchNode["id"] = obj["sv_id"];
			branchNode["pId"] = obj["parentid"];
			branchNode["type"] = obj["type"];
			branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]})["sv_name"];
			branchNode["isParent"] = true;
			if(branchNode["pId"] === "0") branchNode["open"] = true;
			if(obj["type"] === "entity"){
				branchNode["isParent"] = false;
			}
			branch.push(branchNode);
		}
		return branch;
	},
	
	getDetailTree:function(){ //包含监视器	
		var nodes = Svse.find().fetch();
		var branch = [];
		for(index in nodes){
			var obj = nodes[index];
			var branchNode = {};
			branchNode["id"] = obj["sv_id"];
			branchNode["pId"] = obj["parentid"];
			branchNode["type"] = obj["type"];
			branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]})["sv_name"];
			branchNode["isParent"] = true;
			if(branchNode["pId"] === "0") branchNode["open"] = true;
			if(obj["type"] === "entity" && obj["submonitor"] && obj["submonitor"].length){
				
				var submonitor = obj["submonitor"];
				for(subindex in submonitor){
					var subobj = {};
					subobj["id"] = submonitor[subindex];
					subobj["pId"] = obj["sv_id"];
					subobj["type"] = "monitor";
					subobj["name"] = SvseTree.findOne({sv_id:submonitor[subindex]})["sv_name"];
					branch.push(subobj);
				}
			}
			branch.push(branchNode);
		}
		return branch;
		
	},	
	removeNodesById:function(id,fn){  //根据ID删除节点 返回删除的节点数
		//同时删除SvseTree和Svse中的数据而且删除其子节点。 //先删除服务器中的节点再删本地数据库中的节点
		Meteor.call('svseDaoAgent','removeNodesById',[id,true],function(err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true})
				}
			}
			
		});
	},
	addGroup:function(group,parentid,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call('svseDaoAgent','addGroup',[group,parentid],function(err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		})
	},
	
	editGroup:function(group,selfId,fn){
		/*
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
		*/
		Meteor.call('svseDaoAgent',"editGroup",[group,selfId],function(err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true})
				}
			}
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