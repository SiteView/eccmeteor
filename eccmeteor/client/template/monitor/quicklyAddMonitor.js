Template.QuickMonitorDynamicService.monities = function(){
//	var entityDevicetype =  Session.get("_showEntityId");
	var entityDevicetype = Session.get(SessionManage.MAP.CHECKEDENTITYTEMPLATEID);
	if(!entityDevicetype) return [];
	SystemLogger("快速添加的设备类型是："+entityDevicetype);
	var addedEntityId = SessionManage.getAddedEntityId();
	SystemLogger("快速添加的设备ID是："+addedEntityId);
	var monitors = SvseEntityTemplateDao.getEntityMonitorByDevicetype(entityDevicetype,true); //true表示获取快速添加的监视器列表
	SystemLogger("该设备监视器有：");
	SystemLogger(monitors);
	return monitors;
}
/**
		Type:Add
		Author:huyinghuan
		Date:2013-10-16 15:00
		Content:添加完设备后快速添加监视器时，获取相关监视器模板的动态属性
		-----------
		Deps.autorun(function(){.....
		var getQuicklyMonitorsDynamicParams = function..................
		------------
		{
			DynamicData:{
				'C:': "C:"
				'D:': "D:"
			},
			return:{
				return : true
			}

		}
**/
Deps.autorun(function(){
	var id = Session.get("ADDEDENTITYID");
	if(!id)
		return;
	var entityDevicetype = Session.get(SessionManage.MAP.CHECKEDENTITYTEMPLATEID);
	var monitors = SvseEntityTemplateDao.getEntityMonitorByDevicetype(entityDevicetype,true);
	getQuicklyMonitorsDynamicParams("1.26.19",monitors);//"1.26.19" SessionManage.getAddedEntityId() 
});
//接收一个设备ID以及该设备相关的一组监视器模板
var getQuicklyMonitorsDynamicParams = function(entityId,monitors){
	if(!monitors || !monitors.length)
		return;
	var length = monitors.length;
	var dynamicMonitors = [];
	for(var i = 0 ; i < length ; i++){
		if(!monitors[i]["property"]["sv_extradll"]) //如果没有动态属性
			continue;
		dynamicMonitors.push(monitors[i]["return"]["id"]);
	}
	SvseMonitorTemplateDao.getMonityDynamicPropertyDataArray(entityId,dynamicMonitors,function(status,result){
		if(!status){
			Messsage.error(result);
			return;
		}
		console.log(result);
		setQuicklyMonitorsDynamicParamsToDom(result);
	});
}
//操作Dom元素
var setQuicklyMonitorsDynamicParamsToDom = function(monitors){
	if(!monitors || !monitors.length)
		return;
	var length = monitors.length;
	for(index = 0; index < length; index++){
		var monitor = monitors[index];
		var seletor = "div#QuickMonitorDynamicService div#MonitorDynamicProperty"+monitor["temlpateId"];
		var html = Meteor.render(function(){
			return Template.QuickMonitorDynamicProperty(monitor);
		})
		$(seletor).empty().append(html);
	}
}

var getQuicklyMonitorsParams = function(id){
	console.log("getQuicklyMonitorsParams " + id);
	var template =  SvseMonitorTemplateDao.getTemplateById(id);
	//return template;
	var error  = template["error"];
	var saveAttr = ["conditioncount","expression","paramname","paramvalue","operate"];
	error = ClientUtils.deleteAttributeFromObject(error,saveAttr);
	var good  = template["good"];
	good = ClientUtils.deleteAttributeFromObject(good,saveAttr);
	var warning  = template["warning"];
	warning = ClientUtils.deleteAttributeFromObject(warning,saveAttr);
	var advance = {};
	var parameter = {};
	for(attr in template){
		if(attr.indexOf("AdvanceParameterItem") != -1){
			advance[template[attr]["sv_name"]] = template[attr]["sv_value"];
			continue;
		}
		if(attr.indexOf("ParameterItem") != -1){
			parameter[template[attr]["sv_name"]] = template[attr]["sv_value"];
		}
	}
	parameter["sv_errfreqsave"] = "";
	parameter["sv_description"] = "";
	parameter["sv_checkerr"] =  true;	
	parameter["sv_errfreq"] = 0;
	parameter["sv_errfrequint"] = 1;
	parameter["sv_reportdesc"] = "";
	parameter["sv_plan"] = "7x24";
	var property = {
			sv_disable : false,
			sv_endtime : "",
			sv_monitortype : id,
			sv_name : template.property.sv_name,
			sv_starttime : "",
			creat_timeb : new Date().format("yyyy-MM-dd hh:mm:ss")
	};
	var monitor = {
			advance_parameter : advance,
			error : error,
			warning : warning,
			good : good,
			parameter : parameter,
			property : property
	};
	console.log(monitor);
	return monitor;
}

Template.showQuickMonityTemplate.events = {
	"click #chooseallqucikmonitor" : function () {
		$("#quickMonitorList :checkbox").each(function(){
			this.checked = true;
		});
	},
	"click #unchooseallqucikmonitor" : function(){
		$("#quickMonitorList :checkbox").each(function(){
			this.checked = !this.checked;
		});
	},
	"click #showQuickMonityTemplateSaveBtn" : function () {
		var checkeds = $("#quickMonitorList :checkbox[checked='checked']");
		if(!checkeds.length){
		//	Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY);//显示组和设备界面
			$("#showQuickMonityTemplatediv").modal("hide");
			return;
		}
		var templates = [];
		for (var index = 0; index < checkeds.length ; index++){
			console.log("checkeds index " + index)
			templates.push(getQuicklyMonitorsParams(checkeds[index].id));
		//	templates.push(checkeds[index].id);
		}
		console.log("father id is "+SessionManage.getAddedEntityId());
		console.log(templates);
		SystemLogger("正在刷新多个监视器...");
		SvseMonitorDao.addMultiMonitor(templates,SessionManage.getAddedEntityId(),function(result){
			if(!result.status){
				SystemLogger(result.msg,-1);
			}else{
				SystemLogger("刷新完成...");
		//		SwithcView.render(MONITORVIEW.GROUPANDENTITY,LAYOUTVIEW.NODE); //切换视图和布局
			}
			$("#showQuickMonityTemplatediv").modal("hide");
		});
	},
	"click #showQuickMonityTemplateCancelBtn" : function() {
		//Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY);//显示组和设备界面
		$("#showQuickMonityTemplatediv").modal("hide");
	//	SwithcView.render(MONITORVIEW.GROUPANDENTITY,LAYOUTVIEW.NODE); //切换视图和布局
	}
}