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
		    var arr = $.fn.zTree.getZTreeObj("svse_tree_check_contrast").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
				targets.push(arr[index].id);
			}
			console.log(targets);
			
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
			Session.set("selectnode",targets);
			for(var i = 0;i < targets.length;i++){
			console.log(targets[i]);
			
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
			var target = Session.get("selectnode");	
			RenderTemplate.renderIn("#ContrastDetailData","Contrastlist2",renderObj,false);
			
			DrawContrastReport.draw(imageData,nstartTime,nendTime);
			
			});
		 }

	},
	//导出报告
	"click #exportreport":function(e){	
			var targets = [];
		    var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
		    var contrastlist = ClientUtils.formArrayToObject($("#contrastlist").serializeArray());
		    var arr = $.fn.zTree.getZTreeObj("svse_tree_check_contrast").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
				targets.push(arr[index].id);
			}
			console.log(targets);
			
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
			var target = Session.get("selectnode");	
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
				
Template.contrast.rendered = function(e){
//监视器选择树
	$(function(e){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps",
 				              "N": "ps" }
			},
			//以下是右键备用代码
			/*callback : {
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
				*/
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
			//},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0",
				}
			},
			callback:{
				onCheck:function(event,treeId,treeNode,e){
					console.log(treeNode.id+"钩选的节点--对应监测器id");//钩选的节点--对应监测器id
					//Session.set("nodeid",targets);
					SwithcView.layout(LAYOUTVIEW.SettingLayout);
					Session.set("selectnode",treeNode.id);
					var arr = $.fn.zTree.getZTreeObj("svse_tree_check_contrast").getNodesByFilter(function(node){return (node.type === "monitor")});
					var flag = false;
					for(index in arr){
						//console.log(arr[index].id);
						if(treeNode.id == arr[index].id){
							flag = true;	
						}
					}
					if(flag){
							DrawContrastReport(treeNode.id);
							
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
		var selectNodeid = Session.get("selectnode");
		console.log(selectNodeid);
		if(!selectNodeid){
			$.fn.zTree.init($("#svse_tree_check_contrast"), setting, data);
			return;
		}
		var tree = $.fn.zTree.init($("#svse_tree_check_contrast"), setting,expandSimpleTreeNode(data,TreeNodeRemenber.get()));
			console.log("-------");
			
		tree.checkNode(selectNodeid,true,true);
			console.log("======");
		});
		//var checkednodes = result.GroupRight.split("\,")
		 //左边树的勾选
		//var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_contrast");
		//treeObj.checkAllNodes(false); //清空上一个用户状态
		/*  //节点勾选
		for(var index  = 0; index < selectNodeid.length ; index++){
			treeObj.checkNode(treeObj.getNodesByFilter(function(node){
				return  node.id  === selectNodeid[index];
			}, true), true);
		} */
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
								
});

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

