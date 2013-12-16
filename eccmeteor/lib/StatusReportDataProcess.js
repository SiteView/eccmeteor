//饼状图的数据处理
StatusReportDataProcess = function(data){
	this.imageData = {};
	this.baseData = {};
	this.analysis(data);
};

//拆分数据
StatusReportDataProcess.prototype.analysis = function(data){
	for(returnvalue in data){
		//包含了画图等数据
		if(returnvalue.indexOf("dstr") !== -1){
			this.dealWithImageData(data[returnvalue]);//处理画图数据
		}else if(returnvalue.indexOf("return") === -1){
			this.dealWithBaseData(data[returnvalue]) //处理基础数据
		}
	}
}
//计算时间差值
StatusReportDataProcess.prototype.differenceTime = function(startTime,endTime){
    //2013-12-02 09:13:05
	var st = Date.str2Date(startTime,"yyyy-MM-dd hh:mm:ss");
	var et = Date.str2Date(endTime,"yyyy-MM-dd hh:mm:ss");
    var difference = et.getTime() - st.getTime();
    var days=Math.floor(difference/(24*3600*1000));
	//计算出小时数
	var leave1 = difference%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));
	//计算相差秒数
	var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000);
	var str = "";
	str = str + (days === 0 ? "" : (days+"天 "));
	str = str + (hours === 0 ? "" : (hours+"小时 "));
	str = str + (minutes === 0 ? "" : (minutes+"分钟 "));
	str = str + (minutes === 0 ? "" : (minutes+"秒 "));
	return str ;
}
 
//处理报表的表格数据
StatusReportDataProcess.prototype.dealWithImageData =  function(item){
	var dstr = item;
	//饼状图
	var status = {
		"ok":0,
		"disable":0,
		"warning":0,
		"error":0,
		"bad":0
	}
	var total = 0;
	var chart = [];//状态分布图
	var statusList = [];//状态列表
	var flag = null;
	var startTime = null;
	var endTime = null;
	var count = 0;
	for(time in dstr){
		if(time === "MonitorName"){
			continue;
		}
		total++;
		endTime = time ;//every time maybe is end time;
		if(dstr[time].indexOf("ok") !== -1){
			status.ok++;
			chart.push(1);
			if(flag == null){ //init
				flag = "ok";
				startTime = time;
				count = 1;
			}else if("ok" === flag){ //is continuous 
				count ++;
			}else{   //is not  continuous
				statusList.push({  //save the before one of status
					startTime : startTime,
					endTime : time,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,time)
				});
				//init
				startTime = time ;
				count = 1;
				flag = "ok";
			}

		}else if(dstr[time].indexOf("disable")!== -1){
			chart.push(2)
			status.disable++;
			if(flag == null){ //init
				flag = "disable";
				startTime = time;
				count = 1;
			}else if("disable" === flag){ //is continuous 
				count ++;
			}else{   //is not  continuous
				statusList.push({  //save the before one of status
					startTime : startTime,
					endTime : time,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,time)
				});
				//init
				startTime = time ;
				count = 1;
				flag = "disable";
			}

		}else if(dstr[time].indexOf("warning") !== -1){
			chart.push(3);
			status.warning++;
			if(flag == null){ //init
				flag = "warning";
				startTime = time;
				count = 1;
			}else if("warning" === flag){ //is continuous 
				count ++;
			}else{   //is not  continuous
				statusList.push({  //save the before one of status
					startTime : startTime,
					endTime : time,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,time)
				});
				//init
				startTime = time ;
				count = 1;
				flag = "warning";
			}

		}else if(dstr[time].indexOf("error") !== -1){
			status.error++;
			chart.push(4);
			if(flag == null){ //init
				flag = "error";
				startTime = time;
				count = 1;
			}else if("error" === flag){ //is continuous 
				count ++;
			}else{   //is not  continuous
				statusList.push({  //save the before one of status
					startTime : startTime,
					endTime : time,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,time)
				});
				//init
				startTime = time ;
				count = 1;
				flag = "error";
			}

		}else { //bad
			status.bad++;
			chart.push(5);
			if(flag == null){ //init
				flag = "bad";
				startTime = time;
				count = 1;
			}else if("bad" === flag){ //is continuous 
				count ++;
			}else{   //is not  continuous
				statusList.push({  //save the before one of status
					startTime : startTime,
					endTime : time,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,time)
				});
				//init
				startTime = time ;
				count = 1;
				flag = "bad";
			}

		}
	}
	//save the lastest status
	statusList.push({ 
					startTime : startTime,
					endTime : endTime,
					count : count,
					flag : flag,
					difference:this.differenceTime(startTime,endTime)
				});
	//状态百分比
	var percent = {
		okPercent:0,
		warnPercent:0,
		errorPercent:0,
		disbalePercent:0,
		badPercent:0
	}
	if(total !== 0 ){
		percent.errorPercent = status.error / total * 100;
		percent.disbalePercent = status.disable / total * 100;
		percent.okPercent = status.ok / total * 100;
		percent.warnPercent = status.warning / total * 100;
		percent.badPercent = status.bad / total * 100;
	}
	
	this.imageData = {
		statusList:statusList,
		chart:chart,
		pie:[
			{status:"ok",count:status.ok},
			{status:"warn",count:status.warning},
			{status:"error",count:status.error},
			{status:"disable",count:status.disable},
			{status:"bad",count:status.bad},
		],
		percent:percent
	}

}


//处理报表的状态统计
StatusReportDataProcess.prototype.dealWithBaseData =  function(item){
	this.baseData = item;
}

StatusReportDataProcess.prototype.getImageData =  function(){
	return this.imageData;
}
StatusReportDataProcess.prototype.getBaseData =  function(){
	return this.baseData;
}