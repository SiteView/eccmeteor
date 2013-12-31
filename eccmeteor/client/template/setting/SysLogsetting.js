var getSysLogsetting_statusSelectAll = function(){
	return ClientUtils.tableGetSelectedAll("SysLogsetting_status");
}

Template.SysLogsetting.events={
        //设备参数设置应用
		"click #SysLogsettingEntityapplybtn":function(e){
					//var EntitySet = ClientUtils.formArrayToObject($("#EntitySet").serializeArray());
					// $.fn.serializeObject = function() {  
					// if ( !this.length ) { 
					// return false;
					//  }  
					//var ids = ClientUtils.tableGetSelectedAll($("EntitySet").serialize());
				/*var ids = ClientUtils.tableGetSelectedAll("EntitySet");
				var str = ids.join();
				console.log(str);
				var entity =str;		
				//console.log(EntitySet);
				SvseSysLogDao.setQueryCondEntityConfig(entity,function(result){
					console.log(result);
					console.log("成功A！");
				 });*/
				 var Entity = ClientUtils.formArrayToObject($("#EntitySet").serializeArray());
				console.log(Entity);
				var Ent =[];
				for(var E in Entity){
					console.log(Entity[E]);
					Ent.push(Entity[E]);
				}
				console.log(Ent.join());
				SvseSysLogDao.setQueryCondEntityConfig(Ent,function(result){
					console.log(result);
					console.log("成功！");
				});
				 
				},

		//设备参数设置重新获取
		"click #SysLogsettingEntityrecoverbtn":function(){
				Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,Entity){
				console.log(Entity["Facility"]);
					$(function operateAll(checked){ 
                        checked = checked || true;
                        var objects = document.getElementsByTagName("input")
						for(var i=0;i<objects.length;i++){
							if(objects[i].type=='checkbox'){
							if(checked==false)
								objects[i].checked=""        
								else
								objects[i].checked="checked"
								}
							}
                        }); 
						var result = Entity["Facility"].split(",");
							console.log(result);
							for(var i = 0;i < result.length;i++){
								$("#"+result[i]).attr("checked",true);
								
							}
							});
							console.log("成功B！");
							},
		//级别参数设置应用
		"click #SysLogsettingRankapplybtn":function(){
		       //var Rank=$("#RankSet").find(":checkbox[name='Severities']").val();
				//var ids = ClientUtils.tableGetSelectedAll("RankSet");
				var Rank = ClientUtils.formArrayToObject($("#RankSet").serializeArray());
				console.log(Rank);
				var ras =[];
				for(var r in Rank){
					console.log(Rank[r]);
					ras.push(Rank[r]);
				}
				console.log(ras.join());
				
				//var str1 = ids.join();
				// var str1 = "";
				// for(var j = 0;j < ids.length;j++){
					// if(j == (ids.length - 1)){
						// str1 += ids[j]
				// }else{
					// str1 += ids[j]+",";
				// }
				// }
				//console.log(str1);
				
				// var rank =str1;
				SvseSysLogDao.setQueryCondRankConfig(ras,function(result){
					console.log(result);
					console.log("成功！");
				});
			},
			
		//级别参数设置重新获取
		"click #SysLogsettingRankrecoverbtn":function(){
				Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,Rank){
					console.log(Rank);
					$(function operateAll(checked){ 
					checked = checked || true;
					var objects = document.getElementsByTagName("input")
					for(var i=0;i<objects.length;i++){
						if(objects[i].type=='checkbox'){
						  if(checked==false)
								objects[i].checked=""        
								else
								objects[i].checked="checked"
						}
					}
					}); 
					if(!Rank) return;
					$("#RankSet :checkbox[name=Severities]").val(Rank["checkbox"]);
						});
				console.log("成功B+！");
			},
		"click #SysLogsettinKeepDaygapplybtn":function(){
			var day=$("#keepforday").find(":text[name=KeepDay]").val();
			if(!day){
				Message.info("记录保持天数不能为空！");
				return;
			}
			var length=$("#keepforday :text[name=KeepDay]").val();
				   if(length == 0 || length > 9999){
				 Message.info("记录保持天数必须是大于0的整数(最大只能到9999)！"); 
				 $("#keepforday :text[name=KeepDay]").val(0);
				 return;
			}
				
				console.log("成功！564564");
				var keepforday = ClientUtils.formArrayToObject($("#keepforday").serializeArray());
					console.log(keepforday);
				SvseSysLogDao.setDelCondConfig(keepforday,function(result){
				if(!result){
					console.log("error");
					return;
				}
					console.log(result);
					console.log("成功！");
			});
		},
		//系统日志的删除事件
			"click #delsyslogbtn":function(){
			var id = 'syslog';
			var endPicker = $('#delDatebox').data('datetimepicker');
			
			var endTime = endPicker.getDate();
			var endDate = ClientUtils.dateToObject(endPicker.getDate());
			console.log(endDate);
			console.log("#######################");
			SvseSysLogDao.DeleteRecordsByIds(id,endDate,function(result){
			console.log(endPicker);
			if(!result){
					console.log("error");
					return;
				}
				console.log(result);
			  console.log("删除指定时间之前的日志！");
			});
		},
		//帮助信息
	"click #SysLogsettinghelpbtn" : function(){
	$('#helpmessagediv').modal('toggle');
 
	}
		
}
	
Template.SysLogsetting_status.rendered = function () {
	$(function () {
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("SysLogsetting_statusselectall");
	});
}

Template.SysLogsetting.rendered = function(){
		var template = this;
		$(function() { //初始化日期选择器
			var endDate = new Date();
			$(template.find("#delDatebox")).datetimepicker({
					format: 'yyyy-MM-dd hh:mm:ss',
					language: 'zh-CN',
					endDate : endDate,
					maskInput: false,
			});
		   
			var endPicker = $(template.find("#delDatebox")).data('datetimepicker');
		   
			endPicker.setDate(endDate);
		
		});
		Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,Entity){
			console.log(Entity["Facility"]);
			var result = Entity["Facility"].split(",");
			console.log(result);
			for(var i = 0;i < result.length;i++){
				//$("#"+result[i]).attr("checked",true);
				$("#EntitySet").find("input:checkbox[name="+result[i]+"]").attr("checked",true);
			}
			
		});
			 
		Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,Rank){
			console.log(Rank["Severities"]);
			var result = Rank["Severities"].split(",");
			console.log(result);
			 for(var j = 0;j < result.length;j++){
				$("#RankSet").find("input:checkbox[name="+result[j]+"]").attr("checked",true);
			 }					

		});
		
		Meteor.call("svGetSysLogDelCondConfigSetting",function(err,KeepDay){
				console.log(KeepDay);
			if(!KeepDay) return;
				$("#keepforday :text[name='KeepDay']").val(KeepDay["KeepDay"]);

				 });
		
/*$(function(){
	//在点击删除操作时弹出提示框实现进一步提示
	$("#delsyslogbtn").confirm({
		'message':"确定删除操作？",
		'action':function(){
			/*var ids = getEmailSelectAll();
			console.log(ids);
			SvseEmailDao.checkEmailSelect(ids);
			if(ids.length){
				//在删除之前要先判断报警规则中有没有正在使用的邮件，如果有，则不能删除
				ids = getEmailNameOfAlertUsing(ids);
				console.log(ids);
				if(ids == "") return;
				SvseEmailDao.deleteEmailAddressByIds(ids,function(result){
					console.log(result);
				});
				//console.log("确定");
			}
			$("#delemailsetting").confirm("hide");*/
			/*var id = "syslog";
			var endPicker = $('#delDatebox').data('datetimepicker');
			
			var endTime = endPicker.getDate();
			var endDate = ClientUtils.dateToObject(endPicker.getDate());
			console.log(endDate);
			console.log("#######################");
			SvseSysLogDao.DeleteRecordsByIds(id,endDate,function(result){
			if(!result){
					console.log("error");
					return;
				}
				console.log(result);
			  console.log("删除指定时间之前的日志！");
			});
			$("#delsyslogbtn").confirm("hide");	
			}
	});				
});*/
}
