Template.showMonitor.entityid = function () {
	return SessionManage.getCheckedTreeNode("id");
}

Template.showMonitor.getChildrenNodesByIdAndType = function(id,subtype){
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(id,subtype);
    return SvseTreeDao.getNodesByIds(childrenIds);
}

Template.showMonitor.events={
	"click tbody tr":function(e){
		var id  = e.currentTarget.id;
		if(SessionManage.getCheckedMonitorId() === id)
			return;
	//	var status = $(e.currentTarget).attr("data-status");
		if(!id || id=="") return;
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(id);
		drawImage(id);
	},
    "click #showMonitorList button[name='trash']":function(e){
		var id = e.currentTarget.id;
		console.log("删除监视器id:"+id);
		var parentid  = SessionManage.getCheckedTreeNode("id");
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			SystemLogger(result);
		});
    },
 	"click #showMonitorList button[name='edit']":function(e){
        var id = e.currentTarget.id;
        console.log("编辑监视器id:"+id);
        SessionManage.setCheckedMonitorId(id);
        var monitorTemplateId = SvseMonitorDao.getMonitorTemplateIdByMonitorId(id);
        //设置监视器模板id
        Session.set("monityTemplateId",monitorTemplateId);
        Session.set("monitorStatus","编辑");
        $("#showMonitorInfoDiv").modal('show');
    },
    "mouseenter #showMonitorList img":function(e){
    	$(e.currentTarget).popover('show');
    },
    "mouseleave #showMonitorList img":function(e){
    	$(e.currentTarget).popover('hide');
    }
    /*,
    "mouseenter #showMonitorList div.descriptTd":function(e){
    	
    	$(e.currentTarget).tooltip('show');
    },
    "mouseleave #showMonitorList div.descriptTd":function(e){

    	$(e.currentTarget).tooltip('hide');
    }*/
}

Template.showMonitor.rendered = function(){ //默认选中第一个监视进行绘图
	//初始化checkbox全选效果
	$(function(){
        //隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("showMonitorList");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("showMonitorTableSelectAll");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("showMonitorList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("showMonitorList");
    });
	//默认选中第一个监视器，展示数据
	$(function(){
		var tr = $("#showMonitorList tr:first").addClass("success");
		var id = tr.attr("id");
		if(id && id !=""){
			SessionManage.setCheckedMonitorId(id);
			drawImage(id);
		}else{
			emptyImage();
		}
	});
}

Template.MonitorStatisticalSimpleData.recordsData = function(){
	return SessionManage.getMonitorRuntimeTableData();
}

Template.MonitorStatisticalSimpleData.events({
	"click .btn#monitorDetail" :  function(){
		SwithcView.view(MONITORVIEW.MONITORDETAIL);//设置视图状态为监视器详细信息
	}
})

Template.MonitorStatisticalDetailData.monitorStatisticalDetailTableData = function(){
	return SessionManage.getMonitorStatisticalDetailTableData();
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) 
		var count = 200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	SvseMonitorDao.getMonitorRuntimeRecords(id,count,function(result){
		if(!result.status){
			SystemLogger(result.msg);
			return;
		}
		var records = result.content;
		var dataProcess = new DataProcess(records,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		SessionManage.setMonitorStatisticalDetailTableData(keys);
		var line = new DrawLine(
							resultData,
							{
								key:foreigkeys["monitorPrimary"],
								label:foreigkeys["monitorDescript"],
								width:$("svg#line").parent().width(),
								height:150
							},
							"svg#line");

		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图;
		SessionManage.setMonitorRuntimeTableData(recordsData);
	});
}
function emptyImage(){
	SessionManage.setMonitorStatisticalDetailTableData(null);
	SessionManage.setMonitorRuntimeTableData({
		ok:0,
		warning:0,
		error:0,
		disable:0,
		starttime:"---",
		endtime:"---"
	});
	$("svg#line").empty();	
	d3.select("svg#line")
		.attr("height",150)
		.append("g")
		.append("text")
		.attr("x","50%")
		.attr("y","50%")
		.text("暂无数据")
		.style("text-anchor", "middle");
			
}