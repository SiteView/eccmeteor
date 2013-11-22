/*
Type： add
Author：xuqiang
Date:2013-10-15
Content:初始化statistical 列表
 */
Template.statisticallist.statisticalresultlist = function () {
	console.log(SvseStatisticalDao.getStatisticalresultlist());
	 return SvseStatisticalresultlist.find({},page.skip());
	//return SvseStatisticalDao.getStatisticalresultlist();
}
//分页的实现

var page = new Pagination("statisticalPagination");
Template.statisticallist.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(SvseStatisticalresultlist.find().count());
}
Template.statisticallist.destroyed = function(){
  page.destroy();
}
//单击添加按钮事件
Template.statistical.events = {
	"click #statisticalofadd" : function (e) {
		$('#statisticalofadddiv').modal('toggle');
	},
	//删除单行，多行记录
	"click #statisticalofdel" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.deleteStatisticalByIds(ids, function (result) {
				SystemLogger(result);
			});
	},
	//允许操作
	"click #allowestatistical" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids, "on", function (result) {
				SystemLogger(result);
			});

	},
	//禁止操作
	"click #forbidstatistical" : function () {
		var checks = $("#statisticallist :checkbox[checked]");
		var ids = [];
		for (var i = 0; i < checks.length; i++) {
			ids.push($(checks[i]).attr("id"));
		}
		if (ids.length)
			SvseStatisticalDao.updateStatisticalStatus(ids, "No", function (result) {
				SystemLogger(result);
			});
	},
	"click #refreshstatistical" : function () {
		SvseStatisticalDao.sync(function (result) {
			if (result.status) {
				console.log("页面刷新已完成！");
			} else {
				SystemLogger(result);
			}
		});
	},
	//帮助
	"click #statisticalhelpmessage" : function () {
		console.log("这里是帮助信息...");
	}
}
Template.statisticalofadd.rendered = function () {
	//监视器选择树
	$(function () {
		var data = SvseDao.getDetailTree();
		var setting = {
			check : {
				enable : true,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
			callback : {
				onRightClick : function (event, treeId, treeNode) {
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
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : "0",
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
		if (rMenu)
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
	/*	function addTreeNode() {
	hideRMenu();
	var newNode = { name:"增加" + (addCount++)};
	if (zTree.getSelectedNodes()[0]) {
	newNode.checked = zTree.getSelectedNodes()[0].checked;
	zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
	} else {
	zTree.addNodes(null, newNode);
	}
	}
	function removeTreeNode() {
	hideRMenu();
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length>0) {
	if (nodes[0].children && nodes[0].children.length > 0) {
	var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
	if (confirm(msg)==true){
	zTree.removeNode(nodes[0]);
	}
	} else {
	zTree.removeNode(nodes[0]);
	}
	}
	}
	function checkTreeNode(checked) {
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length>0) {
	zTree.checkNode(nodes[0], checked, true);
	}
	hideRMenu();
	}
	function resetTree() {
	hideRMenu();
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	}

	}
	 */
	 	//$('#datetimepicker').datetimepicker();
		 // $('#datepicker').datepicker();
		 
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
		$(".form_datetime").datetimepicker({
			format: "dd MM yyyy",
			autoclose: true,
			todayBtn: true,
			pickerPosition: "bottom-left"
		});
	//弹窗移动
	ModalDrag.draggable("#statisticalofadddiv");
}

Template.statisticalofadd.events = {
"change #reporttypePeriodlist":function(){
		if(document.getElementById("reporttypePeriodlist").value=="Week"){
			 document.getElementById("reporttypetemplatelist").disabled=false;
		}else if(document.getElementById("reporttypePeriodlist").value=="Other"){
			document.getElementById("form_datetime").style.display="";
			document.getElementById("form_datetimes").style.display="";
			//$("#form_datetime").attr("disabled","disabled");	
		}else{
		document.getElementById("form_datetime").style.display="none";
		document.getElementById("form_datetimes").style.display="none";
		document.getElementById("reporttypetemplatelist").disabled=true;
		}

},
	"click #statisticalofaddcancelbtn" : function () {
		$('#statisticalofadddiv').modal('toggle');
	},
	"click #statisticalofaddsavebtn" : function () {
		var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("#basicinfoofstatisticaladd").serializeArray());
		//表单数据校验。
		var Title = basicinfoofstatisticaladd["Title"];
			if(!Title){
			Message.warn("报告标题不能为空，请重新输入！");
			return;
		}
		//报告标题是否重复判断
		var result =SvseStatisticalDao.getTitle(Title);
			if(result){
				Message.warn("报告名称已存在，请重新输入！");
			return;
		}
		var targets = [];
		var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function (node) {
				return (node.checked && node.type === "monitor")
			});
		for (index in arr) {
			targets.push(arr[index].id);
		}
		basicinfoofstatisticaladd["GroupRight"] = targets.join();

		var nIndex = Utils.getUUID();
		basicinfoofstatisticaladd["nIndex"] = nIndex

			console.log(basicinfoofstatisticaladd); //控制台打印添加的信息

		var address = {};
		address[nIndex] = basicinfoofstatisticaladd;

		console.log(address[nIndex]);

		SvseStatisticalDao.addStatistical(nIndex, address, function (result) {
			SystemLogger(result);
			console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");
			$('#statisticalofadddiv').modal('toggle');
		});
	}
}


Template.statisticallist.rendered = function () {
	$(function () {
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("statisticallist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("statisticallistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("statisticallist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("statisticallist");
	});
}
//根据id编辑报告表单
Template.statisticallist.events({
/*
"change #reporttypePeriodlisted":function(){
		if(document.getElementById("reporttypePeriodlisted").value=="Week"){
			 document.getElementById("reporttypetemplatelisted").disabled=false;
		}else if(document.getElementById("reporttypePeriodlisted").value=="Other"){
			document.getElementById("editform_datetime").style.display="";
			document.getElementById("editform_datetimes").style.display="";
			//$("#form_datetime").attr("disabled","disabled");	
		}else{
		document.getElementById("editform_datetime").style.display="none";
		document.getElementById("editform_datetimes").style.display="none";
		document.getElementById("reporttypetemplatelisted").disabled=true;
		}

},
*/
	"click td .btn" : function (e) {
		console.log(e.currentTarget.id);
		var result = SvseStatisticalDao.getStatisticalById(e.currentTarget.id);
		console.log("111111");
		console.log(result);
		$("#statisticalofadddivedit").find(":input[type='text'][name='Title']:first").val(result.Title);
		$("#statisticalofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
		$("#statisticalofadddivedit").find("input[type='email'][name='EmailSend']:first").val(result.EmailSend);
		$("#statisticalofadddivedit").find("input[type='number'][name='Generate']:first").val(result.Generate);
		$("#statisticalofadddivedit").find(":input[type='time'][name='EndTime']:first").val(result.EndTime);
		$("#statisticalofadddivedit").find(":text[name='WeekEndTime']:first").val(result.WeekEndTime);
		$("#statisticalofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);

		$("#reporttypePeriodlisted").find("option[value = '" + result["Period"] + "']:first").attr("selected", "selected");
		$("#statisticalofaddtypelisted").find("option[value = '" + result["ComboGraphic"] + "']:first").attr("selected", "selected");
		$("#statisticaloutputtypeed").find("option[value = '" + result["fileType"] + "']:first").attr("selected", "selected");

		var CheckedGraphic = result.Graphic;
		$("#statisticalofadddivedit").find(":checkbox[name='Graphic']").each(function () {
			if ($(this).val() === CheckedGraphic) {
				$(this).attr("checked", true);
			}
		});

		var CheckedListError = result.ListError;
		$("#statisticalofadddivedit").find(":checkbox[name='ListError']").each(function () {
			if ($(this).val() === CheckedListError) {
				$(this).attr("checked", true);
			}
		});

		var CheckedListDanger = result.ListDanger;
		$("#statisticalofadddivedit").find(":checkbox[name='ListDanger']").each(function () {
			if ($(this).val() === CheckedListDanger) {
				$(this).attr("checked", true);
			}
		});
		var CheckedParameter = result.Parameter;
		$("#statisticalofadddivedit").find(":checkbox[name='Parameter']").each(function () {
			if ($(this).val() === CheckedParameter) {
				$(this).attr("checked", true);
			}
		});
		var CheckedDeny = result.Deny;
		$("#statisticalofadddivedit").find(":checkbox[name='Deny']").each(function () {
			if ($(this).val() === CheckedDeny) {
				$(this).attr("checked", true);
			}
		});
		//Session.set("emailbasicsettingofaddressbasciinfoeditform",result);
		$('#statisticalofadddivedit').modal('toggle');

		//加载编辑弹出页面左侧树
		var checkednodes = result.GroupRight.split("\,");
		//左边树的勾选
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
		treeObj.checkAllNodes(false); //清空上一个用户状态
		//节点勾选
		for (var index = 0; index < checkednodes.length; index++) {
			treeObj.checkNode(treeObj.getNodesByFilter(function (node) {
					return node.id === checkednodes[index];
				}, true), true);
		}
	}
});

Template.statisticalofedit.rendered = function () {
	//树
	$(function () {
		var data = SvseDao.getDetailTree();
		var setting = {
			check : {
				enable : true,
				chkStyle : "checkbox",
				chkboxType : {
					"Y" : "ps",
					"N" : "ps"
				}
			},
			callback : {
				onRightClick : function (event, treeId, treeNode) {
					zTree = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
					if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
						zTree.cancelSelectedNode();
						showRMenu("root", event.clientX, event.clientY);
					} else if (treeNode && !treeNode.noR) {
						zTree.selectNode(treeNode);
						showRMenu("node", event.clientX, event.clientY);
					}
				}
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",
					pIdKey : "pId",
					rootPId : "0",
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check_edit"), setting, data);
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
				if (rMenu)
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
			/*	function addTreeNode() {
			hideRMenu();
			var newNode = { name:"增加" + (addCount++)};
			if (zTree.getSelectedNodes()[0]) {
			newNode.checked = zTree.getSelectedNodes()[0].checked;
			zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
			} else {
			zTree.addNodes(null, newNode);
			}
			}
			function removeTreeNode() {
			hideRMenu();
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
			if (nodes[0].children && nodes[0].children.length > 0) {
			var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
			if (confirm(msg)==true){
			zTree.removeNode(nodes[0]);
			}
			} else {
			zTree.removeNode(nodes[0]);
			}
			}
			}
			function checkTreeNode(checked) {
			var nodes = zTree.getSelectedNodes();
			if (nodes && nodes.length>0) {
			zTree.checkNode(nodes[0], checked, true);
			}
			hideRMenu();
			}
			function resetTree() {
			hideRMenu();
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			}

			}
			 */
	//弹窗可移动
	ModalDrag.draggable("#statisticalofadddivedit");
}

Template.statisticalofedit.events = {
	"click #statisticalofeditcancelbtn" : function () {
		$("#statisticalofadddivedit").modal('toggle');
	},
	"change #reporttypePeriodlisted":function(){
		if(document.getElementById("reporttypePeriodlisted").value=="Week"){
			 document.getElementById("reporttypetemplatelisted").disabled=false;
		}else if(document.getElementById("reporttypePeriodlisted").value=="Other"){
			document.getElementById("editform_datetime").style.display="";
			document.getElementById("editform_datetimes").style.display="";
			//$("#form_datetime").attr("disabled","disabled");	
		}else{
		document.getElementById("editform_datetime").style.display="none";
		document.getElementById("editform_datetimes").style.display="none";
		document.getElementById("reporttypetemplatelisted").disabled=true;
		}

	},
	"click #statisticalofeditsavebtn" : function () {
		var statisticalofaddformedit = ClientUtils.formArrayToObject($("#statisticalofaddformedit").serializeArray());
		var nIndex = statisticalofaddformedit["nIndex"];
		var address = {};
		address[nIndex] = statisticalofaddformedit;

		SvseStatisticalDao.updateStatistical(nIndex, address, function (result) {

			$('#statisticalofadddivedit').modal('toggle');
		});
	}
}
/*
Template.statistical_detail.entityid = function () {
	return SessionManage.getCheckedTreeNode("id");
	console.log("12333333");
}
*/
Template.statistical_detail.monitortypelist = function (treeId,subtype) {
	var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(treeId,subtype);
    return SvseTreeDao.getNodesByIds(childrenIds);
	/*		var nodes = Svse.find().fetch();
	console.log(nodes);
	console.log("123");
	var branch =[];
	for(index in nodes){
	var obj = nodes[index];
	var branchNode = {};
	branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]}).property.sv_name;
	}
	//return branchNode["name"];
	 */
}
