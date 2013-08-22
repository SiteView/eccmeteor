Template.BodyContentOfMonitor.rendered = function(){
	if(!Session.get("moitorContentRendered"))
		Session.set("moitorContentRendered",true); //渲染完毕
}