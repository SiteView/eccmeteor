var getTopNListSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("topNlist");
}
Template.topN.events = {
    //点击添加按钮弹出框
	"click #addtopN":function(e){
		$('#topNofadddiv').modal('toggle');
	},
	
	"click #deltopN" : function(){
		SvseTopNDao.deleteTopNs(getTopNListSelectAll());
	},
	"click #allowetopN":function(){
		SvseTopNDao.updateTopNsStatus(getTopNListSelectAll(),"Enable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #forbidtopN":function(){
		SvseTopNDao.updateTopNsStatus(getTopNListSelectAll(),"Disable",function(result){
			if(result.status){
				SystemLogger("改变状态"+result.option.count+"条");
			}
		});
	},
	"click #refreshtopN":function(){
		SvseTopNDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	"click #topNhelpmessage":function(){
		console.log("topNhelpmessage");
		$('#topNofadddiv').modal('toggle');
	},
	
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
    var basicinfooftopNadd = ClientUtils.formArrayToObject($("basicinfooftopNadd").serializeArray());
    var nIndex = Utils.getUUID();
        basicinfooftopNadd["nIndex"] = nIndex
        var address = {};
          address[nIndex] = basicinfooftopNadd;
          SvseTopNDao.addTopN(nIndex,address,function(result){
         SystemLogger(result);
          $('#topNofadddiv').modal('toggle');
              });
                     }
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
//获取topNlist的集合
Template.topNlist.topN=function(){
	console.log(SvseTopNDao.getTopNList());
	return SvseTopNDao.getTopNList();
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
Template.topNlist.events = {
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseTopNDao.getTopN(e.target.id);
		//填充表单
		$("#topNofadddivedit").find(":text[name='AlertName']:first").val(result.AlertName);
		$("#topNofadddivedit").find(":text[name='OtherAdress']:first").val(result.OtherAdress);
		$("#topNofadddivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
		$("#topNofadddivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
		$("#topNofadddivedit").find(":text[name='Stop']:first").val(result.Stop);
		$("#topNofadddivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
		$("#topNofadddivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
		$("#topNofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
		var checkedTopNReport = result["TopNReport"].split(",");
		for(var eal = 0 ; eal < checkedTopNReport.length ; eal ++){
			try{
				$(".topNmultiselectedit").multiselect('select',checkedTopNReport[eal]);
			}catch(e){}
		}
		var checkedEmailTemplate = result["AlertTarget"].split(",");
		for(var etl = 0 ; etl < checkedTopNTemplate.length; etl ++){
			$("#topNtemplatelistedit").find("option[name='"+checkedTopNTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var AlertCategory = result.AlertCategory;
		$("#topNofaddformsendconditionsedit").find(":radio[name='AlertCategory']").each(function(){
			if($(this).val() === AlertCategory){
				$(this).attr("checked",true);
			}
		});
		$("#topNofadddivedit").modal('toggle');
		
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

}
