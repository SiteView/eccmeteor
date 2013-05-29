Template.showQuickMonityTemplate.monities = function(){
	var entityDevicetype =  Session.get("showEntityId");
	SystemLogger("快速添加的设备类型是："+entityDevicetype);
	return SvseEntityTemplateDao.getEntityMontityByDevicetype(entityDevicetype,true);
}

Template.showQuickMonityTemplate.events = {
	"click #chooseallqucikmonitor" : function () {
		$("#quickMonitorList :checkbox").each(function(){
			this.checked = true;
		});
	},
	"click #unchooseallqucikmonitor" : function(){
		$("#quickMonitorList :checkbox").each(function(){
			this.checked = !this.checked;
		});
	},
	"click #savequickmonitorlist" : function () {
		$("#quickMonitorList :checkbox").each(function(){
			if(!this.checked) 
				return;
		});
	},
	"click #cancequickmonitorlist" : function() {
		
	}
}