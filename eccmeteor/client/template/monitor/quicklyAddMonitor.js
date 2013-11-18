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
	var id = Session.get(SessionManage.MAP.ADDEDENTITYID);
	if(!id)
		return;
	var entityDevicetype = Session.get(SessionManage.MAP.CHECKEDENTITYTEMPLATEID);
	var monitors = typeof(SvseEntityTemplateDao) !== "undefined" ? SvseEntityTemplateDao.getEntityMonitorByDevicetype(entityDevicetype,true) : [];
	getQuicklyMonitorsDynamicParams&&getQuicklyMonitorsDynamicParams(SessionManage.getAddedEntityId(),monitors);//"1.26.19"  
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
	LoadingModal.loading();
	SvseMonitorTemplateDao.getMonityDynamicPropertyDataArray(entityId,dynamicMonitors,function(status,result){
		LoadingModal.loaded();
		if(!status){
			Message.error(result);
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
		var seletor = "div.QuickMonitorDynamicService div#MonitorDynamicProperty"+monitor["temlpateId"];
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
/*
	获取选中的checkbox
*/
var getTheCheckedDynamicServices = function(){
	var children = $("div.QuickMonitorDynamicServiceSelectChildren");
	var c_len = children.length;
	var quickMonitorLists = [];
	for(var index = 0 ; index < c_len ; index++){
		var values = $(children[index]).find(":checkbox[checked]");
		//如果当前监视没有选择被选择
		if(!values.length)
			continue;
		//获取该监视器相关信息，id，类型,sv_name等
		var template = $(children[index]).parents("div.QuickMonitorDynamicService")
							.children("div.QuickMonitorDynamicServiceSelectParent")
							.find(":checkbox:first");
		var sv_name = template.attr("data-name");
		var sv_monitortype = template.attr("data-id");
		var extra = template.attr("data-extra") === "" ? false :  template.attr("data-extra");
		var monitor = getQuicklyMonitorsParams(sv_monitortype);
		//判断是否为动态属性
		//非动态属性
		if(!extra){
			quickMonitorLists.push(monitor);
			continue;
		}
		//动态属性
		for(var i = 0; i < values.length ; i++){
			var tmp = Utils.clone(monitor);
			console.log(extra);
			console.log(values[i].value);
			console.log(values[i]);
			tmp.parameter[extra] = values[i].value;
			quickMonitorLists.push(tmp);
		}
	}
	return quickMonitorLists;
}

Template.QuickMonitorDynamicService.events({
	"click div.QuickMonitorDynamicServiceSelectParent :checkbox":function(e){
		var checked = e.currentTarget.checked;
		$(e.currentTarget).parents("div.QuickMonitorDynamicService")
							.children("div.QuickMonitorDynamicServiceSelectChildren")
							.find(":checkbox")
							.each(function(){
								this.checked = checked;
							});
	}
});
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
		var templates = getTheCheckedDynamicServices();
		console.log(templates);
		if(!templates.length){
			$("#showQuickMonityTemplatediv").modal("hide");
			return;
		}
			
		LoadingModal.loading();
		SvseMonitorDao.addMultiMonitor(templates,SessionManage.getAddedEntityId(),function(result){
			LoadingModal.loaded();
			if(!result.status){
				Message.error(result.msg);
			}else{
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

Template.showQuickMonityTemplate.rendered = function(){
	ModalDrag.draggable("#showQuickMonityTemplatediv");
}