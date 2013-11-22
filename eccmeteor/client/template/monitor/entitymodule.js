var PagerMonitor = new Pagination("subentitylist",{currentPage: 1,perPage:5});

Template.MonitorList.pagerMonitor = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
	return PagerMonitor.create(SvseTreeDao.getNodeCountsByIds(childrenIds));
}

Template.MonitorList.Monitors = function(){
	var entityId = SessionManage.getCheckedTreeNode("id");
    var childrenIds = SvseDao.getChildrenIdsByRootIdAndChildSubType(entityId,"submonitor");
    return SvseTreeDao.getNodesByIds(childrenIds,false,PagerMonitor.skip());
}

Template.MonitorList.events={
	"click tbody tr":function(e){
		var checkedMonitorId = this.sv_id;
		if(SessionManage.getCheckedMonitorId() === checkedMonitorId)
			return;
	//	var status = this.status;
		if(!checkedMonitorId || checkedMonitorId=="") return;
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(checkedMonitorId);
		drawImage(checkedMonitorId);
	},
    "click #showMonitorList button[name='trash']":function(e){
		var id = this.sv_id;
		console.log("删除监视器id:"+id);
		var parentid  = SessionManage.getCheckedTreeNode("id");
		SvseMonitorDao.deleteMonitor(id,parentid,function(result){
			SystemLogger(result);
		});
    },
 	"click #showMonitorList button[name='edit']":function(e){
      //  var id = e.currentTarget.id;
      	var id = this.sv_id;
        console.log("编辑监视器id:"+id);
       // SessionManage.setCheckedMonitorId(id);
        var monitorTemplateId = SvseMonitorTemplateDao.getMonitorTemplateIdBySvid(id);
        //设置监视器模板id
    	//Session.set("monityTemplateId",monitorTemplateId);
      //  Session.set("monitorStatus","编辑");

      	var context = getMonitorInfoContext(monitorTemplateId);
     //   $("#showMonitorInfoDiv").modal('show');
     	getEditMonitorDynamicData(id);
    },
    "mouseenter #showMonitorList img":function(e){
    	$(e.currentTarget).popover('show');
    },
    "mouseleave #showMonitorList img":function(e){
    	$(e.currentTarget).popover('hide');
    }
}

Template.MonitorList.rendered = function(){ //默认选中第一个监视进行绘图
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
	//console.log("默认画图id是："+this.find("td input:checkbox").id);
	var defaultMonitorId = this.find("td input:checkbox").id ;
	$(this.find("tbody tr")).addClass("success");
	if(defaultMonitorId && defaultMonitorId !== ""){
		drawImage(defaultMonitorId);
	}else{
		emptyImage();
	}
	
}

Template.MonitorStatisticalSimpleData.recordsData = function(){
	return SessionManage.getMonitorRuntimeTableData();
}

Template.svg.events({
	"click .btn#monitoryDetailBtn" :  function(){
	//	SwithcView.view(MONITORVIEW.MONITORDETAIL);//设置视图状态为监视器详细信息
		$("#showMonitorDetailSvgDiv").modal('show');
	}
})

Template.MonitorStatisticalDetailData.monitorStatisticalDetailTableData = function(){
	return SessionManage.getMonitorStatisticalDetailTableData();
}

//画图前 获取相关数据
function drawImage(id,count){
	if(!count) 
		var count =200;
	var foreigkeys =SvseMonitorDao.getMonitorForeignKeys(id);
	if(!foreigkeys){
		SystemLogger("监视器"+id+"不能获取画图数据");
		return;
	}
	//获取画图数据
	SvseMonitorDao.getMonitorRuntimeRecords(id,count,function(result){
		if(!result.status){
			Log4js.error(result.msg);
			return;
		}
		var records = result.content;
		if(!records)
			return;
		var dataProcess = new DataProcess(records,foreigkeys["monitorForeignKeys"]);
		var resultData = dataProcess.getData();
		var recordsData = dataProcess.getRecordsDate();
		var keys = dataProcess.getDataKey();
		SessionManage.setMonitorStatisticalDetailTableData(keys);
		var selector = "svg#line";
		var line = new DrawLine(
							resultData,
							{
								'key':foreigkeys["monitorPrimary"],
								'label':foreigkeys["monitorDescript"],
								'width':$(selector).parent().width(),
								'height':$(selector).parent().height(),
								'dateformate':"%H:%M"
							},
							selector);

		line.drawLine();//调用 client/lib 下的line.js 中的drawLine函数画图;
	/*	SessionManage.setMonitorRuntimeTableData(recordsData);
		var selectorPie = "svg#monitorStatisticalPieSvg";
		var pie = new DrawPie(
				recordsData,
				selectorPie,
				{}
			)
		pie.draw();
	*/
		drawDie(recordsData,"svg#monitorStatisticalPieSvg");
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

var getMonitorInfoContext = function(){}
var getEditMonitorDynamicData = function(checkedMonitorId){
	SvseMonitorDao.getMonitor(checkedMonitorId,function(err,result){
			if(err){
				Log4js.error(err);
				Message.error(result);
				return;
			}
			var monitor = result;
			console.log(monitor);
			var advance_parameter = monitor["advance_parameter"];
			var parameter = monitor["parameter"];
			var error = monitor["error"];
			var good = monitor["good"];
			var warning = monitor["warning"];//定义一个checkbox。
	});
}