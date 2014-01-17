	var getContrastListSelectAll = function(){
		return ClientUtils.tableGetSelectedAll("contrastlist");
	}
Template.contrast.rendered = function () {
	ConstrastAction.initConstrastTree(this);

}
Template.Contrastlist.rendered = function(){
	ConstrastAction.initDatePicker(this);
	ConstrastAction.render(this);
}
var ConstrastAction = function(){};
Template.constrast.events({
	"click #serch": function(e,t){
		ConstrastAction.query(e,t,this);
	}
});
Object.defineProperty(ConstrastAction,"query",{
	value:function(e,template,context){
		var targets = [];
		//var nIndex = new Date().format("yyyyMMddhhmmss") +"x"+ Math.floor(Math.random()*1000);
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
		ConstrastAction.drawConstrastReport(monitorId,template);
	}
});

Object.defineProperty(ConstrastAction,"drawConstrastReport",{
	value:function(monitorId,template){
			var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
			var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
			var beginDate = startPicker.getDate();
			var endDate = endPicker.getDate();
			var startTime = ClientUtils.dateToObject(startPicker.getDate());
			var endTime = ClientUtils.dateToObject(endPicker.getDate());
			console.log("#############################");
		// var startPicker = $('#datetimepickerStartDate').data('datetimepicker');
		// var endPicker = $('#datetimepickerEndDate').data('datetimepicker');
		// var startPickerDate = startPicker.getDate();
		// var endPickerDate = endPicker.getDate();
		// var startTime = ClientUtils.dateToObject(startPickerDate);
		// var endTime = ClientUtils.dateToObject(endPickerDate);
			DrawContrastReport.getDate(monitorId,startTime,endTime,function(result){			
			var records = result.content;//获取监视器原始数据	
			var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用			
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();			
			var renderObj = {
				baseDate:baseData,
				startTime:DrawContrastReport.buildTime(startTime),
				endTime:DrawContrastReport.buildTime(endTime),
				tableData:tableData
			}
			var target = Session.get("selectnode");	
			RenderTemplate.renderIn("#ContrastDetailData","Contrastlist2",renderObj,false);			
			DrawContrastReport.draw(imageData,beginDate,endDate);			
			});
	}
});

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
				
//初始化日期选择器
Object.defineProperty(ConstrastAction,"initDatePicker",{
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
Object.defineProperty(ConstrastAction,"initConstrastTree",{
	value:function(template){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps",
 				              "N": "ps" }
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
				onCheck:function(event,treeId,treeNode,e){
					console.log(treeNode.id+"钩选的节点--对应监测器id");//钩选的节点--对应监测器id
					//Session.set("nodeid",targets);
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
							drawConstrastReport(treeNode.id);
							
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
	}
});
/*
*展开树
*/
Object.defineProperty(ConstrastAction,"expandSimpleTreeNode",{
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

