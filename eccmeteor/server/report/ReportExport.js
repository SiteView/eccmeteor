/*
	报表导出接口
	localhost:3000/report?mid=1.26.27.3&st=2013121010100000&et=2013121020100000
*/
//
var coverTime = function(timestr){
	return  {
		year:timestr.substr(0,4),
		month:timestr.substr(4,2),
		day:timestr.substr(6,2),
		hour:timestr.substr(8,2),
		minute:timestr.substr(10,2),
		second:timestr.substr(12,2)
	}
}
//趋势报告
Meteor.Router.add( '/report', 'GET', function () {
	Log4js.info(this.request.query);
	var mid = this.request.query.mid;
	var st = this.request.query.st;
	var et = this.request.query.et;
	var stime =  coverTime(st);
	var etime =  coverTime(et);
	console.log(stime);
	console.log(etime);
  	return [200,
    	{
       		'Content-type': 'text/html',
       		'Content-Disposition': "attachment; filename=trend_report.html"
    	},new Buffer(DrawTrendReport.export(mid))];
} );