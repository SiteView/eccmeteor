Template.taskabsolute.events = {
	"click #taskabsoluteofadd" : function(e){
	$('#taskabsoluteadddiv').modal('toggle');
	}
}
Template.taskabsoluteadd.events = {
	"click #taskabsoluteaddcancelbtn" : function () {
		$('#taskabsoluteadddiv').modal('toggle');
	},
	"click #taskabsoluteaddofsavebtn" : function () {
		var basicinfoofstatisticaladd = ClientUtils.formArrayToObject($("#taskabsoluteaddofbasciinfo").serializeArray());
		//表单数据校验。
		var Name = taskabsoluteaddofbasciinfo["Name"];
			if(!Name){
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