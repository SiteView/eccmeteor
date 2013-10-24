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
	  	SystemLogger(result);
	  });
	}
}

Template.topN.rendered=function(){
	
	//初始化弹窗
	$(function(){
		$('#topNdiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		});
	});
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
			basicinfooftopNadd["AlertTarget"] = targets.join();
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
Template.topNlist.topNresultlist=function(){
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
		console.log(e.target.id);
		var result = SvseTopNDao.getTopNById(e.target.id);
        console.log(result);
		$("#topNofadddivedit").find(":text[name='Title']:first").val(result.Title);
		$("#topNofadddivedit").find(":text[name='Descript']:first").val(result.Descript);
	    $("#topNofadddivedit").find(":text[name='Type']:first").val(result.Type);
	    $("#topNofadddivedit").find(":text[name='Mark']:first").val(result.Mark);
	    $("#topNofadddivedit").find(":text[name='Sort']:first").val(result.Sort);
	    $("#topNofadddivedit").find(":text[name='Count']:first").val(result.Count);
	    $("#topNofadddivedit").find(":text[name='Period']:first").val(result.Period);
	    $("#topNofadddivedit").find(":text[name='fileType']:first").val(result.fileType);
	    $("#topNofadddivedit").find(":text[name='GetValue']:first").val(result.GetValue);
	    $("#topNofadddivedit").find(":text[name='Generate']:first").val(result.Generate);
		$("#topNofadddivedit").find(":text[name='EmailSend']:first").val(result.EmailSend);
		$("#topNofadddivedit").find(":text[name='Deny']:first").val(result.Deny);
		$("#topNofadddivedit").find(":text[name='WeekEndTime']:first").val(result.WeekEndTime);
		$("#topNofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
		//填充表单
		var CheckedType = result["Type"].split(",");
		 for(var eal = 0; eal < CheckedType.length; eal++){
				 $("#Typelist").find("option[name = '"+CheckedType[eal]+"']:first").attr("selected","selected").prop("selected",true);
			 }
			 var CheckedMark = result.Mark;
			 for(var ebl = 0; ebl<CheckedMark.length;ebl++){
				$("#marklist").find("option[name = '"+CheckedMark[ebl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			var Sort = result.Sort;
		   $("#topNofadddivedit").find(":radio[name='Sort']").each(function(){
			if($(this).val() === Sort){
				$(this).attr("checked",true);
			}
		  });
			var CheckedCount = result["count"].split(",");
			for(var ecl = 0; ecl<CheckedCount.length;ecl++){
				$("#topNofadddivedit").find("option[name = '"+CheckedCount[ecl]+"']:first").attr("selected","selected").prop("selected",true);
			}
			
			 var CheckedPeriod = result["Period"].split(",");
		     for(var edl = 0; edl < CheckedPeriod.length; edl++){
				 $("#reporttypetemplatelist").find("option[name = '"+CheckedPeriod[edl]+"']:first").attr("selected","selected").prop("selected",true);
			 }
             var CheckedfileType = result["fileType"].split(",");
			 for(var eel = 0; eel<CheckedfileType.length;eel++){
				$("#topNoutputtype").find("option[name = '"+CheckedfileType[eel]+"']:first").attr("selected","selected").prop("selected",true);
			} 
			var CheckedGetValue = result["GetValue"].split(",");
			 for(var efl = 0; efl<CheckedfileType.length;efl++){
				$("#GetValuelist").find("option[name = '"+CheckedGetValue[efl]+"']:first").attr("selected","selected").prop("selected",true);
			} 
			
            var CheckedDeny = result.Deny;
			 $("#topNofadddivedit").find(":checkbox[name='Deny']").each(function(){
				 if($(this).val()=== CheckedDeny){
					 $(this).attr("checked",true);
					 }
				 });
		$('#topNofadddivedit').modal('toggle');
		
        //加载编辑弹出页面左侧树
		var checkednodes = result.AlertTarget.split("\,")
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
		$('#topNofadddiv').modal({
			backdrop:true,
			keyboard:true,
			show:false
		}).css({
			width: '800',
			'margin-left': function () {
				return -($(this).width() / 2);
			},
		//	height:"600"
		});
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
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
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
          
          $('#topNofadddivedit').modal('toggle');
              });
            }
       }