//日期工具类 主要用于报告的生成。用于Client和Server端
ReportDateUtils = function(){};

//获得某月的天数
Object.defineProperty(ReportDateUtils,"getMonthDays",{
	value:function (nowYear,myMonth){   
	    var monthStartDate = new Date(nowYear, myMonth, 1);    
	    var monthEndDate = new Date(nowYear, myMonth + 1, 1);    
	    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
	    return days;
	} 
})

//获取当天的开始结束时间 Array  
//如果指定了时间 time ，则获取指定时间所在的天的开始结束时间  Date
Object.defineProperty(ReportDateUtils,"getCurrentDay",{
	value:function(time){
		var now =  time ? time : new Date();                 //当前日期   
		var nowDayOfWeek = now.getDay();         //今天本周的第几天   
		var nowDay = now.getDate();              //当前日   
		var nowMonth = now.getMonth();           //当前月   
		var nowYear = now.getFullYear();             //当前年   
		//获得本周的开始日期   
    	var dayStartDate = new Date(nowYear, nowMonth, nowDay);
    	dayStartDate.setHours(0);
    	dayStartDate.setMinutes(0);
    	dayStartDate.setSeconds(0);
		//获得本周的结束日期   
    	var dayEndDate = new Date(nowYear, nowMonth, nowDay);
    	dayEndDate.setHours(23);
    	dayEndDate.setMinutes(59);
    	dayEndDate.setSeconds(59);
    	return [dayStartDate,dayEndDate];
	}
});  

//获取当前周的开始结束时间 Array  
//如果指定了时间 time ，则获取指定时间所在的周的开始结束时间  Date
Object.defineProperty(ReportDateUtils,"getCurrentWeek",{
	value:function(time){
		var now =  time ? time : new Date();                   //当前日期   
		var nowDayOfWeek = now.getDay();         //今天本周的第几天   
		var nowDay = now.getDate();              //当前日   
		var nowMonth = now.getMonth();           //当前月   
		var nowYear = now.getFullYear();             //当前年   
		//获得本周的开始日期   
    	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
		//获得本周的结束日期   
    	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    	return [weekStartDate,weekEndDate];
	}
});

//获取当前月的开始结束时间 Array  
//如果指定了时间 time ，则获取指定时间所在的月的开始结束时间  Date
Object.defineProperty(ReportDateUtils,"getCurrentMonth",{
	value:function(time){
		var now = time ? time : new Date();                    //当前日期   
		var nowDayOfWeek = now.getDay();         //今天本周的第几天   
		var nowDay = now.getDate();              //当前日   
		var nowMonth = now.getMonth();           //当前月   
		var nowYear = now.getFullYear();             //当前年   
		//获得本月的开始日期   
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		//获得本月的结束日期   
		var monthEndDate = new Date(nowYear, nowMonth, ReportDateUtils.getMonthDays(nowYear,nowMonth)); 
		return [monthStartDate,monthEndDate];
	}
});