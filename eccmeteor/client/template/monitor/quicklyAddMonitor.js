//保存监视器时调用
var getQuicklyMonitorsParamsForSave = function(id){
	console.log("getQuicklyMonitorsParamsForSave " + id);
	var template =  SvseMonitorTemplateDao.getTemplateById(id);
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
	获取选中的checkbox //保存监视器时调用
*/
var getTheCheckedDynamicServicesForSave = function(t){
	//var children = $("div.QuickMonitorDynamicServiceSelectChildren");
	var children = t.findAll("div.QuickMonitorDynamicServiceSelectChildren");
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
		var monitor = getQuicklyMonitorsParamsForSave(sv_monitortype);
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

Template.showQuickMonityTemplate.events = {
	"click #chooseallqucikmonitor" : function (e,t) { //选择所有
		t.findAll("input:checkbox").forEach(function(item){
			item.checked = true;
		});
	},
	"click #unchooseallqucikmonitor" : function(e,t){ //反选
		t.findAll("input:checkbox").forEach(function(item){
			item.checked = !item.checked;
		});
	},
	"click #showQuickMonityTemplateSaveBtn" : function (e,t) { //保存按钮
		var addedEntityId = t.find("input:hidden").value; //监视器所属的设备id
		var templates = getTheCheckedDynamicServicesForSave(t);
		console.log(templates);
		console.log(addedEntityId);
		if(!templates.length){
			RenderTemplate.hideParents(t);
			return;
		}
		LoadingModal.loading();
		SvseMonitorDao.addMultiMonitor(templates,addedEntityId,function(result){
			LoadingModal.loaded();
			if(!result.status){
				Message.error(result.msg);
			}else{
			}
			RenderTemplate.hideParents(t);
		});
	},
	"click #showQuickMonityTemplateCancelBtn" : function(e,t) { //取消操作
		RenderTemplate.hideParents(t);
	},
	//=========================Update
	//选择某一个监视器类型。如果是动态属性，则勾选下面的所有多选框
	"click div.QuickMonitorDynamicServiceSelectParent :checkbox":function(e){ 
		var checked = e.currentTarget.checked;
		$(e.currentTarget)
			.parents("div.QuickMonitorDynamicService")
			.children("div.QuickMonitorDynamicServiceSelectChildren")
			.find(":checkbox")
			.each(function(){
				this.checked = checked;
			});
	}
}

Template.showQuickMonityTemplate.rendered = function(){
	ModalDrag.draggable($(this.find(".modal")));
}