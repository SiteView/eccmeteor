Template.messagebasicsettingofadd.rendered = function(){
	//邮件模板下拉列表
	SvseMessageDao.getMessageTemplates(function(err,result){
		for(name in result){
		//console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#messagebasicsettingofmessagetemplatelist").append(option);
		}
	});
	
	$(function(){
		$("button#messagesettingcancelbtn").click(function(){
			console.log("hello");
			$('#addmessagesettingdiv').modal('hide');
		});
		$("button#messagebasicsettingofsavebtn").click(function(){
		var messagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#messagebasicsettingofbasciinfo").serializeArray());
		var nIndex = Utils.getUUID();
		messagebasicsettingofbasciinfo["nIndex"] = nIndex
	//	console.log(emailbasicsettingofaddressbasciinfo);
		var message = {};
		message[nIndex] = messagebasicsettingofbasciinfo;
		SvseMessageDao.addMessage(nIndex,message,function(result){
			SystemLogger(result);
			$('#addmessagesettingdiv').modal('hide');
		});
		console.log("保存");
		});
	});
}
/*
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
		SvseMessageDao.addMessage(nIndex,message,function(result){
			SystemLogger(result);
			$('#addmessagesettingdiv').modal('toggle');
		});
		console.log("保存");
	}
}*/