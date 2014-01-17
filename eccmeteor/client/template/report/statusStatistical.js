var getstatusStatisticalSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("statusStatistical");
}

Template.statusStatisticalform.events = {
	//查询显示图表
	"click #sel1":function(){
		//获取树中选中的节点-监测器id
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_status");
		var nodes = treeObj.getSelectedNodes();
		if(!nodes || nodes == ""){
			Message.info("请选择监测器!");
			return;
		}
		var mid = nodes[0].id;
		console.log(mid); 
		//获取树中所有监测器类型的id
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_status").getNodesByFilter(function(node){return (node.type === "monitor")});
		var flag = false;
		for(index in arr){
			if(mid == arr[index].id){
				flag = true;	
			}
		}
		if(flag){
			drawTableAndChart(mid);
		}else{
			Message.info("请选择监测器");
			return;
		}
		
		LoadingModal.loading();
	},
	
	//导出报表
	"click #exportstatusreportbtn":function(){
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_status");
		var nodes = treeObj.getSelectedNodes();
		if(!nodes || nodes == ""){
			Message.info("请选择监测器");
			return;
		}
		var mid = nodes[0].id;
		console.log(mid); 
		//获取树中所有监测器类型的id
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check_status").getNodesByFilter(function(node){return (node.type === "monitor")});
		var flag = false;
		for(index in arr){
			if(mid == arr[index].id){
				flag = true;
			}
		}
		if(!flag){
			Message.info("请选择监测器");
			return;
		}
		var startPicker = $('#statusdatetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#statusdatetimepickerEndDate').data('datetimepicker');
		var beginDate = startPicker.getDate();
		var endDate = endPicker.getDate();
		
		var startTime = ClientUtils.dateToObject(startPicker.getDate());
		var endTime = ClientUtils.dateToObject(endPicker.getDate());
		console.log("#############################");
		console.log(startTime);
		console.log(endTime);
		console.log("#######################");
		var st = coverTime(startTime);
		var et = coverTime(endTime);
		console.log(st);
		console.log(et);
		window.location.href="/StatusReport?mid=" + mid + "&st=" + st + "&et=" + et +"";
	}
	

}

//将时间对象转换成字符串
var coverTime = function(obj){
	var year = obj.year;
	var month = (obj.month < 10 ? "0" + obj.month : obj.month);
	var day = (obj.day < 10 ? "0" + obj.day : obj.day);
	var hour = (obj.hour < 10 ? "0" + obj.hour : obj.hour);
	var minute = (obj.minute < 10 ? "0" + obj.minute : obj.minute);
	var second = (obj.second < 10 ? "0" + obj.second : obj.second);
	return "" + year + month + day + hour + minute + second;
}

Template.warnerrulelist.rendered = function(){
	//初始化checkbox选项
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("warnerrulelist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("warnerrulelistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("warnerrulelist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("warnerrulelist");
	});

}



var drawTableAndChart = function(monitorId){
	var startPicker = $('#statusdatetimepickerStartDate').data('datetimepicker');
	var endPicker = $('#statusdatetimepickerEndDate').data('datetimepicker');
	var beginDate = startPicker.getDate();
	var endDate = endPicker.getDate();
	
	var startTime = ClientUtils.dateToObject(startPicker.getDate());
	var endTime = ClientUtils.dateToObject(endPicker.getDate());
	console.log("#############################");
	console.log(startTime);
	console.log(endTime);
	console.log("#######################");
	LoadingModal.loading();
	DrawStatusReport.getData(monitorId,startTime,endTime,function(result){
		LoadingModal.loaded();
		var records = result.content;
		console.log(records);
		var dataProcess = new StatusReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		// console.log(imageData);
		console.log(baseData);
		
		console.log(imageData.percent);
		console.log(imageData.statusList);
		var renderObj = {
			baseDate:baseData,
			startTime:DrawStatusReport.buildTime(startTime),
			endTime:DrawStatusReport.buildTime(endTime),
			tableData:imageData.percent,
			statusList:imageData.statusList
		};
		RenderTemplate.renderIn("#statusStatisticallistDiv","statusStatisticallist",renderObj);
		DrawStatusReport.drawStatusBarChart(imageData.chart);
		DrawStatusReport.drawStatusPie(imageData.pie);
		LoadingModal.loaded();	 
		
	});
	
}


/*
*展开树
*/
var expandSimpleTreeNode = function(zNodes,expandnodeids){
	var branch = [];
	if(!expandnodeids.length) 
		return zNodes;
	for(index in expandnodeids){
		for(jndex in zNodes){
			if(expandnodeids[index] == zNodes[jndex].id){
				zNodes[jndex].open = true;
				break;
			}
		}
	}
	return zNodes;
}

/**
树节点转存在Session中的节点
*/
var changeTreeNodeToCheckedNode = function(treeNode){
	return {
		id:treeNode.id,
		type:treeNode.type,
		name:treeNode.name
	};
}

Template.statusStatistical.rendered = function(){
	//监视器选择树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: false,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			},
			callback:{
				onClick:function(event,treeId,treeNode){
				
					console.log(treeNode.id);	//点击的节点--对应监测器id
					//console.log(treeNode.name);
					//console.log("select");
					Session.set("select",treeNode.id);
					/* //获取树中所有监测器类型的id
					var type = treeNode.type;
					var checkedTreeNode = changeTreeNodeToCheckedNode(treeNode);
					//记录点击的节点。根据该节点获取 编辑增加设备时的基本信息;
					SessionManage.setCheckedMonitorId(checkedTreeNode);
					console.log(SessionManage.getCheckedMonitorId());
					if(type !== "entity"){
						//设置视图状态
						//SwithcView.view(REPORT.STATUSsTATISTICALFORM); 
					//	SessionManage.setSvseId(id);
						SessionManage.clearMonitorRuntimeDate();//清空一些监视数据session
					} */
						 
					
					var arr = $.fn.zTree.getZTreeObj("svse_tree_check_status").getNodesByFilter(function(node){return (node.type === "monitor")});
					var flag = false;
					for(index in arr){
						//console.log(arr[index].id);
						if(treeNode.id == arr[index].id){
							flag = true;	
						}
					}
					if(flag){
						drawTableAndChart(treeNode.id);
						
					}else{
						return;
					}
				},
				/*
				*节点展开事件
				*/
				onExpand:function(event, treeId, treeNode){
					TreeNodeRemenber.remenber(treeNode.id); //记住展开节点
				},
				/*
				*节点折叠事件
				*/
				onCollapse:function(event, treeId, treeNode){	
					TreeNodeRemenber.forget(treeNode.id); //删除展开节点
				}
			}
		};
		if(!$.fn.zTree){
			return ;
		}
		console.log("============");
		var selectNodeid = Session.get("select");
		console.log(selectNodeid);
		if(!selectNodeid){
			$.fn.zTree.init($("#svse_tree_check_status"), setting, data);
			return;
		}
		var tree = $.fn.zTree.init($("#svse_tree_check_status"), setting,expandSimpleTreeNode(data,TreeNodeRemenber.get()));
		tree.selectNode(selectNodeid);
		
	});
	
	var template = this;
	$(function() { //初始化日期选择器
			var endDate = new Date();
			var startDate = new Date();
			startDate.setTime(startDate.getTime() - 1000*60*60*24);
			$(template.find("#statusdatetimepickerStartDate")).datetimepicker({
					format: 'yyyy-MM-dd hh:mm:ss',
					language: 'zh-CN',
					maskInput: false
			});
			$(template.find("#statusdatetimepickerEndDate")).datetimepicker({
					format: 'yyyy-MM-dd hh:mm:ss',
					language: 'zh-CN',
					endDate : endDate,
					maskInput: false,
			});
			var startPicker = $(template.find("#statusdatetimepickerStartDate")).data('datetimepicker');
			var endPicker = $(template.find("#statusdatetimepickerEndDate")).data('datetimepicker');
			startPicker.setDate(startDate);
			endPicker.setDate(endDate);
			// $('#AlertdatetimepickerStartDate').on('changeDate', function(e) {
				// endPicker.setstartDate(e.date);
			// });
			// $('#AlertdatetimepickerEndDate').on('changeDate', function(e) {
				// startPicker.setEndDate(e.date);
			// });
	});

}