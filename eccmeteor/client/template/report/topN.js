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
    var nIndex = Utils.getUUID();
        basicinfooftopNadd["nIndex"] = nIndex
        
        console.log(basicinfooftopNadd); //控制台打印添加的信息
        var address = {};
          address[nIndex] = basicinfooftopNadd;
          
          console.log(address[nIndex]); 
          console.log("123");
          SvseTopNDao.addTopN(nIndex,address,function(result){
          console.log("AAA");
         SystemLogger(result);
            console.log("123");
			console.log(result); //控制台打印添加的信息
			console.log("123");	
          $('#topNofadddiv').modal('toggle');
              });
            }
       }
              

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
Template.topNlist.events = {
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseTopNDao.getTopNresult(e.target.id);
		//填充表单
		$("#topNofadddivedit").find(":text[name='AlertName']:first").val(result.AlertName);
		$("#topNofadddivedit").find(":text[name='OtherAdress']:first").val(result.OtherAdress);
		$("#topNofadddivedit").find(":text[name='Upgrade']:first").val(result.Upgrade);
		$("#topNofadddivedit").find(":text[name='UpgradeTo']:first").val(result.UpgradeTo);
		$("#topNofadddivedit").find(":text[name='Stop']:first").val(result.Stop);
		$("#topNofadddivedit").find(":text[name='WatchSheet']:first").val(result.WatchSheet);
		$("#topNofadddivedit").find(":text[name='UpgradeTo']:first").val(result.Strategy);
		$("#topNofadddivedit").find(":hidden[name='nIndex']:first").val(result.nIndex);
		
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
