HtmlToPdfTest = function(){};

Object.defineProperty(HtmlToPdfTest,"urlToPdf",{
	value:function(){
		var fs = Npm.require('fs');
		console.log("TestUnity HelloWorld");
		var wkhtmltopdf = Meteor.require('wkhtmltopdf');
		wkhtmltopdf('http://baidu.com', { pageSize: 'letter' })
  		.pipe(fs.createWriteStream('/home/ec/ContrastReport.pdf'))
	}
});
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
Object.defineProperty(HtmlToPdfTest,"strToPdf",{
	value:function(){
		var fs = Npm.require('fs');
		var wkhtmltopdf = Meteor.require('wkhtmltopdf');
		var stime = {
			year:"2013",
			month:"12",
			day:"01",
			hour:"00",
			minute:"00", 
			second:"00"
		};
		var etime = {
			year:"2013",
			month:"12",
			day:"08",
			hour:"00",
			minute:"00",
			second:"00"
		}
		/*
			<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIx
MDAiIC8+PC9zdmc+" width="600" height="600">
		*/
		var html = DrawTrendReportPDF.export("1.26.27.3",stime,etime)
		//localhost:3000/TrendReport?mid=1.26.27.3&st=20131201102000&et=20131208102000
		wkhtmltopdf(html, { pageSize: 'letter'})
  		.pipe(fs.createWriteStream('/home/ec/ContrastReport.pdf'))
	}
});