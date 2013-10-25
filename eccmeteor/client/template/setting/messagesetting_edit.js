Template.editmessagebasicsetting.rendered = function(){
	//邮件模板下拉列表
	SvseMessageDao.getMessageTemplates(function(err,result){
		for(name in result){
	//	console.log(name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#messagebasicsettingofmessagetemplatelistedit").append(option);
		}
	});
	/*
	$(function(){
		$("button#editmessagebasicsettingofcancelbtn").click(function(){
			$('#editmessagesettingdiv').modal('hide');
		});
		$("button#editmessagebasicsettingofsavebtn").click(function(){
			var editmessagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#editmessagebasicsettingofbasciinfo").serializeArray());
			var nIndex = editmessagebasicsettingofbasciinfo["nIndex"];
			var message = {};
			message[nIndex] = editmessagebasicsettingofbasciinfo;
		//	console.log(message);
			SvseMessageDao.updateMessage(nIndex,message,function(){
				$('#editmessagesettingdiv').modal('hide');
			});
		});
	});
	*/
}
Template.editmessagebasicsetting.messagebasicsettingofmessagebasciinfoeditform = function(){
	console.log("session:",Session.get("messagebasicsettingofmessagebasciinfoeditform"));
	return Session.get("messagebasicsettingofmessagebasciinfoeditform");
}

Template.editmessagebasicsetting.events={
	"click #editmessagebasicsettingofcancelbtn":function(){
		$("#editmessagesettingdiv").modal("hide");
	},
	"click #editmessagebasicsettingofsavebtn":function(){
		var editmessagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#editmessagebasicsettingofbasciinfo").serializeArray());
			var nIndex = editmessagebasicsettingofbasciinfo["nIndex"];
			var message = {};
			message[nIndex] = editmessagebasicsettingofbasciinfo;
		//	console.log(message);
			SvseMessageDao.updateMessage(nIndex,message,function(){
				$('#editmessagesettingdiv').modal('hide');
			});
	}
}
