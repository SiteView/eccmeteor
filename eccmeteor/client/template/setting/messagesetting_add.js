Template.messagebasicsettingofadd.rendered = function(){
	//邮件模板下拉列表
	SvseMessageDao.getMessageTemplates(function(err,result){
		//console.log(result);
		for(name in result){
			//console.log(name);
			//console.log(result[name]);
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
		//console.log(messagebasicsettingofbasciinfo);
		$(":checkbox[name='Status']").each(function(){
			if(!this.checked) messagebasicsettingofbasciinfo["Status"]="Yes";
		});
		var name = messagebasicsettingofbasciinfo["Name"];
		if(!name){
			Message.info("请填写名称");
			return;
		}
		var result = SvseMessageDao.getMessageByName(name);
		if(result){
			Message.info("此信息名已经存在！");
			return;
		}
		//验证手机号格式
		var phone = messagebasicsettingofbasciinfo["Phone"];
		if(!phone){
			Message.info("手机号码不能为空");
			return;
		}
		var phone = messagebasicsettingofbasciinfo["Phone"];
		var flag = SvseMessageDao.checkPhoneNumberFormat(phone);
		if(!flag) return;
		
		var message = {};
		message[nIndex] = messagebasicsettingofbasciinfo;
		SvseMessageDao.addMessage(nIndex,message,function(result){
			if(result.status){
				$('#addmessagesettingdiv').modal('hide');
			}else{
				Log4js.info(result.msg);
			}
			
		});
		console.log("保存");
		});
		
		//调用获取加载任务计划的方法
		getloadTaskName();
		
		//改变模板类型(com和web),对应不同的信息模板
		$("#changtemplatetype").change(function(){
			var type=$(this).val();
			//web模板
			if(type=="web"){
				$("#messagebasicsettingofmessagetemplatelist").empty();//清空select的option
				SvseMessageDao.getWebMessageTemplates(function(err,result){
					for(name in result){
						//console.log(name);
						var option=$("<option value"+name+"></option>").html(name)
						$("#messagebasicsettingofmessagetemplatelist").append(option);
					}
				});
			}
			//com模板
			if(type=="com"){
				$("#messagebasicsettingofmessagetemplatelist").empty();//清空select的option
				SvseMessageDao.getMessageTemplates(function(err,result){
					for(name in result){
						//console.log(name);
						var option = $("<option value="+name+"></option>").html(name)
						$("#messagebasicsettingofmessagetemplatelist").append(option);
					}
				});
			}
		});
		
		//任务计划类型改变的change事件，对应不同的任务计划
		$("#smstasktypelist").change(function(){
			getTaskName();
		});
	});
	
}

//获取加载时的任务计划
var getloadTaskName = function(){
	var tasktype = $("#smstasktypelist").val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#tasknamelist").empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#tasknamelist").append(option);
		}
	}
};

//获取任务计划
var getTaskName = function(){
	var tasktype = $("#smstasktypelist").val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#tasknamelist").empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		if(!tasks || tasks == ""){
			Message.info("任务计划没有设值！");
			return;
		}
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#tasknamelist").append(option);
		}
	}
};
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
