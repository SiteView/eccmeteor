Template.showMonitorDetailSvg.events = {
	"click #queryDetailLineData" : function(e,t){
		MonitorDetailAction.queryDetailLineDataAction(e,t,this);
	},
	"click ul li a":function(e,t){
		MonitorDetailAction.timeLinkClick(e,t,this);
	}
}
Template.showMonitorDetailSvg.rendered = function(){
	MonitorDetailAction.render(this);
}