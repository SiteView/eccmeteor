/**
	将服务端的对象转成本地标准化对象，为其转Dom元素做准备
**/
LocalObjectConverter = {
	//监视器模板参数转本地对象
	convertMonityTemplateParameter : function(paramter){
		var obj = {};
		obj.type = paramter["sv_type"] ||paramter["type"]|| "";
		obj.name = paramter["sv_name"] ||paramter["name"]|| "";
		obj.value = paramter["sv_value"] ||paramter["value"]||"";
		obj.selects = paramter["selects"] ||paramter["select"]|| [];
		obj.readonly = (paramter["sv_isreadonly"] === 'true')||paramter["readonly"] || false;
		obj.type = obj.type.replace(/^(textbox|password|combobox|textarea)$/,
										function($0){
											var obj = {
												textbox :"input",
												password:"passwd",
												combobox:"select",
												textarea:"textarea"
											}
											return obj[$0];
										})
		return obj;
	}
}