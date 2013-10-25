Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('show');
		console.log("弹出");
	},
	//删除短信
	"click #delmessagesetting" : function(){
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.deleteMessageByIds(ids,function(result){
				SystemLogger(result);
			});
	},
	//改变状态-允许
	"click #allowmessagesetting" : function(){  //启用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"Yes",function(result){
				SystemLogger(result);
			});
	},
	//改变状态-禁止
	"click #forbidmessagesetting" : function(){ //禁用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"No",function(result){
				SystemLogger(result);
			});
	},
	//刷新
	"click #refreshmessagesetting" : function(){
		SvseMessageDao.sync(function(result){
			if(result.status){
				console.log("刷新完成");
			}else{
				SystemLogger(result);
			}
			
		});
	},
	//模板设置
	"click #messagetemplatesetting" : function(){
 
	},
	//帮助
	"click #messagehelpmessage" : function(){
 
	}
}

Template.messagesetting.rendered=function(){
	$(function(){
		//隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("messageSettingList");
		//初始化 checkbox事件
	    ClientUtils.tableSelectAll("messagesettingtableselectall");  
	    //初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("messageSettingList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("messageSettingList");
	});
}

//获取messagelist的集合
Template.messagesettingList.messagelist = function(){
	console.log(SvseMessageDao.getMessageList());
	return SvseMessageDao.getMessageList();
}

Template.messagesettingList.events({
	"click td .btn":function(e){
		console.log(e.target.id);
		var result = SvseMessageDao.getMessageById(e.target.id);
		//console.log(result);
		//编辑的时候填充表单
		$("#editmessagesettingdiv").find(":hidden[name='nIndex']:first").val(result.nIndex);
		$("#editmessagesettingdiv").find(":text[name='Name']:first").val(result.Name);
		$("#editmessagesettingdiv").find(":text[name='Phone']:first").val(result.Phone);
		var checkedTemplate = result["Template"].split(",");
		//console.log(checkedTemplate);
		for(var etl = 0 ; etl < checkedTemplate.length; etl ++){
			$("#messagebasicsettingofmessagetemplatelistedit").find("option[value='"+checkedTemplate[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var status = result["Status"];
		console.log(status);
		$(":checkbox[name='Status']").each(function(){
			if($(this).val() === status) this.checked = true;
		});
		var templateType = result["TemplateType"].split(",");
		for(var etl = 0 ; etl < templateType.length; etl ++){
			$("#editmessageTemplateTypelist").find("option[value='"+templateType[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var taskType = result["TaskType"].split(",");
		for(var etl = 0 ; etl < taskType.length; etl ++){
			$("#editmessageTaskTypelist").find("option[value='"+taskType[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		var plan = result["Plan"].split(",");
		for(var etl = 0 ; etl < plan.length; etl ++){
			$("#editmessagePlanlist").find("option[value='"+plan[etl]+"']:first").attr("selected","selected").prop("selected",true);
		}
		$('#editmessagesettingdiv').modal('show');
		
	}
});

Template.sendingmessagemethods.rendered=function(){
	
}
