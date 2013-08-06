Template.showGroupAndEntity.svid = function () {
	return Session.get("svid");
}

Template.showGroupAndEntity.events({
    "click #showGroupAndEntityTableGroupList i.icon-trash":function(e){
		var id = e.target.id;
		console.log("删除组id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
     "click #showGroupAndEntityTableGroupList i.icon-edit":function(e){
        var id = e.target.id;
        Session.set("showGroupAndEntityEditGroupId",id);
        console.log("编辑组id:"+id);
        $("#showGroupEditdiv").modal('show');
    },
    "click #showGroupAndEntityTableEntityList i.icon-trash":function(e){
		var id = e.target.id;
		console.log("删除设备id:"+id);
		SvseDao.removeNodesById(id,function(result){
			if(!result.status){
				console.log(result.msg);
			}
		});
    },
     "click #showGroupAndEntityTableEntityList i.icon-edit":function(e){
        var id = e.target.id;
        console.log("编辑设备id:"+id);
        Session.set("showGroupAndEntityEditEntityId",id);
        $("#showEditEntityDiv").modal('show');
    },
    "mouseenter tbody tr":function(e){
    	var target = $(e.target);
    	target.find("td:first").width(target.find("td:first").width()+35);
    	target.find("div:eq(1)").css("display","block");

    },
    "mouseleave tbody tr":function(e){
		var target = $(e.target);
		target.find("div:eq(1)").css("display","none");
        target.find("td:first").width(target.find("td:first").width()-35);
    }
});


Template.showGroupAndEntity.rendered = function(){
    //初始化checkbox全选效果
    $(function(){
        ClientUtils.tableSelectAll("showGroupAndEntityTableGroupSelectAll");
        ClientUtils.tableSelectAll("showGroupAndEntityTableEntitySelectAll");
    });
    //光标手状
    $(function(){
        $("tbody i").mouseenter(function(){
        	$(this).css("cursor","pointer");
        }).mouseleave(function(){
        	$(this).css("cursor","auto");
        });
    });
	//选中变色
	$(function(){
		$("tbody tr").click(function(){
			var checkbox = $(this).find(":checkbox:first");
			checkbox[0].checked = !checkbox[0].checked;
			if(checkbox[0].checked){
				$(this).addClass("error");
			}else{
				$(this).removeClass("error");
			}
		});
		$("tr :checkbox").click(function(){
			if(this.checked){
				$(this).closest("tr").addClass("error");
			}else{
				$(this).closest("tr").removeClass("error");
			}
		});
	});
    
}