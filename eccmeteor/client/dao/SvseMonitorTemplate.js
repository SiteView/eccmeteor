//监视器模板属性
SvseMonitorTemplateDao = function(){};

Object.defineProperty(SvseMonitorTemplateDao,"AGENT",{
	value:"svseMonitorTemplateDaoAgent"
});

Object.defineProperty(SvseMonitorTemplateDao,"getTemplateById",{
	value:function(id){//根据id获取模板
		return SvseMonitorTemplate.findOne({"return.id" : id});
	}
});

//编辑监视器时根据 监视器的id获取该监视器的模板类型
/**
	svid：监视器的id
*/
Object.defineProperty(SvseMonitorTemplateDao,"getMonitorTemplateIdBySvid",{
	value:function(svid){
		var monitor = SvseTree.findOne({sv_id:svid});
		if(!monitor){
			return false;
		}
		return monitor.sv_monitortype;
	}
});

//编辑监视器时根据 监视器模板id获取该监视器的模板类型名称
/**
	templateId:监视器模板id
*/
Object.defineProperty(SvseMonitorTemplateDao,"getMonitorTemplateNameByTemplateId",{
	value:function(templateId){
		var template = SvseMonitorTemplate.findOne({"return.id":templateId})
		if(!template){
			return false;
		}
		return template.property.sv_label;
	}
});


Object.defineProperty(SvseMonitorTemplateDao,"isEmpty",{
	value:function(){
		//如果当前数据为空，则缓存数据
		if(SvseMonitorTemplate.findOne() == null
			&& !Subscribe.isLoadSvseEntityTemplate()
			&& !Subscribe.isLoadSvseSvseMonitorTemplate()){
			Subscribe.loadSvseEntityTemplate();
			Subscribe.loadSvseSvseMonitorTemplate();
			return true;
		}
		return false;
	}
});

//异步
//通过设备类型获取模板类型
//获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
Object.defineProperty(SvseMonitorTemplateDao,"getEntityMonitorByDevicetypeAsync",{
	value:function(type,status,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getEntityMonitorByDevicetypeAsync",[type,status],function(error,result){
			if(error){
				console.log(error);
			}
			fn(result);
		});
	}
});

//同步
//通过设备类型获取模板类型
//获取设备的可以添加监视器 status控制是否为快速添加的监视器 true 快速添加，false为选择添加，默认为选择添加
Object.defineProperty(SvseMonitorTemplateDao,"getEntityMonitorByDevicetypeSync",{
	value:function(type,status){
		template = SvseEntityTemplet.findOne({"return.id":type});
		if(!template){
			Log4js.info("找不到设备"+type);
			return [];
		}
		var monityIds = !status ? (template["submonitor"] || []):(template["property"]["sv_quickadd"] ? template["property"]["sv_quickadd"].split("\,"):[]);
		if(monityIds.length === 0){
			Log4js.info("该设备"+type+"不存在监视器");
			return [];
		}
		var monities = SvseMonitorTemplate.find({"return.id":{$in:monityIds}}).fetch();
		return monities;
	}
});

//异步
//添加设备完成后的快速监视器添加 信息获取

Object.defineProperty(SvseMonitorTemplateDao,"getQuickAddMonitorsAsync",{
	value:function(entityDevicetype,addedEntityId,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getQuickAddMonitorsAsync",[entityDevicetype,addedEntityId],function(error,result){
			if(error){
				console.log(error);
				fn({status:false})
			}else{
				fn({status:true,context:result});
			}
		});
	}
});

//异步
//编辑监视器 信息获取
Object.defineProperty(SvseMonitorTemplateDao,"getEditMonitorInfoAsync",{
	value:function(monitorId,entityId,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getEditMonitorInfoAsync",[monitorId,entityId],function(error,result){
			if(error){
				console.log(error);
				fn({status:false})
			}else{
				fn({status:true,context:result});
			}
		});
	}
})


//异步
//编辑监视器 信息获取
Object.defineProperty(SvseMonitorTemplateDao,"getAddMonitorInfoAsync",{
	value:function(monitorTemplateId,entityId,fn){
		Meteor.call(SvseMonitorTemplateDao.AGENT,"getAddMonitorInfoAsync",[monitorTemplateId,entityId],function(error,result){
			if(error){
				console.log(error);
				fn({status:false})
			}else{
				fn({status:true,context:result});
			}
		});
	}
});