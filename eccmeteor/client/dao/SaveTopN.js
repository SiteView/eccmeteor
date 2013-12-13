SvseTopNDao = {
	"AGENT":"SvseTopNDaoAgent",
	//根据id获取topN报告
	"getTopNresult" : function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},
	
	"getTopNresultlist" : function(){
		//return SvseTopNresultlist.find({nIndex:{$exists:true}}).fetch();
		return SvseTopNresultlist.find().fetch();
	},
	
	"addTopN":function(addressname,address,fn){
		Meteor.call(SvseTopNDao.AGENT,'addTopN',[addressname,address],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				if(result && !result[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	//批量删除
	"deleteTopNByIds":function(ids,fn){
		Meteor.call(SvseTopNDao.AGENT,"deleteTopNByIds",[ids],function(err,result){
			if(err == ""){
				SystemLogger(err);
				 Message.info("检查删除操作时是否勾选对象");
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	
	"getTopNById":function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},
	//根据title获取topN对象
	"getTopNByName":function(title){
		return SvseTopNresultlist.findOne({Title:title});
	},
	
	/*"getMonitorTemplate":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"getMonitorTemplate",[],fn);
	},*/
	
	
	/*//根据报告标题与之前查看对比是否重复。
    "getTitle":function(title){
     return SvseTopNresultlist.findOne({Title:title});
    },
	//根据监视器id 获取该监视器相应的模板id
	getMonitorTemplateIdByMonitorId : function(id){
		return SvseTree.findOne({sv_id:id}).sv_monitortype;
	},*/
	"updateTopN":function(addressname,address,fn){
                Meteor.call(SvseTopNDao.AGENT,'updateTopN',[addressname,address],function(err,result){
                        if(err){
                                 SystemLogger(err);
                                 fn({status:false,msg:err})
                         }else{
                                 if(result && !result[status]){
                                         SystemLogger(err);
                                         fn(result);
                                 }else{
                                         fn({status:true})
                                }
                        }
                });
        },
	//批量更新topN报告状态
	"updateTopNStatus": function(ids,status,fn){
		SystemLogger(typeof fn);
		Meteor.call(SvseTopNDao.AGENT,"updateTopNStatus",[ids,status],function(err,result){
			if(err){
				fn({status:false,msg:err});
			}else{
				if(result && !result.status){
					fn(result)
				}else{
					fn({status:true,option:{count:ids.length}});
				}
			}
		});
	},
/*	"generatereport":function(ids,status,fn){
		Meteor.call(SvseTopNDao.AGENT,'generatereport',[ids,status],function(err,result){
			if(err){
	 			SystemLogger(err);
	 			fn({status:false,msg:err})
	 		}else{
	 			if(result && !result[status]){
	 				SystemLogger(err);
	 				fn(result);
	 			}else{
	 				fn({status:true})
				}
			}
		});
	},*/
	//检查操作时是否勾选对象
   "checkTopNresultlistSelect":function(getTopNresultlistSelectAll){
     if(getTopNresultlistSelectAll == ""){
       Message.info("检查操作时是否勾选对象");
       return;
     }
    },
	//刷新同步
	"sync":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	},
	//获取监视器模板名称 如：CPU ，ping等
	getTemplateTypeById:function(id){
		return SvseMonitorTemplate.findOne({"return.id" : id}).property.sv_label;
	},
	getMonityTemplateParameters:function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var parameters = [];
		for(item in template){
			if(item.indexOf("ParameterItem") == -1 || item.indexOf("AdvanceParameterItem") != -1) continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				parameters.push(temp);
				continue;
			}
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1) continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			parameters.push(temp);
		}
		return parameters;
	},
	
	
	
	/*getTypeById:function(id){
		return SvseTopN.findOne({"return.id" : id}).property.sv_label;
	},
	getTopNParameters:function(id){//根据id获取监视器类型
		var template = SvseTopN.findOne({"return.id" : id});
		var parameters = [];
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				parameters.push(temp);
				continue;
			}
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1) continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			parameters.push(temp);
			console.log("》11/》");
		}
		return parameters;
	},*/
	
	
	/*getMonityTemplateParametersById:function(id){
		var parameters = SvseTopNDao.getMonityTemplateParameters(id);
		var newparameters = [];
		for(index in parameters){
			if(!!parameters[index].sv_name.match(/^(_frequency|_frequencyUnit)$/)){
				continue;
			}
			newparameters.push(parameters[index]);
		}
		return newparameters;
		},
		
		
	getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds,fn){
		Meteor.call(
			SvseMonitorTemplateDao.AGENT,
			"getMonityDynamicPropertyDataArray",
			[entityId,templateMonitoryTemlpateIds],
			function(err,result){
				if(err){
					SystemLogger(err);
					fn(false,err);
				}else{
					fn(true,result);
				}
			}
		)
	},
	
	getMonityTemplateStatesById : function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var states = [];
		states.push(template["error"]);
		states.push(template["warning"]);
		states.push(template["good"]);
		return states;
	},
	
	getMonityTemplateStatesByIdAndStatus : function (id,status){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		return template[status]||{};
	},
	
	getMonityTemplateAdvanceParametersById : function(id){//根据id获取监视器模板参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var advanceParameters = [];
		for(item in template){
			if(item.indexOf("AdvanceParameterItem") == -1) continue;
			var temp = template[item];
			temp["sv_allownull"] = (temp["sv_allownull"] === 'false' ? false:true);
			if(temp["sv_type"] !== "combobox"){//非下拉列表类型
				advanceParameters.push(temp);
				continue;
			}
			//组合下拉列表	
			var selects = []; 
			for(label in temp){
				if(label.indexOf("sv_itemlabel") === -1) continue;
				var select = {};
				var sub = "sv_itemvalue"+label.substr(-1);
				select.key = temp[label];
				select.value = temp[sub];
				selects.push(select);
			}
			temp["selects"] = selects;
			advanceParameters.push(temp);
		}
		return advanceParameters;
	},
	
	
	getMonityTemplateReturnItemsById:function(id){//根据id获取返回参数
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		var returnItems = [];
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			returnItems.push(template[item]);
		}
		//SystemLogger(returnItems);
		return returnItems;
	},
	
	
	getMonityTemplateReturnItemLabelByIdAndName:function(id,name){
		var template = SvseMonitorTemplate.findOne({"return.id" : id});
		for(item in template){
			if(item.indexOf("ReturnItem") == -1) continue;
			if(template[item]["sv_name"] === name)
				return template[item]["sv_label"];
		}
	},
	
	
	getMonityDynamicPropertyData:function(panrentid,templateMonitoryId,fn){
		console.log("getMonityDynamicPropertyData templateMonitoryId is:"+templateMonitoryId);
		Meteor.call(
			SvseMonitorTemplateDao.AGENT,
			"getMonityDynamicPropertyData",
			[panrentid,templateMonitoryId],
			function(err,result){
				if(err){
					SystemLogger(err);
					fn(false,err)
				}else{
					fn(true,result);
				}
			}
		);
	},
	
	getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds,fn){
		Meteor.call(
			SvseTDao.AGENT,
			"getMonityDynamicPropertyDataArray",
			[entityId,templateMonitoryTemlpateIds],
			function(err,result){
				if(err){
					SystemLogger(err);
					fn(false,err);
				}else{
					fn(true,result);
				}
			}
		)
}*/
}
/*Meteor.autosubscribe(function () {
   Meteor.subscribe("marklists",Session.get("selected_Typelist"));
}*/
