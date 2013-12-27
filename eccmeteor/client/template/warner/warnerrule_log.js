/* var logPage = new Pagination("alertLogList",{currentPage:1,perPage:6});

Template.selectwarnerloglist.queryalertlog = function(){
	var queryalertlog = Session.get("queryAlertLog");
	console.log(queryalertlog);
	return queryalertlog(logPage.skip());
}

Template.selectwarnerloglist.logPager = function(){
	var queryalertlog = Session.get("queryAlertLog");
	var count = queryalertlog.length;
	return logPage.create(count);
} */

Template.warnerrulelog.rendered = function(){
	var template = this;
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$(template.find("#alertdatetimepickerStartDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$(template.find("#alertdatetimepickerEndDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $(template.find("#alertdatetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#alertdatetimepickerEndDate")).data('datetimepicker');
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
//		$('#alertdatetimepickerStartDate').on('changeDate', function(e) {
//			endPicker.setstartDate(e.date);
//		});
//		$('#alertdatetimepickerEndDate').on('changeDate', function(e) {
//			startPicker.setEndDate(e.date);
//		});
		//接收手机号下拉列表多选框
		$('.messagemultiselect').multiselect({
			buttonClass : 'btn',
			buttonWidth : "auto",
			buttonContainer : '<div class="btn-group" />',
			maxHeight : 200,
			//textAlign: left,
			enableFiltering : true,
			buttonText : function (options) {
				if (options.length == 0) {
					return 'None selected <b class="caret"></b>';
				} else if (options.length > 3) {
					return options.length + ' selected  <b class="caret"></b>';
				} else {
					var selected = '';
					options.each(function () {
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
				}
			}
		});
		
	});
}

//获取报警规则列表
Template.warnerrulelog.warnerruleoflist = function(){
	var rulelist = SvseWarnerRuleDao.getWarnerRuleList();
	console.log(rulelist);
	return SvseWarnerRuleDao.getWarnerRuleList();
}

//获取报警规则的类型
Template.warnerrulelog.alertTypes = function(){
	console.log(SvseAlertLogDao.defineAlertTypeData());
	return SvseAlertLogDao.defineAlertTypeData();
}


//获取报警接收人地址的数组
Template.warnerrulelog.alertReceivers = function(){
	//console.log(alertReceiver());
	return alertReceiver();
}

//报警日志的查询事件
Template.warnerrulelog.events({
	"click #selectalertlogbtn":function(){
		var alertlogquerycondition = ClientUtils.formArrayToObject($("#alertlogquerycondition").serializeArray());
		console.log(alertlogquerycondition);
		$("#warnerloglist").empty();
		var startPicker = $('#alertdatetimepickerStartDate').data('datetimepicker');
		var endPicker = $('#alertdatetimepickerEndDate').data('datetimepicker');
		var startTime = startPicker.getDate();
		var endTime = endPicker.getDate();
		if(startTime != "" && endTime !=""){
			if(startTime > endTime){
				Message.info("报警开始时间晚于报警结束时间！");
				return;
			}
		}
		var beginDate = ClientUtils.dateToObject(startPicker.getDate());
		var endDate = ClientUtils.dateToObject(endPicker.getDate());
		console.log("#############################");
		console.log(beginDate);
		console.log(endDate);
		console.log("#######################");
		
		SvseAlertLogDao.getQueryAlertLog(beginDate,endDate,alertlogquerycondition,function(result){
			console.log("result");
			if(!result.status){
				Log4js.info(result.msg);
				return;
			}
			console.log(result);
			//var dataProcess = new DataProcess(result.content);
			var resultData = result.content;
			if(!resultData){
				console.log("查出报警日志没有数据");
				return;
			}
			//console.log(resultData.length);
			//console.log(resultData);
			var types = SvseAlertLogDao.defineAlertTypeData();
			//绘制表
			for(var i = 0;i < resultData.length;i++){
				var data = resultData[i];
				//判断报警状态的显示
				if(data["_AlertStatus"] == 0){
					data["_AlertStatus"] = "Fail";
				}
				if(data["_AlertStatus"] == 1){
					data["_AlertStatus"] = "Success";
				}
				for(var j = 0; j < types.length;j++){
					if(data["_AlertType"] == types[j]["id"]){
						data["_AlertType"] = types[j]["type"];
					}
				}
				var tbody = "<tr><td>"+data["_AlertTime"]+"</td><td>"+data["_AlertRuleName"]+"</td><td>"+data["_DeviceName"]+"</td>"
				+"<td>"+data["_MonitorName"]+"</td><td>"+data["_AlertType"]+"</td><td>"+data["_AlertReceive"]+"</td><td>"+data["_AlertStatus"]+"</td></tr>";
				$("#warnerloglist").append(tbody);
			}
			
		});
	}
});


//获取报警接收人地址(注意：此处暂时只考虑了值只有一个的情况，如果是多个的话要进一步修改--多个值的情况已经修改完成)
var alertReceiver = function(){
	var allalerts = SvseWarnerRuleDao.getWarnerRuleList();
	//console.log(allalerts);
	var alertReceiver = [];
	var rec = {};
	var result = [];
	for(var i = 0;i < allalerts.length;i++){
		var recevier = allalerts[i];
		if(recevier.AlertType == "EmailAlert"){
			//跟邮件设置相关联的邮件地址
			if(recevier.EmailAdress){
				if(recevier.EmailAdress == "" || recevier.EmailAdress=="其他") continue;
				//console.log(recevier.EmailAdress);
				var emailAdress = recevier.EmailAdress.split(",");
				//console.log("-------------------");
				var address = [];
				for(var k = 0;k < emailAdress.length;k++){
					//console.log(emailAdress[k]);
					var mulemail = SvseEmailDao.getEmailByName(emailAdress[k]);
					if(!mulemail){
						console.log("这个邮件地址可能已经不存在了！");
						continue;
					}
					address.push(mulemail.MailList);
				}
				//console.log(address);
				var addressStr = SvseWarnerRuleDao.getValueOfMultipleSelect(address);
				if(addressStr != ""){
					alertReceiver.push(addressStr);
				}
			}
			//其他的邮件地址
			// if(recevier.OtherAdress){
				// alertReceiver.push(recevier.OtherAdress);
			// }
		}else if(recevier.AlertType == "SmsAlert"){
			//跟短信设置相关联的短信手机号
			if(recevier.SmsNumber){
				if(recevier.SmsNumber == "" || recevier.SmsNumber=="其他") continue;
				//console.log(recevier.SmsNumber);
				var smsnumber = recevier.SmsNumber.split(",");
				//console.log(smsnumber);
				//console.log("-------------------");
				var numbers = [];
				for(var j = 0;j < smsnumber.length;j++){
					//console.log(smsnumber[j]);
					var mulmessage = SvseMessageDao.getMessageByName(smsnumber[j]);
					if(!mulmessage){
						console.log("这个短信接收手机号可能已经不存在了！");
						continue;
					}
					console.log("------");
					console.log(mulmessage.Phone);
					numbers.push(mulmessage.Phone);
				}
				//console.log(numbers);
				var numberStr = SvseWarnerRuleDao.getValueOfMultipleSelect(numbers);
				if(numberStr != ""){
					alertReceiver.push(numberStr);
				}
				
			}
			//其他的短信手机地址
			// if(recevier.OtherNumber){
				// alertReceiver.push(recevier.OtherNumber);
			// }
		}else if(recevier.ScriptServer){
			if(recevier.ScriptServer == "192.168.1.127(Windows)(_win)"){
				recevier.ScriptServer = "192.168.1.127";
			}
			alertReceiver.push(recevier.ScriptServer);			
		}else if(recevier.Server){
			//console.log(recevier.Server);
			alertReceiver.push(recevier.Server);
		}
		
	}
	console.log(alertReceiver);
	//对数组去除重复项
	for(var j = 0;j < alertReceiver.length;j++){
		if(!rec[alertReceiver[j]]){   
          rec[alertReceiver[j]] = true;   
          result.push(alertReceiver[j]);   
		}  
	}
	//console.log(result);
	console.log(result.sort());//进行排序
	return result.sort();
}
