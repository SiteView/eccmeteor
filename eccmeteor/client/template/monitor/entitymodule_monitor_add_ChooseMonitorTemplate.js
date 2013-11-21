Template.ChooseeMonitorTemplateModal.events({
	"click tr a":function(e,t){
	//	SwithcView.view(MONITORVIEW.MONITORADD);//设置视图状态 选择监视器模板的视图
		var data = this;//this为上下文环境
		if(!data)
			return;
		var monitorTemplateId = data.return.id;
		var monityTemplateName = data.property.sv_label
	//	Session.set("monitorTemplateId",monitorTemplateId); //后修改版本中尽量删除此变量
	//	Session.set("monitorStatus","false"); //后修改版本中尽量删除此变量
		RenderTemplate.hideParents(t);
		var context = getMonitorInfoContext(monitorTemplateId,monityTemplateName);
		if(!context)
			return;
		console.log(context);
		//=====================
		var entityId = SessionManage.getCheckedTreeNode("id");
		//处理可能处在的动态监视器属性
		//判断改监视器是否具有动态属性
		var monityTemplateParameters= context.MonityTemplateParameters;
		var mParametersLength = monityTemplateParameters.length;
		var DynamicParameters = null;
		for(var pi = 0 ; pi < mParametersLength ; pi++){
			if(monityTemplateParameters[pi]["sv_dll"]){
				DynamicParameters = {index:pi,parameter:monityTemplateParameters[pi]};
				break;
			}
		}
		//监视器不具备动态属性。直接渲染弹窗
		if(!DynamicParameters){
			RenderTemplate.showParents("#AddMoniorFormModal","AddMoniorFormModal",context);
			return;
		}
		//具备动态属性 && 获取动态属性
		LoadingModal.loading();
		SvseMonitorTemplateDao.getMonityDynamicPropertyData(entityId,monitorTemplateId,function(status,result){
			LoadingModal.loaded();
			if(!status){
				Log4js.error(result);
				Message.error("获取监视器动态属性失败！");
				return;
			}
			var optionObj = result["DynamicData"];
			var DynamicDataList = [];
			for(name in optionObj){
				DynamicDataList.push({key:name,value:optionObj[name]});
			}
			//给对应的设备赋值
			context.MonityTemplateParameters[DynamicParameters.index]["selects"] = DynamicDataList;
			RenderTemplate.showParents("#AddMoniorFormModal","AddMoniorFormModal",context);
		});
	}
});
var getMonitorInfoContext = function(monitorTemplateId,monityTemplateName){
	if(!monitorTemplateId){
		Message.error("选择"+monityTemplateName+"模板不存在");
		return false;
	}
	var ActionType = "添加";//添加或编辑。用于标题栏
	var devicename = SessionManage.getCheckedTreeNode("name");
	var monitorType = monityTemplateName;
	var MonityTemplateParameters = SvseMonitorTemplateDao.getMonityTemplateParametersById(monitorTemplateId);
	var MonityTemplateAdvanceParameters = SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(monitorTemplateId);
	var MonityTemplateReturnItems = SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(monitorTemplateId);
	var MonityTemplateStates = SvseMonitorTemplateDao.getMonityTemplateStatesById(monitorTemplateId);
	var MonityFrequencyLabel = SvseMonitorTemplateDao.getMonityTemplateParameterByName(monitorTemplateId,"_frequency").sv_label;
	var MonityFrequencyDom =  SvseMonitorTemplateDao.getMonityTemplateFrequencyParameters(monitorTemplateId);
	var AllTaskNames = SvseTaskDao.getAllTaskNames();
	return {
		monitorTemplateId:monitorTemplateId,
		ActionType:ActionType,
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