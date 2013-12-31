Template.AddMoniorFormModal.events({
	"submit form":function(){
		return false;
	},
	"click #monityTemplateFormsSavelBtn":function(e,t){
        var monitorTemplateId = t.find("input:hidden#monitorTemplateId").value;
        var monityTemplateParameter = ClientUtils.formArrayToObject($("#monityTemplateParameter").serializeArray());
        var monityTemplateAdvanceParameters = ClientUtils.formArrayToObject($("#monityTemplateAdvanceParameters").serializeArray());
        var monityCommonParameters = ClientUtils.formArrayToObject($("#monityTemplateCommonParameters").serializeArray());
        monityCommonParameters["sv_checkerr"] = monityCommonParameters["sv_checkerr"] || "false";
        var checkedMonityTemolateProperty = SvseMonitorTemplateDao.getTemplateById(monitorTemplateId)["property"];//模板属性
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
        monityParameter["_frequency1"] = monityParameter["_frequency"];
        var error =  ClientUtils.statusFormToObj($("#errorsStatusForm").serializeArray());
        var good =  ClientUtils.statusFormToObj($("#goodStatusForm").serializeArray());
        var warning =  ClientUtils.statusFormToObj($("#warningStatusForm").serializeArray());
        var property = {
                sv_disable : "",
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
        var parentid = SessionManage.getCheckedTreeNode("id");
        SystemLogger("获取到的结果是:");
        console.log(monitor);

        LoadingModal.loading();
        SvseMonitorDao.addMonitor(monitor,parentid,function(result){
            LoadingModal.loaded();
            if(result && !result.status){
                Message.error(result.msg);
            }
            else{
            }
            RenderTemplate.hideParents(t);
        });
	},
	"click #monityTemplateFormsCancelBtn":function(e,t){
		//$("#showMonitorInfoDiv").modal('hide');
		RenderTemplate.hideParents(t);
	},
	"click i.icon-trash":function(e){
		var i = $(e.currentTarget); //转Jquery对象
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
	},
	"click .modal-header button.close":function(e,t){
		RenderTemplate.hideParents(t);
	}
});

Template.AddMoniorFormModal.rendered = function(){
	
}

Template.monitorTemplateStatus.events({
	//添加报警条件
	"click button":function(e,t){ 
	//	console.log(t.find("button#monitorTemplateStatusAddConditions").id);
		//防止误操作
		if(e.currentTarget.id !== "monitorTemplateStatusAddConditions")
			return;
		var btn = $(e.currentTarget);
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