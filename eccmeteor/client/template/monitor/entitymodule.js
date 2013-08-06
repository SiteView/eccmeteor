
Template.showMonitor.entityid = function () {
	return Session.get("entityid");
}

Template.showMonitor.events={
	"click tbody tr":function(e){
		var id  = e.currentTarget.id;
		var status = e.currentTarget.title;
		if(!id || id=="") return;
		var ID = {id:id,type:"monitor"}
		Session.set("checkedMonitorId",ID);//存储选中监视器的id
		//用此方法代替上面的存储方式
		SessionManage.setCheckedMonitroId(id);
		drawImage(id);
	}
}

Template.showMonitor.rendered = function(){ //默认选中第一个监视进行绘图
	SystemLogger("1");
	//初始化checkbox全选效果
	$(function(){
        ClientUtils.tableSelectAll("showMonitorTableSelectAll");
    });
	
	$(function(){
		var tr = $("#showMonitorList tr:first");
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