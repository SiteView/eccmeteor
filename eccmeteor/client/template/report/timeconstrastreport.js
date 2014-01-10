
Template.timeconstrastreport.events = {
	"click #timeselectbtn":function(e,t){
		TimeConstrastReportAction.query(e,t,this);

	},

	"click #output_timeconstrast_report":function(e,t){
		TimeConstrastReportAction.outputReport(e,t,this);
	}
}



Template.timeconstrastreport.rendered = function(){
	TimeConstrastReportAction.initTree(this);
	TimeConstrastReportAction.initDatePicker(this);
}

var TimeConstrastReportAction = function(){};
//导出报表函数

Object.defineProperty(TimeConstrastReportAction,"outputReport",{
	value:function(e,template,context){
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_time");
		var nodes = treeObj.getSelectedNodes();
		if(!nodes || nodes == ""){
			Message.info("请选择监测器");
			return;
		}
		var nodeid = nodes[0].id;
		console.log(nodeid); 		
		var firstPicker = $(template.find('#datetimepickerFirstDate')).data('datetimepicker');
		var secondPicker = $(template.find('#datetimepickerSecondDate')).data('datetimepicker');
		var firstDate = firstPicker.getDate();
		var secondDate = secondPicker.getDate();
		var dateType = template.find("#timeconstrast").value;
		var firstCurrentDate = ReportDateUtils.getCurrentDate(firstDate,dateType);
		var secondCurrentDate = ReportDateUtils.getCurrentDate(secondDate,dateType);
		var currentDate = firstCurrentDate.concat(secondCurrentDate);
		var timeArr = [];
			currentDate.forEach(function(d){
				timeArr.push(ClientUtils.dateToObject(d))
			});	
		var t1 = TimeConstrastReportAction.coverTime(timeArr[0])+","+TimeConstrastReportAction.coverTime(timeArr[1]);
		var t2 = TimeConstrastReportAction.coverTime(timeArr[2])+","+TimeConstrastReportAction.coverTime(timeArr[3]);
			console.log("#######################");
			console.log(dateType);
			console.log(t1);
			console.log(t2);
			console.log("#############################");
		window.location.href="/TimeContrastReport?mid="+nodeid+"&t1="+t1+"&t2="+t2+"&type="+dateType+"";	
	//时段对比报告
	//time1 :the first time, split start time and end time wiht ','  
	//Day对比报告 				TimeContrastReport?mid=1.23.4.1&t1=20131215000000,20131215235959&t2=20131216000000,20131216235959&type=day
	//Month  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131101000000,20131130235959&t2=20131201000000,20131230235959&type=month
	//weeks  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131201000000,20131207000000&t2=20131215000000,20131221000000&type=weeks

	}
});


Object.defineProperty(TimeConstrastReportAction,"initTree",{
	value:function(t){
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
					// var monitorId= treeNode.id;
					Session.set("selectnode",treeNode.id);
					if(treeNode.type !== "monitor"){
						Message.warn("请选择监测器！");
						return;
					}						
					TimeConstrastReportAction.treeNodeClick(treeId,treeNode,t)
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
		var selectnode = Session.get("selectnode");
		var expendNodes = TimeConstrastReportAction.expandSimpleTreeNode(data,TreeNodeRemenber.get());
		var tree = $.fn.zTree.init($("#svse_tree_check_time"), setting,expendNodes);
		tree.selectNode(selectnode);
	}
});

Object.defineProperty(TimeConstrastReportAction,"treeNodeClick",{
	value:function(treeId,treeNode,t){
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
			TimeConstrastReportAction.drawReport(treeNode.id,t);
			
		}else{
			Message.info("请选择监测器");
			return;
		}
	}
});

/*
*展开树
*/
Object.defineProperty(TimeConstrastReportAction,"expandSimpleTreeNode",{
	value: function(zNodes,expandnodeids){
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
});

//画时间段报告的方法
Object.defineProperty(TimeConstrastReportAction,"drawReport",{
	value:function(monitorId,template){
		var firstPicker = $(template.find('#datetimepickerFirstDate')).data('datetimepicker');
		var secondPicker = $(template.find('#datetimepickerSecondDate')).data('datetimepicker');
		var firstDate = firstPicker.getDate();
		var secondDate = secondPicker.getDate();
		var dateType = template.find("#timeconstrast").value;
		var firstCurrentDate = ReportDateUtils.getCurrentDate(firstDate,dateType);
		var secondCurrentDate = ReportDateUtils.getCurrentDate(secondDate,dateType);
		var currentDate = firstCurrentDate.concat(secondCurrentDate);
		var timeArr = [];
		currentDate.forEach(function(d){
			timeArr.push(ClientUtils.dateToObject(d))
		});
		var t1 = TimeConstrastReportAction.coverTime(timeArr[0])+","+TimeConstrastReportAction.coverTime(timeArr[1]);
		var t2 = TimeConstrastReportAction.coverTime(timeArr[2])+","+TimeConstrastReportAction.coverTime(timeArr[3]);
		console.log("***");
		console.log(dateType);
		console.log(t1);		
		console.log(t2);
		console.log("***");
		// console.log(timeArr);
		// console.log(currentDate);
		DrawTimeContrastReport.getData(monitorId,timeArr,function(result){
			var records = result;//获取监视器原始数据
			//原始数据的基本处理 //客户端服务端通用
			var dataProcess = new TimeContrastReportDataProcess(records,dateType);
			
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();

			var renderObj = {
				baseDate:baseData,
				tableData:tableData
			}
			RenderTemplate.renderIn("#timeconstrastDiv","timeconstrast_date",renderObj);
			DrawTimeContrastReport.draw(imageData,currentDate,dateType);		
		});
	}
});

//初始化日期选择器
Object.defineProperty(TimeConstrastReportAction,"initDatePicker",{
	value:function(template){
		var endDate = new Date();
		var startDate = new Date();
		var startDate = startDate.setTime(endDate.getTime() - 1000*60*60*24);
		var firstDatePicker = $(template.find("#datetimepickerFirstDate"));
		var secondDatePicker = $(template.find("#datetimepickerSecondDate"));

		firstDatePicker.datetimepicker({
				format: 'yyyy-MM-dd hh:mm:ss',
				language: 'zh-CN',
				maskInput: false
		});
		secondDatePicker.datetimepicker({
				format: 'yyyy-MM-dd hh:mm:ss',
				language: 'zh-CN',
				endDate : endDate,
				maskInput: false,
		});
		firstDatePicker.data('datetimepicker').setDate(startDate);
		secondDatePicker.data('datetimepicker').setDate(endDate);
	}
});

Object.defineProperty(TimeConstrastReportAction,"query",{
	value:function(e,template,context){
		var treeobj = $.fn.zTree.getZTreeObj("svse_tree_check_time");
		var monitorId = treeobj.getSelectedNodes();
		if(!monitorId || monitorId == ""){
			Message.info("请选择监测器");
			return;
		}
		//var monitorId ="1.27.7.2" ;
		TimeConstrastReportAction.drawReport(monitorId,template);
	}
});
//将时间对象转换成字符串
Object.defineProperty(TimeConstrastReportAction,"coverTime",{
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