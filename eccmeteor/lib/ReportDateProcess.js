/*
报表数据原始数据的基本处理 
客户端服务端通用
*/
ReportDataProcess = function(data){
	this.tableData = [];
	this.imageData = [];
	this.baseData = [];
	this.status = {};
	this.startTime = null;
	this.endTime = null;
	this.analysis(data);
}
//拆分数据
ReportDataProcess.prototype.analysis = function(data){
	for(returnvalue in data){
		//包含了画图等数据
		if(returnvalue.indexOf("dstr") !== -1){
			this.dealWithStatusData(data[returnvalue]);
		}else if(returnvalue.indexOf("Return_") !== -1){
			this.dealWithTableData(data[returnvalue]);//处理表格数据
			this.dealWithImageData(data[returnvalue]);//处理画图数据
		}else if(returnvalue.indexOf("return") === -1){
			this.dealWithBaseData(returnvalue,data[returnvalue]) //处理基础数据
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
ReportDataProcess.prototype.dealWithStatusData =  function(item){
	var dstr = item;
	//饼状图
	var statusPie = {
		"ok":0,
		"disable":0,
		"warning":0,
		"error":0,
		"bad":0
	}
	for(time in dstr){
		if(time === "MonitorName"){
			continue;
		}
		if(dstr[time].indexOf("ok") !== -1){
			statusPie.ok++;
		}else if(dstr[time].indexOf("disable")!== -1){
			statusPie.disable++;
		}else if(dstr[time].indexOf("warning") !== -1){
			statusPie.warning++;
		}else if(dstr[time].indexOf("error") !== -1){
			statusPie.error++;
		}else { //bad
			statusPie.bad++;
		}
	}
	this.status = statusPie;
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
		var newDate = Date.str2Date(record[0],"yyyy-MM-dd hh:mm:ss");
		if((+item.sv_primary) == 1){
			this.dealWithTimeExtent(newDate);
		}
		newRecords.push({
			time:newDate,
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

ReportDataProcess.prototype.dealWithTimeExtent = function(date){
	var time = date.getTime();
	if(this.startTime == null){
		this.startTime = time;
		this.endTime = time;
	}else{
		if(time < this.startTime){
			this.startTime = time ;
		}else if(time > this.endTime){
			this.endTime = time;
		}
	}
} 

//处理报表的状态统计
ReportDataProcess.prototype.dealWithBaseData =  function(name,item){
	this.baseData.push({name:name,item:item});
}

ReportDataProcess.prototype.getImageData =  function(){
	return this.imageData;
}

ReportDataProcess.prototype.getTableData =  function(){
	return this.tableData;
}

ReportDataProcess.prototype.getBaseData =  function(){
	if(this.baseData.length === 1){
		return this.baseData[0]["item"]
	}
	var newData = {};
	var title = "";
	for(i in this.baseData){
		var one = this.baseData[i];
		newData[one.name] = one.item;
		title = title + one.item.MonitorName.split("\:")[1] + ","
	}
	newData.title = title.replace(/\,$/,"");
	return newData;
}

ReportDataProcess.prototype.getStatusData =  function(){
	return this.status;
}

ReportDataProcess.prototype.getExtentDate =  function(){
	var date1 = new Date();
	var date2 = new Date();
	date1.setTime(this.startTime);
	date2.setTime(this.endTime);
	return [date1,date2];
}