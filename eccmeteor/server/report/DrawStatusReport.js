var d3 = Meteor.require("d3");
var Jsdom = Meteor.require("jsdom");

 //报告
DrawStatusReport = function(){};

Object.defineProperty(DrawStatusReport,"_option",{
	value:{
		htmlTemplate:"StatusReport.html",
		CssTemplate:["table.css"]
	},
	writable:true
});


Object.defineProperty(DrawStatusReport,"getMonitorRecords",{
	value:function(monitorId,startTime,endTime,filter){
		return SvseMonitorDaoOnServer.getMonitorReportDataByfilter(monitorId,startTime,endTime,filter);
	}
});

//拼接时间
Object.defineProperty(DrawStatusReport,"buildTime",{
	value:function(obj){
		return obj.year + "-" + obj.month + "-" +  obj.day+ " " +obj.hour + ":" +obj.minute+":"+obj.second;
	}
})

//根据查询条件返回结果
Object.defineProperty(DrawStatusReport,"export",{
	value:function(monitorId,startTime,endTime){
		var records = this.getMonitorRecords(monitorId,startTime,endTime,"sv_primary,sv_drawimage");//获取监视器原始数据  //,
		var dataProcess = new StatusReportDataProcess(records);//原始数据的基本处理 //客户端服务端通用
		var imageData = dataProcess.getImageData();
		var baseData = dataProcess.getBaseData();
		
		
		var renderObj = {
			baseDate:baseData,
			startTime:this.buildTime(startTime),
			endTime:this.buildTime(endTime),
			tableData:imageData.percent,
			statusList:imageData.statusList
		};
		var htmlStub = HtmlTemplate.render(this._option.htmlTemplate,renderObj);
		var document = Jsdom.jsdom(htmlStub,null,{
			features : {
				FetchExternalResources : ['css'],
			 	QuerySelector : true
			}
		});
	    Css.addStyle(this._option.CssTemplate,document);//添加css文件
		var window = document.parentWindow;
	//	var testData =[1,1,1,2,2,3,3,1,1,1,1,4,4,4,4,5,1,1,1,1,1,1,1,1,1,5,5,5,5,1,1,1,1,1,1,1,1,1,5]
		this.drawStatusBarChart(imageData.chart,window);
	//	this.drawStatusBarChart(testData,window);
		/*
		var testPieData = [
			{status:"ok",count:50},
			{status:"warn",count:50},
			{status:"error",count:50},
			{status:"disable",count:50},
			{status:"bad",count:50},
		]
		*/
		this.drawStatusPie(imageData.pie,window);
	//	this.drawStatusPie(testPieData,window);
		return window.document.innerHTML;
	}
});
Object.defineProperty(DrawStatusReport,"chooseColor",{
	value:function(d){
		if(typeof d === "string"){
			switch(d){
				case "ok" : return "green"; // ok
				case "disable" : return "gray"; //disable
				case "warn" : return "yellow";//warn
				case "error" : return "red"; //error;
				case "bad" : return  "black";//bad
	   		}
		}
		if(typeof d === "number"){
			switch(d){
				case 1 : return "green"; // ok
				case 2 : return "gray"; //disable
				case 3 : return "yellow";//warn
				case 4 : return "red"; //error;
				case 5 : return  "black";//bad
	   		}
   		}
	}
})

Object.defineProperty(DrawStatusReport,"drawStatusBarChart",{
	value:function(data,window){
		var width = 800;
		var height = 50;
		var el = window.document.querySelector('#statisticalList');
		var chart = d3.select(el)
					.append('svg:svg')
					.attr('width', width)
					.attr('height', height)
					.append("g");

		var length = data.length;
		var averge = length === 0 ? width : width/length;
		var x = function(i){
			return i*averge;
		}
   		var color = this.chooseColor ;
   		chart.selectAll("rect").data(data)
   			.enter().append("rect")
   			.style({
   				"fill":function(d){
   					return color(d);
   			 	},
   				"stroke-width": 0
   			 })
 			.attr("x",function(d,i){return x(i)})//相当于function(d){return x(d);}  
 			.attr("y",0)//svg的坐标以左上角为原点，
 			.attr("width",averge) //获取散列值每段的长度 为矩形的宽  
 			.attr("height",height); // 通过函数1  function(d){return  (420/42)*d}  得到矩形的高  	
	}
})

Object.defineProperty(DrawStatusReport,"drawStatusPie",{
	value:function(data,window){
		var el = window.document.querySelector('#statistical');
		var w = 450;
		var h = 450;
		var svg = d3.select(el)
					.append('svg:svg')
					.attr('width', w)
					.attr('height', h)
					.append("g")
					.attr("class","pie");

		var color = this.chooseColor ;
		var pie = d3.layout.pie();
		pie.value(function(d){return d.count});
		var outerRadius = w / 2;
		var innerRadius = 0;
		var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

		var arcs = svg.selectAll("g.arc")
				.data(pie(data));

		arcs.enter()
			.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")")
			.append("path")
				.attr("fill", function(d) {
					return color(d.data.status);
				})
			.attr("d", arc)
	}
})