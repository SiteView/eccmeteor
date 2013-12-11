DrawContrastReport = function(){}

//获取相关数据
Object.defineProperty(DrawContrastReport,"getMonitorRecords",{
	value:function(monitorId,startTime,endTime){
		return SvseMonitorDaoOnServer.getMonitorReportData(monitorId,startTime,endTime);
	}
})

//根据查询条件返回结果
Object.defineProperty(DrawContrastReport,"export",{
	value:function(monitorId,startTime,endTime){
		var records = this.getMonitorRecords(monitorId,startTime,endTime);//获取监视器原始数据
		var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		Log4js.info(tableData);
		Log4js.info(imageData);
		Log4js.info(baseData);
		return ;
		var renderObj = {
			baseDate:baseData,
			startTime:this.buildTime(startTime),
			endTime:this.buildTime(endTime),
			tableData:tableData
		}
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate,renderObj);
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件
		var window = document.parentWindow;
		return this.draw(imageData,window);
	}
});