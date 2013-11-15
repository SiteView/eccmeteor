Template.editmessagebasicsetting.rendered = function(){
	//邮件模板下拉列表
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
			
			var message = {};
			message[nIndex] = editmessagebasicsettingofbasciinfo;
			//console.log(message);
			SvseMessageDao.updateMessage(nIndex,message,function(){
				$('#editmessagesettingdiv').modal('hide');
			});
		});
		//获取任务计划列表
		var tasks=SvseTaskDao.getAllTaskNames();
		console.log(tasks);
		for(var i=0;i<tasks.length;i++){
			var option = $("<option value="+tasks[i]+"></option>").html(tasks[i]);
			$("#editmessagePlanlist").append(option);
		}
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
	});
	
}
/*
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
*/
