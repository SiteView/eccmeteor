Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('toggle');
	}
	
}

Template.messagesetting.rendered=function(){
	
	//初始化弹窗
	$(function(){
		$('#addmessagesettingdiv').modal({
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
Template.messagebasicsettingofaddedit.events = {
	"click #messagebasicsettingofcancelbtn":function(){
		$('#addmessagesettingdiv').modal('toggle');
	},
	"click #messagebasicsettingofsavebtn":function(){
		$('#addmessagesettingdiv').modal('toggle');
	}
}


//获取messagelist的集合
