Template.ChooseMonitorTemplate.monities = function(){
//	var id = Session.get("checkedTreeNode")["id"];
	var id = SessionManage.getCheckedTreeNode("id");
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
	return SvseEntityTemplateDao.getEntityMonitorByDevicetype(devicetype);
}
Template.ChooseMonitorTemplate.events = {
	"click tr a":function(e){
	//	SwithcView.view(MONITORVIEW.MONITORADD);//设置视图状态 选择监视器模板的视图
		Session.set("monityTemplateId",e.target.id);
	//	var  checkedMonityTemolate = SvseMonitorTemplateDao.getTemplateById(e.target.id);
	//	Session.set("checkedMonityTemolate",checkedMonityTemolate);//存储选中的监视器模板信息
		Session.set("monitorStatus","添加");
		$("#chooseMonitorTemplateDiv").modal('hide');
		$("#showMonitorInfoDiv").modal('show');
	} 
}