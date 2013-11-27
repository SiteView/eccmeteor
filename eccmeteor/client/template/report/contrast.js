var getContrastListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("contrastlist");
}
Session.setDefault('query', {datetimepickerStartDate:"", datetimepickerEndDate:""});
Template.contrast.events = {
    //查询
	  "click #search" : function(){
	   console.log("@@@@");
	  /* var queryCondition = {
	   datetimepickerStartDate: $("#datetimepickerStartDate").val(),
	   datetimepickerEndDate:$("#datetimepickerEndDate").val()
	   };
	    Session.set('query',queryCondition);*/
		drawDetailLineAgain();
		console.log("!!!!!!!!!!");
		
	},
		  
	   "click ul li a":function(e){
		var str = e.target.name;
		var startDate;
		var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
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
		console.log("#############################");
		console.log(startDate);
		console.log(endPicker.getDate());
		console.log("#######################");
		drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(endPicker.getDate()));
	},
	//导出报告
	   "click #exportreport":function(e){
	    /* SvseContrastDao.checkContrastresultlistSelect(getContrastListSelectAll());
            SvseContrastDao.updateTopNStatus(getContrastListSelectAll()," No",function(result){
                if(result.status){
                    SystemLogger("改变状态"+result.option.count+"条");
                        }
                });*/
			$('#exportdiv').modal('toggle');
		  },
	//帮助
	   "click #helpmessagebtn":function(e){
		   //LoadingModal.loading();
			$('#helpmessagediv').modal('toggle');
		  }
		  
}
	/*
	 查询结果数据列表
	*/	
	/*Template.contrastlist.contrastresultlist = function()‌{‌
		/*var queryobj = {};‌
		queryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);‌
		‌
		var nodes = SvseTree.find(queryobj).fetch();‌
		‌
		return nodes;		‌
	}‌*/
	

/*var getEntityTree = function()‌
{ ‌
	//查询条件	‌
	var basequeryobj = {};‌
	basequeryobj["sv_id"] = new RegExp(Session.get('query').sv_id);‌
	‌
	var nodes = Svse.find(basequeryobj).fetch();‌
	‌	‌
	var branch = [];‌
	for(index in nodes)‌
	{‌
		var obj = nodes[index];‌
		var otherqueryobj = {};‌
		//otherqueryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);	‌
		otherqueryobj["sv_id"]=obj["sv_id"];‌
		//if(SvseTree.findOne(otherqueryobj).length == 0)‌
		   //continue;
	var branchNode = {};‌
		branchNode["id"] = obj["sv_id"];‌
		branchNode["pId"] = obj["parentid"];‌
		branchNode["type"] = obj["type"];‌
		branchNode["name"] = SvseTree.findOne(otherqueryobj)["sv_name"];			‌
		//branchNode["isParent"] = true;‌
		branchNode["status"] = SvseTree.findOne(otherqueryobj)["status"];‌
		if(branchNode["pId"] === "0") branchNode["open"] = true;‌
		branchNode["open"] = true;‌
		if(obj["type"] === "entity" && obj["submonitor"] && obj["submonitor"].length)‌
		{				‌
			var submonitor = obj["submonitor"];		‌
			var submonitors = [];‌
			for(subindex in submonitor)‌
			{‌
				otherqueryobj = {};‌
				//otherqueryobj[Session.get('query').QueryObj] = new RegExp(Session.get('query').QueryValue);	‌
				otherqueryobj["sv_id"]=submonitor[subindex];	‌
				‌
				//if(SvseTree.findOne(otherqueryobj).length == 0)‌
				  // continue;‌
				‌
				var subobj = {};‌
				subobj["id"] = submonitor[subindex];‌
				//subobj["pId"] = obj["sv_id"];‌
				subobj["type"] = SvseTree.findOne(otherqueryobj)["sv_monitortype"];‌
				subobj["name"] = SvseTree.findOne(otherqueryobj)["sv_name"];‌
				//subobj["dstr"] = SvseTree.findOne(therqueryobj)["dstr"];‌
				subobj["status"] = SvseTree.findOne(otherqueryobj)["status"];‌
				subobj["status_disable"] = SvseTree.findOne({sv_id:submonitor[subindex]})["status_disable"];‌
				submonitors.push(subobj);‌
			}‌
			branchNode["submonitor"] = submonitors;‌
		}‌
		branchNode["icon"] = "imag/status/"+branchNode["type"]+(branchNode["status"]?branchNode["status"]:"")+".png";‌
		branch.push(branchNode);‌
	}‌
	return branch;		‌
}*/
	
	Template.ContrastDetailData.rendered = function(){
	
	}
	
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
				onClick : function(){
				console.log("45");
				}  
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
				// $('#AlertdatetimepickerStartDate').on('changeDate', function(e) {
				//  endPicker.setstartDate(e.date);
				// });
				// $('#AlertdatetimepickerEndDate').on('changeDate', function(e) {
				// startPicker.setEndDate(e.date);
				// });
});

/*//判断是否选择选择监测器
      var targets = [];
	    var contrastlist = ClientUtils.formArrayToObject($("#contrastlist").serializeArray());
	    var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
			targets.push(arr[index].id);
			}
			contrastlist["GroupRight"] = targets.join();
			
			$(":checkbox[name='Status']").each(function(){
			if(!this.checked) contrastlist["Status"]="Yes";
		});
        contrastlist["AlertTarget"] = targets.join();
		if(!contrastlist["AlertTarget"]){
			Message.info("请选择选择选择监测器！",{align:"center",time:3});
			return;
		}*/


}
	
Template.rMenu.monitortypelist = function () {
	
}

Template.ContrastDetailData.contrastDetailData = function(){
	return SessionManage.getContrastDetailTableData();
}
	
	//画图前 获取相关数据
function drawImage(id,count){
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
	
		
	});
}

var drawDetailLine =  function(startDate,endDate){
	var id = SessionManage.getCheckedMonitorId();
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	var selector = "svg#detailLine";
	if($(selector).length == 0)
		return;
	var dateDifference = ClientUtils.getDateDifferenceHour(ClientUtils.objectToDate(startDate),ClientUtils.objectToDate(endDate))
	var dateformate = dateDifference > 48 ? "%m-%d %H:%M" : "%H:%M";
	SvseMonitorDao.getMonitorRuntimeRecordsByTime(id,startDate,endDate,function(result){
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
	var startDate   =  $('#datetimepickerStartDate').data('datetimepicker').getDate();
	var enddate   =  $('#datetimepickerEndDate').data('datetimepicker').getDate();
	drawDetailLine(ClientUtils.dateToObject(startDate),ClientUtils.dateToObject(enddate));
}
//公布一个对象给其他Template调用该Template中的方法 或者检查活性数据源？  重新绘制详细曲线图哪个更合理？
Deps.autorun(function(){
	var id = SessionManage.getCheckedMonitorId();
	if(!id)
		return;
	drawDetailLineAgain();
});