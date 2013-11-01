var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
Template.topN.events = {
    //点击添加按钮弹出框    
	"click #topNofadd":function(e){
		$('#topNofadddiv').modal('toggle');
	},
	"click #topNofdel":function(){
	var checks = $("#topNlist :checkbox[checked]");
	var ids = [];
	for(var i = 0; i < checks.length; i++){
	   ids.push($(checks[i]).attr("id"));
	}
	if(ids.length)
	  SvseTopNDao.deleteTopNByIds(ids,function(result){
	    console.log("删除全部《《");
	  	SystemLogger(result);
	  	console.log("删除全部》》");
	  });
	  
	},
	"click #allowetopN" : function(){  //启用TopN地址
		var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"Yes",function(result){
				SystemLogger(result);
			});
			
	},
	"click #forbidtopN" : function(){ //禁用TopN地址
		var checks = $("#topNlist :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseTopNDao.updateTopNStatus(ids,"No",function(result){
				SystemLogger(result);
			});
	},
	"click #topNrefresh" : function(){
		//topN报告同步
		SvseTopNDao.sync();
	},
	"click #topNhelpmessage" : function(){
	$('#helpmessagediv').modal('toggle');
 
	}
}


//点击保存、取消按钮时的事件

Template.topNofadd.events = {
         "click #topNofaddcancelbtn":function(){
          $('#topNofadddiv').modal('toggle');
                                     },
          "click #topNofaddsavebtn":function(){
    var basicinfooftopNadd = ClientUtils.formArrayToObject($("#basicinfooftopNadd").serializeArray());
    var targets = [];
	var arr = $.fn.zTree.getZTreeObj("svse_tree_check").getNodesByFilter(function(node){return (node.checked && node.type === "monitor")});
			for(index in arr){
			targets.push(arr[index].id);
			}
			basicinfooftopNadd["GroupRight"] = targets.join();
    var nIndex = Utils.getUUID();
        basicinfooftopNadd["nIndex"] = nIndex
        var address = {};
            address[nIndex] = basicinfooftopNadd;
          console.log(address[nIndex]); 
          SvseTopNDao.addTopN(nIndex,address,function(result){
          SystemLogger(result);
			console.log(result); //控制台打印添加的信息
          $('#topNofadddiv').modal('toggle');
              });
            }
       }
    /*   Template.topNofedit.topNofaddsavebtneditform = function(){
	return Session.get("topNofaddsavebtneditform");
   }*/

//获取topNlist的集合
Template.topNlist.topNresultlist = function(){
	console.log(SvseTopNDao.getTopNresultlist());
	return SvseTopNDao.getTopNresultlist();
}


Template.topNlist.rendered = function(){
   
	   //初始化checkbox选项
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("topNlist");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("topNlistselectall");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("topNlist");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("topNlist");
	});

}

Template.topNlist.events({
	"click td .btn":function(e){
		console.log(e.currentTarget.id);
		var result = SvseTopNDao.getTopNById(e.currentTarget.id);
        console.log(result);
		$("#topNofadddivedit").find(":text[name='Title']:first").val(result.Title);
		$("#topNofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
	    
	  
	    $("#topNofadddivedit").find("input[type='number'][name='Count']:first").val(result.Count);
	    
		$("#topNofadddivedit").find("input[type='number'][name='Generate']:first").val(result.Generate);
		$("#topNofadddivedit").find("input[type='email'][name='EmailSend']:first").val(result.EmailSend);
		$("#topNofadddivedit").find(":text[name='Deny']:first").val(result.Deny);
		$("#topNofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
		
		$("#Typelisted").find("option[value = '"+result["Type"]+"']:first").attr("selected","selected");
		$("#marklisted").find("option[value = '"+result["Mark"]+"']:first").attr("selected","selected");
		$("#reporttypePeriodlisted").find("option[value = '"+result["Period"]+"']:first").attr("selected","selected");
		$("#topNoutputtyped").find("option[value = '"+result["fileType"]+"']:first").attr("selected","selected");
		$("#GetValuelisted").find("option[value = '"+result["GetValue"]+"']:first").attr("selected","selected");
		$("#topNtypetemplatelisted").find("option[value = '"+result["WeekEndTime"]+"']:first").attr("selected","selected");
		
		
			var Sort = result.Sort;
		   $("#topNofadddivedit").find(":radio[name='Sort']").each(function(){
			if($(this).val() === Sort){
				$(this).attr("checked",true);
			}
		  });
		  
            var CheckedDeny = result.Deny;
			 $("#topNofadddivedit").find(":checkbox[name='Deny']").each(function(){
				 if($(this).val()=== CheckedDeny){
					 $(this).attr("checked",true);
					 }
					// $(this).attr("checked",false);
				 });
				 
		$('#topNofadddivedit').modal('toggle');
		
        //加载编辑弹出页面左侧树
		var checkednodes = result.GroupRight.split("\,")
		//左边树的勾选
		var treeObj = $.fn.zTree.getZTreeObj("svse_tree_check_edit");
		treeObj.checkAllNodes(false);//清空上一个用户状态
		//节点勾选
		for(var index  = 0; index < checkednodes.length ; index++){
			treeObj.checkNode(treeObj.getNodesByFilter(function(node){
				return  node.id  === checkednodes[index];
			}, true), true);
		}
	}
});

Template.topNofedit.rendered = function(){
//树
	$(function(){
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
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
			}
		};
		$.fn.zTree.init($("#svse_tree_check_edit"), setting, data);
	});
}

Template.topNofadd.rendered = function(){

//监视器选择树
	$(function(){
		
		var data = SvseDao.getDetailTree();
		var setting = {
			check:{
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "ps", "N": "ps" }
			},
			
			callback:{
			
			      Change:function (event, treeId, treeNode) {
			  
			      zTree = $.fn.zTree.getZTreeObj("svse_tree_check");
			
			     if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
				     zTree.cancelSelectedNode();
				     show("root", event.clientX, event.clientY);
			     } else if (treeNode && !treeNode.noR) {
				zTree.selectNode(treeNode);
				show("node", event.clientX, event.clientY);
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
	
	
        console.log("QQQQ");
       
         function zTreeOnChange(event, treeId, treeNode) {
            operDiyDom(treeId, treeNode);
        }
	/*function show(type, x, y) {
			$("#basicinfooftopNadd select").show();
			$("body").bind("change", onBodyChange);
		}
		
		function hideMenu() {
			if (basicinfooftopNadd) $("#basicinfooftopNadd").css({"visibility": "hidden"});
			$("body").unbind("change", onBodyChange);
		}			
		function onBodyChange(event){
			if (!(event.target.id == "basicinfooftopNadd" || $(event.target).parents("#basicinfooftopNadd").length>0)) {
				$("#basicinfooftopNadd").css({"visibility" : "hidden"});
			}
		}*/
console.log("QQQQ111");
}

/*Template.Typelist.monitortypelist = function(){
		var nodes = Svse.find().fetch();
		 
		var branch =[];
		for(index in nodes){
			var obj = nodes[index];
			var branchNode = {};
			branchNode["name"] = SvseTree.findOne({sv_id:obj["sv_id"]}).property.sv_name;
			}
		return branchNode["name"];

}*/

/* Template.topNresultlist.monitorType = function(){
	return Session.get("monitorTypelist") 
			? SvseTopNDao.getTemplateTypeById(Session.get("monitorTypelist"))
			: {}
	
}*/
/*
Template.showMonitorInfo.Mark = function(){
	return  Session.get("Mark") ? Session.get("Mark") : "";
}

Template.showMonitorInfo.getTopNParameters = function(){
	return Session.get("monityTemplateId") 
			? SvseMonitorTemplateDao.getTopNParametersById(Session.get("topNId"))
			: {}
	
}*/


Template.topNofedit.topNeditform = function(){
	return Session.get("topNeditform");
}

Template.topNofedit.events = {
         "click #topNofaddcancelbtnedit":function(){
          $('#topNofadddivedit').modal('toggle');
         },
          "click #topNofaddsavebtnedit":function(){
       var topNofaddfromedit = ClientUtils.formArrayToObject($("#topNofaddfromedit").serializeArray());
       console.log("form:"+topNofaddfromedit);
       var nIndex = topNofaddfromedit["nIndex"];
       var address = {};
           address[nIndex] = topNofaddfromedit;
          console.log("nIndex:"+nIndex);
          SvseTopNDao.updateTopN(nIndex,address,function(result){
          console.log("12313");
          $('#topNofadddivedit').modal('toggle');
          console.log("%%%%");
              });
            }
       }