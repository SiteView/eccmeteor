EntityModuleMonitorEditDomAction = function(){};
Object.defineProperty(EntityModuleMonitorEditDomAction,"statusFormToObjArray",{
	value:function(form){
		var parameteArray = form.serializeArray();
		if(!parameteArray ||parameteArray.length == 0){
			return [];
		}
		var MIStatus ={};
		for(index in parameteArray){
			MIStatus[parameteArray[index]["name"]] = parameteArray[index]["value"];
		}
		var selects = [];
		for(property in MIStatus){
			if(property.indexOf("sv_paramname") != -1){
				var index = property.replace("sv_paramname","");
				selects.push({
					"sid":index,
					"paramenameKey":property,
					"paramenameValue":MIStatus[property],
					"operateKey":("sv_operate"+index),
					"operateValue":MIStatus[("sv_operate"+index)],
					"sv_paramvalueKey":("sv_paramvalue"+index),
					"sv_paramvalueValue":MIStatus[("sv_paramvalue"+index)],
					"sv_relationKey":("sv_relation"+index),
					"sv_relationValue":MIStatus[("sv_relation"+index)]
				})
			}
		}
		return selects;
	}
});
/*错误，正常，警告等条件添加*/
Object.defineProperty(EntityModuleMonitorEditDomAction,"addStatusConditions",{
	value:function(e,t,context){
		//防止误操作
		if(e.currentTarget.id !== "monitorTemplateStatusAddConditions"){
			return;
		}
		var btn = $(e.currentTarget);
		var form = btn.parent("form");//当前用户输入的表单
		var inputs = form.serializeArray();
		//提取新增的条件
		var inputObject = ClientUtils.formArrayToObject(inputs);
		//获取隐藏表单数据，然后进行重组
		var div =  form.parent("div.accordion-inner");//直接父类
		var tbody = div.children("table").children("tbody"); //正常显示的tbody元素
		var hiddenform = div.children("form:eq(1)"); //隐藏字段的表单元素

		var selects = this.statusFormToObjArray(hiddenform);//提取有效的字段
		//放入新增的条件
		var selectlength = selects.length +1 ;
		selects.push({
			"sid":selectlength,
			"paramenameKey":("sv_paramname"+selectlength),
			"paramenameValue":inputObject["sv_paramname"],
			"operateKey":("sv_operate"+selectlength),
			"operateValue":inputObject["sv_operate"],
			"sv_paramvalueKey":("sv_paramvalue"+selectlength),
			"sv_paramvalueValue":inputObject["sv_paramvalue"],
			"sv_relationKey":("sv_relation"+selectlength),
			"sv_relationValue":inputObject["sv_relation"]
		});
		//获取重新渲染的表格视图，并替换原来的表格视图
		var tableView = Meteor.render(function(){
			return Template.monitorTemplateInitStatusTableTrEdit({selects:selects});
		});
		tbody.empty().append(tableView);
		//获取重新渲染的隐藏字段视图，并且替换原来的
		selectlength = selects.length;
		var hiddenView = Meteor.render(function(){
			return Template.monitorTemplateInitStatusInputHiddenEdit({sv_conditioncount:selectlength,selects:selects});
		});
		hiddenform.empty().append(hiddenView);
		//对象显示内容的div的操作
		var ConditionsDiv = div.parents(".accordion-group").find("div.MonitorStatusConditionsDiv");
		var conditions = "";
		for(var j = 0 ; j < selectlength ; j++){
			var slt = selects[j];
			var relation = slt.sv_relationValue ? slt.sv_relationValue :"";
			conditions = conditions + relation + "["+slt.paramenameValue+slt.operateValue+slt.sv_paramvalueValue+"]"
		}
		conditions = conditions.replace(/(^(or|and))|((or|and)$)/,"")
								.replace(/\b(or|and)\b/g,function($0){return {or:"或",and:"与"}[$0]});
		ConditionsDiv.text(conditions);
	}
});


/*错误，正常，警告等条件删除*/
/*
接收一个父类容器div的选择者器
*/
Object.defineProperty(EntityModuleMonitorEditDomAction,"removeStatusConditions",{
	value:function(e,t,context){
		var target = $(e.currentTarget);
		var div = target.parents("div.accordion-inner");//相对 顶级div
		var tid = e.currentTarget.id;
		//获取隐藏表单数据，然后进行重组
		var tbody = div.children("table").children("tbody"); //正常显示的tbody元素
		var hiddenform = div.children("form:eq(1)"); //隐藏字段的表单元素
		//删除指定的隐藏字段
		hiddenform.find("div.hiddenFormGroup[id='"+tid+"']").remove();
		var selects = this.statusFormToObjArray(hiddenform);//提取有效的字段
		//获取重新渲染的表格视图，并替换原来的表格视图
		var tableView = Meteor.render(function(){
			return Template.monitorTemplateInitStatusTableTrEdit({selects:selects});
		});
		tbody.empty().append(tableView);
		//获取重新渲染的隐藏字段视图，并且替换原来的
		var selectlength = selects.length;
		var hiddenView = Meteor.render(function(){
			return Template.monitorTemplateInitStatusInputHiddenEdit({sv_conditioncount:selectlength,selects:selects});
		});
		hiddenform.empty().append(hiddenView);
		//对象显示内容的div的操作
		var ConditionsDiv = div.parents(".accordion-group").find("div.MonitorStatusConditionsDiv");
		var conditions = "";
		for(var j = 0 ; j < selectlength ; j++){
			var slt = selects[j];
			var relation = slt.sv_relationValue ? slt.sv_relationValue :"";
			conditions =conditions + relation + "["+slt.paramenameValue+slt.operateValue+slt.sv_paramvalueValue+"]"
		}
		conditions = conditions.replace(/(^(or|and))|((or|and)$)/,"")
								.replace(/\b(or|and)\b/g,function($0){return {or:"或",and:"与"}[$0]});
		ConditionsDiv.text(conditions);
	}
});

//获取状态的显示信息
Object.defineProperty(EntityModuleMonitorEditDomAction,"getStatusConditionsText",{
	value:function(selects){
		if(!selects){
			Log4js.warn("selects不存在");
		}
		var selectlength = selects.length;
		var conditions = "";
		for(var j = 0 ; j < selectlength ; j++){
			var slt = selects[j];
			var relation = slt.sv_relationValue ? slt.sv_relationValue :"";
			conditions =conditions + relation + "["+slt.paramenameValue+slt.operateValue+slt.sv_paramvalueValue+"]"
		}
		return conditions.replace(/(^(or|and))|((or|and)$)/,"")
						.replace(/\b(or|and)\b/g,function($0){return {or:"或",and:"与"}[$0]});
	}
});

//保存表单信息
Object.defineProperty(EntityModuleMonitorEditDomAction,"saveForm",{
	value:function(e,t,context){
		var monitorTemplateId = t.find("input:text").value;
		var monityTemplateParameter = ClientUtils.formArrayToObject($(t.find("form#monityTemplateParameter")).serializeArray());
		var monityTemplateAdvanceParameters = ClientUtils.formArrayToObject($(t.find("form#monityTemplateAdvanceParameters")).serializeArray());
		var monityCommonParameters = ClientUtils.formArrayToObject($(t.find("form#monityTemplateCommonParameters")).serializeArray());
		monityCommonParameters["sv_checkerr"] = monityCommonParameters["sv_checkerr"] || "false";
		var checkedMonityTemolateProperty = ClientUtils.formArrayToObject($(t.find("form#CommonProperty")).serializeArray());
		var monityParameter = ClientUtils.objectCoalescence(monityTemplateParameter,monityCommonParameters);
		//拼接基本参数属性
		if(!monityParameter["sv_errfreqsave"]){
			monityParameter["sv_errfreqsave"] = "";
			monityParameter["sv_errfreq"] = 0;
		}
		if(monityParameter["sv_errfreqsave"] !== ""){
			monityParameter["sv_errfreq"] = +monityParameter["sv_errfreqsave"];
		}
		monityParameter["_frequency"] = +monityParameter["_frequency"];
		monityParameter["_frequency1"] = monityParameter["_frequency"]
		var error =  ClientUtils.statusFormToObj($(t.find("form#errorsStatusForm")).serializeArray());
		var good =  ClientUtils.statusFormToObj($(t.find("form#goodStatusForm")).serializeArray());
		var warning =  ClientUtils.statusFormToObj($(t.find("form#warningStatusForm")).serializeArray());
		var property = {
			sv_disable : checkedMonityTemolateProperty.sv_disable == "true" ? true : false,
			sv_endtime : checkedMonityTemolateProperty.sv_entime,
			sv_monitortype : checkedMonityTemolateProperty.sv_monitortype,
			sv_name : checkedMonityTemolateProperty.sv_name,
			sv_starttime : checkedMonityTemolateProperty.sv_starttime,
			creat_timeb :checkedMonityTemolateProperty.creat_timeb
		};
		//组装监视器数据
		var monitor = {
			advance_parameter : monityTemplateAdvanceParameters,
			error : error,
			warning : warning,
			good : good,
			parameter : monityParameter,
			property : property
		};
		//获取父节点id
		var parentid = SessionManage.getCheckedTreeNode("id");
		var monitorId = t.find("input:hidden#monitorId").value;
		monitor["return"] = {id : monitorId,return : true};
		Log4js.info("获取到的结果是:");
		console.log(monitor);
		LoadingModal.loading();
		SvseMonitorDao.editMonitor(monitor,parentid,function(result){
			LoadingModal.loaded();
			if(result && !result.status){
				Message.error(result.msg);
			}
			RenderTemplate.hideParents(t);
		});
	}
})