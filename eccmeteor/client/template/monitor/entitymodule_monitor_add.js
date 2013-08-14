Template.ChooseMonitorTemplate.monities = function(){
	var id = Session.get("checkedTreeNode")["id"];
	var devicetype = SvseEntityTemplateDao.getSvseEntityDevicetypeBySvseTreeId(id);
	return SvseEntityTemplateDao.getEntityMontityByDevicetype(devicetype);
}
Template.ChooseMonitorTemplate.events = {
	"click tr a":function(e){
	//	SwithcView.view(MONITORVIEW.MONITORADD);//设置视图状态 选择监视器模板的视图
		Session.set("monityTemplateId",e.target.id);
	//	var  checkedMonityTemolate = SvseMonitorTemplateDao.getTemplateById(e.target.id);
	//	Session.set("checkedMonityTemolate",checkedMonityTemolate);//存储选中的监视器模板信息
		$("#chooseMonitorTemplateDiv").modal('hide');
		$("#showMonitorInfoDiv").modal('show');
	} 
}

Template.showMonitorInfo.getMonityTemplateParameters = function(){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getMonityTemplateParametersById(Session.get("monityTemplateId"))
			: {}
}

Template.showMonitorInfo.getMonityTemplateAdvanceParameters = function(){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(Session.get("monityTemplateId"))
			: {}
//	return SvseMonitorTemplateDao.getMonityTemplateAdvanceParametersById(Session.get("monityTemplateId"));
}

Template.monitorTemplateStatus.getMonityTemplateReturnItemsById = function(){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(Session.get("monityTemplateId"))
			: {}
//	return SvseMonitorTemplateDao.getMonityTemplateReturnItemsById(Session.get("monityTemplateId"));
}

Template.showMonitorInfo.getMonityTemplateStates = function(){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getMonityTemplateStatesById(Session.get("monityTemplateId"))
			: {}
//	return SvseMonitorTemplateDao.getMonityTemplateStatesById(Session.get("monityTemplateId"));
}

Template.showMonitorInfo.getMonityTemplateStatesByStatus = function(status){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getMonityTemplateStatesByIdAndStatus(Session.get("monityTemplateId"),status)
			: {}
//	return SvseMonitorTemplateDao.getMonityTemplateStatesByIdAndStatus(Session.get("monityTemplateId"),status);
}

Template.showMonitorInfo.devicename = function(){
	 return Session.get("checkedTreeNode").name;
}

Template.showMonitorInfo.events({
	"submit form":function(){
		return false;
	},
	"click #monityTemplateFormsSavelBtn":function(){
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
			SvseMonitorDao.addMonitor(monitor,parentid,function(result){
				if(result && !result.status){
					SystemLogger(result.msg,-1);
				}
				else{
					SystemLogger("刷新监视器完成....");
				}
				Session.set("viewstatus",MONITORVIEW.MONTIOTR);//设置视图状态
			});
		}else{//如果编辑监视器
			monitor["return"] = {id : Session.get("checkedMonitorId").id,return : true};
			console.log(monitor);
			SvseMonitorDao.editMonitor(monitor,parentid,function(result){
				if(!result.status){
					SystemLogger(result.msg,-1);
				}else{
					SystemLogger("刷新监视器完成....");
				}
				Session.set("viewstatus",MONITORVIEW.MONTIOTR);//设置视图状态
			});
		}
	},
	"click #monityTemplateFormsCancelBtn":function(){
		$("#showMonitorInfoDiv").modal('hide');
	},
	"click i.icon-trash":function(e){
		var i = $(e.target); //转Jquery对象
		if(i.parents("table").find("tr").length === 1){
			console.log("none tr");
			return;
		}
		i.closest("table").children("tbody:first").find(":checkbox").each(function(){
			if(!this.checked)
				return;
			var tr = $(this).closest("tr");
			var id = tr.attr("id").substr(2);
			tr.closest("div[id]").find("form[id]:first :hidden").each(function(){
				var name = $(this).attr("name");
				if(name.indexOf(id) == -1)
					return;
				var reg=eval("/"+id+"/");
				if(!$(this).attr("name").replace(reg,"").match(/\d+/g))
					$(this).remove();
			});
			tr.remove();
		});
		i.parent().children(":checkbox")[0].checked = false;

		//div 内容更新
		var condition = "";
		i.parents("table").find("tr").each(function(j){
			var oneCon = "[ "
			$(this).children("td").each(function(i){
				if(i == 0) return;
				if(i == 4){
					oneCon = oneCon + " ] "+ $(this).text();
					return ;
				}
				oneCon = oneCon + " " +$(this).text();
			});
			condition = condition + " " +oneCon;
		});
		condition = condition.replace(/^ \[ $/,"无条件限制")
								.replace(/\[  \[/g,"\[")
								.replace(/(or|and)$/,"")
								.replace(/\b(or|and)\b/g,function($0){return {or:"或",de:"与"}[$0]});
		i.parents(".accordion-group")
			.find(".MonitorStatusConditionsDiv")
			.text(condition);
		//condition.replace(/\[  \[/g,"\[").replace(/(or|and)$/,"").replace(/^ \[ $/,"无条件限制")
	},
	"click button.statusmodaldiv":function(e){
	//	$(e.target).parent().parent(".row-fluid").siblings(".modal").modal('show');
		//console.log(div);
	}
});

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
		//在HelperRegister.js中createDomeByPropertyHelper 创建监视器属性时，可能出现dll类型属性，此时需要重新处理该属性对应的Dom元素
		if($("select.dll:first").length){
			(function(){		
				var panrentid = Session.get("checkedTreeNode")["id"];
				var monitorstatus = ($("#monitorstatus").val() === "true" || $("#monitorstatus").val() === true) ;
				if(monitorstatus){ //编辑状态
					var monitorid = Session.get("checkedMonitorId")["id"];
					var templateMonitoryId = SvseTreeDao.getMonitorTypeById(monitorid); //获取需编辑监视器的模板id
				}else{
					templateMonitoryId = Session.get("monityTemplateId");
				}			
				console.log(panrentid+" : "+templateMonitoryId);
				//获取某个监视器的动态属性
				SvseMonitorTemplateDao.getMonityDynamicPropertyData(panrentid,templateMonitoryId,function(status,result){
					if(!status){
						SystemLogger(result,-1);
						return;
					}
					var optionObj = result["DynamicData"];
					for(name in optionObj){
						var option = $("<option value='"+optionObj[name]+"'>"+name+"</option>");
						$("select.dll:first").append(option);
					}
				});
			})();
		}
	});
	//初始化弹窗
	$(function(){
		$('#showMonitorInfoDiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -(($(this).width() / 2)+ 50);
			},
		});
	});
}
Template.showMonitorInfo.getAllTaskNames = function(){
	return SvseTaskDao.getAllTaskNames();
}

Template.monitorTemplateStatus.events({
	//添加报警条件
	"click button":function(e){ 
		//防止误操作
		if(e.target.id !== "monitorTemplateStatusAddConditions")
			return;
		var btn = $(e.target);
		var form = btn.parent("form");//当前用户输入的表单
		var div =  form.parent("div");//直接父类
		var tbody = div.children("table").children("tbody");
		var hiddenform = div.children("form:eq(1)");
		var inputs = form.serializeArray();
		//对隐藏字段的表格进行操作
		var sv_conditioncount = hiddenform.children(".sv_conditioncount:first");
		var count = sv_conditioncount.val();
		count = +count;
		count = count+1;
		sv_conditioncount.val(count);
		for(index in inputs){
			var input = ClientUtils.createInputHiddenDom(inputs[index].name+count,inputs[index].value);
			hiddenform.append(input);
		}
		//对条件表格的操作
		var tdShowLabel = form.children("select[name='sv_paramname']").children("option[selected]").text();
		var tr = ClientUtils.creatTrDom(inputs,{label:"value"});
		tr.attr("id","tr"+count);
		var td = $("<td></td>").append($("<input type='checkbox'>"));
		tr.prepend(td);
		tr.children("td:eq(1)").html(tdShowLabel);
		tbody.prepend(tr);
		

		//对象显示内容的div的操作
		var ConditionsDiv = div.parents(".accordion-group").find(".MonitorStatusConditionsDiv");
		var condition = "";
		//此处可能出现bug，造成原因each的回调函数 造成 条件拼接不完整
		tbody.children("tr").each(function(j){
			var oneCon = "[ "
			$(this).children("td").each(function(i){
				if(i == 0) return;
				if(i == 4){
					oneCon = oneCon + " ] "+ $(this).text();
					return ;
				}
				oneCon = oneCon + " " +$(this).text();
			});
			condition = condition + " " +oneCon;
		});
		condition = condition.replace(/(or|and)$/,"")
								.replace(/\b(or|and)\b/g,function($0){return {or:"或",and:"与"}[$0]});
		ConditionsDiv.text(condition);
	}
});