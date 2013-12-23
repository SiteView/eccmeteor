Template.timeconstrastform.events = {
	"click #timeselectbtn":function(){
		
		// var monitorId = [];
		// var arr = $.fn.zTree.getZTreeObj("svse_tree_check_time").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
				// for(index in arr){
					// monitorId.push(arr[index].id);
				// }
				
		var monitorId ="1.27.7.2" ;
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
		var startTime = ClientUtils.dateToObject(startPicker.getDate());
		var endTime = ClientUtils.dateToObject(endPicker.getDate());
		
		var timeArr = [];
		timeArr[0] = startTime;
		timeArr[1] = endTime;
		console.log(timeArr);
		//var compress = false;
		DrawTimeContrastReport.getData(monitorId,timeArr[0],timeArr[1],function(result){
			console.log(result);
		});
		
		
		//console.log(monitorId);
		/* DrawTimeContrastReport.drawTrend(monitorId,startTime,endTime,function (result){
			console.log(result);
			var records = result;//获取监视器原始数据
		//	Log4js.info(records);
			var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
			
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
			var nstartTime =  Date.str2Date(DrawTimeContrastReport.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
			var nendTime =  Date.str2Date(DrawTimeContrastReport.buildTime(endTime),"yyyy-MM-dd hh-mm-ss");
		//	Log4js.info(tableData);
		//	Log4js.info(imageData);
		//	Log4js.info(baseData);
			//var keysData = dataProcess.getKeysData();
			//console.log(baseData);
			var renderObj = {
				baseDate:baseData,
				startTime:DrawTimeContrastReport.buildTime(startTime),
				endTime:DrawTimeContrastReport.buildTime(endTime),
				tableData:tableData
			}
			
			RenderTemplate.renderIn("#timeconstrastDiv","trend_date",renderObj);
			console.log(nstartTime);
			console.log(nendTime);
			//console.log(JSON.stringify(imageData));
			//console.log(imageData);
			DrawTimeContrastReport.draw(imageData,nstartTime,nendTime);
		}); */
	}
}
//画时间段报告的方法
var draw_timeconstrast = function(monitorId){
		var r1 = SvseMonitorDaoOnServer.getMonitorReportData(monitorId,timeArray[0],timeArray[1],false);//the argument 'false' make the data don't be compress
		var r2 = SvseMonitorDaoOnServer.getMonitorReportData(monitorId,timeArray[2],timeArray[3],false);
		var t1 = this.buildTime(timeArray[0]) +"~"+ this.buildTime(timeArray[1]);
		var t2 = this.buildTime(timeArray[2]) +"~"+ this.buildTime(timeArray[3]);

		DrawTimeContrastReport.getMonitorRecords(monitorId,timeArray[0],timeArray[1],function (result){

		
		var records = this.getMonitorRecords(monitorId,timeArray);//获取监视器原始数据
		var dataProcess = new TimeContrastReportDataProcess(records,type);//原始数据的基本处理 //客户端服务端通用
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
	//	Log4js.info(imageData);
	//	return ;

		var nstartTime1 =  Date.str2Date(this.buildTime(timeArray[0]),"yyyy-MM-dd hh-mm-ss");
		var nendTime1 =  Date.str2Date(this.buildTime(timeArray[1]),"yyyy-MM-dd hh-mm-ss");
		var nstartTime2 = Date.str2Date(this.buildTime(timeArray[2]),"yyyy-MM-dd hh-mm-ss");
		var nendTime2 =  Date.str2Date(this.buildTime(timeArray[3]),"yyyy-MM-dd hh-mm-ss");
		
		var newDate = [nstartTime1,nendTime1,nstartTime2,nendTime2];

		var renderObj = {
			baseDate:baseData,
			tableData:tableData
		}
		DrawTimeContrastReport.draw(imageData,window,timeArray,type);
	});
}

Template.timeconstrastreport.rendered = function(){
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
					//选中指定的树的节点
					var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_time");
					treeObj.selectNode(treeNode.id);
					console.log("select");										
					
					var arr = $.fn.zTree.getZTreeObj("svse_tree_check_time").getNodesByFilter(function(node){return (node.type === "monitor")});
					var flag = false;
					for(index in arr){
						//console.log(arr[index].id);
						if(treeNode.id == arr[index].id){
							flag = true;	
						}
					}
					if(flag){
						draw_timeconstrast(treeNode.id);
						
					}else{
						Message.info("请选择监测器");
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

		var tree = $.fn.zTree.init($("#svse_tree_check_time"), setting,expandSimpleTreeNode(data,TreeNodeRemenber.get()));
		//$.fn.zTree.init($("#svse_tree_check_status"), setting, data);
	});
	
	var template = this;
	$(function() { //初始化日期选择器
			var endDate = new Date();
			var startDate = new Date();
			startDate.setTime(startDate.getTime() - 1000*60*60*24);
			$(template.find("#datetimepickerStartDate")).datetimepicker({
					format: 'yyyy-MM-dd hh:mm:ss',
					language: 'zh-CN',
					maskInput: false
			});
			$(template.find("#datetimepickerEndDate")).datetimepicker({
					format: 'yyyy-MM-dd hh:mm:ss',
					language: 'zh-CN',
					endDate : endDate,
					maskInput: false,
			});
			var startPicker = $(template.find("#datetimepickerStartDate")).data('datetimepicker');
			var endPicker = $(template.find("#datetimepickerEndDate")).data('datetimepicker');
			startPicker.setDate(startDate);
			endPicker.setDate(endDate);
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
