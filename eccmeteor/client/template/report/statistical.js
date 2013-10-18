//单击添加按钮
Template.statistical.events = {
	"click #statisticalofadd":function(e){
		$('#statisticalofadddiv').modal('toggle');
	}

}
//弹窗初始化
Template.statistical.rendered = function(){

	$(function(){
		$('#datereportdiv').modal({
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

Template.statisticalofadd.events = {
"click #statisticalofaddcancelbtn":function(){
$('#statisticalofadddiv').modal('toggle');
},
"click #statisticalofaddsavebtn":function(){
var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("basicinfoofstatisticaladd").serializeArray());
var nIndex = Utils.getUUID();
basicinfoofstatisticaladd["nIndex"] = nIndex
var address = {};
address[nIndex] = basicinfoofstatisticaladd;
SvseStatisticalDao.addStatistical(nIndex,address,function(result){
SystemLogger(result);
$('#statisticalofadddiv').modal('toggle');
});
}
}

Template.statisticalofadd.rendered = function(){
	//监视器选择树
	$(function(){
		$('#statisticalofadddiv').modal({
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
Template.statisticallist.statisticalresultlist = function(){
console.log(SvseStatisticalDao.getStatisticalresultlist());
return SvseStatisticalDao.getStatisticalresultlist();
}