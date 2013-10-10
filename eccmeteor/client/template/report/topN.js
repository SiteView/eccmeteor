Template.topN.events = {
    //点击添加按钮弹出框
	"click #addtopN":function(e){
		$('#topNofadddiv').modal('toggle');
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
    var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("basicinfooftopNadd").serializeArray());
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
//Template.topNbasicofaddedit.events = {
//	"click #topNofcancelbtn":function(){
	//	$('#addtopNdiv').modal('toggle');
	//},
	//"click #topNofsavebtn":function(){
		
	//}
//}

//获取topNlist的集合
Template.topNlist.topN=function(){
	console.log(SvseTopNDao.getTopNList());
	return SvseTopNDao.getTopNList();
}
