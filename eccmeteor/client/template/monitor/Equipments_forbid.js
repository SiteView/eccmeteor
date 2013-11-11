/**
	设备组监视器等的临时禁用和永久禁用
*/
Template.ForbidEquipments.rendered = function(){
	var  template = this;
	$(function() { //初始化日期选择器
		var endDate = new Date();
		var startDate = new Date();
		endDate.setTime(endDate.getTime() + 1000*60*60*2);

		$(template.find("#ForbidEquipmentsStartDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			maskInput: false
		});
		$(template.find("#ForbidEquipmentsEndDate")).datetimepicker({
			format: 'yyyy-MM-dd hh:mm:ss',
			language: 'zh-CN',
			endDate : endDate,
			maskInput: false,
		});
		var startPicker = $(template.find("#ForbidEquipmentsStartDate")).data('datetimepicker');
		var endPicker = $(template.find("#ForbidEquipmentsEndDate")).data('datetimepicker');
		Log4js.info(endDate);
		startPicker.setDate(startDate);
		endPicker.setDate(endDate);
	});
}

Template.ForbidEquipments.events = {
	"click #ForbidEquipmentsDivFormForbidBtn":function(e,template){
		LoadingModal.loading();
		var fid = SessionManage.getCheckedTreeNode("id");
		var equipmet = $(template.find("input:hidden[name=equipmetType]"));
		var equipmentIds = equipmet.attr("data-value").split('\,'); //获取批量禁止的节点id
		var equipmentType = equipmet.val();//获取批量禁止的节点的类型 是 （组+设备）  equipments   还是 监视器  monitors
		var type = template.find("input:radio[checked]").value;
		//type  forever 永久禁止 temporary 临时禁止
		if(type === "forever"){
			if(equipmentType === "equipments"){ //（组+设备）
				SvseDao.forbidEquipments(fid,equipmentIds,function(result){
					LoadingModal.loaded();
					if(!result.status)
						Message.error(result.msg);
				});
			}else if(equipmentType === "monitors"){ // 监视器
				SvseDao.forbidMonitors(fid,equipmentIds,function(result){
					LoadingModal.loaded();
					if(!result.status)
						Message.error(result.msg);
				});
			}
		}else{
			var startTime = $(template.find("#ForbidEquipmentsStartDate")).data('datetimepicker').getDate();
			var endTime = $(template.find("#ForbidEquipmentsEndDate")).data('datetimepicker').getDate();
			if(equipmentType === "equipments"){ //（组+设备）
				SvseDao.forbidEquipmentsTemporary(fid,equipmentIds,ClientUtils.dateToObject(startTime),ClientUtils.dateToObject(endTime),function(result){
					LoadingModal.loaded();
					if(!result.status)
						Message.error(result.msg);
				})
			}else if(equipmentType === "monitors"){ // 监视器
				SvseDao.forbidMonitorsTemporary(fid,equipmentIds,ClientUtils.dateToObject(startTime),ClientUtils.dateToObject(endTime),function(result){
					LoadingModal.loaded();
					if(!result.status)
						Message.error(result.msg);
				});
			}
		}
	},
	"click #ForbidEquipmentsDivFormCancelBtn":function(){
		$("#ForbidEquipments").modal("hide");
	}
}