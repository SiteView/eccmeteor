var confirmtip = function(){
	var flag = false;
	
	return flag;
}


Template.confirmTipModal.rendered = function(){
	$(function(){
		var confirmtip1 = function(){
			var flag=false;
			$("#yestipbtn").click(function(){
				flag = true;
				console.log("flag:"+flag);
				$("#confirmTipModalDiv").modal("hide");
			});
			console.log("flag:"+flag);
			return flag;
		}
		var confirmtip2 = function(){
			var flag=false;
			$("#notipbtn").click(function(){
				flag = true;
				console.log("flag:"+flag);
				//Session.set("flag",flag);
				$("#confirmTipModalDiv").modal("hide");
			});
			return flag;
		}
		//console.log(confirmtip());
		
		if(confirmtip1()){
			console.log("yes");
		}
		if(confirmtip2()){
			console.log("no");
		}
	});
		
}

Template.confirmTipModal.events({
	
});