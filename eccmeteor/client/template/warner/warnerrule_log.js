Template.warnerrulelog.rendered = function(){
	var template = this;
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		startDate.setTime(startDate.getTime() - 1000*60*60*24);
		$(template.find("#AlertdatetimepickerStartDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$(template.find("#AlertdatetimepickerEndDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $(template.find("#AlertdatetimepickerStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#AlertdatetimepickerEndDate")).data('datetimepicker');
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
//		$('#AlertdatetimepickerStartDate').on('changeDate', function(e) {
//			endPicker.setstartDate(e.date);
//		});
//		$('#AlertdatetimepickerEndDate').on('changeDate', function(e) {
//			startPicker.setEndDate(e.date);
//		});
		//接收手机号下拉列表多选框
		$('.messagemultiselect').multiselect({
			buttonClass : 'btn',
			buttonWidth : 200,
			buttonContainer : '<div class="btn-group" />',
			maxHeight : 400,
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
Template.warnerrulelog.warnerrulelist = function(){
	console.log(SvseWarnerRuleDao.getWarnerRuleList());
	return SvseWarnerRuleDao.getWarnerRuleList();
}