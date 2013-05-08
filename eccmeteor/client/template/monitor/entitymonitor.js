Template.showMonitorTemplate.monities = function(){
	var id = Session.get("checkedTreeNode")["id"];
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
	return SvseEntityTemplateDao.getEntityMontityByDevicetype(devicetype);
}
Template.showMonitorTemplate.events = {
	"click tr a":function(e){
		SwithcView.view(MONITORVIEW.MONITORADD);//设置视图状态 选择监视器模板的视图
		Session.set("monityTemplateId",e.target.id);
	//	var  checkedMonityTemolate = SvseMonitorTemplateDao.getTemplateById(e.target.id);
	//	Session.set("checkedMonityTemolate",checkedMonityTemolate);//存储选中的监视器模板信息
	} 
}

Template.showMonitorInfo.getMonityTemplateParameters = function(){
	return SvseMonitorTemplateDao.getMonityTemplateParametersById(Session.get("monityTemplateId"));
}

Template.showMonitorInfo.getMonityTemplateAdvanceParameters = function(){
	return SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(Session.get("monityTemplateId"));
}

Template.monitorTemplateStatus.getMonityTemplateReturnItemsById = function(){
	return SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(Session.get("monityTemplateId"));
}

Template.showMonitorInfo.getMonityTemplateStates = function(){
	return SvseMonitorTemplateDao.getMonityTemplateStatesById(Session.get("monityTemplateId"));
}

Template.showMonitorInfo.getMonityTemplateStatesByStatus = function(status){
	return SvseMonitorTemplateDao.getMonityTemplateStatesByIdAndStatus(Session.get("monityTemplateId"),status);
}

Template.showMonitorInfo.devicename = function(){
	 return Session.get("checkedTreeNode").name;
}

Template.showMonitorInfo.events = {
	"click #addMonitor":function(){
		var monityTemplateParameter = ClientUtils.formArrayToObject($("#monityTemplateParameter").serializeArray());
	//	var monityTemplateStates = ClientUtils.formArrayToObject($("#monityTemplateStates").serializeArray());
		var monityTemplateAdvanceParameters = ClientUtils.formArrayToObject($("#monityTemplateAdvanceParameters").serializeArray());
		var monityCommonParameters = ClientUtils.formArrayToObject($("#monityTemplateCommonParameters").serializeArray());
		monityCommonParameters["sv_checkerr"] = monityCommonParameters["sv_checkerr"] || "false";
	//	var checkedMonityTemolateProperty = Session.get("checkedMonityTemolate")["property"];
		var checkedMonityTemolateProperty = SvseMonitorTemplateDao.getTemplateById(Session.get("monityTemplateId"))["property"];//模板属性
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
		error =  ClientUtils.statusFormToObj($("#errorsStatusForm").serializeArray());
		good =  ClientUtils.statusFormToObj($("#goodStatusForm").serializeArray());
		warning =  ClientUtils.statusFormToObj($("#warningStatusForm").serializeArray());
		var property = {
			sv_disable : false,
			sv_endtime : "",
			sv_monitortype : checkedMonityTemolateProperty.sv_id,
			sv_name : checkedMonityTemolateProperty.sv_name,
			sv_starttime : "",
			creat_timeb : new Date().format("yyyy-MM-dd hh:mm:ss")
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
		var monitorstatus = ($("#monitorstatus").val() === "true" || $("#monitorstatus").val() === true) ;//获取当前编辑状态 是添加还是修改。true为修改状态。在entitymonitoredit.js中初始化
		//获取父节点id
		var parentid = Session.get("checkedTreeNode")["id"];
		SystemLogger("获取到的结果是:");
		console.log(monitor);
		SystemLogger("正在刷新监视器....");
		if(!monitorstatus){ //如果是添加监视器
			SvseMonitorDao.addMonitor(monitor,parentid,function(err){
				if(err){
					SystemLogger(err,-1);
				}else{
					SystemLogger("刷新监视器完成....");
				}
				Session.set("viewstatus",MONITORVIEW.MONTIOTR);//设置视图状态
			});
		}else{//如果编辑监视器
			monitor["return"] = {id : Session.get("checkedMonitorId").id,return : true};
			console.log(monitor);
			SvseMonitorDao.editMonitor(monitor,parentid,function(err){
				if(err){
					SystemLogger(err,-1);
				}else{
					SystemLogger("刷新监视器完成....");
				}
				Session.set("viewstatus",MONITORVIEW.MONTIOTR);//设置视图状态
			});
		}
	},
	"click #errorsStatusDiv a.btn":function(){
		var inputs = $("#errorsStatusDiv > form:first").serializeArray();
		var sv_conditioncount = $("#errorsStatusForm > .sv_conditioncount:first");
		var count = sv_conditioncount.val();
		count = +count;
		count = count+1;
		sv_conditioncount.val(count);
		for(index in inputs){
			var input = ClientUtils.createInputHiddenDom(inputs[index].name+count,inputs[index].value);
			$("#errorsStatusForm").append(input);
		}
		var tr = ClientUtils.creatTrDom(inputs,{label:"value"});
		tr.attr("id","tr"+count);
		var td = $("<td></td>").append($("<input type='checkbox'>"));
		tr.prepend(td);
		$("#errorsStatusTable").prepend(tr);
	},
	"click #warningStatusDiv a.btn":function(){
		var inputs = $("#warningStatusDiv > form:first").serializeArray();
		var sv_conditioncount = $("#warningStatusForm > .sv_conditioncount:first");
		var count = sv_conditioncount.val();
		count = +count;
		count = count+1;
		sv_conditioncount.val(count);
		for(index in inputs){
			var input = ClientUtils.createInputHiddenDom(inputs[index].name+count,inputs[index].value);
			$("#warningStatusForm").append(input);
		}
		var tr = ClientUtils.creatTrDom(inputs,{label:"value"});
		tr.attr("id","tr"+count);
		var td = $("<td></td>").append($("<input type='checkbox'>"));
		tr.prepend(td);
		$("#warnigStatusTable").prepend(tr);
	},
	"click #goodStatusDiv a.btn":function(){
		var inputs = $("#goodStatusDiv > form:first").serializeArray();
		var sv_conditioncount = $("#goodStatusForm > .sv_conditioncount:first");
		var count = sv_conditioncount.val();
		count = +count;
		count = count+1;
		sv_conditioncount.val(count);
		for(index in inputs){
			var input = ClientUtils.createInputHiddenDom(inputs[index].name+count,inputs[index].value);
			$("#goodStatusForm").append(input);
		}
		var tr = ClientUtils.creatTrDom(inputs,{label:"value"});
		tr.attr("id","tr"+count);
		var td = $("<td></td>").append($("<input type='checkbox'>"));
		tr.prepend(td);
		$("#goodStatusTable").prepend(tr);
	}
}
Template.showMonitorInfo.rendered = function(){
	if(!this._rendered) {
			this._rendered = true;
	}
	$(function(){
		$("thead .span1 :checkbox").each(function(){//全选，全不选
			$(this).bind("click",function(){
				var flag = this.checked; 
				$(this).closest("table").find("tbody :checkbox").each(function(){
					this.checked = flag//$(this).attr("checked",flag);该写法有bug无法再界面上显示钩
				});
			});
		});
		//删除条件
		$("button[name='deleteConditionBtn']").each(function(){
			$(this).click(function(){
				$(this).parent("div[id]").find("tbody :checkbox").each(function(){
					if(this.checked){
						var tr = $(this).closest("tr");
					    var id = tr.attr("id").substr(2);
						tr.closest("div[id]").find("form[id]:first :hidden").each(function(){
							var name = $(this).attr("name");
							if(name.indexOf(id) == -1)return;
							var reg=eval("/"+id+"/");
							if(!$(this).attr("name").replace(reg,"").match(/\d+/g)){
								$(this).remove();
							}
						});
						tr.remove();
					}
				});
			});
		});
	});
}
Template.showMonitorInfo.getAllTaskNames = function(){
	return SvseTaskDao.getAllTaskNames();
}