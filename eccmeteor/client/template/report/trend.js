Template.trend.rendered = function () {
	$(function () {
		var data = SvseDao.getDetailTree();
		var setting = {
		
			check : {
				enable : false,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
		
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : "0",
				}
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					//设置布局
					//SwithcView.layout(LAYOUTVIEW.SettingLayout);
					var monitorId= treeNode.id;
					//var type = treeNode.type;					
					if(treeNode.type !== "monitor"){
						Message.warn("请选择监测器！");
						return;
					}
					// Message.warn("请选择监测器！");
					draw_trend(monitorId);
					//SwithcView.view(REPORT.TREND);
				//	SessionManage.setEntityId(id);
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
	$.fn.zTree.init($("#svse_tree_check"), setting, data);
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
//		$('#datetimepickerStartDate').on('changeDate', function(e) {
//			endPicker.setstartDate(e.date);
//		});
//		$('#datetimepickerEndDate').on('changeDate', function(e) {
//			startPicker.setEndDate(e.date);
//		});

	});

}
var draw_trend = function(monitorId){
	var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
	var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
	var startTime = ClientUtils.dateToObject(startPicker.getDate());
	var endTime = ClientUtils.dateToObject(endPicker.getDate());
		DrawTrend.drawTrend(monitorId,startTime,endTime,function (result){
		console.log(result);
		var records = result;//获取监视器原始数据
	//	Log4js.info(records);
		var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var nstartTime =  Date.str2Date(DrawTrend.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
		var nendTime =  Date.str2Date(DrawTrend.buildTime(endTime),"yyyy-MM-dd hh-mm-ss");
	//	Log4js.info(tableData);
	//	Log4js.info(imageData);
	//	Log4js.info(baseData);
		//var keysData = dataProcess.getKeysData();
		//console.log(baseData);
		var renderObj = {
			baseDate:baseData,
			startTime:DrawTrend.buildTime(startTime),
			endTime:DrawTrend.buildTime(endTime),
			tableData:tableData
		}
		
		RenderTemplate.renderIn("#TrendResultDiv","trend_date",renderObj);
		console.log(nstartTime);
		console.log(nendTime);
		//console.log(JSON.stringify(imageData));
		//console.log(imageData);
		DrawTrend.draw(imageData,nstartTime,nendTime);
	});
}
Template.trend_status.events({
	"click #search" : function(){
	
	var monitorId = [];
	var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
				monitorId.push(arr[index].id);
			}
			
	//var monitorId ="1.27.3.2" ;
	var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
	var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
	var startTime = ClientUtils.dateToObject(startPicker.getDate());
	var endTime = ClientUtils.dateToObject(endPicker.getDate());
	//console.log(monitorId);
	DrawTrend.drawTrend(monitorId,startTime,endTime,function (result){
		console.log(result);
		var records = result;//获取监视器原始数据
	//	Log4js.info(records);
		var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var nstartTime =  Date.str2Date(DrawTrend.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
		var nendTime =  Date.str2Date(DrawTrend.buildTime(endTime),"yyyy-MM-dd hh-mm-ss");
	//	Log4js.info(tableData);
	//	Log4js.info(imageData);
	//	Log4js.info(baseData);
		//var keysData = dataProcess.getKeysData();
		//console.log(baseData);
		var renderObj = {
			baseDate:baseData,
			startTime:DrawTrend.buildTime(startTime),
			endTime:DrawTrend.buildTime(endTime),
			tableData:tableData
		}
		
		RenderTemplate.renderIn("#TrendResultDiv","trend_date",renderObj);
		console.log(nstartTime);
		console.log(nendTime);
		//console.log(JSON.stringify(imageData));
		//console.log(imageData);
		DrawTrend.draw(imageData,nstartTime,nendTime);
	});

	}
});
