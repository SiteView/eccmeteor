Template.showMonitorEditInfo.rendered = function(){		if(!this._rendered) {			this._rendered = true;		}		var monitorstatus = $("<input type='hidden' value=true id='monitorstatus'>");		$("#errorsStatusDiv").append(monitorstatus);				SvseMonitorDao.getMonitor(Session.get("checkedMonitorId")["id"],function(err,monitor){			if(err){				SystemLogger(err,-1);				return;			}			console.log(monitor);			var advance_parameter = monitor["advance_parameter"];			var parameter = monitor["parameter"];			var error = monitor["error"];			var good = monitor["good"];			var warning = monitor["warning"];//定义一个checkbox。			var td = $("<td></td>");			td.append($("<input type='checkbox'/>"));			//更新高级选项			for(name in advance_parameter){				$("#monityTemplateAdvanceParameters > table tr").not(":first").find("input[name='"+name+"']").val(advance_parameter[name]);			}			//更新基本参数			$("#monityTemplateParameter").find(":input")				.each(function(){					$(this).val(parameter[$(this).attr("name")]);				});			//更新通用参数			$("#monityTemplateCommonParameters").find(":input")				.each(function(){					if($(this).attr("type") === "checkbox"){						$(this).attr("checked",(parameter[$(this).attr("name")] === true || parameter[$(this).attr("name")] === "true"))					}else{						$(this).val(parameter[$(this).attr("name")]);					}					});			//更新错误参数及表格数据			$("#errorsStatusForm").find(":input").remove();			var errorparameter = [];			for(pn in error){				var input = $("<input type='hidden'>"); //处理隐藏表单				input.attr("name",pn);				input.val(error[pn]);				if(pn === "sv_conditioncount"){					input.attr("class",pn);				}				$("#errorsStatusForm").append(input);				if(pn.indexOf("sv_paramname") === -1){ //处理表格展示					continue;				}				var index = pn.substr(12);				var obj = {};				obj[pn] = error[pn];				obj["sv_operate"+index] =  error["sv_operate"+index];				obj["sv_paramvalue"+index] =  error["sv_paramvalue"+index];				obj["sv_relation"+index] = error["sv_relation"+index];				errorparameter.push(obj);			}			var drawTable = new DrawTable();			drawTable.drawTableWithCheckBox(errorparameter,"#errorsStatusTable");			$("#errorsStatusTable tr").each(function(){				$(this).prepend(td.clone());			});						//更新正常参数			$("#goodStatusForm").find(":input").remove();			var goodparameter = [];			for(pn in good){				var input = $("<input type='hidden'>");				input.attr("name",pn);				input.val(good[pn]);				if(pn === "sv_conditioncount")					input.attr("class",pn);				$("#goodStatusForm").append(input);				if(pn.indexOf("sv_paramname") === -1){ //处理表格展示					continue;				}				var index = pn.substr(12);				var obj = {};				obj[pn] = good[pn];				obj["sv_operate"+index] =  good["sv_operate"+index];				obj["sv_paramvalue"+index] =  good["sv_paramvalue"+index];				obj["sv_relation"+index] = good["sv_relation"+index] 				goodparameter.push(obj);			}			drawTable.drawTable(goodparameter,"#goodStatusTable");			$("#goodStatusTable tr").each(function(){				$(this).prepend(td.clone());			});			//更新危险参数			$("#warningStatusForm").find(":input").remove();			var warningparameter = [];			for(pn in warning){				var input = $("<input type='hidden'>");				input.attr("name",pn);				input.val(warning[pn]);				if(pn === "sv_conditioncount")					input.attr("class",pn);				$("#warningStatusForm").append(input);				if(pn.indexOf("sv_paramname") === -1){ //处理表格展示					continue;				}				var index = pn.substr(12);				var obj = {};				obj[pn] = warning[pn];				obj["sv_operate"+index] =  warning["sv_operate"+index];				obj["sv_paramvalue"+index] =  warning["sv_paramvalue"+index];				obj["sv_relation"+index] = warning["sv_relation"+index] 				warningparameter.push(obj);			}			drawTable.drawTable(warningparameter,"#warnigStatusTable");			$("#warnigStatusTable tr").each(function(){				$(this).prepend(td.clone());			});		});}