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
		SystemLogger(robj.estr(0),0);
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
		SystemLogger(robj.estr(0),0);//传入给sv的参数不对等低级错误时，直接返回错误字符串
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
		SystemLogger(robj.estr(0),0);
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
		SystemLogger(robj.estr(0),0);
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
		SystemLogger(robj.estr(0),0);
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
			SystemLogger(robj.estr(0),0);
			return false;
		}
		var fmap = robj.fmap(0);
		return fmap;
}

//获取计划任务
var svGetAllTask = function(){
	var dowhat ={'dowhat':'GetAllTask'};
	var robj= process.sv_univ(dowhat, 0);
	//var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		SystemLogger(robj.estr(0),0);
		return false;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//添加编辑监视器
var svSubmitMonitor = function(monitor,parentid){
	if(parentid){
		var robj= process.sv_submit(monitor,{'dowhat':'SubmitMonitor','parentid':parentid,autoCreateTable:true},0); //修改
	}else{
		var robj= process.sv_submit(monitor,{'dowhat':'SubmitMonitor'},0); //修改
	}
	if(!robj.isok(0)){
		SystemLogger(robj.estr(0),0);
		return false;
	}
	var fmap= robj.fmap(0);
	return fmap;
}

//刷新监视器
var svRefreshMonitors = function (id,pid,instantReturn){
	if(!instantReturn){
		instantReturn = false;	
	}
	SystemLogger("=============instantReturn is " + instantReturn)
	var dowhat ={'dowhat':'RefreshMonitors',id:id,parentid:pid,instantReturn:instantReturn};
	var robj= process.sv_univ(dowhat, 0);
	//var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		console.log("Errors: \n"+robj.estr(0));
		return;
	}
	var fmap = robj.fmap(0);
	return fmap;
}
//获取刷新监视器结果
function svGetRefreshed(queueName,pid){
	var dowhat ={'dowhat':'GetRefreshed',queueName:queueName,parentid:pid};
	var robj= process.sv_univ(dowhat, 0);
	//var robj = process.sv_forest(dowhat, 0);
	var fmap = robj.fmap(0);
	SystemLogger("获取svGetRefreshed");
	SystemLogger(fmap);
	return fmap;
}

//获取监视器
function svGetMonitor(id){
	var dowhat ={'dowhat':'GetMonitor','id':id};
	var robj= process.sv_univ(dowhat, 0);
	//var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		SystemLogger(robj.estr(0),-1);
		return false;
	}
	var fmap = robj.fmap(0);
	return fmap;
}