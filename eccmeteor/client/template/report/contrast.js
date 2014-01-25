Template.contrast.rendered = function () {
	ContrastAction.initTree(this);
}

Template.Contrastlist.rendered = function(){
	ContrastAction.initDatePicker(this);
	ContrastAction.render(this);
}
Template.contrast.events({
	"click #search" : function(e,t){
		
		ContrastAction.query(e,t,this);
		
	},
	"click #exportreport":function(e,t){
		ContrastAction.outputReport(e,t,this);
		
	},
});

var zTreeViewCon = function(){};

var ContrastAction = function(){};

Object.defineProperty(ContrastAction,"render",{
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
	}

});

Object.defineProperty(ContrastAction,"initTree",{
	value:function(template){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable : true,
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
				onRightClick: zTreeOnRightClick,
				onCheck:function(event,treeId,treeNode,e){
						
						console.log(treeNode.id+"钩选的节点--对应监测器id");//钩选的节点--对应监测器id
						var monitorId= treeNode.id;
					
						Session.set("selectnode",monitorId);
						var arr = $.fn.zTree.getZTreeObj("svse_tree_check_contrast").getNodesByFilter(function(node){return (node.type === "monitor")});
						var flag = false;
						for(index in arr){
							
							if(treeNode.id == arr[index].id){
								flag = true;	
							}
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
		var zTree = $.fn.zTree.init($("#svse_tree_check_contrast"), setting,data);
			console.log("============");
		var selectNodeid = Session.get("selectnode");
			console.log(selectNodeid);
		var expandNodes = ContrastAction.expandSimpleTreeNode(data,TreeNodeRemenber.get());
		if(!selectNodeid){
			$.fn.zTree.init($(template.find("#svse_tree_check_contrast")), setting,expandNodes);
			return;
		}
		 var tree = $.fn.zTree.init($(template.find("#svse_tree_check_contrast")), setting,expandNodes);
			console.log("-------");
			
		tree.checkNode(selectNodeid,true,true);
			console.log("======");
			
				function zTreeOnRightClick(event, treeId, treeNode) { 
					console.log(treeNode);
					
					if (!treeNode || treeNode == null) {  
						zTree.cancelSelectedNode();   
						showRMenu("root", event.clientX, event.clientY);   
					} else if (treeNode && !treeNode.noR) { //noR属性为true表示禁止右键菜单   
						if (treeNode.newrole && event.target.tagName != "a" && $(event.target).parents("a").length == 0) {   
							zTree.cancelSelectedNode();   
							showRMenu("root", event.clientX, event.clientY);   
						} else {   
							zTree.selectNode(treeNode);   
							showRMenu("node", event.clientX, event.clientY); 
							RenderTemplate.renderIn("#rMenu","rigntMenu",treeNode);
						}   
					}   
				}
	}
});
	function showRMenu(type, x, y) {
		if(type == "node"){
			$("#rMenu").attr("style","display");
		}else{
			hideRMenu();
			$("#rMenu").attr("style","display:none");
		}
		
		$("#rMenu").css({
			"top" : y + "px",
			"left" : x + "px",
			"visibility" : "visible"
		});
	 
		$("body").bind("mousedown", onBodyMouseDown);
	} 

	function hideRMenu() {
		if ($("#rMenu"))
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
//初始化日期选择器
Object.defineProperty(ContrastAction,"initDatePicker",{
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
		console.log("9899898");
	}
});
Object.defineProperty(ContrastAction,"query",{
	value:function(e,template,context){
	
		//获取选中的检测器id	
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
		//var monitorId ="1.27.3.2" ;
		
		ContrastAction.drowContrast(monitorId,template);
		LoadingModal.loading();
	}
});
Object.defineProperty(ContrastAction,"drowContrast",{
		value:function(monitorId,template){$("#contrastDetailTableData").empty();
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
				
				DrawContrastReport.draw(imageData,beginDate,endDate);
				LoadingModal.loaded();
				});
			}
		}
});
	
Object.defineProperty(ContrastAction,"outputReport",{
	value:function(e,t,context){
			
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
			var st = ContrastAction.coverTime(startTime);
			var et = ContrastAction.coverTime(endTime);
				console.log(st);
				console.log(et);
			var target = Session.get("selectnode");	
				console.log(target);
			//LoadingModal.loading();
			window.location.href="/ContrastReport?mid="+target+"&st="+st+"&et="+et+"";
			LoadingModal.loaded();
			
	}
});
/*Object.defineProperty(zTreeView,"getTreeData",{
	value:function(treelist){
		var data = [];
		var ids = [];
		for(i in treelist){
			if(treelist[i]["type"] == "entity"){
				treelist[i]["isParent"] = false;
				var id = treelist[i]["pId"];
				ids.push(treelist[i]["id"]);
				ids.push(id);
			}
		}
		for(i in treelist){
			if(treelist[i]["type"] == "se"){
				data.push(treelist[i]);
			}
			for(id in ids){
				if(treelist[i]["id"] == ids[id]){
					data.push(treelist[i]);
				}
			}
		}
		return data;
	}
});*/

/*
*展开树
*/
Object.defineProperty(ContrastAction,"expandSimpleTreeNode",{

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
Object.defineProperty(ContrastAction,"coverTime",{
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
   
