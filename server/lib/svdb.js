var meteorSvUniv = function(dowhat){
	var robj = process.sv_univ(dowhat, 0);	
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	return fmap;
}
var meteorSvForest = function(dowhat){
    var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	return fmap;
}

var svForest = function(dowhat){
    var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		SystemLogger(robj.estr(0));
		return false;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//获取监视器一段时间内的状态记录
var getQueryRecords = function(id,count){
	var dowhat ={'dowhat':'QueryRecordsByCount','id':id,'count':count};
	var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	var runtiomeRecords = [];
	for(r in fmap){
		runtiomeRecords.push(fmap[r]);
	}
	return runtiomeRecords;
}
//获取监视器模板
var GetMonitorTemplet = function(id){
	var dowhat ={'dowhat':'GetMonitorTemplet',id:id};
	var robj= process.sv_univ(dowhat, 0);
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//添加，修改组
var svSubmitGroup = function(group,parentid){
	if(parentid){
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup','parentid':parentid},0); //增加
	}else{
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup'},0); //修改
	}	
	if(!robj.isok(0)){
		SystemLogger("Errors:svSubmitGroup 52  "+robj);//传入给sv的参数不对等低级错误时，直接返回错误字符串
		throw new Meteor.Error(500,robj);
	}
	var fmap= robj.fmap(0);
	//SystemLogger(fmap);
	return fmap;
}
//节点删除
var svDelChildren = function(id){  //删除该节点以及其子节点
	var robj = process.sv_univ({'dowhat':'DelChildren','parentid':id}, 0);
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap= robj.fmap(0);
	return fmap;
}

//获取设备模板集
var GetAllEntityGroups = function(){
	var dowhat ={'dowhat':'GetAllEntityGroups'};
	var robj= process.sv_univ(dowhat, 0);
	if(!robj.isok(0)){
		SystemLogger("Errors: svdb's GetAllEntityGroups wrong!")
		SystemLogger(robj.estr(0));
		return false;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

var GetEntityTemplet = function(id){
	var dowhat ={'dowhat':'GetEntityTemplet',id:id};
	var robj= process.sv_univ(dowhat, 0);
	if(!robj.isok(0)){
		SystemLogger("Errors: svdb's GetEntityTemplet wrong!")
		SystemLogger(robj.estr(0));
		return false;
	}
	var fmap = robj.fmap(0);
	return fmap;
}
//添加编辑设备
var svSubmitEntity = function(entity,parentid){
	if(parentid){
		var robj= process.sv_submit(entity,{'dowhat':'SubmitEntity','parentid':parentid},0); //增加
	}else{
		var robj= process.sv_submit(entity,{'dowhat':'SubmitEntity'},0); //修改
	}	
	if(!robj.isok(0)){
		console.log("Errors: \n"+robj.estr(0));
		throw new Meteor.Error(500,robj);
	}
	var fmap= robj.fmap(0);
	return fmap;
}
//获取设备详细信息
var svGetEntity =  function(id){
		var dowhat ={'dowhat':'GetEntity','id':id,'sv_depends':true};
		var robj= process.sv_univ(dowhat, 0);
		if(!robj.isok(0)){
			console.log("Errors: \n"+robj.estr(0));
			return false;
		}
		var fmap = robj.fmap(0);
		return fmap;
}
