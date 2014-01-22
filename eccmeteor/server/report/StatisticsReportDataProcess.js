/*
统计报告 原始数据的基本处理 
服务端
*/
StatisticsReportDataProcess = function(data){
	this.imageData = [];
	this.analysis(data)

}
//拆分数据
StatisticsReportDataProcess.prototype.analysis = function(data){
	for(var i=0; i<data.length;i++){
		this.dealWithImageData(data[i]);
	}
}

//处理报表的表格数据
StatisticsReportDataProcess.prototype.dealWithImageData =  function(item){
	var detail = item.detail;
	var records = detail.replace(/\,$/,"").split("\,");//分割字符串
	var newRecords = [];
	var length = records.length;
    
    //状态统计
	for(var i = 0 ; i < length ; i++){
		//2013-12-08 08:26:54=200
		if(records[i]===""){
			continue;
		}
		record = records[i].split("\=");
		var date = Date.str2Date(record[0],"yyyy-MM-dd hh:mm:ss");
		var value = record[1];
		if(record[1].indexOf("status") !== -1){
			value = 0;
		}
		newRecords.push({
			time:date,
			data:+record[1]
		});
	}
	this.imageData.push({
		data:newRecords,
		max:item.max,
		min:item.min,
		average:item.average,
		lable:item.ReturnName
	})
}

StatisticsReportDataProcess.prototype.getImageData =  function(){
	return this.imageData;
}