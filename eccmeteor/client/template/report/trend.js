﻿Template.trend.rendered = function () {
	TrendAction.initTree(this);

}
Template.trend_status.rendered = function(){
	TrendAction.initDatePicker(this);
	TrendAction.render(this);
}
Template.trend_status.events({
	"click #search" : function(e,t){
		TrendAction.query(e,t,this);
	},
	"click #output_trend_report":function(e,t){
		TrendAction.outputReport(e,t,this);
	},
	"click ul li a":function(e,t){
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_trend");
		var nodes = treeObj.getSelectedNodes();
		console.log(nodes); 		
			if(!nodes || nodes == ""){
				Message.info("请选择监测器!");
				return;
			}else{
			var monitorId = nodes[0].id;
			TrendAction.timeclick(e,t,monitorId,this);			
			}

	}
});

var TrendAction = function(){};

Object.defineProperty(TrendAction,"render",{
	value:function(template){
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
		// var monitorId  = template.find("input:hidden").value;
		// this.draw(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endDate),monitorId,template);
	}
});

Object.defineProperty(TrendAction,"timeclick",{
	value:function(e,template,monitorId,context){
		/**deal with css*/
		var target = $(e.currentTarget);
		target.parents("ul").find("a").removeClass();
		target.addClass("label label-success");
		var str = e.currentTarget.name;
		var startDate;
		var startPicker = $(template.find("#datetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#datetimepickerEndDate")).data('datetimepicker');
		var today = endPicker.getDate();	
			if(str.indexOf(":") === -1){
				switch(str){
					case "today": startDate = Date.today();break;
					case "week" : startDate = today.add({days:1-today.getDay()});break;
					default		: startDate = today;
				}
			}else{
				startDate = today.add(JSON.parse(str));
			}
		startPicker.setDate(startDate);
		var endDate = endPicker.getDate();				
		var startPickerDate = startPicker.getDate();
		var endPickerDate = endPicker.getDate();
		var startTime = ClientUtils.dateToObject(startPickerDate);
		var endTime = ClientUtils.dateToObject(endPickerDate);
		DrawTrend.drawTrend(monitorId,startTime,endTime,function (result){
		console.log(result);
		var dataProcess = new ReportDataProcess(result);//原始数据的基本处理 //客户端服务端通用			
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var renderObj = {
			baseDate:baseData,
			startTime:DrawTrend.buildTime(startTime),
			endTime:DrawTrend.buildTime(endTime),
			tableData:tableData
		}			
		RenderTemplate.renderIn("#TrendResultDiv","trend_date",renderObj);
		DrawTrend.draw(imageData,startPickerDate,endPickerDate);
		});
	}
});

Object.defineProperty(TrendAction,"initTree",{
	value:function(template){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable : false,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
		
			data:{
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : "0",
				}
			},
			callback:{
				onClick:function(event, treeId, treeNode){		
					var monitorId= treeNode.id;
					Session.set("selectnode",monitorId);
					//var type = treeNode.type;					
					if(treeNode.type !== "monitor"){
						Message.warn("请选择监测器！");
						return;
					}			
					TrendAction.drawReport(monitorId);
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
		var selectnode = Session.get("selectnode");
		var expandNodes = TrendAction.expandSimpleTreeNode(data,TreeNodeRemenber.get())
		var tree = $.fn.zTree.init($(template.find("#svse_tree_check_trend")), setting,expandNodes);
		tree.selectNode(selectnode);
	}
});
//初始化日期选择器
Object.defineProperty(TrendAction,"initDatePicker",{
	value:function(template){
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$("#datetimepickerStartDate").datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});

		$("#datetimepickerEndDate").datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,

		});
		var startPicker = $("#datetimepickerStartDate").data('datetimepicker');
		var endPicker = $("#datetimepickerEndDate").data('datetimepicker');
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
		console.log(startDate);
		console.log("xuxuxu");
	}
});

Object.defineProperty(TrendAction,"query",{
	value:function(e,template,context){
		//获取选中的检测器id	
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_trend");
		var monitorId = treeObj.getSelectedNodes();
		if(!monitorId || monitorId == ""){
			Message.info("请选择监测器");
			return;
		}
		console.log(monitorId);	
		//var monitorId ="1.27.3.2" ;
		TrendAction.drawReport(monitorId,template);
	}
});

Object.defineProperty(TrendAction,"drawReport",{
	value:function(monitorId,template){
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
		var startPickerDate = startPicker.getDate();
		var endPickerDate = endPicker.getDate();
		var startTime = ClientUtils.dateToObject(startPickerDate);
		var endTime = ClientUtils.dateToObject(endPickerDate);
		DrawTrend.drawTrend(monitorId,startTime,endTime,function (result){
			console.log(result);
			var records = result;//获取监视器原始数据
		//	Log4js.info(records);
			var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用			
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
			
			//var keysData = dataProcess.getKeysData();
			// console.log(tableData);
			// console.log(imageData);
			// console.log(baseData);
			var renderObj = {
				baseDate:baseData,
				startTime:DrawTrend.buildTime(startTime),
				endTime:DrawTrend.buildTime(endTime),
				tableData:tableData
			}	
			console.log(baseData);
			console.log("*********");			
			console.log(tableData);			
			RenderTemplate.renderIn("#TrendResultDiv","trend_date",renderObj);

			//console.log(JSON.stringify(imageData));
			//console.log(imageData);
			DrawTrend.draw(imageData,startPickerDate,endPickerDate);
		});
	}
});


Object.defineProperty(TrendAction,"outputReport",{
	value:function(e,t,context){
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_trend");
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
		console.log("#############################");
		console.log(startTime);
		console.log(endTime);
		console.log("#######################");
		var st = TrendAction.coverTime(startTime);
		var et = TrendAction.coverTime(endTime);
		console.log(st);
		console.log(et);
		window.location.href="/TrendReport?mid="+nodeid+"&st="+st+"&et="+et+"";	
	}
});
/*
*展开树
*/
Object.defineProperty(TrendAction,"expandSimpleTreeNode",{
	value:function(zNodes,expandnodeids){
		var branch = [];
		if(!expandnodeids.length){
			return zNodes;
		}
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
});
//将时间对象转换成字符串
Object.defineProperty(TrendAction,"coverTime",{
	value:function(obj){
		var year = obj.year;
		var month = (obj.month < 10 ? "0" + obj.month : obj.month);
		var day = (obj.day < 10 ? "0" + obj.day : obj.day);
		var hour = (obj.hour < 10 ? "0" + obj.hour : obj.hour);
		var minute = (obj.minute < 10 ? "0" + obj.minute : obj.minute);
		var second = (obj.second < 10 ? "0" + obj.second : obj.second);
		return "" + year + month + day + hour + minute + second;
	}
});
