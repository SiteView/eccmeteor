EntityMouduleDomAction = function(){};

Object.defineProperty(EntityMouduleDomAction,"drawReportLine",{
	value:function(e,t,context){
		var checkedMonitorId = context.sv_id;
		if(SessionManage.getCheckedMonitorId() === checkedMonitorId)
			return;
	//	var status = this.status;
		if(!checkedMonitorId || checkedMonitorId=="") return;
		//存储选中监视器的id
		SessionManage.setCheckedMonitorId(checkedMonitorId);

		//画图前 获取相关数据
		SvseMonitorDao.getMonitorReportDataByCount(checkedMonitorId,200,function(result){
			//console.log(result.content)
			if(!resutl.status){
				Message.error(result.msg);
				return;
			}
			var process = new ReportDataProcess(result.content);
			var tableData = dataProcess.getTableData();
			var imageData = dataProcess.getImageData();
			var baseData = dataProcess.getBaseData();
			SessionManage.setMonitorStatisticalDetailTableData(tableData);
			DrawMonitorModuleLine.draw(imageData);
		})

	}
})


