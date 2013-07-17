Template.showQuickMonityTemplate.monities = function(){
	var entityDevicetype =  Session.get("showEntityId");
	SystemLogger("快速添加的设备类型是："+entityDevicetype);
	return SvseEntityTemplateDao.getEntityMontityByDevicetype(entityDevicetype,true);
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
	"click #savequickmonitorlist" : function () {
		var checkeds = $("#quickMonitorList :checkbox[checked='checked']");
		if(!checkeds.length){
			Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY);//显示组和设备界面
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
			}
		});
	},
	"click #cancequickmonitorlist" : function() {
		Session.set("viewstatus",MONITORVIEW.GROUPANDENTITY);//显示组和设备界面
	}
}