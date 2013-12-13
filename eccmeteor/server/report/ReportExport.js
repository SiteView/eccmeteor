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
})