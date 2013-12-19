/*
报表数据原始数据的基本处理 
客户端服务端通用
*/ //.js
TimeContrastReportDataProcess = function(data,type){
	this.tableData = [];
	this.imageData = [];
	this.baseData = {};
	this._type = type;
	this.analysis(data);
};

TimeContrastReportDataProcess.prototype.covertTime = function(dateStr){
	var newDate = Date.str2Date(dateStr,"yyyy-MM-dd hh:mm:ss");
	var type = this._type;
	var format = "";
	switch(type){
		case "day" : format = "%H%M%S"; break;
		case "month" : format = "%d%H%M%S";break;
		case "weeks" :format = "%w";break;
		default:format =  "%d%H%M%S";
	}
	var d3 = null;
	if(Meteor.isServer){
		d3 = Meteor.require("d3");
	}else{
		d3 = window.d3;
	}
	if(typeof(d3) === "undefined"){
		throw new Error("d3 is not found");
	}
	var fm = d3.time.format(format);
	if(type !== "weeks"){
		return fm.parse(fm(newDate));
	}
	var week = +fm(newDate)+7;//get The Weeks and add 7
	var fd = d3.time.format("%H:%M:%S");
	var hd = fd(newDate);
	var ds = "1990/1/"+week+" "+hd;
//	Log4js.log(week+"=="+hd+"=="+ds+"=="+new Date(ds));
	return new Date(ds);
}


//拆分数据
TimeContrastReportDataProcess.prototype.analysis = function(data){
	var d1 = data[0].result;

	for(returnvalue in d1){
		//包含了画图等数据
		if(returnvalue.indexOf("Return_") !== -1){
			this.dealWithTableData(data,returnvalue);//处理表格数据
			this.dealWithImageData(data,returnvalue);//处理画图数据
		}else if(returnvalue.indexOf("return") === -1){
			this.dealWithBaseData(data,returnvalue); //处理基础数据
		}
	}
};

//处理报表的表格数据
TimeContrastReportDataProcess.prototype.dealWithTableData =  function(data,returnvalue){
	var item0 = data[0]["result"][returnvalue];
	var item1 = data[1]["result"][returnvalue];
	var time1 = data[0]["time"];
	var time2 = data[1]["time"];
	var obj = {};
	obj.ReturnName = item0.ReturnName;
	obj.TableData = [{
			time:time1,
			max:item0.max,
			min:item0.min,
			average:item0.average,
			latest:item0.latest,
			when_max:item0.when_max
		},
		{
			time:time2,
			max:item1.max,
			min:item1.min,
			average:item1.average,
			latest:item1.latest,
			when_max:item1.when_max
		}]
	this.tableData.push(obj);
}

TimeContrastReportDataProcess.prototype.getNewData  = function(item){
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
		var newTime = this.covertTime(record[0]);
		newRecords.push({
			time:newTime,
			data:+record[1]
		});
	}
	return {
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
	};
}

//处理报表的表格数据
TimeContrastReportDataProcess.prototype.dealWithImageData =  function(data,returnvalue){
	var item1 = data[0]["result"][returnvalue];
	var item2 = data[1]["result"][returnvalue];
	var newV1 = this.getNewData(item1);
	var newV2 = this.getNewData(item2)
	var list = [newV1,newV2];
	this.imageData.push(list);
}


//处理报表的状态统计
TimeContrastReportDataProcess.prototype.dealWithBaseData =  function(data,returnvalue){
	//this.baseData.push({name:name,item:item});
	var title = data[0]["result"][returnvalue]["MonitorName"];
	var time1 = data[0]["time"];
	var time2 = data[1]["time"];
	this.baseData = {
		title:title,
		time1:time1,
		time2:time2
	}
}

TimeContrastReportDataProcess.prototype.getTableData =  function(name,item){
	return this.tableData;
}

TimeContrastReportDataProcess.prototype.getBaseData =  function(name,item){
	return this.baseData;
}

TimeContrastReportDataProcess.prototype.getImageData =  function(){
	return this.imageData;
}
