Template.showMonityTemplate.monities = function(){
	var id = Session.get("checkedTreeNode")["id"];
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
	return SvseEntityTemplateDao.getEntityMontityByDevicetype(devicetype);
}
Template.showMonityTemplate.events = {
	"click tr a":function(e){
		Session.set("viewstatus",MONITORVIEW.MONITYADD);//设置视图状态
		Session.set("monityTemplateId",e.target.id);
	} 
}

Template.showMonityInfo.getMonityTemplateParameters = function(){
	return SvseMonitorTemplateDao.getMonityTemplateParametersById(Session.get("monityTemplateId"));
}

Template.showMonityInfo.getMonityTemplateAdvanceParameters = function(){
	return SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(Session.get("monityTemplateId"));
}
Template.showMonityInfo.getMonityTemplateStates = function(){
	return SvseMonitorTemplateDao.getMonityTemplateStatesById(Session.get("monityTemplateId"));
}
Template.showMonityInfo.devicename = function(){
	 return Session.get("checkedTreeNode").name;
}

Template.showMonityInfo.events = {
	"click #addMonitor":function(){
		var monityTemplateParameter = ClientUtils.formArrayToObject($("#monityTemplateParameter").serializeArray());
		var monityTemplateStates = ClientUtils.formArrayToObject($("#monityTemplateStates").serializeArray());
		var monityTemplateAdvanceParameters = ClientUtils.formArrayToObject($("#monityTemplateAdvanceParameters").serializeArray());
		var monityCommonParameters = ClientUtils.formArrayToObject($("#monityTemplateCommonParameters").serializeArray());
		monityCommonParameters["sv_checkerr"] = monityCommonParameters["sv_checkerr"] || "false";
		SystemLogger("基本属性");
		SystemLogger(monityTemplateParameter);
		SystemLogger("状态");
		SystemLogger(monityTemplateStates);
		SystemLogger("高级选项");
		SystemLogger(monityTemplateAdvanceParameters);
		SystemLogger("常规选项");
		SystemLogger(monityCommonParameters);
		//临时数据 ==============================
		var error =  { 
			sv_conditioncount: '1',
			sv_expression: '1',
			sv_operate1: '==',
			sv_paramname1: 'packetsGoodPercent',
			sv_paramvalue1: '0' };
		
		var good =  { 
			sv_conditioncount: '1',
			sv_expression: '1',
			sv_operate1: '>',
			sv_paramname1: 'packetsGoodPercent',
			sv_paramvalue1: '75' 
			}
		
		var warning = { 
			sv_conditioncount: '1',
			sv_expression: '1',
			sv_operate1: '<=',
			sv_paramname1: 'packetsGoodPercent',
			sv_paramvalue1: '75' 
		}
		 var property = { 
			 sv_dependson: '',
			 sv_disable: 'false',
			 sv_endtime: '',
			 sv_intpos: '1',
			 sv_monitortype: '5',
			 sv_name: 'Ping',
			 sv_starttime: '' 
		}
		//临时数据 ===============================
		var monitor = {};
		monitor["advance_parameter"] = monityTemplateAdvanceParameters;
		monitor["error"] = error;
		monitor["warning"] = warning;
		monitor["good"] = good;
		monitor["parameter"] = ClientUtils.objectCoalescence(monityTemplateParameter,monityCommonParameters);
		monitor["property"] = property ;
	}
}

Template.showMonityInfo.getAllTaskNames = function(){
	return SvseTaskDao.getAllTaskNames();
}