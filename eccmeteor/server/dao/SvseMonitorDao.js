SvseMonitorDaoOnServer = {
	addMonitor : function(monitor,parentid){
		var r_monitor = SvseMethodsOnServer.svSubmitMonitor(monitor,parentid);
		if(!r_monitor)throw new Meteor.Error(500,"SvseMonitorDaoOnServer.addMonitor");
		Log4js.info("添加监视器成功，监视器是：");
		Log4js.info(r_monitor);
		Log4js.info("刷新监视");
		var selfId = r_monitor["return"]["id"];
		Log4js.error("selfId is "+selfId+ "===== parentid is" + parentid);
		up_monitor = SvseMethodsOnServer.svRefreshMonitors(selfId,parentid,false);
		Log4js.info("刷新后的监视器是");
		r_monitor = up_monitor[selfId];
//		return up_monitor[selfId];
		var sv_id = r_monitor["sv_id"];
		SvseTree.insert(r_monitor,function(err,r_id){
			if(err){					
				var msg = "SvseMonitorDaoOnServer's addMonitor  SvseTree.insert faild";
				Log4js.error(msg);
				throw new Meteor.Error(500,msg);
			}
			//3 插入到父节点（更新父节点）
			var parentNode = Svse.findOne({sv_id:parentid});
			Log4js.error("找到的父节点是");
			Log4js.error(parentNode);
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
		if(!r_monitor) 
			throw new Meteor.Error(500,"SvseMonitorDaoOnServer.getMonitorInfoById get null");
		return r_monitor;
	},
	editMonitor : function(monitor,parentid){
		var r_monitor =  SvseMethodsOnServer.svSubmitMonitor(monitor);
		if(!r_monitor)
			throw new Meteor.Error(500,"SvseMonitorDaoOnServer.editMonitor");
	//	Log4js.error("添加监视器成功，监视器是：");
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
	deleteMonitor : function (monitorid,parentid) {
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
	addMultiMonitor : function(monitors,parentid){
		for(index in monitors){
			SvseMonitorDaoOnServer.addMonitor(monitors[index],parentid);
		}
	},
	deleteMultMonitors : function(monitorids,parentid){
		for(index in monitorids){
			SvseMonitorDaoOnServer.deleteMonitor(monitorids[index],parentid);
		}
	},
	getMonitorRuntimeRecords : function(monitorid,count){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecords(monitorid,count);
	},
	//根据时间段获取实时数据
	getMonitorRuntimeRecordsByTime : function(monitorid,startDate,endDate){
		return SvseMethodsOnServer.svGetMonitorRuntimeRecordsByTime(monitorid,startDate,endDate);
	}
}

