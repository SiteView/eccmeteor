SvseMonitorDaoOnServer = {
	addMonitor : function(monitor,parentid){
		var r_monitor = SvseMethodsOnServer.svSubmitMonitor(monitor,parentid);
		if(!r_monitor)throw new Meteor.Error(500,"SvseMonitorDaoOnServer.addMonitor");
		SystemLogger("添加监视器成功，监视器是：");
		console.log(r_monitor);
		console.log("刷新监视");
		var selfId = r_monitor["return"]["id"];
		SystemLogger("selfId is "+selfId+ "===== parentid is" + parentid);
		up_monitor = SvseMethodsOnServer.svRefreshMonitors(selfId,parentid,false);
		console.log("刷新后的监视器是");
		console.log(up_monitor[selfId])
		return up_monitor[selfId];
	},
	getMonitorInfoById:function(id){
		var r_monitor = SvseMethodsOnServer.svGetMonitor(id);
		if(!r_monitor) throw new Meteor.Error(500,"SvseMonitorDaoOnServer.addMonitor");
		return r_monitor;
	},
	editMonitor : function(monitor,parentid){
		var r_monitor =  SvseMethodsOnServer.svSubmitMonitor(monitor);
		if(!r_monitor)throw new Meteor.Error(500,"SvseMonitorDaoOnServer.editMonitor");
		SystemLogger("添加监视器成功，监视器是：");
		console.log(r_monitor);
		console.log("刷新监视");
		var selfId = r_monitor["return"]["id"];
		SystemLogger("selfId is "+selfId+ "===== parentid is" + parentid);
		up_monitor = SvseMethodsOnServer.svRefreshMonitors(selfId,parentid,false);
		console.log("刷新后的监视器是");
		console.log(up_monitor[selfId])
		return up_monitor[selfId];
	},
	deleteMonitor : function (monitorid,parentid) {
		var fmap = SvseMethodsOnServer.svDeleteMonitor(monitorid);
		if(!fmap) throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor has error");
		SvseTree.remove({sv_id:monitorid},function(err){
			if(err){
				SystemLogger(err,-1);
				throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor SvseTree.remove has error");
			} 
			Svse.update({sv_id:parentid},{$pull:{submonitor:monitorid}},function (err){
				if(err) {
					SystemLogger(err,-1);
					throw new Meteor.Error(500,"SvseMonitorDaoOnServer deleteMonitor Svse.update has error");
				}
			});
		});
	}
}

