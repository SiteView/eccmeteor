/*
	报表导出接口
	localhost:3000/TrendReport?mid=1.26.27.3&st=20131201102000&et=20131208102000
*/
//时间转换 20131020122500  {year:2013,month:10,day:20,hour:12,minute:25,second:00}
var coverTime = function(timestr){
	return  {
		year:timestr.substr(0,4),
		month:timestr.substr(4,2),
		day:timestr.substr(6,2),
		hour:(timestr.substr(8,2) === "" ? "00" : timestr.substr(8,2)),
		minute:(timestr.substr(10,2) === "" ? "00" : timestr.substr(10,2)),
		second:(timestr.substr(12,2) === "" ? "00" : timestr.substr(12,2))
	}
}
//趋势报告 localhost:3000/TrendReport?mid=1.26.27.3&st=20131201102000&et=20131208102000
// localhost:3000/TrendReport?mid=1.22.5.3&st=20131211145000&et=20131212145000
Meteor.Router.add( '/TrendReport', 'GET', function () {
	var mid = this.request.query.mid;
	var st = this.request.query.st;
	var et = this.request.query.et;
	var stime =  coverTime(st);
	var etime =  coverTime(et);
	//
  	return [200,
    	{
       		'Content-type': 'text/html',
       		'Content-Disposition': "attachment; filename=trend_report.html"
    	},new Buffer(DrawTrendReport.export(mid,stime,etime))];
} );

//对比报告 localhost:3000/ContrastReport?mid=1.174.10.1,1.168.2&st=20131201102000&et=20131208102000
Meteor.Router.add("/ContrastReport",'GET',function(){
	var mid = this.request.query.mid;
	var st = this.request.query.st;
	var et = this.request.query.et;
	var stime =  coverTime(st);
	var etime =  coverTime(et);
  	return [200,
    	{
       		'Content-type': 'text/html',
       		'Content-Disposition': "attachment; filename=contrast_report.html"
    	},new Buffer(DrawContrastReport.export(mid,stime,etime))];
})

//状态报告 localhost:3000/StatusReport?mid=1.174.10.1&st=20131201102000&et=20131208102000
Meteor.Router.add("/StatusReport",'GET',function(){
	var mid = this.request.query.mid;
	var st = this.request.query.st;
	var et = this.request.query.et;
	var stime =  coverTime(st);
	var etime =  coverTime(et);
//	DrawStatusReport.export(mid,stime,etime);
//	return;
  	return [200,
    	{
       		'Content-type': 'text/html',
       		'Content-Disposition': "attachment; filename=status_report.html"
    	},new Buffer(DrawStatusReport.export(mid,stime,etime))];
});

//时段对比报告
//time1 :the first time, split start time and end time wiht ','  
//Day对比报告 http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131215000000,20131215235959&t2=20131216000000,20131216235959&type=day
//Month  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131101000000,20131130235959&t2=20131201000000,20131230235959&type=month
//weeks  http://localhost:3000/TimeContrastReport?mid=1.23.4.1&t1=20131215000000,20131215235959&t2=20131216000000,20131216235959&type=weeks
Meteor.Router.add("/TimeContrastReport",'GET',function(){
	var mid = this.request.query.mid;
	var t1 = this.request.query.t1.split('\,');
	var t2 = this.request.query.t2.split('\,');
	var st1 =  coverTime(t1[0]);
	var et1 =  coverTime(t1[1]);
	var st2 =  coverTime(t2[0]);
	var et2 =  coverTime(t2[1]);
	var type = this.request.query.type;
//	DrawTimeContrastReport.export(mid,[st1,et1,st2,et2],type);
//	return;
  	return [200,
    	{
       		'Content-type': 'text/html',
       		'Content-Disposition': "attachment; filename=timecontrast_report.html"
    	},new Buffer(DrawTimeContrastReport.export(mid,[st1,et1,st2,et2],type))];
})