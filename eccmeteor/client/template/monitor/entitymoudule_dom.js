EntityMouduleDomAction = function(){};

Object.defineProperty(EntityMouduleDomAction,"draw",{
	value:function(checkedMonitorId){
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(checkedMonitorId);
		//画图前 获取相关数据
		SvseMonitorDao.getMonitorReportDataByCount(checkedMonitorId,200,function(result){
			if(!result.status){
				Message.error(result.msg);
				return;
			}
			var dataProcess = new ReportDataProcess(result.content);
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
			var statusData = dataProcess.getStatusData();
			var extendDate = dataProcess.getExtentDate();
			SessionManage.setMonitorStatisticalDetailTableData(tableData);
			
			var selector = "svg#line";
			var setting = {
				'width':$(selector).parent().width(),
				'height':$(selector).parent().height()
			};
			DrawMonitorModuleLine.draw(imageData,selector,setting,extendDate);
			DrawMonitorModulePie.draw(statusData,"svg#monitorStatisticalPieSvg",extendDate);
		});
	}
});
Object.defineProperty(EntityMouduleDomAction,"clear",{
	value:function(){
		//emptyImage();
		SessionManage.setMonitorStatisticalDetailTableData(null);
		SessionManage.setMonitorRuntimeTableData({
			ok:0,
			warning:0,
			error:0,
			disable:0,
			starttime:"---",
			endtime:"---"
		});
		DrawMonitorModuleLine.clear("svg#line");
	}
})


Object.defineProperty(EntityMouduleDomAction,"drawReportLine",{
	value:function(e,t,context){
		var checkedMonitorId = context.sv_id;
		if(SessionManage.getCheckedMonitorId() === checkedMonitorId){
			return;
		}
		if(!checkedMonitorId || checkedMonitorId==""){
			return;
		}
		this.draw(checkedMonitorId);
	}
});


Object.defineProperty(EntityMouduleDomAction,"MonitorListRendered",{
	value:function(template){
		//默认选中第一个监视进行绘图
		//初始化checkbox全选效果

        //隐藏所有操作按钮
		ClientUtils.hideOperateBtnInTd("showMonitorList");
		//初始化 checkbox事件
		ClientUtils.tableSelectAll("showMonitorTableSelectAll");
		//初始化tr点击变色效果
		ClientUtils.trOfTableClickedChangeColor("showMonitorList");
		//tr 鼠标悬停显示操作按钮效果
		ClientUtils.showOperateBtnInTd("showMonitorList");

		//默认选中第一个监视器，展示数据
		//console.log("默认画图id是："+this.find("td input:checkbox").id);
		//第一判断当前是否还有监视器
		var defaultMonitor = template.find("td input:checkbox");
		if(!defaultMonitor){
			this.clear();
			return;
		}
		//第二 先默认选择第一个监视器的id
		var defaultMonitorId = defaultMonitor.id;
		//第三 判断页面刷新前是否已经选中了监视器
		var parentid  = SessionManage.getCheckedTreeNode("id");
		var checkedMonitorId = SessionManage.getCheckedMonitorId();
		if(checkedMonitorId && checkedMonitorId.indexOf(parentid) !== -1){ //当后台数据自动更新时 不切换当前选中监视器
			//判断已经选中的监视器是否还存在 //避免多客户端对当前监视器进行删除
			if(template.find("input:checkbox[id='"+checkedMonitorId+"']")){
				defaultMonitorId = checkedMonitorId;  //存在 的话
			}
		}
		if(defaultMonitorId && defaultMonitorId !== ""){
			$(template.find("input:checkbox[id='"+defaultMonitorId+"']")).parents("tr").addClass("success");
			//drawImage(defaultMonitorId);
			this.draw(defaultMonitorId);
		}else{
			//emptyImage();
			this.clear();
		}
	}
})


