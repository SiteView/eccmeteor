/*
报表数据原始数据的基本处理 
客户端服务端通用
*/
ReportDataProcess = function(data){
	this.tableData = [];
	this.imageData = [];
	this.baseData = {};
	this.analysis(data);
}
//拆分数据
ReportDataProcess.prototype.analysis = function(data){
	for(returnvalue in data){
		//包含了画图等数据
		if(returnvalue.indexOf("Return_") !== -1){
			this.dealWithTableData(data[returnvalue]);//处理表格数据
			this.dealWithImageData(data[returnvalue]);//处理画图数据
		}else if(returnvalue.indexOf("return") === -1){
			this.dealWithBaseData(data[returnvalue]) //处理基础数据
		}
	}
}

//处理报表的表格数据
ReportDataProcess.prototype.dealWithTableData =  function(item){
	this.tableData.push({
		MonitorName:item.MonitorName,
		ReturnName:item.ReturnName,
		max:item.max,
		min:item.min,
		average:item.average,
		latest:item.latest,
		when_max:item.when_max
	});
}

//处理报表的状态统计
ReportDataProcess.prototype.dealWithStatusData =  function(status,item){
	var name = item.replace("\(status\)","");
	if(typeof status[name] === "undefined"){
		status[name] = 0
	}
	status[name] = status[name] + 1; 
}

//处理报表的表格数据
ReportDataProcess.prototype.dealWithImageData =  function(item){
	var detail = item.detail;
	var records = detail.replace(/\,$/,"").split("\,");//分割字符串
	var newRecords = [];
	var length = records.length;
    
    //状态统计
    var status = {};

	for(var i = 0 ; i < length ; i++){
		//2013-12-08 08:26:54=200
		if(records[i]===""){
			continue;
		}
		record = records[i].split("\=");
		if(record[1].indexOf("status") !== -1){
			this.dealWithStatusData(status,record[1]);//处理当前的状态
			continue;
		}
		newRecords.push({
			time:Date.str2Date(record[0],"yyyy-MM-dd hh:mm:ss"),
			date:+record[1]
		});
	}
	this.imageData.push({
		data:newRecords,
		max:item.max,
		min:item.min,
		average:item.average,
		lable:item.ReturnName,
		tatalCount:length,
		normalCount:newRecords.length,
		status:status,
		drawimage:item.sv_drawimage,
		drawtable:item.sv_drawtable,
		primary:item.sv_primary
	})
}


//处理报表的状态统计
ReportDataProcess.prototype.dealWithBaseData =  function(item){
	this.baseData = item;
}

ReportDataProcess.prototype.getImageData =  function(){
	return this.imageData;
}

ReportDataProcess.prototype.getTableData =  function(){
	return this.tableData;
}
ReportDataProcess.prototype.getBaseData =  function(){
	return this.baseData;
}