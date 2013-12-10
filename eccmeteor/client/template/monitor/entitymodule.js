var PagerMonitor = new Pagination("subentitylist");

Template.MonitorList.pagerMonitor = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
	return PagerMonitor.create(SvseTreeDao.getNodeCountsByIds(childrenIds));
}

Template.MonitorList.Monitors = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
    var perPage = Session.get("PERPAGE");
    return SvseTreeDao.getNodesByIds(childrenIds,false,PagerMonitor.skip({perPage:perPage}));
}

Template.MonitorList.events={
	"click tbody tr":function(e){
		var checkedMonitorId = this.sv_id;
		if(SessionManage.getCheckedMonitorId() === checkedMonitorId)
			return;
	//	var status = this.status;
		if(!checkedMonitorId || checkedMonitorId=="") return;
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(checkedMonitorId);
		drawImage(checkedMonitorId);
	},
    "click #showMonitorList button[name='trash']":function(e){
		var id = this.sv_id;
		console.log("删除监视器id:"+id);
		var parentid  = SessionManage.getCheckedTreeNode("id");
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			SystemLogger(result);
		});
    },
 	"click #showMonitorList button[name='edit']":function(e){
      //  var id = e.currentTarget.id;
      	var monitorId = this.sv_id;
        console.log("编辑监视器id:"+monitorId);
       // SessionManage.setCheckedMonitorId(id);
        var monitorTemplateId = SvseMonitorTemplateDao.getMonitorTemplateIdBySvid(monitorId);
        var monitorTemplateName = SvseMonitorTemplateDao.getMonitorTemplateNameByTemplateId(monitorTemplateId);

      	var context = getMonitorInfoContext(monitorTemplateId,monitorTemplateName);
      	context["monitorId"] = monitorId;
		console.log(context);
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
		LoadingModal.loading();
		SvseMonitorDao.getMonitor(monitorId,function(err,result){
			if(err){
				Log4js.error(err);
				Message.error(result);
				return;
			}
			var monitor = result;
			console.log(monitor);
			//监视器不具备动态属性。直接渲染弹窗
			if(!DynamicParameters){
				LoadingModal.loaded();
				context = megerTemplateAndFactData(context,monitor);//合并模板数据和实际数据
				console.log("不具备动态属性 合并后的实例");
				console.log(context);
				RenderTemplate.showParents("#EditMoniorFormModal","EditMoniorFormModal",context);
				return;
			}
			//具备动态属性 && 获取动态属性
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
				context = megerTemplateAndFactData(context,monitor);//合并模板数据和实际数据
				console.log("具备动态属性 并后的实例");
				console.log(context);
				RenderTemplate.showParents("#EditMoniorFormModal","EditMoniorFormModal",context);
			});

		});
    },
    "mouseenter #showMonitorList img":function(e){
    	$(e.currentTarget).popover('show');
    },
    "mouseleave #showMonitorList img":function(e){
    	$(e.currentTarget).popover('hide');
    }
}

Template.MonitorList.rendered = function(){ //默认选中第一个监视进行绘图
	//初始化checkbox全选效果
	$(function(){
        //隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("showMonitorList");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("showMonitorTableSelectAll");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("showMonitorList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("showMonitorList");
    });
	//默认选中第一个监视器，展示数据
	//console.log("默认画图id是："+this.find("td input:checkbox").id);
	//第一判断当前是否还有监视器
	var defaultMonitor = this.find("td input:checkbox");
	if(!defaultMonitor){
		emptyImage();
		return;
	}
	//第二 先默认选择第一个监视器的id
	var defaultMonitorId = defaultMonitor.id;
	//第三 判断页面刷新前是否已经选中了监视器
	var parentid  = SessionManage.getCheckedTreeNode("id");
	var checkedMonitorId = SessionManage.getCheckedMonitorId();
	if(checkedMonitorId && checkedMonitorId.indexOf(parentid) !== -1){ //当后台数据自动更新时 不切换当前选中监视器
		//判断已经选中的监视器是否还存在 //避免多客户端对当前监视器进行删除
		if(this.find("input:checkbox[id='"+checkedMonitorId+"']")){
			defaultMonitorId = checkedMonitorId;  //存在 的话
		}
	}
	if(defaultMonitorId && defaultMonitorId !== ""){
		$(this.find("input:checkbox[id='"+defaultMonitorId+"']")).parents("tr").addClass("success");
		drawImage(defaultMonitorId);
	}else{
		emptyImage();
	}	
}

Template.MonitorStatisticalSimpleData.recordsData = function(){
	return SessionManage.getMonitorRuntimeTableData();
}

Template.svg.events({
	"click .btn#monitoryDetailBtn" :  function(){
	//	SwithcView.view(MONITORVIEW.MONITORDETAIL);//设置视图状态为监视器详细信息
		$("#showMonitorDetailSvgDiv").modal('show');
	}
})

Template.MonitorStatisticalDetailData.monitorStatisticalDetailTableData = function(){
	return SessionManage.getMonitorStatisticalDetailTableData();
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) 
		var count =200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		Log4j.warn("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	SvseMonitorDao.getMonitorRuntimeRecords(id,count,function(result){
		if(!result.status){
			Log4js.error(result.msg);
			return;
		}
		var records = result.content;
		if(!records)
			return;
		var dataProcess = new DataProcess(records,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		SessionManage.setMonitorStatisticalDetailTableData(keys);
		var selector = "svg#line";
		var line = new DrawLine(
							resultData,
							{
								'key':foreigkeys["monitorPrimary"],
								'label':foreigkeys["monitorDescript"],
								'width':$(selector).parent().width(),
								'height':$(selector).parent().height(),
								'dateformate':"%H:%M"
							},
							selector);

		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图;
	/*	SessionManage.setMonitorRuntimeTableData(recordsData);
		var selectorPie = "svg#monitorStatisticalPieSvg";
		var pie = new DrawPie(
				recordsData,
				selectorPie,
				{}
			)
		pie.draw();
	*/
		drawDie(recordsData,"svg#monitorStatisticalPieSvg");
	});
}

//画图前 获取相关数据
function drawNewImage(id,count){
	if(!count){
		var count =200;
	}
}


function emptyImage(){
	SessionManage.setMonitorStatisticalDetailTableData(null);
	SessionManage.setMonitorRuntimeTableData({
		ok:0,
		warning:0,
		error:0,
		disable:0,
		starttime:"---",
		endtime:"---"
	});
	$("svg#line").empty();	
	d3.select("svg#line")
		.attr("height",150)
		.append("g")
		.append("text")
		.attr("x","50%")
		.attr("y","50%")
		.text("暂无数据")
		.style("text-anchor", "middle");	
}


var getMonitorInfoContext = function(monitorTemplateId,monityTemplateName){
	var ActionType = "编辑";//添加或编辑。用于标题栏
	var devicename = SessionManage.getCheckedTreeNode("name");
	var monitorType = monityTemplateName;
	var MonityTemplateParameters = SvseMonitorTemplateDao.getMonityTemplateParametersById(monitorTemplateId);
	var MonityTemplateAdvanceParameters = SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(monitorTemplateId);
	var MonityTemplateReturnItems = SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(monitorTemplateId);
	var MonityTemplateStates = SvseMonitorTemplateDao.getMonityTemplateStatesById(monitorTemplateId);
	var MonityFrequencyLabel = SvseMonitorTemplateDao.getMonityTemplateParameterByName(monitorTemplateId,"_frequency").sv_label;
	var MonityFrequencyDom =  SvseMonitorTemplateDao.getMonityTemplateFrequencyParameters(monitorTemplateId);
	//var AllTaskNames = SvseTaskDao.getAllTaskNames();
	return {
		devicename:devicename,
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
		MonityFrequencyDom:MonityFrequencyDom
	}
}

/*
合并模板数据和实际数据
*/
var megerTemplateAndFactData = function(MTempalte,MInstance){
	//合并advanceParameter
	var advanceMT = MTempalte.MonityTemplateAdvanceParameters;
	var advanceMI =  MInstance.advance_parameter;
	if(advanceMT.length && advanceMI){
		for(ap in advanceMI){
			for(apIndex = 0 ; apIndex < advanceMT.length ; apIndex ++){
				if(ap == advanceMT[apIndex].sv_name){
					advanceMT[apIndex].sv_value = advanceMI[ap];
					break;
				}
			}
		}
		MTempalte.MonityTemplateAdvanceParameters = advanceMT;
	}
	//合并状态
	MTempalte.Error = mergeTemplateStatus(MTempalte.Error,MInstance.error);
	MTempalte.Good = mergeTemplateStatus(MTempalte.Good,MInstance.good);
	MTempalte.Warning = mergeTemplateStatus(MTempalte.Warning,MInstance.warning);

	//基础频率
	var MonityFrequency = MTempalte.MonityFrequencyDom;
	MonityFrequency[0]["sv_value"] = MInstance.parameter[MonityFrequency[0]["sv_name"]];
	MonityFrequency[1]["sv_value"] = MInstance.parameter[MonityFrequency[1]["sv_name"]];
	MTempalte.MonityFrequencyDom = MonityFrequency;

	//普通参数
	MTempalte["CommonParameter"] = MInstance.parameter;
	//MTempalte["CommonParameter"].AllTaskNames = MTempalte["AllTaskNames"];

	//普通属性
	MTempalte["CommonProperty"] = MInstance.property;
	//动态监视器属性
	var MTDynamicProperty = MTempalte["MonityTemplateParameters"];
	for(var dl = 0; dl < MTDynamicProperty.length; dl++){
		if(MTDynamicProperty[dl]["sv_name"]){
			MTDynamicProperty[dl]["sv_value"] =  MInstance.parameter[MTDynamicProperty[dl]["sv_name"]]
		}
	}
	MTempalte["MonityTemplateParameters"] = MTDynamicProperty;
	return MTempalte;
}
//合并状态
var mergeTemplateStatus = function(MTStatus,MIStatus){
	MTStatus.sv_conditioncount = MIStatus.sv_conditioncount;
	MTStatus.sv_expression = MIStatus.sv_expression;
	var selects = [];
	for(property in MIStatus){
		if(property.indexOf("sv_paramname") != -1){
			var index = property.replace("sv_paramname","");
			var rid = +index;
			selects.push({
				"sid":index,
				"paramenameKey":property,
				"paramenameValue":MIStatus[property],
				"operateKey":("sv_operate"+index),
				"operateValue":MIStatus[("sv_operate"+index)],
				"sv_paramvalueKey":("sv_paramvalue"+index),
				"sv_paramvalueValue":MIStatus[("sv_paramvalue"+index)],
				"sv_relationKey":("sv_relation"+index),
				"sv_relationValue":MIStatus[("sv_relation"+(rid-1))] ? MIStatus[("sv_relation"+(rid-1))] :""
			})
		}
	}
	MTStatus["selects"] = selects;
	return MTStatus;
}