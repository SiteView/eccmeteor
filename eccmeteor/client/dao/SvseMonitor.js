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
			//var selfId = r_monitor["return"]["id"];
			
			//setTimeout("SvseMonitorDao.updateMonitorInfo()",2000);
			return;
			
			Meteor.call("getNodeByParentIdAndId",parentid,selfId,function(err,n_monitor){
				if(err){
					fn(err);
					return;
				}
				SystemLogger("从服务端获取到的SvseTree数据是");
				console.log(n_monitor);
				SvseTree.insert(n_monitor,function(err,r_id){
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
		});
	}

}