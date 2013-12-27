	var getContrastListSelectAll = function(){
		return ClientUtils.tableGetSelectedAll("contrastlist");
	}

Template.contrast.events = {
    //查询
	"click #search" : function(){	     
			$("#contrastDetailTableData").empty();
		    var targets = [];
			
		    var startDate;
		    var endDate;
		    var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		    var contrastlist = ClientUtils.formArrayToObject($("#contrastlist").serializeArray());
		    var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
				targets.push(arr[index].id);
			}
			console.log(targets);
			Session.set("nodeid",targets);
			contrastlist["GroupRight"] = targets.join();
			
			$(":checkbox[name='Status']").each(function(){
				if(!this.checked) contrastlist["Status"]="Yes";
			});
		
			//是否选择选择监测器
			contrastlist["AlertTarget"] = targets.join();
			if(!contrastlist["AlertTarget"]){
				Message.info("请选择选择监测器！",{align:"center",time:3});
		
					return;
				}
			var monitorId = targets;
			console.log("获取监测器id:"+targets);
			//var monitorId = '1.27.1.1';
			var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
			var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
			var beginDate = startPicker.getDate();
			var endDate = endPicker.getDate();
			var startTime = ClientUtils.dateToObject(startPicker.getDate());
			var endTime = ClientUtils.dateToObject(endPicker.getDate());
			console.log("#############################");
			console.log(startTime);
			console.log(startTime["month"]);
			console.log(endTime);
			console.log("#######################");
			
			for(var i = 0;i < targets.length;i++){
			//console.log(targets[i]);
			
			DrawContrastReport.getDate(monitorId,startTime,endTime,function(result){
			
			var records = result.content;//获取监视器原始数据
	
			var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
			
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
			var nstartTime =  Date.str2Date(DrawContrastReport.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
			var nendTime =  Date.str2Date(DrawContrastReport.buildTime(endTime),"yyyy-MM-dd hh-mm-ss");
			console.log(tableData);
			console.log(baseData);
			var renderObj = {
				baseDate:baseData,
				startTime:DrawContrastReport.buildTime(startTime),
				endTime:DrawContrastReport.buildTime(endTime),
				tableData:tableData
			}
			
			RenderTemplate.renderIn("#ContrastDetailData","Contrastlist2",renderObj);
			
			DrawContrastReport.draw(imageData,nstartTime,nendTime);
			
			});
		 }

	},
	//导出报告
	"click #exportreport":function(e){				
			var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
			var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
			var beginDate = startPicker.getDate();
			var endDate = endPicker.getDate();
			var startTime = ClientUtils.dateToObject(startPicker.getDate());
			var endTime = ClientUtils.dateToObject(endPicker.getDate());
			console.log("#############################");
			console.log(startTime);
			console.log(startTime["month"]);
			console.log(endTime);
			console.log("#######################");
			var st = coverTime(startTime);
			var et = coverTime(endTime);
			console.log(st);
			console.log(et);
			var target = Session.get("nodeid");	
			console.log(target);
			window.location.href="/ContrastReport?mid="+target+"&st="+st+"&et="+et+"";
		  // window.location.href="/StatusReport?mid="+target+"&st="+st+"&et="+et+"";
		  
	  },
		  
	//帮助
   "click #helpmessagebtn":function(e){
	   //LoadingModal.loading();
		$('#helpmessagediv').modal('toggle');
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
		
/*//拼接时间
Object.defineProperty(DrawContrastReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})*/

	/*
	 查询结果数据列表
	*/	
/*Template.ContrastDetailData.rendered = function()‌{‌
		var queryobj = {};‌
		queryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);‌
		‌
		var nodes = SvseTree.find(queryobj).fetch();‌
		‌
		return nodes;		‌
	}‌*/
		
Template.contrast.rendered = function(){
//监视器选择树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps",
 				              "N": "ps" }
			},
			callback : {
				    onRightClick : function (event, treeId, treeNode) {
				     console.log("45");
					zTree = $.fn.zTree.getZTreeObj("svse_tree_check");
					 if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
						zTree.cancelSelectedNode();
						showRMenu("root", event.clientX, event.clientY);
					} else if (treeNode && !treeNode.noR) {
						zTree.selectNode(treeNode);
						showRMenu("node", event.clientX, event.clientY);
					}
					
				},
				
				onClick:function(event, treeId, treeNode){
				
				},
				/*onClick:function(event, treeId, treeNode){
					var id= treeNode.id;
					var type = treeNode.type;
					var checkedTreeNode = {};
					checkedTreeNode.id = id;
					checkedTreeNode.type=type;
					checkedTreeNode.name = treeNode.name;
					// 记录点击的节点。根据该节点获取 ;
					SessionManage.setCheckedTreeNode(checkedTreeNode);
					if(type !== "monitor"){
						Message.info("请选择监测器！");	
					
						return;
					}

					SwithcView.view(REPORT.TREND);
				
				console.log("45");
				} */ 
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
	
		function showRMenu(type, x, y) {
			//$("#rMenu ul").show();
			$("#rMenu").css({
				"top" : y + 10 + "px",
				"left" : x + 10 + "px",
				"visibility" : "visible"
			});
			$("body").bind("mousedown", onBodyMouseDown);
		}
		function hideRMenu() {
			if (rMenu1)
				$("#rMenu").css({
					"visibility" : "hidden"
				});
			$("body").unbind("mousedown", onBodyMouseDown);
		}
		function onBodyMouseDown(event) {
			if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
				$("#rMenu").css({
					"visibility" : "hidden"
				});
			}
		}
//鼠标悬停功能实现
		$().tooltip();		 
		$.fn.tooltip = function( options ) { 
		return this.each(function(e) {        
		// If options exist, lets merge them
		// with our default settings
			if ( options ) { 
				$.extend( settings, options );
			}
			var tooltip = "";
			var title = "";
			$(this).mouseover(function(e){
		
				title = $(this).attr("title");
				if(title== ""){
					 tooltip = "";
				}else{
					tooltip = "<div id='tooltip'><p>"+title+"</p></div>";
					$(this).attr("title","");
					
				}		
				$('body').append(tooltip);
				$('#tooltip')
					.css({
					"opacity":"0.8",
					"top":(e.pageY)+"px",
					"left":(e.pageX)+"px"
						}).show('fast');
			})
			$(this).mouseout(function(){
				$(this).attr("title",title);
				$('#tooltip').remove();				
			 })
			
			$(this).mousemove(function(e){
				$('#tooltip').css({
					"top":(e.pageY+20)+"px",
					"left":(e.pageX+10)+"px"
				});							
			})
		});
		
	};
	
	 var template = this;
            $(function() { //初始化日期选择器
                var endDate = new Date();
                var beginDate = new Date();
                beginDate.setTime(beginDate.getTime() - 1000*60*60*24);
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
                startPicker.setDate(beginDate);
                endPicker.setDate(endDate);
				
				// $('#AlertdatetimepickerStartDate').on('changeDate', function(e) {
				//  endPicker.setstartDate(e.date);
				// });
				// $('#AlertdatetimepickerEndDate').on('changeDate', function(e) {
				// startPicker.setEndDate(e.date);
				// });
			//	drawDetailLine(ClientUtils.dateToObject(beginDate),ClientUtils.dateToObject(endDate));
});

	
	/*var defaultMonitor = this.find("td input:checkbox");
		if(!defaultMonitor){
			emptyImage();
			return;
		}
		//第二 先默认选择第一个监视器的id
		var defaultMonitorId = defaultMonitor.id;
		//第三 判断页面刷新前是否已经选中了监视器
		var parentid  = SessionManage.getCheckedTreeNode("id");
		var checkedMonitorId = SessionManage.getCheckedMonitorId();
		if(checkedMonitorId && checkedMonitorId.indexOf(parentid) !== -1){ //当后台数据自动更新时 不切换当前选中监视器
			//判断已经选中的监视器是否还存在 //避免多客户端对当前监视器进行删除
			if(this.find("input:checkbox[id='"+checkedMonitorId+"']")){
				defaultMonitorId = checkedMonitorId;  //存在 的话
			}
		}
		if(defaultMonitorId && defaultMonitorId !== ""){
			$(this.find("input:checkbox[id='"+defaultMonitorId+"']")).parents("tr").addClass("success");
			drawImage(defaultMonitorId);
		}else{
			emptyImage();
		}*/
					$(function(){
        //隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("showMonitorList");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("showMonitorTableSelectAll");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("showMonitorList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("showMonitorList");
    });

}

// Template.MonitorList.Monitors = function(){
	// var entityId = SessionManage.getCheckedTreeNode("id");
    // var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
    // return SvseTreeDao.getNodesByIds(childrenIds,false,PagerMonitor.skip());
// }

 // Template.ContrastDetailData.ContrastDetailTableData = function(){
	// return SessionManage.getContrastDetailTableData();
// }

/*Template.ContrastDetailData.monitorStatisticalDetailTableData = function(){
	return SessionManage.getMonitorStatisticalDetailTableData();
}*/

/*var drawDetailLine =  function(beginDate,endDate){
	var id = SessionManage.getCheckedMonitorId();
	console.log(id);
	//var id = [];
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	var selector = "svg#detailLine";
	if($(selector).length == 0)
		return;
	var dateDifference = ClientUtils.getDateDifferenceHour(ClientUtils.objectToDate(beginDate),ClientUtils.objectToDate(endDate))
	var dateformate = dateDifference > 48 ? "%m-%d %H:%M" : "%H:%M";
	SvseMonitorDao.getMonitorRuntimeRecordsByTime(id,beginDate,endDate,function(result){
		if(!result.status){
			SystemLogger(result.msg);
			return;
		}
		var dataProcess = new DataProcess(result.content,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var line = new DrawLine(
							resultData,
							{
								'key':foreigkeys["monitorPrimary"],
								'label':foreigkeys["monitorDescript"],
								'dateformate':dateformate
							},
							selector);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
	})
}
var drawDetailLineAgain = function(){
	if($('#datetimepickerStartDate').length === 0) //判断是否具有时间选择器
		return;
	var beginDate   =  $('#datetimepickerStartDate').data('datetimepicker').getDate();
	var enddate   =  $('#datetimepickerEndDate').data('datetimepicker').getDate();
	drawDetailLine(ClientUtils.dateToObject(beginDate),ClientUtils.dateToObject(enddate));
}
//公布一个对象给其他Template调用该Template中的方法 或者检查活性数据源？  重新绘制详细曲线图哪个更合理？
Deps.autorun(function(){
	var id = SessionManage.getCheckedMonitorId();
	if(!id)
		return;
	drawDetailLineAgain();
});
//画图前 获取相关数据
/*function drawImage(id,count){
	if(!count) 
		var count =200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	SvseMonitorDao.getMonitorRuntimeRecords(id,count,function(result){
		if(!result.status){
			Log4js.error(result.msg);
			return;
		}
		var records = result.content;
		if(!records)
			return;
		var dataProcess = new DataProcess(records,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		SessionManage.setContrastDetailTableData(keys);
		
		var line = new DrawLine(
							resultData,
							{
								'key':foreigkeys["monitorPrimary"],
								'label':foreigkeys["monitorDescript"],
								'width':$(selector).parent().width(),
								'height':$(selector).parent().height(),
								'dateformate':"%H:%M"
							},
							selector);

		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图;
	/*	SessionManage.setMonitorRuntimeTableData(recordsData);
		var selectorPie = "svg#monitorStatisticalPieSvg";
		var pie = new DrawPie(
				recordsData,
				selectorPie,
				{}
			)
		pie.draw();*/
	
		
	/*});
}*/
/*
合并模板数据和实际数据
*/
/*var megerTemplateAndFactData = function(MTempalte,MInstance){
	//合并advanceParameter
	var advanceMT = MTempalte.MonityTemplateAdvanceParameters;
	var advanceMI =  MInstance.advance_parameter;
	if(advanceMT.length && advanceMI){
		for(ap in advanceMI){
			for(apIndex = 0 ; apIndex < advanceMT.length ; apIndex ++){
				if(ap == advanceMT[apIndex].sv_name){
					advanceMT[apIndex].sv_value = advanceMI[ap];
					break;
				}
			}
		}
		MTempalte.MonityTemplateAdvanceParameters = advanceMT;
	}
	//合并状态
	MTempalte.Error = mergeTemplateStatus(MTempalte.Error,MInstance.error);
	MTempalte.Good = mergeTemplateStatus(MTempalte.Error,MInstance.good);
	MTempalte.Warning = mergeTemplateStatus(MTempalte.Error,MInstance.warning);

	//基础频率
	var MonityFrequency = MTempalte.MonityFrequencyDom;
	MonityFrequency[0]["sv_value"] = MInstance.parameter[MonityFrequency[0]["sv_name"]];
	MonityFrequency[1]["sv_value"] = MInstance.parameter[MonityFrequency[1]["sv_name"]];
	MTempalte.MonityFrequencyDom = MonityFrequency;

	//普通属性
	MTempalte["CommonProperty"] = MInstance.parameter;

	//动态监视器属性
	var MTDynamicProperty = MTempalte["MonityTemplateParameters"];
	for(var dl = 0; dl < MTDynamicProperty.length; dl++){
		if(MTDynamicProperty[dl]["sv_name"]){
			MTDynamicProperty[dl]["sv_value"] =  MInstance.parameter[MTDynamicProperty[dl]["sv_name"]]
		}
	}
	MTempalte["MonityTemplateParameters"] = MTDynamicProperty;
	return MTempalte;
}
//合并状态
var mergeTemplateStatus = function(MTStatus,MIStatus){
	MTStatus.sv_conditioncount = MIStatus.sv_conditioncount;
	MTStatus.sv_expression = MIStatus.sv_expression;
	var selects = [];
	for(property in MIStatus){
		if(property.indexOf("sv_paramname") != -1){
			var index = property.match(/\d+/g);
			index = index === null ? "" : index[0];// index == null or index == ["123"];
			selects.push({
				"paramenameKey":property,
				"paramenameValue":MIStatus[property],
				"operateKey":("sv_operate"+index),
				"operateValue":MIStatus[("sv_operate"+index)],
				"sv_paramvalueKey":("sv_paramvalue"+index),
				"sv_paramvalueValue":MIStatus[("sv_paramvalue"+index)],
				"sv_relationKey":("sv_relation"+index),
				"sv_relationVakue":MIStatus[("sv_relation"+index)]
			})
		}
	}
	MTStatus["selects"] = selects;
	return MTStatus;
}*/