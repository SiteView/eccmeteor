Template.ChooseeMonitorTemplateModal.events({
	"click tr a":function(e,t){
	//	SwithcView.view(MONITORVIEW.MONITORADD);//设置视图状态 选择监视器模板的视图
		var data = this;//this为上下文环境
		if(!data)
			return;
		var id = data.return.id;
		var monityTemplateName = data.property.sv_label
		Session.set("monityTemplateId",id); //后修改版本中尽量删除此变量
	//	var  checkedMonityTemolate = SvseMonitorTemplateDao.getTemplateById(e.target.id);
	//	Session.set("checkedMonityTemolate",checkedMonityTemolate);//存储选中的监视器模板信息
		Session.set("monitorStatus","添加"); //后修改版本中尽量删除此变量
		//$("#chooseMonitorTemplateDiv").modal('hide');
		RenderTemplate.hideParents(t);
	//=====================
	//	$("#showMonitorInfoDiv").modal('show');
		var context = getMonitorInfoContext(id,monityTemplateName);
		if(!context)
			return;
		//RenderTemplate.show("#showMonitorInfoDiv","showMonitorInfoForm",context);
		RenderTemplate.showParents("#AddMoniorFormModal","AddMoniorFormModal",context);
	}
});
var getMonitorInfoContext = function(monityTemplateId,monityTemplateName){
	if(!monityTemplateId){
		Message.error("选择"+monityTemplateName+"模板不存在");
		return false;
	}
	var monitorStatus = "添加";//添加或编辑。用于标题栏
	var devicename = SessionManage.getCheckedTreeNode("name");
	var monitorType = monityTemplateName;
	var MonityTemplateParameters = SvseMonitorTemplateDao.getMonityTemplateParametersById(monityTemplateId);
	var MonityTemplateAdvanceParameters = SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(monityTemplateId);
	var MonityTemplateReturnItems = SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(monityTemplateId);
	var MonityTemplateStates = SvseMonitorTemplateDao.getMonityTemplateStatesById(monityTemplateId);
	var MonityFrequencyLabel = SvseMonitorTemplateDao.getMonityTemplateParameterByName(monityTemplateId,"_frequency").sv_label;
	var MonityFrequencyDom =  SvseMonitorTemplateDao.getMonityTemplateFrequencyParameters(monityTemplateId);
	var AllTaskNames = SvseTaskDao.getAllTaskNames();
	return {
		monitorStatus:monitorStatus,
		monitorType:monitorType,
		MonityTemplateParameters:MonityTemplateParameters,
		MonityTemplateAdvanceParameters:MonityTemplateAdvanceParameters,
		MonityTemplateReturnItems:MonityTemplateReturnItems,
		Error:MonityTemplateStates.Error,
		Warning:MonityTemplateStates.Warning,
		Good:MonityTemplateStates.Good,
		MonityFrequencyLabel:MonityFrequencyLabel,
		MonityFrequencyDom:MonityFrequencyDom,
		AllTaskNames:AllTaskNames
	}
}