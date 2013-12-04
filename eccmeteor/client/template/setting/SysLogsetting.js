Template.SysLogsetting.events={
        //设备参数设置应用
		"click #SysLogsettingEntityapplybtn":function(){
				var EntitySet = ClientUtils.formArrayToObject($("#EntitySet").serializeArray());
				console.log(EntitySet);
				SvseSysLogDao.setQueryCondEntityConfig(EntitySet,function(result){
					console.log(result);
					console.log("成功！");
				});
							$(function () {
    var inputs = document.getElementById('input');
    
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'checkbox') {
            inputs[i].onclick = function () {
                
                alert(this.value);
            };
        }
    }
});
			},

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
		Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,EntitySet){
			console.log(EntitySet);
			if(!EntitySet) return;
			$("#EntitySet :name[name=Facility]").val(EntitySet["Facility"]);
		});
		console.log("成功！");
		},
		//级别参数设置应用
		"click #SysLogsettingRankapplybtn":function(){
				var RankSet = ClientUtils.formArrayToObject($("#RankSet").serializeArray());
				console.log(RankSet);
				SvseSysLogDao.setQueryCondRankConfig(RankSet,function(result){
					console.log(result);
					console.log("成功写入！");
				});
			},
		"click #SysLogsettingRankrecoverbtn":function(){
			Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,EntitySet){
						console.log(EntitySet);
						if(!EntitySet) return;
						$("#RankSet :type[name=Severities]").val(EntitySet["Severities"]);
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
		"click #SysLogsettingapplybtn3":function(){
		var day=$("#keepforday").find(":text[name=KeepDay]").val();
		//if(!day || day <= 0){
		if(!day){
			Message.info("记录保持天数不能为空！");
			return;
		}
		var length=$("#keepforday :text[name=KeepDay]").val();
		       if(length == 0 || length > 70){
			 Message.info("记录保持天数必须是大于0的整数！"); 
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

}
//设备参数设置应用
// Template.SysLogsetting_status.events({
	// "click #SysLogsettingapplybtn":function(){
		// var methodsendforlib = ClientUtils.formArrayToObject($("#methodsendforlib").serializeArray());
		// console.log(methodsendforlib);
		// SvseSysLogDao.setMessageWebConfig(methodsendforlib,function(result){
			// console.log(result);
			// console.log("成功！");
		// });
	// }
// });
// Template.SysLogsetting_status.rendered = function(){
	 // Meteor.call("svGetSysLogConfigSetting",function(err,day){
					 // console.log(day);
					 // if(!day) return;
					 // $("#keepforday :text[name=KeepDay]").val(day["KeepDay"]);
				 // });


// }