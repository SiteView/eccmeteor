Template.showMonitorDetailSvg.events = {
	"click #queryDetailLineData" : function(e,t){
		MonitorDetailAction.queryDetailLineDataAction(e,t,this);
	},
	"click ul li a":function(e,t){
		MonitorDetailAction.timeLinkClick(e,t,this);
	},
	"click .close":function(e,t){
		RenderTemplate.hideParents(t);
	}
}
Template.showMonitorDetailSvg.rendered = function(){
	MonitorDetailAction.render(this);
}