Template.warnerruleofmessage.events={
	"click #warnerruleofmessagecancelbtn":function(){
		$('#messagewarnerdiv').modal('toggle');
	}
}

Template.warnerruleofmessage.rendered = function(){
	//监视器选择树
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
		$.fn.zTree.init($("#svse_tree_check_add"), setting, data);
	});
}

Template.warnerruleofmessageform.messagelist = function(){
	return SvseMessageDao.getMessageList();
}