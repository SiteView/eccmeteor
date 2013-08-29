SvseMonitorDao = {
	AGENT:"svseMonitorDaoAgent",
	addMonitor:function(monitor,parentid,fn){ //添加监视器
		Meteor.call(SvseMonitorDao.AGENT,"addMonitor",[monitor,parentid],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	getMonitor : function(id,fn){
		Utils.checkReCallFunction(fn);
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorInfoById",[id],function(err,result){
			if(err){
				fn(err)
				return;
			}
			fn(undefined,result);
		});
	},
	editMonitor : function(monitor,parentid,fn){
		Utils.checkReCallFunction(fn);
		Meteor.call(SvseMonitorDao.AGENT,'editMonitor',[monitor,parentid],function(err,result){
			if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					SystemLogger(err);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		
		});
	},
	addMultiMonitor : function(monitors,parentid,fn){
		for(index in monitors){
			Meteor.call(SvseMonitorDao.AGENT,"addMultiMonitor",[monitors,parentid],function(err,result){
				if(err){
				SystemLogger(err);
				fn({status:false,msg:err})
				}else{
					if(result && !reult[status]){ // 无权限
						SystemLogger(err);
						fn(result);
					}else{
						fn({status:true})
					}
				}
			});
		}
	},
	getMonitorForeignKeys: function(tree_id){
		var monitor = SvseTree.findOne({sv_id:tree_id});//找到该监视器所依赖的监视器模板
		if(!monitor) return; //如果该监视器不存在，不划线
		var monitorTypeId = monitor.sv_monitortype+""; //获取监视器模板ID
		//获取监视器模板	
		var monitorTemplate = SvseMonitorTemplate.findOne({"return.id" : monitorTypeId})
		//遍历 模板对象，找到 画图数据的主键
		var monitorPrimary = "";
		var monitorDescript = "";
		var monitorForeignKeys = []; //定义 数据主副键的数组，用来求最大、平均等
		for (property in monitorTemplate) {
			if (property.indexOf("ReturnItem") != -1) { //主键包含在ReturnItem1，ReturnItem2,..等属性中
				var template = monitorTemplate[property];
				if (template["sv_primary"] === "1" && template["sv_drawimage"] == "1") {  //判断是否为主键和是否可以画图
					monitorPrimary = template["sv_name"];
					monitorDescript = template["sv_label"];
		//			SystemLogger("画图属性为"+property+"画图主键为  "+monitorPrimary + "画图说明"+monitorDescript);
					monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
				}else{
					monitorForeignKeys.push({name:template["sv_name"],label:template["sv_label"]});
				}
			}
		}
		//如果没有找到画图主键，或者不能画图 ，返回。
		return monitorForeignKeys.length ? {monitorForeignKeys:monitorForeignKeys,monitorPrimary:monitorPrimary,monitorDescript:monitorDescript}: undefined ;
	},
	deleteMonitor : function(monitorid,parentid,fn){
		fn = Utils.checkReCallFunction(fn);
		Meteor.call(SvseMonitorDao.AGENT,"deleteMonitor",[monitorid,parentid],function (err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	deleteMultMonitors : function(monitorIds,parentid,fn){
		Meteor.call(SvseMonitorDao.AGENT,"deleteMultMonitors",[monitorIds,parentid],function (err,result){
			if(err){
				console.log(err);
				fn({status:false,msg:err})
			}else{
				if(result && !reult[status]){ // 无权限
					console.log(result.msg);
					fn(result);
				}else{
					fn({status:true})
				}
			}
		});
	},
	//根据监视器id 获取该监视器相应的模板id
	getMonitorTemplateIdByMonitorId : function(id){
		return SvseTree.findOne({sv_id:id}).sv_monitortype;
	},
	//获取监视器的实时数据
	getMonitorRuntimeRecords : function(id,count,fn){
		if(SvseTree.findOne({sv_id:id}).status !== "ok"){
			fn({status:false,msg:"监视器非正常状态,无法获取相关数据"});
			return;
		}
		Meteor.call(SvseMonitorDao.AGENT,"getMonitorRuntimeRecords",[id,count],function (err,result){
			if(err){
				fn({status:false,msg:err})
				return;
			}
			fn({status:true,content:result});
		});
	}
}
