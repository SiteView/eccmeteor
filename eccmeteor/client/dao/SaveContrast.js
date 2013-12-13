SvseContrastDao = {

// 检查操作时是否勾选对象
   "checkContrastresultlistSelect":function(getContrastListSelectAll){
     if(getContrastListSelectAll == ""){
       Message.info("检查操作时是否勾选对象");
       return;
     }
    },
	getMonitorForeignKeys: function(tree_id){
		var monitor = SvseTree.findOne({sv_id:tree_id});//找到该监视器所依赖的监视器模板
		if(!monitor) return; //如果该监视器不存在，不划线
		var monitorTypeId = monitor.sv_monitortype+""; //获取监视器模板ID
		// 获取监视器模板	
		var monitorTemplate = SvseMonitorTemplate.findOne({"return.id" : monitorTypeId})
		// 遍历 模板对象，找到 画图数据的主键
		var monitorPrimary = "";
		var monitorDescript = "";
		var monitorForeignKeys = []; //定义 数据主副键的数组，用来求最大、平均等
		for (property in monitorTemplate) {
			if (property.indexOf("ReturnItem") != -1) { //主键包含在ReturnItem1，ReturnItem2,..等属性中
				var template = monitorTemplate[property];
				if (template["sv_primary"] === "1" && template["sv_drawimage"] == "1") {  //判断是否为主键和是否可以画图
					monitorPrimary = template["sv_name"];
					monitorDescript = template["sv_label"];
					// SystemLogger("画图属性为"+property+"画图主键为  "+monitorPrimary + "画图说明"+monitorDescript);
					monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
				}else{
					monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
				}
			}
		}
		// 如果没有找到画图主键，或者不能画图 ，返回。
		return monitorForeignKeys.length ? {monitorForeignKeys:monitorForeignKeys,monitorPrimary:monitorPrimary,monitorDescript:monitorDescript}: undefined ;
	},
	getSvseEntityDevicetypeBySvseTreeId:function(id){
	//根据设备在SvseTree的id获取该设备的类型
		var node = SvseTree.findOne({sv_id:id});
		return node ? node.sv_devicetype : "";
	},
	// 根据监视器id 获取该监视器相应的模板id
	getMonitorTemplateIdByMonitorId : function(id){
	    var node = SvseTree.findOne({sv_id:id});
		return node ? node.sv_monitortype : "";
		//return SvseTree.findOne({sv_id:id}).sv_monitortype;
	},
	// 获取监视器的实时数据
	/*getMonitorRuntimeRecords : function(id,count,fn){
		/*
		if(SvseTree.findOne({sv_id:id}).status !== "ok"){
			fn({status:false,msg:"监视器非正常状态,无法获取相关数据"});
			return;
		}*/
		/*Meteor.call(SvseMonitorDao.AGENT,"getMonitorRuntimeRecords",[id,count],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
		});
	},*/
	// 根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(id,beginDate,endDate,fn){
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorRuntimeRecordsByTime",[id,beginDate,endDate],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
		});
	},
	// 查询数据库监测记录
	// getQueryRecordsByTime : function(id,beginDate,endDate,fn){
		// Meteor.call(SvseMonitorDao.AGENT,"getQueryRecordsByTime",[id,beginDate,endDate],function (err,result){
			// if(err){
				// fn({status:false,msg:err})
				// return;
			// }
			// fn({status:true,content:result});
		// });
	// },
	// getMonityDynamicPropertyDataArray:function(entityId,templateMonitoryTemlpateIds,fn){
		// Meteor.call(
			// SvseMonitorTemplateDao.AGENT,
			// "getMonityDynamicPropertyDataArray",
			// [entityId,templateMonitoryTemlpateIds],
			// function(err,result){
				// if(err){
					// SystemLogger(err);
					// fn(false,err);
				// }else{
					// fn(true,result);
				// }
			// }
		// )
	// },
	// "getContrastDetailData":function(id,type,fn){
		// Meteor.call(SvseContrastDao.AGENT,'getContrastDetailData',[id,type],function(err,result){
			// if(err){
				// SystemLogger(err);
				// fn({status:false,msg:err})
			// }else{
				// if(result && !result[status]){ // 无权限
					// SystemLogger(err);
					// fn(result);
				// }else{
					// fn({status:true})
				// }
			// }
		// });
	// }	


}
// 编辑监视器时根据 监视器的id获取该监视器的模板类型
/**
	svid：监视器的id
*/
/*Object.defineProperty(SvseContrastDao,"getMonitorTemplateIdBySvid",{
	value:function(svid){
		var monitor = SvseTree.findOne({sv_id:svid});
		if(!monitor){
			return false;
		}
		return monitor.sv_monitortype;
	}
});

// 编辑监视器时根据 监视器的id获取该监视器的模板类型名称
/**
	templateId:监视器模板id
*/
/*Object.defineProperty(SvseContrastDao,"getMonitorTemplateNameByTemplateId",{
	value:function(templateId){
		var template = SvseMonitor.findOne({"return.id":templateId})
		if(!template){
			return false;
		}
		return template.property.sv_label;
	}
});*/

