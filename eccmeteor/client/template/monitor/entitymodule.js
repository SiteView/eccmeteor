
Template.showMonitor.entityid = function () {
	return Session.get("entityid");
}

Template.showMonitor.events={
	"click tbody tr":function(e){
		var id  = e.currentTarget.id;
		if(SessionManage.getCheckedMonitorId() === id)
			return;
		var status = e.currentTarget.title;
		if(!id || id=="") return;
		var ID = {id:id,type:"monitor"}
		Session.set("checkedMonitorId",ID);//存储选中监视器的id
		//用此方法代替上面的存储方式
		SessionManage.setCheckedMonitroId(id);
		drawImage(id);
	},
	"mouseenter tbody tr":function(e){
    	var target = $(e.target);
    	target.find("td:first").width(target.find("td:first").width()+40);
    	target.find("div:eq(1)").css("display","block");

    },
    "mouseleave tbody tr":function(e){
		var target = $(e.target);
		target.find("div:eq(1)").css("display","none");
        target.find("td:first").width(target.find("td:first").width()-40);
    },
     "click #showMonitorList i.icon-trash":function(e){
		var id = e.target.id;
		console.log("删除监视器id:"+id);
		var parentid  = Session.get("checkedTreeNode")["id"];
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			SystemLogger(result);
		});
    },
    "click #showMonitorList i.icon-edit":function(e){
        var id = e.target.id;
        Session.set("showGroupAndEntityEditGroupId",id);
        console.log("编辑监视器id:"+id);
        return;
        $("#showGroupEditdiv").modal('show');
    }
}

Template.showMonitor.rendered = function(){ //默认选中第一个监视进行绘图
	//初始化checkbox全选效果
	$(function(){
        ClientUtils.tableSelectAll("showMonitorTableSelectAll");
    });
	
	$(function(){
		var tr = $("#showMonitorList tr:first").addClass("success");
		if(!tr){
			$("#showSvg").css("display","none");
			return;//如果没有监视器则不画图
		}
		var id = tr.attr("id");
		if(!id || id=="") {
			$("#showSvg").css("display","none");
			return;
		}
		$("#showSvg").css("display","block");
		var ID = {id:id,type:"monitor"}
		Session.set("checkedMonitorId",ID);//存储选中监视器的id
		//用此方法代替上面的存储方式
		SessionManage.setCheckedMonitroId(id);
		drawImage(id);
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
		$("#showMonitorList tr").click(function(){
			var checkbox = $(this).find(":checkbox:first");
			checkbox[0].checked = !checkbox[0].checked;
			$(this).siblings(".success").each(function(){
				$(this).removeClass("success");
				if($(this).find(":checkbox:first")[0].checked){
					$(this).addClass("error");
				}
			});
			$(this).removeClass().addClass("success");

		});
		$("#showMonitorList:checkbox").click(function(event){
			event.stopPropagation();
			if(this.checked){
				if(!$(this).closest("tr").hasClass("success")){
					$(this).closest("tr").addClass("error");
				}
			}else{
				$(this).closest("tr").removeClass("error");
			}
		});
	});
}
Template.recordsData.recordsData = function(){
	return Session.get("recordsData");
}
Template.recordsData.events = {
	"click .btn#monitorDetail" :  function(){
		SwithcView.view(MONITORVIEW.MONITORDETAIL);//设置视图状态为监视器详细信息
	}
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) var count = 200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	Meteor.call("getQueryRecords",id,count, function (err, result) {
		if(err){
			SystemLogger(err);
			return;
		}	
		var dataProcess = new DataProcess(result,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		var table = new DrawTable();//调用 client/lib 下的table.js 中的drawLine函数画图
		table.drawTable(keys,"#tableData");
		var line = new DrawLine(resultData,foreigkeys["monitorPrimary"],foreigkeys["monitorDescript"]);
		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图
		Session.set("recordsData",recordsData);
	});

}