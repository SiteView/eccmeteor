SvseMonitorDao = {
	AGENT:"svseMonitorDaoAgent",
	addMonitor:function(monitor,parentid,fn){ //添加监视器
		/*
		fn = Utils.checkReCallFunction(fn);
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
		*/
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
			/*
			//SvseMonitorDao.addMonitor(monitors[index],parentid)
			Meteor.call("entityAddMonitor",monitors[index],parentid,function(err,r_monitor){
				if(err){
					SystemLogger(err,-1);
					SystemLogger("监视器：");
					console.log(monitors[index]);
					SystemLogger("添加失败");
					return ;
				}else{
					SystemLogger("添加成功"+r_monitor["sv_id"]);
				}
				var selfId = r_monitor["sv_id"];
				SvseTree.insert(r_monitor,function(err,r_id){
					if(err){
						fn(err,selfId);						
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
							fn(err,selfId);
							return;
						}
						SystemLogger("根据树结构的父节点成功");
						fn(undefined,selfId);
					});
				});
			});
			*/
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
	}
}