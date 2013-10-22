LoadingModal = {
	loading:function(){
		console.log("==================================正在加载...==================================");
		$("LoadingModal").modal('show');
	},
	loaded:function(){
		console.log("==================================加载完毕...==================================");
		$("LoadingModal").modal('hide');
	}
}