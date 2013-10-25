Template.messagesetting.events={
	//点击添加按钮弹出框
	"click #addmessagesetting": function(){
		$('#addmessagesettingdiv').modal('show');
		console.log("弹出");
	},
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
	"click #allowmessagesetting" : function(){  //启用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"0",function(result){
				SystemLogger(result);
			});
	},
	"click #forbidmessagesetting" : function(){ //禁用邮件地址
		var checks = $("#messageSettingList :checkbox[checked]");
		var ids = [];
		for(var i = 0 ; i < checks.length; i++){
			ids.push($(checks[i]).attr("id"));
		}
		if(ids.length)
			SvseMessageDao.updateMessageStatus(ids,"1",function(result){
				SystemLogger(result);
			});
	},
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
		var template = result["Template"];
		console.log("Template:"+result["Template"]);
		var status = result["Status"];
		$("#messagebasicsettingofmessagetemplatelistedit option").each(function(){
			if($(this).val() === template) this.checked = true;
		});
		$(":checkbox[name='Status']").each(function(){
			if($(this).val() === status) this.checked = true;
		});
		Session.set("messagebasicsettingofmessagebasciinfoeditform",result);
		console.log("nIndex:",result["nIndex"]);
		$('#editmessagesettingdiv').modal('show');
	}
});

Template.sendingmessagemethods.rendered=function(){
	SvseMessageDao.getMessageDllName(function(err,result){
		console.log(result);
		for(name in result){
			console.log("dllname:"+name);
			var option = $("<option value="+name+"></option>").html(name)
			$("#sendmessageofdllnamelist").append(option);
		}
	});
}
