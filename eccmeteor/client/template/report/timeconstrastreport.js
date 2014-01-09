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
		// console.log(endTime);
		//var nstartTime =  Date.str2Date(DrawTimeContrastReport.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
		//var nendTime =  Date.str2Date(DrawTimeContrastReport.buildTime(endTime),"yyyy-MM-dd hh-mm-ss"); 		 
		var timeArr = [];
		timeArr[0] = startTime;
		timeArr[1] = endTime;
		timeArr[2] = startTime;
		timeArr[3] = endTime;
		//console.log(timeArr[1]);
		//var compress = false;
		DrawTimeContrastReport.getData(monitorId,timeArr,function(result){
		console.log(result);
		var records = result;//获取监视器原始数据
		var type = $("#timeconstrast").val();
		var dataProcess = new TimeContrastReportDataProcess(records,type);//原始数据的基本处理 //客户端服务端通用
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var nstartTime1 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[0]),"yyyy-MM-dd hh-mm-ss");		
		var nendTime1 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[1]),"yyyy-MM-dd hh-mm-ss");
		var nstartTime2 = Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[2]),"yyyy-MM-dd hh-mm-ss");
		var nendTime2 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[3]),"yyyy-MM-dd hh-mm-ss");		
		var newDate = [nstartTime1,nendTime1,nstartTime2,nendTime2];
		var renderObj = {
			baseDate:baseData,
			tableData:tableData
		}
		console.log(tableData);
		console.log("11111111");
		console.log(nstartTime1);
		console.log(baseData);		
		RenderTemplate.renderIn("#timeconstrastDiv","timeconstrast_date",renderObj);
		//console.log(nstartTime);
		//console.log(nendTime);
		//console.log(JSON.stringify(imageData));
		//console.log(imageData);
		DrawTimeContrastReport.draw(imageData,newDate,type);		
		});
		
	}
/*
	"click #output_timeconstrast_report":function(){
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_time");
		var nodes = treeObj.getSelectedNodes();
		if(!nodes || nodes == ""){
			Message.info("请选择监测器");
			return;
		}
		var nodeid = nodes[0].id;
		console.log(nodeid); 		
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
		var startTime = ClientUtils.dateToObject(startPicker.getDate());
		var endTime = ClientUtils.dateToObject(endPicker.getDate());
		// console.log(endTime);
		//var nstartTime =  Date.str2Date(DrawTimeContrastReport.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
		//var nendTime =  Date.str2Date(DrawTimeContrastReport.buildTime(endTime),"yyyy-MM-dd hh-mm-ss"); 		 
		var timeArr = [];
		timeArr[0] = startTime;
		timeArr[1] = endTime;
		timeArr[2] = startTime;
		timeArr[3] = endTime;
		console.log("#############################");
		console.log(startTime);
		console.log(endTime);
		console.log("#######################");
		var st = coverTime(startTime);
		var et = coverTime(endTime);
		console.log(st);
		console.log(et);
		//window.location.href="/TrendReport?mid="+nodeid+"&st="+st+"&et="+et+"";	
		window.location.href="/TimeContrastReport?mid="+nodeid+"&t1="+t1+"&t2="+t2+"&type="+type+"";	
//时段对比报告
//time1 :the first time, split start time and end time wiht ','  
//Day对比报告 				TimeContrastReport?mid=1.23.4.1&t1=20131215000000,20131215235959&t2=20131216000000,20131216235959&type=day
//Month  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131101000000,20131130235959&t2=20131201000000,20131230235959&type=month
//weeks  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131201000000,20131207000000&t2=20131215000000,20131221000000&type=weeks
	}
*/
}
//画时间段报告的方法
var draw_timeconstrast = function(monitorId){
	var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
	var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
	var startTime = ClientUtils.dateToObject(startPicker.getDate());
	var endTime = ClientUtils.dateToObject(endPicker.getDate());
	var timeArr = [];
		timeArr[0] = startTime;
		timeArr[1] = endTime;
		timeArr[2] = startTime;
		timeArr[3] = endTime;
		//console.log(timeArr[1]);
		//var compress = false;
	DrawTimeContrastReport.getData(monitorId,timeArr,function(result){
		console.log(result);
		var records = result;//获取监视器原始数据
		var type = $("#timeconstrast").val();
		console.log(type);
		var dataProcess = new TimeContrastReportDataProcess(records,type);//原始数据的基本处理 //客户端服务端通用
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
//	Log4js.info(imageData);
//	return ;
		var nstartTime1 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[0]),"yyyy-MM-dd hh-mm-ss");
		var nendTime1 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[1]),"yyyy-MM-dd hh-mm-ss");
		var nstartTime2 = Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[2]),"yyyy-MM-dd hh-mm-ss");
		var nendTime2 =  Date.str2Date(DrawTimeContrastReport.buildTime(timeArr[3]),"yyyy-MM-dd hh-mm-ss");
	
		var newDate = [nstartTime1,nendTime1,nstartTime2,nendTime2];
		var renderObj = {
			baseDate:baseData,
			tableData:tableData
		}
		console.log(baseData);
		console.log("上面是baseData的数据，下面是tableData的数据！@");
		console.log(tableData);
		console.log(imageData);
		RenderTemplate.renderIn("#timeconstrastDiv","timeconstrast_date",renderObj);
	//console.log(nstartTime);
	//console.log(nendTime);
	//console.log(JSON.stringify(imageData));
	//console.log(imageData);
		DrawTimeContrastReport.draw(imageData,newDate,type);		
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
