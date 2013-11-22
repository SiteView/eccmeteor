var getContrastListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("contrastlist");
}

Template.contrast.events = {
    //查询
	   "click #queryDetailLineData":function(e){
	   var queryCondition = {
	   datetimepickerStartDate: $("#datetimepickerStartDate").val(), datetimepickerEndDate:$("#datetimepickerEndDate").val()
	   };
		   drawDetailLineAgain();
		   Session.set('query', queryCondition);
		   
		   
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
	    var contrastdiv = ClientUtils.formArrayToObject($("#contrastdiv").serializeArray());
	    var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
			targets.push(arr[index].id);
			}
			contrastdiv["GroupRight"] = targets.join();
			
			$(":checkbox[name='Status']").each(function(){
			if(!this.checked) contrastdiv["Status"]="Yes";
		});
        contrastdiv["AlertTarget"] = targets.join();
		if(!contrastdiv["AlertTarget"]){
			Message.info("请选择选择选择监测器！",{align:"center",time:3});
			return;
		}*/
}
/*Template.contrast.events = {
	"click #queryDetailLineData" : function(){
		drawDetailLineAgain();
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
	}
}
*/
Template.rMenu.monitortypelist = function () {
	
}
