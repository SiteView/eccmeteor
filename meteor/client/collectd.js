Meteor.subscribe("monitor",function(){
	console.log("monitor 订阅完成");
	Session.set("monitor",true);
});

Template.hello.cpus = function(){
	return Monitor.find({type:"cpu"},{sort:{recordDate:-1},limit:20});
}

Template.svg.rendered = function(){
	Session.set("realyTest",true);
}

Deps.autorun(function(){
	if(Session.get("realyTest") && Session.get("monitor")){
		var data = Monitor.find({},{sort:{recordDate:-1}}).fetch();
		DrawMonitorModuleLine.dynamicDraw(data,"svg#svg");
	}
});