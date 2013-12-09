Template.SysLogsetting.events={
        //设备参数设置应用
		"click #SysLogsettingEntityapplybtn":function(){
				//var EntitySet = ClientUtils.formArrayToObject($("#EntitySet").serializeArray());
				var ids = ClientUtils.tableGetSelectedAll("EntitySet");
				var str = "";
				for(var i = 0;i < ids.length;i++){
					str += ids[i]+",";
				}
				console.log(str);
				var entity ={Facility:str};
				
				//console.log(EntitySet);
				SvseSysLogDao.setQueryCondEntityConfig(entity,function(result){
					console.log(result);
					console.log("成功A！");
				});
			},
		//设备参数设置重新获取
		"click #SysLogsettingEntityrecoverbtn":function(){

			/*$(function operateAll(checked){ 
			checked != checked || false;
			var objects = document.getElementsByTagName("input")
			for(var i=0;i<objects.length;i++){
				if(objects[i].type=='checkbox'){
				  if(checked==true)
					objects[i].checked=""	
					else
					objects[i].checked="checked"
				}
			}
			})*/ 
				Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,Entity){
				console.log("成功-------！");
					console.log(Entity);
					if(!Entity) return;
					$("#EntitySet :text[checkbox=checkbox]").val(Entity["checkbox"]);
					
				});
				console.log("成功B！");
				},
		//级别参数设置应用
		"click #SysLogsettingRankapplybtn":function(){
				var ids = ClientUtils.tableGetSelectedAll("RankSet");
				var str1 = "";
				
				for(var j = 0;j < ids.length;j++){
					str1 += ids[j]+",";
				}
				console.log(str1);
				
				var rank ={Severities:str1};
				SvseSysLogDao.setQueryCondRankConfig(rank,function(result){
					console.log(result);
					console.log("成功！");
				});
			},
		//级别参数设置重新获取
		"click #SysLogsettingRankrecoverbtn":function(){
					Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,Rank){
								console.log(Rank);
								if(!Rank) return;
								//$("#RankSet :type[name=Severities]").val(Rank["Severities"]);
							});
			// $(function operateAll(checked){ 
			// checked != checked || false;
			// var objects = document.getElementsByTagName("input")
			// for(var i=0;i<objects.length;i++){
				// if(objects[i].type=='checkbox'){
				  // if(checked==true)
					// objects[i].checked=""	
					// else
					// objects[i].checked="checked"
				// }
			// }
		// })
		
		},
		"click #SysLogsettinKeepDaygapplybtn":function(){
			var day=$("#keepforday").find(":text[name=KeepDay]").val();
			//if(!day || day <= 0){
			if(!day){
				Message.info("记录保持天数不能为空！");
				return;
			}
			var length=$("#keepforday :text[name=KeepDay]").val();
				   if(length == 0 || length > 9999){
				 Message.info("记录保持天数必须是大于0的整数(最大只能到9999)！"); 
				 $("#keepforday :text[name=KeepDay]").val();
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
			"click #dellogbtn":function(){
			  console.log("删除指定时间之前的日志！");
			},
		
	}

Template.SysLogsetting.rendered = function(){
			var template = this;
			$(function() { //初始化日期选择器
				var endDate = new Date();
				$(template.find("#date")).datetimepicker({
						format: 'yyyy-MM-dd hh:mm:ss',
						language: 'zh-CN',
						endDate : endDate,
						maskInput: false,
				});
			   
				var endPicker = $(template.find("#date")).data('datetimepicker');
			   
				endPicker.setDate(endDate);
		
			
							});
		/*	Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,Entity){
				console.log(Entity);
			if(!Entity) return;
			//$("#EntitySet :text[checkbox=checkbox]").val(Entity["checkbox"]);

				 });
				 
			Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,Rank){
				console.log(Rank);
			if(!Rank) return;
			//$("#RankSet :text[checkbox=checkbox]").val(Rank["checkbox"]);

				 });*/
							
}
