Template.warnerruleofmessage.events={
	"click #warnerruleofmessagecancelbtn":function(){
		$('#messagewarnerdiv').modal('toggle');
	}
}

Template.warnerruleofmessage.rendered = function(){
	//监视器选择树
	$(function(){
		$('#messagewarnerdiv').modal({
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
		
	});
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
					rootPId: "0"
				}
			}
		};
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
}