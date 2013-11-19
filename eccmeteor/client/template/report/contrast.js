Template.contrast.rendered = function(){
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
		$.fn.zTree.init($("#svse_tree_check"), setting, data);
	});
	 $(".form_datetime").datetimepicker({
        format: "dd-MM-yyyy hh:mm",
        autoclose: true,
        todayBtn: true,
		language: 'en',  
        pickDate: true,  
        pickTime: true,  
        hourStep: 1, 
        minuteStep: 15,  
        secondStep: 30,  
        inputMask: true 
    });
}