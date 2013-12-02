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
				var index = property.match(/\d+/g);
				index = index === null ? "" : index[0];// index == null or index == ["123"];
				selects.push({
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
		var selectlength = selects.length;
		selects.push({
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
		conditions = conditions.replace(/(or|and)$/,"")
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
		var selectlength = selects.length;
		selects.push({
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
			conditions =conditions + relation + "["+slt.paramenameValue+slt.operateValue+slt.sv_paramvalueValue+"]"
		}
		conditions = conditions.replace(/(or|and)$/,"")
								.replace(/\b(or|and)\b/g,function($0){return {or:"或",and:"与"}[$0]});
		ConditionsDiv.text(conditions);
	}
});