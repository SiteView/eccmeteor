//节点关系
SvseDao = {
	AGENT:"svseDaoAgent",
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
	getTreeSimple:function(){//不包含监视器 简单数据类型
		if(typeof Svse === "undefined")
			return [];
		var nodes = Svse.find().fetch();
		var branch = [];
		for(index in nodes){
			var obj = nodes[index];
			var branchNode = {};
			var treeNode = SvseTree.findOne({sv_id:obj["sv_id"]});
			if(!treeNode)
				treeNode = {sv_name:"",status:"ok"}
			branchNode["id"] = obj["sv_id"];
			branchNode["pId"] = obj["parentid"];
			branchNode["type"] = obj["type"];
			branchNode["name"] = treeNode["sv_name"];
			branchNode["isParent"] = true;
			branchNode["icon"] = "imag/status/"+obj["type"]+(treeNode["status"]?treeNode["status"]:"")+".png";
			if(branchNode["pId"] === "0"){
				branchNode["open"] = true;
				//记住这个节点
				TreeNodeRemenber.remenber(obj["sv_id"])
			}
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
		//同时删除SvseTree和Svse中的数据而且删除其子节点。
		Meteor.call(SvseDao.AGENT,'removeNodesById',[id,true],function(err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err});
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true});
				}
			}
			
		});
	},/*
	removeNodesByIds:function(ids,panrenid,fn){
		Meteor.call(SvseDao.AGENT, "removeNodesByIds", [ids,panrenid], function(err, result) {
			if (err) {
				console.log(err);
				fn({
					status: false,
					msg: err
				});
			} else {
				if (result && !reult[status]) { // 无权限
					console.log(result.msg);
					fn(result);
				} else {
					fn({
						status: true
					});
				}
			}

		});
	},*/
	addGroup:function(group,parentid,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call(SvseDao.AGENT,'addGroup',[group,parentid],function(err,result){
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
		Meteor.call(SvseDao.AGENT,"editGroup",[group,selfId],function(err,result){
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
	refreshTreeData : function(){
		Meteor.call(SvseDao.AGENT,'syncAll');
	},
	/**
		Type:fix bug
		Author:huyinghuan
		Date:2013-10-15 10:02
		Content:修改存在访问空对象属性bug
	**/
	getChildrenStatusById:function(id){
		var node = Svse.findOne({sv_id:id});
		if(!node){
			return SvseDao.testGetEntityStatus(-1);	//传入一个无效参数使返回为默认
		}
		var type = node.type;
		if(type === "entity"){
			return SvseDao.testGetEntityStatus(id);
		}
		return SvseDao.testGetGroupStatus(id);
	},
	/**
		Type:fix bug
		Author:huyinghuan
		Date:2013-10-15 10:00
		Content:修改for循环结构中存在空对象属性bug
		for(index in nodes){ ............}
	**/
	testGetGroupStatus:function(id){
		var data = {
			ok:0,
			error:0,
			warning:0,
			disable:0,
			monitor:0,
			entity:0
		}
		var nodes = Svse.find({parentid:id}).fetch();
		var submonitors ;
		var subentitys;
		for(index in nodes){
			var obj = nodes[index];
			var nodeId = obj.sv_id;
			var treeNode  = SvseTree.findOne({sv_id:nodeId});
			if(!treeNode)
				continue;
			var status = treeNode.status;
			data[status]= data[status]+1;
			if(obj["type"] == "entity"){
				submonitors =  obj["submonitor"];
				if(!submonitors)
					continue;
				data["monitor"] = data["monitor"] +submonitors.length;
				for(i in obj["submonitor"]){
					var treeMonitor = SvseTree.findOne({sv_id:obj["submonitor"][i]});
					if(!treeMonitor)
						continue;
					var ms =treeMonitor.status;
					data[ms] = data[ms] +1;
				}
			}else if(obj["type"] == "group"){
				subentitys = obj["subentity"];
				if(!subentitys)
					continue;
				data["entity"] = data["entity"]+ subentitys.length;
				var sondata = this.testGetGroupStatus(nodeId);
				for(x in data){
					data[x] = data[x] + sondata[x]
				}
			}
		}
		return data;
	},
	/**
		Type:fix bug
		Author:huyinghuan
		Date:2013-10-15 10:10
		Content:控对象判断后增加一个返回值
		if(!node)  return data
	**/
	testGetEntityStatus:function(id){
		var data = {
			ok:0,
			error:0,
			warning:0,
			disable:0,
			monitor:0
		}
		var node = Svse.findOne({sv_id:id});
		if(!node || !node["submonitor"])
			return data
		var sub = node["submonitor"];
		data["monitor"] = sub.length;
		for(i in sub){
			var ms = SvseTree.findOne({sv_id:sub[i]}).status;
			data[ms] = data[ms] +1;
		}
		return data;
	}

}

/**
	批量启用设备以及组节点
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"enabledEquipments",{
	value:function(fid,cids,fn){
		Meteor.call(SvseDao.AGENT,'enabledEquipments',[fid,cids],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});

/**
	批量永久禁用设备以及组节点
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"forbidEquipments",{
	value:function(fid,cids,fn){
		Meteor.call(SvseDao.AGENT,'forbidEquipments',[fid,cids],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});

/**
	批量临时禁用设备以及组节点
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		starttime:开始时间
		endtime:结束时间
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"forbidEquipmentsTemporary",{
	value:function(fid,cids,starttime,endtime,fn){
		Meteor.call(SvseDao.AGENT,'forbidEquipmentsTemporary',[fid,cids,starttime,endtime],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});

/**
	批量启用监视器
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"enabledMonitors",{
	value:function(fid,cids,fn){
		Meteor.call(SvseDao.AGENT,'enabledMonitors',[fid,cids],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});

/**
	批量永久禁用监视器
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"forbidMonitors",{
	value:function(fid,cids,fn){
		Meteor.call(SvseDao.AGENT,'forbidMonitors',[fid,cids],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});

/**
	批量永久禁用监视器
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		starttime:开始时间
		endtime:结束时间
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
**/
Object.defineProperty(SvseDao,"forbidMonitorsTemporary",{
	value:function(fid,cids,starttime,endtime,fn){
		Meteor.call(SvseDao.AGENT,'forbidMonitorsTemporary',[fid,cids,starttime,endtime],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true})
			}
		});
	}
});
/*
	删除单个设备或组
	参数
		fid：节点id
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
*/
Object.defineProperty(SvseDao,"deletEquipment",{
	value:function(id){
		Meteor.call(SvseDao.AGENT,'deletEquipment',[id],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true});
			}
		});
	}
});
/*
	批量删除设备或组
	参数
		fid：这些节点的父节点id
		cids:子节点数组
		fn:回调函数 接收一个结果对象,{status:true|false,msg:"当status为false时，存在该属性",result:{}}
*/
Object.defineProperty(SvseDao,"deletEquipmentsMul",{
	value:function(fid,cids,fn){
		Meteor.call(SvseDao.AGENT,'deletEquipmentsMul',[fid,cids],function(err,result){
			if(err){
				Log4js.error(err);
				fn({status:false,msg:err})
			}else{
				fn({status:true});
			}
		});
	}
})