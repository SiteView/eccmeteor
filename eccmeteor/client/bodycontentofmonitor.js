Template.BodyContentOfMonitor.rendered = function(){
	$("#moitorContentTree").css("height",screen.height-250);
	$("#ContentLayout").css("height",screen.height-220);
	$("body").css("background-color","white");
}

Template.ControlViewLayout.viewlayout = function(){
	return Session.get("layout");
}
/*
	视图类型  设备
*/
Template.SettingLayout.viewTypeForSetting = function(){
	return Session.get("ViewTypeForSetting"); //在SwitchView中进行定义
}

Template.EquipmentsLayout.viewTypeForEquipments = function(){
	return Session.get("ViewType"); //在  MoitorContentTree -> drawSvseSimpleTree -> callback 中进行定义
}

