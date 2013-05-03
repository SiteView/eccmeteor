var SvseMonitorDao = {
	addMonitor:function(monitor,parentid,fn){ //添加监视器
		Utils.checkReCallFunction(fn);
		Meteor.call("entityAddMonitor",monitor,parentid,function(err,r_monitor){
			if(err){
				fn(err);
				return;
			}
			SystemLogger("插入到服务端成功,服务端返回是数据是");
			console.log(r_monitor);
			var selfId = r_monitor["sv_id"];
			
			//setTimeout("SvseMonitorDao.updateMonitorInfo()",2000);
			SvseTree.insert(r_monitor,function(err,r_id){
					if(err){
						fn(err);						
						return;
					}
					SystemLogger("插入数据到SvseTree成功");
					//3 插入到父节点（更新父节点）
					var parentNode = Svse.findOne({sv_id:parentid});
					SystemLogger("找到的父节点是");
					SystemLogger(parentNode);
					Svse.update(parentNode._id,{$push:{submonitor:selfId}},function(err){
						if(err){
							SystemLogger("更新父节点失败，错误是：");
							fn(err);
							return;
						}
						SystemLogger("根据树结构的父节点成功");
						fn();
					});
			});
		});
	},
	getMonitor : function(id,fn){
		Utils.checkReCallFunction(fn);
		Meteor.call("getMonitorInfoById",id,function(err,r_monitor){
			if(err){
				fn(err)
				return;
			}
			fn(undefined,r_monitor);
		});
	
	},
	editMonitor : function(monitor,parentid,fn){
		Utils.checkReCallFunction(fn);
		Meteor.call("entityEditMonitor",monitor,parentid,function(err,r_monitor){
			if(err){
				fn(err)
				return;
			}
			var selfId =  r_monitor.sv_id;
			oldNode = SvseTree.findOne({sv_id:selfId});
			console.log("原来的SvseTree节点是");
			console.log(oldNode);
			SvseTree.update(oldNode._id,{$set:{status:oldNode.status}},function(err){
				if(err){
					SystemLogger("更新SvseTree错误是：");
					fn(err);
				}else{
					SystemLogger("更新SvseTree节点成功");
					fn();
				}
			});
			
		});
	}
}