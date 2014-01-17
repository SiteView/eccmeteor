SvseTopNDao = {
	"AGENT":"SvseTopNDaoAgent",
	//根据id获取topN报告
	"getTopNById":function(id){
		return SvseTopNresultlist.findOne({nIndex:id});
	},
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
	//根据title获取topN对象
	"getTopNByName":function(title){
		return SvseTopNresultlist.findOne({Title:title});
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
}

	//isEmpty  判断topN列表当前数据为空
Object.defineProperty(SvseTopNDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseTopNresultlist.findOne() == null && !Subscribe.isLoadSvseTopNresultlist()){
			Subscribe.loadSvseTopNresultlist();
			return true;
		}
		return false;
	}
});

//同步获取topN列表
Object.defineProperty(SvseTopNDao,"getTopNresultlistSync",{
	value:function(){
		return SvseTopNresultlist.find().fetch();
	}
});

//异步获取topN列表
Object.defineProperty(SvseTopNDao,"getTopNresultlistAsync",{
	value:function(fn){
		Meteor.call(SvseTopNDao.AGENT,"getTopNresultlistAsync",function(error,result){
			if(error){
				Log4js.info(error);
			}else{
				fn(result);
			}
		})
	}
});