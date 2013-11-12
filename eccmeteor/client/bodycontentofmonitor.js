Template.BodyContentOfMonitor.rendered = function(){
	$("#moitorContentTree").css("height",screen.height-250);
	$("#ContentLayout").css("height",screen.height-220);
	$("body").css("background-color","white");
}

Template.ControlViewLayout.viewlayout = function(){
	return Session.get("layout");
}
/*
	视图类型
*/
Template.SettingLayout.viewType = function(){
	return Session.get("ViewType"); //在SwitchView中进行定义
}

Template.EquipmentsLayout.viewType = function(){
	return Session.get("ViewType"); //在  MoitorContentTree -> drawSvseSimpleTree -> callback 中进行定义
}

