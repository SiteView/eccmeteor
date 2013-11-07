SvseTopNDao = {
	"AGENT":"SvseTopNDaoAgent",
	//根据id获取topN报告
	"getTopNresult" : function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},
	
	"getTopNresultlist" : function(){
		return SvseTopNresultlist.find().fetch()
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
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	
	"getTopNById":function(id){
	return SvseTopNresultlist.findOne({nIndex:id});
	},
	//根据name获取topN对象
	"getTopNByName":function(name){
		return SvseTopNresultlist.findOne({Name:name});
	},
	"getMonitorTemplates":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"getMonitorTemplates",[],fn);
	},

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
	/*"updateTopNStatus": function(ids,status,fn){
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
	},*/
	
	"updateTopNStatus" : function(ids,status,fn){
		Meteor.call(SvseTopNDao.AGENT,"updateTopNStatus",[ids,status],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				fn(result);
			}
		});
	},
	//刷新同步
	/*"sync":function(fn){
		Meteor.call(SvseTopNDao.AGENT,"sync",function(err,result){
			if(result && !result.status){
				fn(result);
			}
			else{
				fn({status:true});
			}
		});
	}*/
	"sync" : function(){
		Meteor.call(SvseTopNDao.AGENT,"sync");
	},
	//获取监视器模板名称 如：CPU ，ping等
	getTypeById:function(id){
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
			console.log("》》");
		}
		return parameters;
	},
	getMonityTemplateParametersById:function(id){
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
	}
}
/*Meteor.autosubscribe(function () {
   Meteor.subscribe("marklists",Session.get("selected_Typelist"));
}*/
