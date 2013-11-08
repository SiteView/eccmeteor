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
		$(":checkbox[name='Status']").each(function(){
			if(!this.checked) messagebasicsettingofbasciinfo["Status"]="Yes";
		});
		var name=messagebasicsettingofbasciinfo["Name"];
		if(!name){
			Message.info("请填写名称");
			return;
		}
		var result=SvseMessageDao.getMessageByName(name);
		if(result){
			Message.info("此信息名已经存在！");
			return;
		}
		var message = {};
		message[nIndex] = messagebasicsettingofbasciinfo;
		SvseMessageDao.addMessage(nIndex,message,function(result){
			if(result.status){
				$('#addmessagesettingdiv').modal('hide');
			}else{
				SystemLogger(result.msg);
			}
			
		});
		console.log("保存");
		});
		//获取任务计划列表
		var tasks=SvseTaskDao.getAllTaskNames();
		console.log(tasks);
		for(var i=0;i<tasks.length;i++){
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#tasknamelist").append(option);
		}
	});
	
}
/*
Template.messagebasicsettingofadd.events({

	"click #messagesettingcancelbtn": function(){
		$('#addmessagesettingdiv').modal('hide');
		console.log("执行取消");
	},
	
	"click #messagebasicsettingofsavebtn": function(){
		var messagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#messagebasicsettingofbasciinfo").serializeArray());
		var nIndex = Utils.getUUID();
		messagebasicsettingofbasciinfo["nIndex"] = nIndex
	//	console.log(emailbasicsettingofaddressbasciinfo);
		$(":checkbox[name='Status']").each(function(){
			if(!this.checked) messagebasicsettingofbasciinfo['Status']='Yes';
		});
		var message = {};
		message[nIndex] = messagebasicsettingofbasciinfo;
		SvseMessageDao.addMessage(nIndex,message,function(result){
			SystemLogger(result);
			$('#addmessagesettingdiv').modal('toggle');
		});
		console.log("保存");
	}
});*/
