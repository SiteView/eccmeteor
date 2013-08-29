Template.showMonitor.entityid = function () {
	return SessionManage.getEntityId();
}

Template.showMonitor.events={
	"click tbody tr":function(e){
		var id  = e.currentTarget.id;
		if(SessionManage.getCheckedMonitorId() === id)
			return;
		var status = e.currentTarget.title;
		if(!id || id=="") return;
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(id);
		drawImage(id);
	},
    "click #showMonitorList button[name='trash']":function(e){
		var id = e.target.id;
		console.log("删除监视器id:"+id);
		var parentid  = SessionManage.getCheckedTreeNode("id");
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			SystemLogger(result);
		});
    },
 	"click #showMonitorList button[name='edit']":function(e){
        var id = e.target.id;
        console.log("编辑监视器id:"+id);
        SessionManage.setCheckedMonitorId(id);
        var monitorTemplateId = SvseMonitorDao.getMonitorTemplateIdByMonitorId(id);
        //设置监视器模板id
        Session.set("monityTemplateId",monitorTemplateId);
        Session.set("monitorStatus","编辑");
        $("#showMonitorInfoDiv").modal('show');
    }
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
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(id);
		drawImage(id);
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
	//	var table = new DrawTable();//调用 client/lib 下的table.js 中的drawLine函数画图
	//	table.drawTable(keys,"#tableData");
		SessionManage.setMonitorStatisticalDetailTableData(keys);
		SystemLogger(keys);
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