Template.AlerBox.rendered = function(){
    $("#AlerBox").on("close",function(){
        $("#MessageBoxModal").modal("hide");
    })
};

Template.MessageBoxModal.rendered = function(){
	$('#MessageBoxModal').on('shown', function () { //延时关闭
  		// do something…
	})
}