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

Template.showMonityInfo.getMonityTemplateParameters = function(id){
	return SvseMonitorTemplateDao.getMonityTemplateParametersById(id);
}