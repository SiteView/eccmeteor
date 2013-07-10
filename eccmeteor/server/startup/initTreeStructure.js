//更新树结构 和 监视器 信息//更新更加详细的monitor信息  需要在SVSE数据库更新后才能调用initTreeDataMonitor = function(debug){	if(debug === -1)return;	//SvseTree.find()	var entities = Svse.find({"type":"entity"},{fields:{sv_id:1,submonitor:1}}).fetch();	for(x in entities){		var submonitor = entities[x]["submonitor"];		if(!submonitor  || !submonitor.length)		{			SystemLogger("设备无监视器："+entities[x]["sv_id"]);			continue;		}		var sv_id = entities[x]["sv_id"];		var result = SvseMethodsOnServer.svGetDefaultTreeData(sv_id,false);		if(!result){			SystemLogger("失败时，监视器的父节点："+sv_id);			SystemLogger.log("initTreeDataMonitor svGetDefaultTreeData exists errors",-1);			return;		}		for(y in result){			SvseTree.insert(result[y],function(err,r_id){				if(err)					SystemLogger(err);			});		}	}}//寻找树的子节点 svse的操作/*initSvseTreeNodeAtStartUp = function(id,parentid,type){	if (type === "group") {		what = 'GetGroup';	} else if (type == "entity") {		what = 'GetEntity';	} else if (type == "se") {		what = 'GetSVSE';	}	var dowhat = {		'dowhat' : what,		'id' : id	};	Meteor.call("meteorSvUniv",dowhat,function(err,result){		if(err){			SystemLogger(err);			return;		}		var obj = {};		obj["parentid"] = parentid;		obj["sv_id"] = id;		obj["type"] = type;		if (result['subentity'] || result['subgroup']) {			obj["has_son"] = true;		}		if (type !== "entity") {			var entities = result['subentity'];			var subentity = [];			for (entity in entities) {				subentity.push(entity);				initSvseTreeNodeAtStartUp(entity, id, "entity");			}			var groups = result['subgroup'];			var subgroup = [];			for (group in groups) {				subgroup.push(group);				initSvseTreeNodeAtStartUp(group, id, "group");			}			obj["subentity"] = subentity;			obj["subgroup"] = subgroup;			if(type === "group")				obj["property"] = result["property"]		}else{			var moitors = result['submonitor'];			var submonitor = [];			for (moitor in moitors) {				submonitor.push(moitor);			}			obj["submonitor"] = submonitor;		}		var count = Svse.find({				sv_id : id			}).count();		if (count !== 0) {			//SystemLogger("更新数据id:" + id + " : " + JSON.stringify(obj));			Svse.update({				sv_id : id			}, obj, function (err, r_id) {				if (err) {					SystemLogger("更新子节点" + id + "失败");				}			});		} else {			//SystemLogger("插入子节点:" + id);			Svse.insert(obj, function (err, r_id) {				if (err) {					SystemLogger("插入子节点" + id + "失败");				}			});		}	});}*/initSvseTreeNodeAtStartUp = function(id,parentid,type){	var result = SvseMethodsOnServer.svGetTreeDataChildrenNodes(id,type);	if(!result){		SystemLogger.log("initSvseTreeNodeAtStartUp failed， svGetTreeDataChildrenNodes exists errors",-1);		return;	}	var obj = {		"parentid"	: parentid,		"sv_id"		: id,		"type"		: type	};	if (result['subentity'] || result['subgroup']) {		obj["has_son"] = true;	}	if (type !== "entity") {		var entities = result['subentity'];		var subentity = [];		for (entity in entities) {			subentity.push(entity);			initSvseTreeNodeAtStartUp(entity, id, "entity");		}		var groups = result['subgroup'];		var subgroup = [];		for (group in groups) {			subgroup.push(group);			initSvseTreeNodeAtStartUp(group, id, "group");		}		obj["subentity"] = subentity;		obj["subgroup"] = subgroup;		if(type === "group")			obj["property"] = result["property"]	}else{		var moitors = result['submonitor'];		var submonitor = [];		for (moitor in moitors) {			submonitor.push(moitor);		}		obj["submonitor"] = submonitor;	}		Svse.insert(obj, function (err, r_id) {		if (err) 			SystemLogger("插入子节点" + id + "失败");	}	}//初始化树结构 svse的操作/*initSvseTreeStructureAtStartUp = function(debug){	SystemLogger("初始化数据结构开始...");	if(debug === -1)return;	if(debug === 0){		Svse.remove({});		SystemLogger("Svse date is clear");	}	var dowhat = {		'dowhat' : 'GetTreeData',		'parentid' : 'default'	}		Meteor.call("meteorSvForest", dowhat, function (err, result) {		if(err){			SystemLogger(err);			return;		}		for(son in result){				var parentid = "0";			var sv_id = result[son]["sv_id"];			var type = result[son]["type"];			initSvseTreeNodeAtStartUp(sv_id,parentid,type);		}	});	SystemLogger("初始化数据结构完成!");		SystemLogger("初始化监视器节点信息开始")	initTreeDataMonitor(debug);	SystemLogger("初始化监视器节点信息完成")}*/initSvseTreeStructureAtStartUp = function(debug){	SystemLogger("初始化数据结构开始...");	if(debug === -1)return;	if(debug === 0){		Svse.remove({});		SystemLogger("Svse date is clear");	}	var result = SvseMethodsOnServer.svGetDefaultTreeData('default',true);	if(!result){		SystemLogger.log("initSvseTreeStructureAtStartUp failed， svGetDefaultTreeData exists errors",-1);		return;	}	for(son in result){			var parentid = "0";		var sv_id = result[son]["sv_id"];		var type = result[son]["type"];		initSvseTreeNodeAtStartUp(sv_id,parentid,type);	}	SystemLogger("初始化数据结构完成!");		SystemLogger("初始化监视器节点信息开始")	initTreeDataMonitor(debug);	SystemLogger("初始化监视器节点信息完成")}