Template.AlerBox.rendered = function(){
    $("#AlerBox").on("close",function(){
        $("#MessageBoxModal").modal("hide");
    })
};

Template.MessageBoxModal.rendered = function(){}