var d3 = Meteor.require("d3");
var Jsdom = Meteor.require("jsdom");

 //报告
DrawStatusReport = function(){};

Object.defineProperty(DrawStatusReport,"_option",{
	value:{
		htmlTemplate:"StatusReport.html",
		CssTemplate:["table.css"]
	},
	writable:true
});


Object.defineProperty(DrawStatusReport,"getMonitorRecords",{
	value:function(monitorId,startTime,endTime,filter){
		return SvseMonitorDaoOnServer.getMonitorReportDataByfilter(monitorId,startTime,endTime,filter);
	}
});

//拼接时间
Object.defineProperty(DrawStatusReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})

//根据查询条件返回结果
Object.defineProperty(DrawStatusReport,"export",{
	value:function(monitorId,startTime,endTime){
		var records = this.getMonitorRecords(monitorId,startTime,endTime,"sv_primary,sv_drawimage");//获取监视器原始数据  //,
		
		var dataProcess = new ReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		
		var tableData = dataProcess.getTableData();
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		var nstartTime =  Date.str2Date(this.buildTime(startTime),"yyyy-MM-dd hh-mm-ss");
		var nendTime =  Date.str2Date(this.buildTime(endTime),"yyyy-MM-dd hh-mm-ss");
		Log4js.info(tableData);
		Log4js.info(imageData);
		Log4js.info(baseData);  
		return ;
		var renderObj = {
			baseDate:baseData,
			startTime:this.buildTime(startTime),
			endTime:this.buildTime(endTime),
			tableData:tableData
		};
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate,renderObj);
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件
		var window = document.parentWindow;
		return this.draw(imageData,window,nstartTime,nendTime);
	}
});