var confirmtip = function(){
	var flag = false;
	
	return flag;
}


Template.confirmTipModal.rendered = function(){
	$(function(){
		var flag = false;
		$("#yestipbtn").click(function(){
			flag = true;
			//console.log("flag:"+flag);
			$("#confirmTipModalDiv").modal("hide");
		});
		$("#notipbtn").click(function(){
			flag = false;
			//console.log("flag:"+flag);
			Session.set("flag",flag);
			$("#confirmTipModalDiv").modal("hide");
		});
		
	});
	
	
}