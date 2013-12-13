/**
 Type:add
 Author:huyinghuan
 Date: 2013-11-27 10:47
 Content :添加检查错误的机制 在服务端调用SvAPI时
*/
var checkErrorOnServer = function(robj){
	if(typeof robj === "string"){
		throw new Error("传入参数错误，请在相关日志中搜索具体信息");
		return robj;
	}
	if(!robj.isok(0) &&robj.estr(0) !== ""){
		throw new Error("传入参数错误，请在相关日志中搜索具体信息");
		return robj.estr(0);
	}
	return false;
}
meteorSvUniv = function(dowhat){
	var robj = process.sv_univ(dowhat, 0);	
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	return fmap;
}
meteorSvForest = function(dowhat){
    var robj = process.sv_forest(dowhat, 0);
	if(!robj.isok(0)){
		throw new Meteor.Error(500,robj.estr(0));
	}
	var fmap = robj.fmap(0);
	return fmap;
}

svForest = function(dowhat){
    var robj = process.sv_forest(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

svGetAllMonitorTempletInfo = function(){
	var dowhat ={'dowhat':'GetAllMonitorTempletInfo'};
	var robj = process.sv_univ(dowhat, 0);	
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

svGetTreeData = function(parentid){
	if(typeof parentid === "undefined")
		parentid = "default";
	var dowhat = {
		'dowhat' : 'GetTreeData',
		'parentid' : parentid,
		'onlySon':false
	}
	var robj = process.sv_forest(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
	
}

svGetTreeDataChildrenNodes = function(id,type){
	if (type === "group") {
		what = 'GetGroup';
	} else if (type == "entity") {
		what = 'GetEntity';
	} else if (type == "se") {
		what = 'GetSVSE';
	}
	var dowhat = {
		'dowhat' : what,
		'id' : id
	};
	var robj = process.sv_univ(dowhat, 0);	
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}
//=====================注意！！！！==============//
//===========以上为0.6.4修改添加方法==============//

svGetDefaultTreeData = function(parentid,onlySon){
	if(typeof onlySon === "undefined") onlySon = true;
	var dowhat = {
		'dowhat' : 'GetTreeData',
		'parentid' : parentid,
		'onlySon'  : onlySon
	}
	var robj = process.sv_forest(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}

svGetSVSE = function (id){
	var dowhat = {
		'dowhat' : 'GetSVSE',
		'id':id
	}
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}

svGetGroup = function (id){
	var dowhat = {
		'dowhat' : 'GetGroup',
		'id':id
	}
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}
svGetEntity = function (id){
	var dowhat = {
		'dowhat' : 'GetEntity',
		'id':id
	}
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}
//获取监视器一段时间内的状态记录
svGetMonitorRuntimeRecords = function(id,count){
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

//通过时间段获取记录数据
svGetMonitorRuntimeRecordsByTime = function(id,beginDate,endDate){
	var robj = process.sv_forest({
		'dowhat':'QueryRecordsByTime',
		id:id, 
		begin_year:beginDate["year"], begin_month:beginDate["month"], begin_day: beginDate["day"],  begin_hour: beginDate["hour"],  begin_minute:beginDate["minute"],  begin_second:beginDate["second"],  
		end_year: endDate["year"],  end_month:endDate["month"],  end_day: endDate["day"],  end_hour:endDate["hour"],  end_minute:endDate["minute"],  end_second: endDate["second"]
	}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		throw new Meteor.Error(500,flag);
	}
	var fmap = robj.fmap(0);
	var runtiomeRecords = [];
	for(r in fmap){
		runtiomeRecords.push(fmap[r]);
	}
	return runtiomeRecords;
}
/**
 Type:add
 Author:huyinghuan
 Date: 2013-12-10 11:53
 Content :获取报表数据
*/
svGetReportData = function(monitorId,beginDate,endDate){
	/*
	{
		id:id,//id 可以是逗号分隔的多个id
		compress:compress,//默认压缩数据（即若不填则为true ；另：<400个数据不压缩，>=400压缩到200；不压缩数据的个数极限为50000)
		dstrNeed:dstrNeed, //true/false 默认不给dstr（即若不填则为 false)
		byCount:byCount,//(如果有值则按个数查询，而不是按时间)
		dstrStatusNoNeed:null, //null,ok,warning,error,disable,bad (不需要的dstr状态，如dstrStatusNoNeed=ok 则ok的dstr不传，其他的都传回) 
		return_value_filter:"return_value_filter", //= XXX,XXX 返回值过滤，如该值为 sv_primary,sv_drawimage ，则只回传 sv_primary=1 且 sv_drawimage=1 的返回值
		begin_year:XXX,begin_month:XXX, begin_day= XXX,begin_hour= XXX,begin_second= XXX, 
		end_year= XXX,end_month= XXX,end_day= XXX,end_hour= XXX,end_minute= XXX, end_second= XXX,
	}
	mid=1.26.27.3&st=20131207102000&et=20131208102000
	
	monitorId = "1.26.27.3";
	beginDate = {
		year:"2013",
		month:"12",
		day:"01",
		hour:"10",
		minute:"20",
		second:"00"
	}
	endDate = {
		year:"2013",
		month:"12",
		day:"08",
		hour:"10",
		minute:"20",
		second:"00"
	}*/
	var robj = process.sv_univ({
		'dowhat':'QueryReportData',
		id:monitorId,
	//	dstrNeed:true,
		dstrStatusNoNeed:null,
	//	return_value_filter:"sv_primary,sv_drawimage",
		begin_year:beginDate["year"], begin_month:beginDate["month"], begin_day: beginDate["day"],  begin_hour: beginDate["hour"],  begin_minute:beginDate["minute"],  begin_second:beginDate["second"],  
		end_year: endDate["year"],  end_month:endDate["month"],  end_day: endDate["day"],  end_hour:endDate["hour"],  end_minute:endDate["minute"],  end_second: endDate["second"]
	}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
};

//状态统计的数据 （之获取主键和可画图的数据）
svGetReportDataByFilter = function(monitorId,beginDate,endDate,filter){
	var robj = process.sv_univ({
		'dowhat':'QueryReportData',
		id:monitorId,
		dstrStatusNoNeed:null,
		dstrNeed:true,
		return_value_filter:filter,
		begin_year:beginDate["year"], begin_month:beginDate["month"], begin_day: beginDate["day"],  begin_hour: beginDate["hour"],  begin_minute:beginDate["minute"],  begin_second:beginDate["second"],  
		end_year: endDate["year"],  end_month:endDate["month"],  end_day: endDate["day"],  end_hour:endDate["hour"],  end_minute:endDate["minute"],  end_second: endDate["second"]
	}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
};

//获取监视器模板
svGetMonitorTemplet = function(id){
	var dowhat ={'dowhat':'GetMonitorTemplet',id:id};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//获取设备模板集
GetAllEntityGroups = function(){
	var dowhat ={'dowhat':'GetAllEntityGroups'};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

GetEntityTemplet = function(id){
	var dowhat ={'dowhat':'GetEntityTemplet',id:id};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//获取设备详细信息
svGetEntity =  function(id){
	var dowhat ={'dowhat':'GetEntity','id':id,'sv_depends':true};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

//获取计划任务
svGetAllTask = function(){
	var dowhat ={'dowhat':'GetAllTask'};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}



//刷新监视器
svRefreshMonitors = function (id,pid,instantReturn){
	if(!instantReturn){
		instantReturn = false;	
	}
	Log4js.info("=============instantReturn is " + instantReturn)
	var dowhat ={'dowhat':'RefreshMonitors',id:id,parentid:pid,instantReturn:instantReturn};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}
//获取刷新监视器结果
svGetRefreshed = function (queueName,pid){
	var dowhat ={'dowhat':'GetRefreshed',queueName:queueName,parentid:pid};
	var robj= process.sv_univ(dowhat, 0);
	//var robj = process.sv_forest(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	Log4js.info("获取svGetRefreshed");
	Log4js.info(fmap);
	return fmap;
}




//获取设备动态属性数据

svGetEntityDynamicPropertyData = function(entityId,monitorTplId){
	var robj = process.sv_univ({'dowhat':'GetDynamicData','entityId':entityId,'monitorTplId':monitorTplId}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;	
}

//获取邮件列表
svGetEmailList = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"emailAdress.ini",
		"user":"default","sections":"default"}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;
}

//获取统计报告列表
/*
Type：   add 
Author：xuqiagn
Date:2013-10-18 09:40
Content:增加svGetStatisticalList的操作，获取统计报告列表
*/ 
svGetStatisticalList = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"reportset.ini",
		"user":"default","sections":"default"}, 0);
	if(!robj.isok(0)){
	}
	var fmap= robj.fmap(0);
	return fmap;
}
/*
Type：   add 
Author：xuqiang
Date:2013-11-28 09:40
Content:增加svGetTrendList的操作，获取趋势报告列表
*/ 
svGetTrendList = function(id,type){
	var dowhat ={'dowhat':'QueryInfo',needkey:id,needtype:type};
	var robj = process.sv_univ(dowhat,0);	
	if(!robj.isok(0)){
		console.log("Errors: \n"+robj.estr(0));
		return;
	}
	var fmap = robj.fmap(0);
	return fmap;
}
//获取发送邮件的设置
svGetSendEmailSetting = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"email.ini",
		"user":"default","sections":"default"}, 0);
	if(!robj.isok(0)){
		return;
	}
	var fmap= robj.fmap(0);
	if(!fmap || !fmap["email_config"]) return ;
	fmap["email_config"]["password"] = svDecryptOne(fmap["email_config"]["password"]);
	return fmap["email_config"];
}


//解密
svDecryptOne =  function (password){
	var dowhat = {
		'dowhat':'decrypt'
	}
	dowhat[password]="";
	var robj = process.sv_univ(dowhat,0);
	var fmap= robj.fmap(0);
//	console.log(fmap)
	return fmap.return[password];
}

//加密
svEncryptOne = function(password){
	var dowhat = {
		'dowhat':'encrypt'
	}
	dowhat[password]="";
	var robj = process.sv_univ(dowhat,0);
	var fmap= robj.fmap(0);
//	console.log(fmap)
	return fmap.return[password];
}

//获取发送邮件模板
svGetEmailTemplates = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"TXTtemplate.ini",
			"user":"default","sections":"Email"}, 0);
	var fmap= robj.fmap(0);
	return fmap["Email"];
}

//获取报警规则列表
svGetWarnerRule = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"alert.ini",
			"user":"default","sections":"default"}, 0);
	return robj.fmap(0);;
}
//获取TopN报告列表(2013/10/16)
/*
Type：   add 
Author：renjie
Date:2013-10-18 13:40
Content:增加svGetTopNList的操作，获取统计报告列表
*/ 
svGetTopNList = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"topnreportset.ini",
			"user":"default","sections":"default"}, 0);
	if(!robj.isok(0)){
		}
		var fmap= robj.fmap(0);
		return fmap;
}
//邮件测试
svEmailTest = function(emailSetting){
	emailSetting["dowhat"]="EmailTest";
	 process.sv_univ(emailSetting,0);
}

/* ==========================Svse 使用部分 ============================ */

//节点删除
svDelChildren = function(id){  //删除该节点以及其子节点
	var robj = process.sv_univ({'dowhat':'DelChildren','parentid':id}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	Log4js.error(robj.fmap(0));
	return true;
}

//添加，修改组
/*
svSubmitGroup = function(group,parentid){
	if(parentid){
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup','parentid':parentid},0); //增加
	}else{
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup'},0); //修改
	}	
	if(!robj.isok(0)){
		Log4js.error(robj.estr(0),0);//传入给sv的参数不对等低级错误时，直接返回错误字符串
		throw new Meteor.Error(500,robj);
	}
	var fmap= robj.fmap(0);
	//Log4js.error(fmap);
	return fmap;
}*/
svSubmitGroup = function(group,parentid){
	if(parentid){
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup','parentid':parentid},0); //增加
	}else{
		var robj= process.sv_submit(group,{'dowhat':'SubmitGroup'},0); //修改
	}	
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	//Log4js.error(fmap);
	return fmap;
}

svGetNodeByParentidAndSelfId = function(parentid,selfId){
	var dowhat = {
		'dowhat' : 'GetTreeData',
		'parentid' : parentid,
		'onlySon'  : true
	}
	var robj = process.sv_forest(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	var node = {};
	for(index in fmap){
		if(fmap[index]["sv_id"] === selfId){
			node = fmap[index];
			break;
		}	
	}
	return node;
}

//临时禁用
svForbidNodeTemporary = function(ids,starttime,endtime){
	if(!ids || !ids.length) return true;
	var dowhat = {'dowhat':'DisableTemp'};
	for(index in ids){
		dowhat[ids[index]] = "";
	}
	dowhat['sv_starttime'] = starttime;
	dowhat['sv_endtime'] = endtime;
	
	Log4js.info("执行临时禁止：");
	Log4js.info(dowhat);
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;
}

//永久禁用
svForbidNodeForever = function (ids){
	console.log("svDisableForever  ids is ");
	console.log(ids);
	if(!ids || !ids.length) return true;
	console.log("执行 svDisableForever");
	var dowhat = {'dowhat':'DisableForever'};
	for(index in ids){
		dowhat[ids[index]] = "";
	}
	Log4js.info("执行禁止：");
	Log4js.info(dowhat);
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;	
}

//启用
svAllowNode = function (ids) {
	console.log("svEnable  ids is ");
	console.log(ids);
	if(!ids || !ids.length ) return true;
	console.log("执行 svEnable");
	var dowhat = {'dowhat':'Enable'} 
	for(index in ids){
		dowhat[ids[index]] = "";
	}
	Log4js.info("执行启用：");
	Log4js.info(dowhat);
	var robj = process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	console.log(fmap);
	return fmap;
}
/* ==========================SvseMonitor 使用部分 ============================ */

//删除监视器
svDeleteMonitor = function (id){
	var robj = process.sv_univ({'dowhat':'DelChildren','parentid':id}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap; 
}

/* ==========================SvseEmail 使用部分 ============================ */

//emailAdress.ini写入
svWriteEmailAddressIniFileSectionString = function(addressname,address){
	var robj= process.sv_submit(address,{'dowhat':'WriteIniFileSection','filename':"emailAdress.ini",'user':"default",'section':addressname},0); 
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}

//统计报告 Statistical.ini写入
/*
Type：add
Author：xuqiang	
Date:2013-10-18 09:40
Content:统计报告 Statistical.ini写入
*/ 
svWriteStatisticalIniFileSectionString =  function(addressname,address){
	var robj = process.sv_submit(address,{'dowhat': 'WriteIniFileSection','filename':"reportset.ini",'user':"default",'section':addressname},0);
	if(!robj.isok(0)){
	Log4js.error(robj.estr(0),-1);
	return false;
	}
	return robj.fmap(0);
}
//email.ini写入
svWriteEmailIniFileSectionString = function(section){
	console.log(section);
	section["password"] = svEncryptOne(section["password"]);
	var ini = {"email_config":section};
	var robj= process.sv_submit(ini,{'dowhat':'WriteIniFileSection','filename':"email.ini",'user':"default",'section':"email_config"},0); 
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	Log4js.error(robj.fmap(0));
	return robj.fmap(0);
}

//删除emailAddress.ini的section
svDeleteEmailAddressIniFileSection = function(ids){
	var dowhat = {
		'dowhat' : 'DeleteIniFileSection',
		'filename' : "emailAdress.ini",
		'user' : "default",
		"sections" : ids
	};
	var robj = process.sv_univ(dowhat,0);
	return robj.fmap(0);
}


/*
Type：add 
Author：xuqiang
Date:2013-10-18 15:00
Content:删除reportset.ini的section
*/ 
svDeleteStatisticalIniFileSection = function(ids){
	var dowhat = {
		'dowhat' : 'DeleteIniFileSection',
		'filename' : "reportset.ini",
		'user' : "default",
		"sections" : ids
	};
	var robj = process.sv_univ(dowhat,0);
	return robj.fmap(0);
}

/*
Type：add 
Author：xuqiang
Date:2013-10-24 17：20
Content:增加统计报表允许，禁止状态的改变
*/ 
svWriteStatisticalStatusInitFilesection = function(sectionName,status){
	var robj = process.sv_univ({
		'dowhat' : 'WriteIniFileString',
		'filename' : "reportset.ini",
		'user' : "default",
		'section' : sectionName,
		"key" : "bCheck",
		"value" : status
	},0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}
//更改邮件状态
svWriteEmailAddressStatusInitFilesection = function(sectionName,status){
	var robj = process.sv_univ({
		'dowhat' : 'WriteIniFileString',
		'filename' : "emailAdress.ini",
		'user' : "default",
		'section' : sectionName,
		"key" : "bCheck",
		"value" : status
	}, 0);
	if(!robj.isok(0)){
		Log4js.error(robj.estr(0),-1);
		return false;
	}
	return robj.fmap(0);
}


/* ==========================SvseEntityTemplate 使用部分 ============================ */

//添加编辑设备
svSubmitEntity = function(entity,parentid){
	if(parentid){
		var robj= process.sv_submit(entity,{'dowhat':'SubmitEntity','parentid':parentid},0); //增加
	}else{
		var robj= process.sv_submit(entity,{'dowhat':'SubmitEntity'},0); //修改
	}	
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;
}

/* =====================      SvseMonitorDao          =====================================*/
//添加编辑监视器
svSubmitMonitor = function(monitor,parentid){
	if(parentid){
		var robj= process.sv_submit(monitor,{'dowhat':'SubmitMonitor','parentid':parentid,autoCreateTable:true,del_supplement:true},0); //添加
	}else{
		var robj= process.sv_submit(monitor,{'dowhat':'SubmitMonitor',del_supplement:false},0); //修改
	}
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;
}

//获取监视器
svGetMonitor = function(id){
	var dowhat ={'dowhat':'GetMonitor','id':id};
	var robj= process.sv_univ(dowhat, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap = robj.fmap(0);
	return fmap;
}

/* =========================  SvseWarnerRule ================================ */

//Alert.ini文件写入
svWriteAlertIniFileSectionString = function(sectionname,section){
	var robj= process.sv_submit(section,{'dowhat':'WriteIniFileSection','filename':"alert.ini",'user':"default",'section':sectionname},0); 
//	console.log(robj.fmap(0));
	return robj.fmap(0);
}

//Alert.ini 删除
svDeleteAlertInitFileSection = function(ids){
	var dowhat = {
		'dowhat' : 'DeleteIniFileSection',
		'filename' : "alert.ini",
		'user' : "default",
		"sections" : ids
	};
	var robj = process.sv_univ(dowhat,0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
	
}

//改变报警规则状态
svWriteAlertStatusInitFileSection = function(sectionName,status){
	var robj = process.sv_univ({
		'dowhat' : 'WriteIniFileString',
		'filename' : "alert.ini",
		'user' : "default",
		'section' : sectionName,
		"key" : "AlertState",
		"value" : status
	}, 0);
	return robj.fmap(0);
}
/*====================SvseTopN==============*/

//topn.ini文件写入
/*
Type：add|modify
Author：renjie	
Date:2013-10-18 13:40
Content:统计报告 topn.ini写入
*/ 
svWriteTopNIniFileSectionString = function(addressname,address){
	var robj= process.sv_submit(address,{'dowhat':'WriteIniFileSection','filename':"topnreportset.ini",'user':"default",'section':addressname},0); 
//	console.log(robj.fmap(0));
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}

//topnreport.ini 删除
svDeleteTopNIniFileSection = function(ids){
	var dowhat = {
		'dowhat' : 'DeleteIniFileSection',
		'filename' : "topnreportset.ini",
		'user' : "default",
		"sections" : ids
	};
	var robj = process.sv_univ(dowhat,0);
	return robj.fmap(0);
	
}
/*
Type：  modify
Author：renjie
Date:2013-10-23 13:40
Content: 删除 svWriteTopNreportStatusInitFileSection 改成 svWriteTopNStatusInitFileSection
*/

//改变TopN状态
svWriteTopNStatusInitFilesection = function(sectionName,status){
	var robj = process.sv_univ({
		'dowhat' : 'WriteIniFileString',
		'filename' : "topnreportset.ini",
		'user' : "default",
		'section' : sectionName,
		"key" : "Deny",
		"value" : status
	}, 0);
	return robj.fmap(0);
}


/*
	Type:add file about message.ini
	Author:zhuqing
	Date:2013-10-16  16:47
	content:SvseMessage使用部分
**/
/*============SvseMessage===============*/
//smsphoneset.ini文件写入
svWriteMessageIniFileSectionString = function(messagename,message){
	var robj= process.sv_submit(message,{'dowhat':'WriteIniFileSection','filename':"smsphoneset.ini",'user':"default",'section':messagename},0); 
	if(!robj.isok(0)){
		Log4js.error(robj.estr(0),-1);
		return false;
	}
	return robj.fmap(0);
}
//获取短信列表
svGetMessageList = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"smsphoneset.ini",
		"user":"default","sections":"default"}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	var fmap= robj.fmap(0);
	return fmap;
}
//删除短信Message的section
svDeleteMessageIniFileSection = function(ids){
	var dowhat = {
		'dowhat' : 'DeleteIniFileSection',
		'filename' : "smsphoneset.ini",
		'user' : "default",
		"sections" : ids
	};
	var robj = process.sv_univ(dowhat,0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}
//获取发送com短信模板
svGetMessageTemplates = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"TXTtemplate.ini",
			"user":"default","sections":"SMS"}, 0);
	var fmap= robj.fmap(0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return fmap["SMS"];
}

//获取发送web短信模板--by zhuqing add
svGetWebMessageTemplates=function(){
	var robj = process.sv_univ({
		'dowhat':'GetSvIniFileBySections',
		'filename':'TXTTemplate.ini',
		'user':'default',
		'sections':'WebSmsConfige'
	},0);
	var fmap = robj.fmap(0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return fmap["WebSmsConfige"];
}

//更改短信状态
svWriteMessageStatusInitFilesection = function(sectionName,status){
	var robj = process.sv_univ({
		'dowhat' : 'WriteIniFileString',
		'filename' : "smsphoneset.ini",
		'user' : "default",
		'section' : sectionName,
		"key" : "Status",
		"value" : status
	}, 0);
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	return robj.fmap(0);
}

/*
	Type:ini文件读写
	Author:zhuqing
	Date:2013-10-28
	Content:发送短信方式的数据写入
*/
//(Web方式)短信发送方式smsconfig.ini(section:SMSWebConfig)写入
svWriteSMSWebConfigIniFileSectionString = function(section){
	console.log(section);
	section["Pwd"] = svEncryptOne(section["Pwd"]);
	var ini = {"SMSWebConfig":section};
	var robj= process.sv_submit(ini,{'dowhat':'WriteIniFileSection','filename':"smsconfig.ini",'user':"default",'section':"SMSWebConfig"},0); 
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	Log4js.error(robj.fmap(0));
	return robj.fmap(0);
}
//(com方式)短信发送方式smsconfig.ini(section:SMSCommConfig)写入
svWriteSMSCommConfigIniFileSectionString = function(section){
	console.log(section);
	var ini = {"SMSCommConfig":section};
	var robj= process.sv_submit(ini,{'dowhat':'WriteIniFileSection','filename':"smsconfig.ini",'user':"default",'section':"SMSCommConfig"},0); 
	var flag = checkErrorOnServer(robj);
	if(typeof flag === "string"){
		Log4js.error(flag);
		return null;
	}
	Log4js.error(robj.fmap(0));
	return robj.fmap(0);
}
//获取以web方式发送短信的设置
svGetSMSWebConfigSetting = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"smsconfig.ini",
		"user":"default","section":"SMSWebConfig"}, 0);
	if(!robj.isok(0)){
		return;
	}
	var fmap= robj.fmap(0);
	if(!fmap || !fmap["SMSWebConfig"]) return ;
	fmap["SMSWebConfig"]["Pwd"] = svDecryptOne(fmap["SMSWebConfig"]["Pwd"]);
	return fmap["SMSWebConfig"];
}
//获取以com方式发送短信的设置
svGetSMSComConfigSetting = function(){
	var robj = process.sv_univ({'dowhat':'GetSvIniFileBySections',"filename":"smsconfig.ini",
		"user":"default","section":"SMSCommConfig"}, 0);
	if(!robj.isok(0)){
		return;
	}
	var fmap= robj.fmap(0);
	if(!fmap || !fmap["SMSCommConfig"]) return ;
	return fmap["SMSCommConfig"];
}
/*
//获取短信设置的发送短信方式中的调用动态库的动态库名称(有问题-待修改)
svGetSmsDllName=function(){
	var dowhat={'dowhat':'GetSmsDllName'};
	var robj=process.sv_univ(dowhat,0);
	Log4js.info("11");
	if(!robj.isok(0)){
		Log4js.error(robj.estr(0),-1);
		return false;
	}
	Log4js.info("22");
	var fmap=robj.fmap(0);
	return fmap;
}
*/
/*
========================================
	Type:对报警规则的操作
	Author:zhuqing
	Date:2013-11-6
	Content:read ScriptFile...
*/
//获取脚本报警中的ScriptFile脚本
svGetScriptFileofScriptAlert=function(){
	var robj=process.sv_univ({
		'dowhat':'GetSvIniFileBySections',
		'filename':'TXTTemplate.ini',
		'user':'default',
		'section':'Scripts'
	},0);
	var fmap= robj.fmap(0);
	return fmap["Scripts"];
}

/*
	Type:查询日志
	Author:zhuqing
	Data:2013-11-27
	Content:queryAlertLog
*/
//查询报警规则的日志记录
svGetQueryAlertLog = function(beginDate,endDate,alertQueryCondition){
	var robj = process.sv_forest({
		'dowhat':'QueryAlertLog',
		alertName:alertQueryCondition.AlertName,
		alertReceive:alertQueryCondition.AlertReceiver,
		alertType:alertQueryCondition.AlertType,
		begin_year:beginDate["year"], begin_month:beginDate["month"], begin_day: beginDate["day"],  begin_hour: beginDate["hour"],  begin_minute:beginDate["minute"],  begin_second:beginDate["second"],  
		end_year: endDate["year"],  end_month:endDate["month"],  end_day: endDate["day"],  end_hour:endDate["hour"],  end_minute:endDate["minute"],  end_second: endDate["second"]
	}, 0);
	if(!robj.isok(0)){
		Log4js.error(robj.estr(0),-1);
		return false;
	}
	console.log(alertQueryCondition);
	var fmap = robj.fmap(0);
	var alertLogRecords = [];
	for(r in fmap){
		alertLogRecords.push(fmap[r]);
	}
	
	return alertLogRecords;
}
