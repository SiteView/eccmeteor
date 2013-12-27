
//查询结果分页
 /*var logPage = new Pagination("sysLogList",{currentPage:1,perPage:6});

Template.sysLogList.querysyslog = function(){
	var querysyslog = Session.get("querysyslog");
	console.log(querysyslog);
	return querysyslog(logPage.skip());
}

Template.sysLogList.logPager = function(){
	var querysyslog = Session.get("querysyslog");
	var count = querysyslog.length;
	return logPage.create(count);
} */

//Syslog的查询事件
Template.sysLogQuery.events({
		"click #selectsyslogbtn":function(){
				// var syslogquerycondition = ClientUtils.formArrayToObject($("#syslogquerycondition").serializeArray());
				 //var syslogquerycondition = ClientUtils.tableGetSelectedAll("syslogquerycondition");
				 console.log(syslogquerycondition);
						 
				//查询条件（正则表达式）		 
				var expression = $("#expression").val();
				console.log(expression);

				//查询条件（IP）
				var SourceIp = $("#SourceIp").val();
				
					console.log(SourceIp);
					
				$("#syslogDetailList").empty();
				var startPicker = $('#syslogdatetimepickerStartDate').data('datetimepicker');
				var endPicker = $('#syslogdatetimepickerEndDate').data('datetimepicker');
				var startTime = startPicker.getDate();
				var endTime = endPicker.getDate();
				if(startTime != "" && endTime !=""){
					if(startTime > endTime){
						Message.info("开始时间大于结束时间！");
						return;
					}
				}	
				var beginDate = ClientUtils.dateToObject(startPicker.getDate());
				var endDate = ClientUtils.dateToObject(endPicker.getDate());
				console.log("#############################");
				console.log(beginDate);
				console.log(endDate);
				console.log("#######################");
				
				//id = 'syslog';
				SvseSysLogDao.getQuerySysLog(beginDate,endDate,function(result){
					console.log("result");
					if(!result.status){
						Log4js.info(result.msg);
						return;
					}
					console.log(result);
					/*
					//var dataProcess = new DataProcess(result.content);
					//console.log(dataProcess);
					//var resultData= dataProcess.getData();
					*/
					var resultData = result.content;
					if(!resultData){
						Message.info("没有要显示的数据！");
						return;
					}
					console.log(resultData.length);
					console.log(resultData);
					console.log("------------------");
					var table = [];
					for(var i = 0;i < resultData.length;i++){
						table.push(resultData[i]);
					}
					//console.log(table);
					//判断正则表达式
					if(expression){
						var resultData = [];
						for(var i = 0;i< table.length;i++){
							expression = new RegExp("([ftph]+://[a-zA-Z0-9\._-]+)","img");
							//expression = new RegExp("[\u4e00-\u9fa5\\w]+","img");
							//expression.test(syslogmsg);
							var syslogmsg = table[i]["_SysLogMsg"]
							var flag = syslogmsg.match(expression);
							if(flag){
								resultData.push(table[i]);
								console.log("yes");
							}
						}
					}
					console.log(resultData);
					console.log("以上是正则表达式筛选");
					
					//判断IP地址
					if(SourceIp){
						var resultData = [];
						for(var i = 0;i< table.length;i++){
							var _SourceIp = table[i]["_SourceIp"]
							if(SourceIp == _SourceIp){
								resultData.push(table[i]);
								console.log("yes");
							}
						}
					}
					 console.log("以下判断IP地址筛选");
					 console.log(resultData);
					//复选框的选中条件查询
					/*	var syslogquerycondition = ClientUtils.formArrayToObject($("#syslogquerycondition").serializeArray());
							console.log(syslogquerycondition);
						var resultData =[];
						for(var r in syslogquerycondition){
							console.log(syslogquerycondition[r]);
							resultData.push(syslogquerycondition[r]);
						}
						console.log(resultData.join());
						
					var ids = [];
					for(var i=0;i<ids.length;i++){
					     if(ids[i].checked == true){
						 //查询
						 }
					else{
					
					}
					
					}*/
					/*if (0.isChecked() || 1.isChecked() || 2.isChecked()
						|| 3.isChecked() || 4.isChecked() || 5.isChecked()
						|| 6.isChecked() || 7.isChecked() || 8.isChecked()
						|| 9.isChecked() || 10.isChecked() || 11.isChecked()
						|| 12.isChecked() || 13.isChecked() || 14.isChecked()
						|| 15.isChecked() || 16.isChecked() || 17.isChecked()
						|| 18.isChecked() || 19.isChecked() || 20.isChecked()
						|| 21.isChecked() || 22.isChecked() || 23.isChecked()) {						
						}*/
					var types = SvseSysLogDao.defineparameterTypeData();
					//绘制表
					for(var i = 0;i < resultData.length;i++){
						var data = resultData[i];
						for(var j = 0; j < types.length;j++){
							if(data["_Level"] == types[j]["name"]){
								data["_Level"] = types[j]["type"];
							}
							if(data["_Facility"] == types[j]["id"]){
								data["_Facility"] = types[j]["type"];
							}
						}
						var tbody = "<tr><td>"+data["creat_time"]+"</td><td>"+data["_SourceIp"]+"</td><td>"+data["_Facility"]+"</td>"
						+"<td>"+data["_Level"]+"</td><td>"+data["_SysLogMsg"]+"</td></tr>";
						$("#syslogDetailList").append(tbody);
					}
				});
			}
		});
		

// Template.sysLogList.syslogDetailList = function(){
	// console.log(SvseSyslogDao.getSyslogList());
	
	// return SvseSyslogDetailList.find({},page.skip());
	
// }
	//分页列表
// var page = new Pagination("syslogPagination",{perPage:20});

// Template.sysLogList.svseSyslogDetailList = function(){
  // return SvseSyslogDetailList.find({},page.skip());
// }
  
// Template.sysLogList.pager = function(){
  // return page.create(SvseSyslogList.find().count());
// }
	
Template.sysLogQuery.rendered = function(){
	var template = this;
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$(template.find("#syslogdatetimepickerStartDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$(template.find("#syslogdatetimepickerEndDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $(template.find("#syslogdatetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#syslogdatetimepickerEndDate")).data('datetimepicker');
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);	
				/*$('.sysmultiselect').multiselect({
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
				});*/
				
			});
			//页面渲染
			Meteor.call("svGetSysLogQueryContEntityConfigSetting",function(err,Entity){
						console.log(Entity["Facility"]);
						var result = Entity["Facility"].split(",");
						console.log(result);
						for(var i = 0;i < result.length;i++){
							$("#"+result[i]).attr("checked",true);
							//$("#syslogquerycondition").find("input:checkbox[id='result[i]']").attr("checked",true);
						}
						
					});
			//页面渲染
			Meteor.call("svGetSysLogQueryContRankConfigSetting",function(err,Rank){
				console.log(Rank["Severities"]);
				var result = Rank["Severities"].split(",");
				console.log(result);
				 for(var j = 0;j < result.length;j++){
					$("#syslogquerycondition").find("input:checkbox[name="+result[j]+"]").attr("checked",true);
				 }					

			});
}
// Template.SysLogList.SyslogDetailList = function(){
	// return SessionManage.getSyslogDetailList();
// }
	