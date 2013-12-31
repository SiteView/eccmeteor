Template.messagetemplatesetting.rendered = function(){
	
}

//短信模板设置的事件
Template.messagetemplatesetting.events({
	//显示不同的模板信息
	 "click tr":function(e){
		//console.log("yes");
		var name = this.name;
		console.log(name);
		if(!name){
			return;
		}
		//点击选中的效果
		var ids = ClientUtils.tableGetSelectedAll("messagetemplatelist");
		//console.log(ids);
		for(var i = 0;i< ids.length;i++){
			$("#"+ids[i]).prop("checked",false);
			$("#"+ids[i]).parents("tr:first").removeClass("success");
		}
		
		var flag = $("#"+name).prop("checked");
		if(!flag){
			$("#"+name).prop("checked",true);
			$("#"+name).parents("tr:first").addClass("success");
		}
		SvseMessageDao.getMessageTemplates(function(err,result){
			//console.log(result);
			var showTemplate = {};
			for(index in result){
				var temp = {};
				var context = result[index];
				if(context.indexOf("&") != -1){
					var text = context.split("&");
					temp["name"] = text[0];
					temp["context"] = text[1];
				}else{
					temp["name"] = index;
					temp["context"] = context;
				}
				if(name == index){
					showTemplate = temp;
				}
				
			}
			console.log(showTemplate);
			$("#templateinfo").find(":text[name='messagetitle']:first").val(showTemplate["name"]);
			$("#messagecontent").val(showTemplate["context"]);
		}); 
		
	},
	
	//添加短信模板----(有问题，待解决--添加的时候有中文问题)
	"click #addmessagetemplatebtn":function(){
		var title = $("#messageTemplateTitle").val();
		if(!title){
			Message.info("模板名称不能为空！");
			$("#messageTemplateTitle").focus();
			return;
		}
		var addtemplateinfo = ClientUtils.formArrayToObject($("#templateinfo").serializeArray());
		var name = addtemplateinfo.messagetitle;
		var content = name + "&" + addtemplateinfo.context;
		console.log(title);
		console.log(content);
		// Meteor.call("svWriteSMSTemplateSettingFilesection","ss","问ggg111",function(err,result){
			// if(err){
				// console.log(err);
				// return;
			// }
			// console.log(result);
		// });
		SvseMessageDao.WriteSMSTemplateSetting(title,content,function(err,result){
			if(err){
				console.log(err);
				return;
			}
			console.log(result);
		});
	},
	
	//删除选中的短信模板
	"click #deletemessagetemplatebtn":function(){
		var check = $("#messagetemplatelist :checkbox[checked]");
		var key = $(check).attr("id");
		console.log(key);
		if(!key){
			Message.info("请选择要删除的短信模板");
			return;
		}
		if(key == "Default" || key == "SelfDefine" || key == "Simple"){
			Message.info("系统自定义模板，不能被删除");
			return;
		}
		//删除模板的时候要进行一些筛选 -- 判断在短信设置以及短信报警中是否正在使用要删除的在各个模板
		SvseMessageDao.deleteSMSTemplateSetting(key,"SMS",function(result){
			console.log(result);
			SvseMessageDao.getMessageTemplates(function(err,result){
				//console.log(result);
				var showTemplate = {};
				for(index in result){
					var temp = {};
					var context = result[index];
					if(context.indexOf("&") != -1){
						var text = context.split("&");
						temp["name"] = text[0];
						temp["context"] = text[1];
					}else{
						temp["name"] = index;
						temp["context"] = context;
					}
					if(name == index){
						showTemplate = temp;
					}
					
				}
				console.log(showTemplate);
				$("#templateinfo").find(":text[name='messagetitle']:first").val(showTemplate["name"]);
				$("#messagecontent").val(showTemplate["context"]);
			}); 
		});
		
	},
	
	//更新选中的短信模板
	"click #updatemessagetemplatebtn":function(){
		var check = $("#messagetemplatelist :checkbox[checked]");
		var key = $(check).attr("id");
		console.log(key);
		if(!key){
			Message.info("请选择要更新的短信模板");
			return;
		}
		if(key == "Default" || key == "SelfDefine" || key == "Simple"){
			Message.info("系统自定义模板，不能被更新");
			return;
		}
		var templateinfo = ClientUtils.formArrayToObject($("#templateinfo").serializeArray());
		var title = templateinfo.messagetitle;
		var value = title + "&" + templateinfo.context;
		console.log(value);
		// SvseMessageDao.updateSMSTemplateSetting(key,value,function(result){
			// console.log(result);
		// });
	},
	
	//关闭模板窗口
	"click #closemessagetemplatebtn":function(e,t){
		//console.log(t);
		RenderTemplate.hideParents(t);
	},
	
	//显示系统变量说明
	"click #systemvariablebtn":function(e,t){
		$("#explanationlist").removeClass("hide");
		$("#systemvariablebtn").addClass("hide");
		$("#hidesystemvariablebtn").removeClass("hide");
	},
	
	//隐藏系统变量说明
	"click #hidesystemvariablebtn":function(e,t){
		$("#explanationlist").addClass("hide");
		$("#systemvariablebtn").removeClass("hide");
		$("#hidesystemvariablebtn").addClass("hide");
	},
	
});

//web短信模板设置的事件
Template.webmessagetemplatesetting.events({
	//显示不同的模板信息
	 "click tr":function(e){
		//console.log("yes");
		var name = this.name;
		console.log(name);
		if(!name){
			return;
		}
		//点击选中的效果
		var ids = ClientUtils.tableGetSelectedAll("webmessagetemplatelist");
		//console.log(ids);
		for(var i = 0;i< ids.length;i++){
			$("#"+ids[i]).prop("checked",false);
			$("#"+ids[i]).parents("tr:first").removeClass("success");
		}
		
		var flag = $("#"+name).prop("checked");
		if(!flag){
			$("#"+name).prop("checked",true);
			$("#"+name).parents("tr:first").addClass("success");
		}
		SvseMessageDao.getWebMessageTemplates(function(err,result){
			//console.log(result);
			var showTemplate = {};
			for(index in result){
				if(name == index){
					var context = result[index];
					if(context.indexOf("\\;") != -1){
						var text = context.split("\\;");
						showTemplate["name"] = text[0];
						showTemplate["context"] = text[1];
						$("#webname").val(showTemplate["name"]);
						$("#webmessagecontent").val(showTemplate["context"]);
					}else{
						showTemplate["name"] = context;
						$("#webname").val(showTemplate["name"]);
					}
				}
				
			}
			console.log(showTemplate);
			
		}); 
		
	},

	//添加web短信模板
	"click #addwebmessagetemplatebtn":function(){
		var title = $("#webTemplateTitle").val();
		if(!title){
			Message.info("模板名称不能为空！");
			$("#webTemplateTitle").focus();
			return;
		}
		var addwebtemplateinfo = ClientUtils.formArrayToObject($("#webtemplateinfo").serializeArray());
		var name = addwebtemplateinfo.webtemplate;
		var content = name + "\\;" + addwebtemplateinfo.webcontent;
		console.log(title);
		console.log(content);
		// Meteor.call("svWriteSMSTemplateSettingFilesection","ss","问ggg111",function(err,result){
			// if(err){
				// console.log(err);
				// return;
			// }
			// console.log(result);
		// });
		// SvseMessageDao.WriteSMSTemplateSetting(title,content,function(err,result){
			// if(err){
				// console.log(err);
				// return;
			// }
			// console.log(result);
		// });
	},
	
	//删除选中的web短信模板
	"click #deletewebmessagetemplatebtn":function(){
		var check = $("#webmessagetemplatelist :checkbox[checked]");
		var key = $(check).attr("id");
		console.log(key);
		if(!key){
			Message.info("请选择要删除的短信模板");
			return;
		}
		if(key == "Default" || key == "SelfDefine" || key == "Simple"){
			Message.info("系统自定义模板，不能被删除");
			return;
		}
		//删除模板的时候要进行一些筛选 -- 判断在短信设置以及短信报警中是否正在使用要删除的在各个模板
		SvseMessageDao.deleteSMSTemplateSetting(key,"WebSmsConfige",function(result){
			console.log(result);
			SvseMessageDao.getWebMessageTemplates(function(err,result){
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
				RenderTemplate.renderIn("#messageTemplateSettingDiv","messagetemplatesetting",context);
				console.log("delete end");
			});
		});
		
	},
	
	//更新web短信模板
	
	
	//关闭模板窗口
	"click #closewebmessagetemplatebtn":function(e,t){
		RenderTemplate.hideParents(t);
	},
	
	//显示系统变量说明
	"click #websystemvariablebtn":function(e,t){
		$("#explanationlist").removeClass("hide");
		$("#websystemvariablebtn").addClass("hide");
		$("#hidewebsystemvariablebtn").removeClass("hide");
	},
	
	//隐藏系统变量说明
	"click #hidewebsystemvariablebtn":function(e,t){
		$("#explanationlist").addClass("hide");
		$("#websystemvariablebtn").removeClass("hide");
		$("#hidewebsystemvariablebtn").addClass("hide");
	},

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