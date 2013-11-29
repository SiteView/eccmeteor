Template.SysLogsetting.events={
		"click #SysLogsettingrecoverbtn":function(){

			$(function operateAll(checked){ 
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
		})
		console.log("成功！");
		},
		"click #SysLogsettingrecoverbtn1":function(){

			$(function operateAll(checked){ 
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
		})
		},
		"click #syslogsettingapplybtn3":function(){
			console.log("成功！");
			
			var count=home3["Count"];
			
			   if(!count){
				Message.info("输入天数不能为空！",{align:"center",time:3});
				return;
			 }
}
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
Template.SysLogsetting_status.events({
	"click #SysLogsettingapplybtn":function(){
		var methodsendforlib = ClientUtils.formArrayToObject($("#methodsendforlib").serializeArray());
		console.log(methodsendforlib);
		SvseSysLogDao.setMessageWebConfig(methodsendforlib,function(result){
			console.log(result);
			console.log("成功！");
		});
	}
});