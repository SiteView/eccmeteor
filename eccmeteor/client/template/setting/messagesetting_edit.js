Template.editmessagebasicsetting.rendered = function(){
	//邮件模板下拉列表
	//var t = this;
	
	SvseMessageDao.getMessageTemplates(function(err,result){
		for(name in result){
			var option = $("<option value="+name+"></option>").html(name)
			$("#messagebasicsettingofmessagetemplatelistedit").append(option);
		}
	});
	$(function(){
		//点击取消编辑
		$("button#editmessagebasicsettingofcancelbtn").click(function(){
			$('#editmessagesettingdiv').modal('hide');
		});
		//点击保存编辑
		$("button#editmessagebasicsettingofsavebtn").click(function(){
			var editmessagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#editmessagebasicsettingofbasciinfo").serializeArray());
			var nIndex = editmessagebasicsettingofbasciinfo["nIndex"];
			
			if($(":checkbox[name='Status']").attr("checked")){
				editmessagebasicsettingofbasciinfo["Status"]="Yes";
			}
			
			
			//验证手机号格式
			var phone = editmessagebasicsettingofbasciinfo["Phone"];
			if(!phone){
				Message.info("手机号码不能为空");
				return;
			}
			var flag = SvseMessageDao.checkPhoneNumberFormat(phone);
			if(!flag) return;
			
			var message = {};
			message[nIndex] = editmessagebasicsettingofbasciinfo;
			//console.log(message);
			SvseMessageDao.updateMessage(nIndex,message,function(){
				$('#editmessagesettingdiv').modal('hide');
			});
		});
		//获取加载任务计划列表
		getLoadTaskName();
		//改变模板类型(com和web),对应不同的信息模板
		$("#editmessageTemplateTypelist").change(function(){
			var type=$(this).val();
			//web模板
			if(type=="web"){
				$("#messagebasicsettingofmessagetemplatelistedit").empty();//清空select的option
				SvseMessageDao.getWebMessageTemplates(function(err,result){
					for(name in result){
						//console.log(name);
						var option=$("<option value"+name+"></option>").html(name)
						$("#messagebasicsettingofmessagetemplatelistedit").append(option);
					}
				});
			}
			//com模板
			if(type=="com"){
				$("#messagebasicsettingofmessagetemplatelistedit").empty();//清空select的option
				SvseMessageDao.getMessageTemplates(function(err,result){
					for(name in result){
						//console.log(name);
						var option = $("<option value="+name+"></option>").html(name)
						$("#messagebasicsettingofmessagetemplatelistedit").append(option);
					}
				});
			}
		});
		
		//根据不同的任务计划类型获取不同的任务计划
		$("#editmessageTaskTypelist").change(function(){
			getEditTaskName();
		});
	});
	
}

//获取任务计划
var getLoadTaskName = function(){
	var tasktype = $("#editmessageTaskTypelist").val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
			$("#editmessagePlanlist").empty();//清空上一个状态的任务计划值
			var tasks = SvseTaskDao.getTaskNameByType(tasktype);
			console.log(tasks);
			for(var i=0;i<tasks.length;i++){
					if(tasks[i] == "") continue;
					var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
					$("#editmessagePlanlist").append(option);
			}
	}
};

//获取任务计划
var getEditTaskName = function(){
	var tasktype = $("#editmessageTaskTypelist").val();
	console.log("tasktype:"+tasktype);
	//获取任务计划列表
	if(tasktype){
		$("#editmessagePlanlist").empty();//清空上一个状态的任务计划值
		var tasks = SvseTaskDao.getTaskNameByType(tasktype);
		console.log(tasks);
		if(!tasks || tasks == ""){
			Message.info("任务计划没有设值！");
			return;
		}
		for(var i=0;i<tasks.length;i++){
			if(tasks[i] == "") continue;
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#editmessagePlanlist").append(option);
		}
	}
};

/* Template.editmessagebasicsetting.events({
	
	 "click #editmessagebasicsettingofcancelbtn":function(e,t){
		console.log("cancel----");
		console.log(t);
		//RenderTemplate.hideParents(t);
	},
	
	"click #editmessagebasicsettingofsavebtn":function(e,t){
		var editmessagebasicsettingofbasciinfo = ClientUtils.formArrayToObject($("#editmessagebasicsettingofbasciinfo").serializeArray());
			var nIndex = editmessagebasicsettingofbasciinfo["nIndex"];
			var message = {};
			message[nIndex] = editmessagebasicsettingofbasciinfo;
		//	console.log(message);
			SvseMessageDao.updateMessage(nIndex,message,function(){
				RenderTemplate.hideParents(t);
			});
	}
}); */

