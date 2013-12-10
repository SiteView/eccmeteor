SvseMonitorDaoOnServer = {
	addMonitor : function(parentid,monitor){
		var r_monitor = SvseMethodsOnServer.svSubmitMonitor(monitor,parentid);
		if(!r_monitor)
			throw new Meteor.Error(500,"SvseMonitorDaoOnServer.addMonitor");
		var selfId = r_monitor["return"]["id"];
		up_monitor = SvseMethodsOnServer.svRefreshMonitors(selfId,parentid,false);
		r_monitor = up_monitor[selfId];
		var sv_id = r_monitor["sv_id"];
		SvseTree.insert(r_monitor,function(err,r_id){
			if(err){					
				var msg = "SvseMonitorDaoOnServer's addMonitor  SvseTree.insert faild";
				Log4js.error(msg);
				throw new Meteor.Error(500,msg);
			}
			//3 插入到父节点（更新父节点）
			var parentNode = Svse.findOne({sv_id:parentid});
			Svse.update(parentNode._id,{$push:{submonitor:sv_id}},function(err){
				if(err){					
					var msg = "SvseMonitorDaoOnServer's addMonitor  Svse.update faild";
					Log4js.error(msg);
					throw new Meteor.Error(500,msg);
				}
			});
		});
	},
	getMonitorInfoById:function(id){
		var r_monitor = SvseMethodsOnServer.svGetMonitor(id);
		Log4js.info("编辑监视器获取的原始数据:");
		Log4js.info(r_monitor);
		if(!r_monitor) 
			throw new Meteor.Error(500,"SvseMonitorDaoOnServer.getMonitorInfoById get null");
		return r_monitor;
	},
	editMonitor : function(parentid,monitor){
		var r_monitor =  SvseMethodsOnServer.svSubmitMonitor(monitor,parentid);
		if(!r_monitor)
			throw new Meteor.Error(500,"SvseMonitorDaoOnServer.editMonitor");
	//	Log4js.info("编辑监视器成功，监视器是：");
	//	Log4js.info(r_monitor);
	//	Log4js.info("刷新监视");
		var selfId = r_monitor["return"]["id"];
	//	Log4js.error("selfId is "+selfId+ "===== parentid is" + parentid);
		up_monitor = SvseMethodsOnServer.svRefreshMonitors(selfId,parentid,false);
	//	Log4js.info("刷新后的监视器是");
	//	Log4js.info(up_monitor[selfId])
	//	return up_monitor[selfId];
	//	var self_monitor  = up_monitor[selfId];
		var upId =  up_monitor[selfId].sv_id;
		var	oldNode = SvseTree.findOne({sv_id:upId});
		SvseTree.update(oldNode._id,{$set:{status:oldNode.status}},function(err){
			if(err){
				Log4js.error("更新SvseTree错误是：");
				Log4js.error(err);
				throw new Meteor.Error(500,"SvseMonitorDaoOnServer.getMonitorInfoById get null");
			}
		});
	},
	deleteMonitor : function (parentid,monitorid) {
		var fmap = SvseMethodsOnServer.svDeleteMonitor(monitorid);
		if(!fmap) throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor has error");
		SvseTree.remove({sv_id:monitorid},function(err){
			if(err){
				Log4js.error(err);
				throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor SvseTree.remove has error");
			} 
			Svse.update({sv_id:parentid},{$pull:{submonitor:monitorid}},function (err){
				if(err) {
					Log4js.error(err);
					throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor Svse.update has error");
				}
			});
		});
	},
	addMultiMonitor : function(parentid,monitors){
		for(index in monitors){
			SvseMonitorDaoOnServer.addMonitor(parentid,monitors[index]);
		}
	},
	deleteMultMonitors : function(parentid,monitorids){
		/*
		for(index in monitorids){
			SvseMonitorDaoOnServer.deleteMonitor(monitorids[index],parentid);
		}*/
		var id = monitorids.join("\,");
		var fmap = SvseMethodsOnServer.svDeleteMonitor(monitorid);
		if(!fmap) throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor has error");
		SvseTree.remove({sv_id:{$in:monitorids}});
		Svse.update({sv_id:parentid},{
			$pull:{
					submonitor:{
						$in:monitorids
					}
				}
			},function (err){
				if(err) {
					Log4js.error(err);
					throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor Svse.update has error");
				}
			});
	},
	getMonitorRuntimeRecords : function(monitorid,count){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	},
	//根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(monitorid,startDate,endDate){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecordsByTime(monitorid,startDate,endDate);
	}
}
/*获取监视器的报告数据*/
Object.defineProperty(SvseMonitorDaoOnServer,"getMonitorReportData",{
	value:function(monitorId,beginDate,endDate){
		return SvseMethodsOnServer.svGetReportData(monitorId,beginDate,endDate);
	}
})

