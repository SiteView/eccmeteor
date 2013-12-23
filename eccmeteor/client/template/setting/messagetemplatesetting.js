Template.messagetemplatesetting.rendered = function(){
	// $(function(){
		
	// });
	
}

Template.messagetemplatesetting.events({
	//显示不同的模板信息
	 "click a":function(e){
		//console.log("yes");
		console.log(e.currentTarget.id);
		var name = e.currentTarget.id;
		//$("#"+name).css("background-color","red");
		SvseMessageDao.getMessageTemplates(function(err,result){
			//console.log(result);
			var showTemplate = {};
			for(index in result){
				var temp = {};
				temp["name"] = index;
				temp["context"] = result[index];
				//console.log(temp);
				if(index == name){
					showTemplate = temp;
				}
				
			}
			console.log(showTemplate);
			$("#templateinfo").find(":text[name='messagetitle']:first").val(showTemplate["name"]);
			$("#messagecontent").val(showTemplate["context"]);
		});
		
	},
	
	//添加短信模板----
	"click #addmessagetemplatebtn":function(){
		var title = $("#messageTemplateTitle").val();
		if(!title){
			Message.info("模板名称不能为空！");
			$("#messageTemplateTitle").focus();
			return;
		}
		var addtemplateinfo = ClientUtils.formArrayToObject($("#templateinfo").serializeArray());
		console.log(addtemplateinfo);
		Meteor.call("svWriteEmailAddressStatusInitFilesection",title,addtemplateinfo.context,function(result){
			console.log("短信模板添加成功");
			console.log(result);
		});
	},
	
	//删除选中的短信模板
	"click #deletemessagetemplatebtn":function(){
		
	},
	
	/* //模板设置
	"click #smsmessagetemplatesetting" : function(){
		//$("#messageTemplateSettingDiv").modal("show");
		SvseMessageDao.getMessageTemplates(function(err,result){
			console.log(result);
			var messageTemplate = [];
			var defaulttemplate = {};
			for(index in result){
				var temp = {};
				//console.log(index);
				//console.log(result[index]);
				temp["name"] = index;
				temp["context"] = result[index];
				console.log(temp);
				messageTemplate.push(temp);
				if(index == "Default"){
					defaulttemplate = temp;
				}
				//console.log(messageTemplate);
				
			}
			console.log(messageTemplate);
			console.log(defaulttemplate);
			var context = {Template:messageTemplate,showTemplate:defaulttemplate};
			RenderTemplate.showParents("#messageTemplateSettingDiv","messagetemplatesetting",context);
		});
	}, */
	
});

//
var getMessageNameOfAlertUsing = function(ids){
	//得到所有短信报警正在使用中的短信名称
	var getAlertByType = SvseWarnerRuleDao.getAlertByAlertType("SmsAlert");
	console.log(getAlertByType);
	var emailaddress = [];
	var rec = {};
	var names = [];
	for(var index in getAlertByType){
		//console.log(getAlertByType[index]["EmailAdress"]);
		var address = getAlertByType[index]["EmailAdress"];
		if(!address) continue;
		var res = address.split(",");
		for(var i = 0;i < res.length;i++){
			emailaddress.push(res[i]);
		}
	}
	//console.log(emailaddress);
	for(var j = 0;j < emailaddress.length;j++){
		if(!rec[emailaddress[j]]){   
          rec[emailaddress[j]] = true;   
          names.push(emailaddress[j]);   
		}  
	}
	var nameStr = [];
	//var useids = [];
	for(var i = 0;i < names.length;i++){
		for(var k = 0;k < ids.length;k++){
			var email = SvseEmailDao.getEmailById(ids[k]);
			if(email["Name"] == names[i]){
				//useids.push(ids[k]);
				ids.splice(k,1);
				nameStr.push(email["Name"]);
				Message.info(nameStr.join() +"正在报警规则中使用，不能删除，请重选");
			}
		}
	}
	//console.log(ids);
	return ids;
	
}