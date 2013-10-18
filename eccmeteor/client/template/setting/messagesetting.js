Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('show');
		console.log("弹出");
	}
}

Template.messagesetting.rendered=function(){
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("messagesettingList");
		//初始化 checkbox事件
	    ClientUtils.tableSelectAll("messagesettingtableselectall");  
	    //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("messagesettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("messagesettingList");
	});
}

//点击保存、取消按钮时的事件----
Template.messagebasicsettingofadd.events = {

	"click #messagesettingcancelbtn": function(){
		$('#addmessagesettingdiv').modal('hide');
		console.log("执行取消");
	},
	
	"click #messagebasicsettingofsavebtn": function(){
		var messagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#messagebasicsettingofbasciinfo").serializeArray());
		var nIndex = Utils.getUUID();
		messagebasicsettingofbasciinfo["nIndex"] = nIndex
	//	console.log(emailbasicsettingofaddressbasciinfo);
		var message = {};
		message[nIndex] = messagebasicsettingofbasciinfo;
		SvseEmailDao.addEmailAddress(nIndex,message,function(result){
			SystemLogger(result);
			$('#addmessagesettingdiv').modal('toggle');
		});
		console.log("保存");
	}
}

Template.editmessagebasicsetting.events = {
	"click #editmessagebasicsettingofcancelbtn":function(){
		$('#editmessagesettingdiv').modal('toggle');
	},
}

//获取messagelist的集合
Template.messagesettingList.messagelist = function(){
	console.log(SvseMessageDao.getMessageList());
	return SvseMessageDao.getMessageList();
}

Template.messagesettingList.events({
	"click td .btn":function(e){
		$('#editmessagesettingdiv').modal('toggle');
	}
});